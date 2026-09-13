import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface Campaign { id: string; name: string; brief: string | null; status: string; start_date: string | null; end_date: string | null; created_at: string }

export type CampaignStatus = "draft" | "active" | "ended";

/** Local YYYY-MM-DD (matches how `date` columns compare lexicographically). */
function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Effective status computed on read: draft (unapproved) / ended (past end_date) / active. */
export function campaignStatus(c: Campaign): CampaignStatus {
  if (c.status === "draft") return "draft";
  if (c.end_date && todayStr() > c.end_date) return "ended";
  return "active";
}

/** Whether a NEW invite can be created for this campaign right now, with a reason if not. */
export function campaignBookable(c: Campaign): { ok: boolean; reason?: string } {
  if (c.status === "draft") return { ok: false, reason: "This campaign is still a draft." };
  const today = todayStr();
  if (c.start_date && today < c.start_date) return { ok: false, reason: "This campaign hasn't started yet." };
  if (c.end_date && today > c.end_date) return { ok: false, reason: "This campaign's booking window is closed." };
  return { ok: true };
}
export interface Collaboration {
  id: string; campaign_id: string | null; creator_user_id: string | null;
  creator_name: string; creator_avatar: string | null; creator_tags: string | null;
  rate: string | null; status: string; next_action: string | null;
  due_date: string | null; net: string | null; post_url: string | null;
  post_impressions: number | null; post_reactions: number | null; post_comments: number | null; post_clicks: number | null;
  created_at: string; updated_at: string;
}

/** Deterministic-ish mock post metrics seeded from follower count. */
export function generatePostMetrics(followers: number) {
  const base = Math.max(followers, 400);
  const rnd = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
  const impressions = Math.round(base * rnd(2, 4));
  const reactions = Math.round(impressions * rnd(0.012, 0.03));
  const comments = Math.round(reactions * rnd(0.06, 0.18));
  const clicks = Math.round(impressions * rnd(0.006, 0.02));
  return { impressions, reactions, comments, clicks };
}

export async function getUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await createClient().auth.getUser();
  return data.user?.id ?? null;
}

export async function listCampaigns(): Promise<Campaign[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await createClient().from("campaigns").select("*").order("created_at", { ascending: false });
  return error ? [] : ((data ?? []) as Campaign[]);
}

export async function createCampaign(input: { name: string; brief?: string; start_date?: string | null; end_date?: string | null }): Promise<Campaign | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await createClient().from("campaigns").insert({
    name: input.name,
    brief: input.brief ?? null,
    start_date: input.start_date ?? null,
    end_date: input.end_date ?? null,
  }).select("*").single();
  return error ? null : (data as Campaign);
}

/** Brand's own bookings (rows they created). */
export async function listBrandCollaborations(): Promise<Collaboration[]> {
  const uid = await getUserId(); if (!uid) return [];
  const { data, error } = await createClient().from("collaborations").select("*").eq("user_id", uid).order("created_at", { ascending: false });
  return error ? [] : ((data ?? []) as Collaboration[]);
}

/** Invitations/collaborations routed to the current user as a creator. */
export async function listCreatorCollaborations(): Promise<Collaboration[]> {
  const uid = await getUserId(); if (!uid) return [];
  const { data, error } = await createClient().from("collaborations").select("*").eq("creator_user_id", uid).order("created_at", { ascending: false });
  return error ? [] : ((data ?? []) as Collaboration[]);
}

export async function createCollaboration(input: {
  campaign_id?: string | null; creator_user_id?: string | null;
  creator_name: string; creator_avatar?: string | null; creator_tags?: string | null;
  rate?: string | null; net?: string | null; due_date?: string | null;
}): Promise<Collaboration | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await createClient().from("collaborations").insert({
    campaign_id: input.campaign_id ?? null,
    creator_user_id: input.creator_user_id ?? null,
    creator_name: input.creator_name,
    creator_avatar: input.creator_avatar ?? null,
    creator_tags: input.creator_tags ?? null,
    rate: input.rate ?? null,
    net: input.net ?? input.rate ?? null,
    due_date: input.due_date ?? null,
    status: "invited",
    next_action: "Awaiting creator",
  }).select("*").single();
  return error ? null : (data as Collaboration);
}

/** Creator accepts an invitation. */
export async function acceptCollaboration(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await createClient().from("collaborations")
    .update({ status: "active", next_action: "Create & submit the post", updated_at: new Date().toISOString() })
    .eq("id", id);
  return !error;
}

/** Creator submits the published post link → also generates mock metrics from their followers. */
export async function submitPost(id: string, url: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const profile = await getProfile();
  const m = generatePostMetrics(profile?.followers ?? 0);
  const { error } = await createClient().from("collaborations")
    .update({
      status: "submitted", post_url: url, next_action: "Awaiting brand review",
      post_impressions: m.impressions, post_reactions: m.reactions, post_comments: m.comments, post_clicks: m.clicks,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  return !error;
}

/** Brand marks the collaboration complete → writes brand debit + creator credit atomically (RPC). */
export async function completeCollaboration(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const { error } = await createClient().rpc("complete_collaboration", { p_id: id });
  return !error;
}

export interface WalletTx { id: string; amount: number; type: "credit" | "debit"; description: string | null; created_at: string }

export async function listTransactions(): Promise<WalletTx[]> {
  const uid = await getUserId(); if (!uid) return [];
  const { data, error } = await createClient().from("wallet_transactions").select("*").eq("user_id", uid).order("created_at", { ascending: false });
  return error ? [] : ((data ?? []) as WalletTx[]);
}

export async function getBalance(): Promise<number> {
  const txs = await listTransactions();
  return txs.reduce((b, t) => b + (t.type === "credit" ? Number(t.amount) : -Number(t.amount)), 0);
}

/** Add budget = a real credit to the brand's own ledger (no payment processing). */
export async function addBudget(amount: number, description = "Budget top-up"): Promise<boolean> {
  const uid = await getUserId(); if (!uid || !amount) return false;
  const { error } = await createClient().from("wallet_transactions").insert({ amount, type: "credit", description });
  return !error;
}

export const parseAmount = (s?: string | null) => Number((s ?? "").replace(/[^0-9]/g, "")) || 0;

export interface Profile {
  role: string | null;
  name: string | null; bio: string | null; tags: string | null; rate: string | null; avatar: string | null; linkedin_url: string | null;
  followers: number | null;
  company_name: string | null; website_url: string | null; description: string | null;
}

export async function getProfile(): Promise<Profile | null> {
  const uid = await getUserId(); if (!uid) return null;
  const { data, error } = await createClient().from("profiles").select("*").eq("user_id", uid).maybeSingle();
  if (error) return null;
  return (data as Profile) ?? null;
}

/** Create or update the current user's profile (one row per user). */
export async function upsertProfile(fields: Partial<Profile>): Promise<boolean> {
  const uid = await getUserId(); if (!uid) return false;
  const { error } = await createClient().from("profiles").upsert(
    { user_id: uid, ...fields, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  return !error;
}

export interface CreatorListing {
  user_id: string; name: string | null; bio: string | null; tags: string | null; rate: string | null; avatar: string | null; followers: number | null; is_seed: boolean;
}

/** Marketplace: every registered creator profile (real + seed), newest first. */
export async function listCreators(): Promise<CreatorListing[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await createClient()
    .from("profiles")
    .select("user_id,name,bio,tags,rate,avatar,followers,is_seed")
    .eq("role", "creator")
    .order("created_at", { ascending: false });
  return error ? [] : ((data ?? []) as CreatorListing[]);
}
