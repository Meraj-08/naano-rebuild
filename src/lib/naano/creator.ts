import type { Profile, Collaboration } from "./db";
import { parseAmount } from "./db";

/** MarketplaceCard props from the logged-in creator's real profile. */
export function toCardProps(p: Profile | null) {
  return {
    name: p?.name || "Your name",
    avatarUrl: p?.avatar || undefined,
    topic: p?.tags || undefined,
    headline: p?.bio || "Your tagline and topics will appear here.",
    followers: p?.followers ?? null,
    cost: p?.rate ? parseAmount(p.rate) : null,
    costLabel: "Cost / post",
  };
}

export interface Snapshot { followers: number; posts: number; reach: number; engagements: number }

/** Instant mock analytics seeded from follower count + any submitted collaboration posts. */
export function computeSnapshot(p: Profile | null, collabs: Collaboration[]): Snapshot {
  const followers = p?.followers ?? 0;
  const submitted = collabs.filter((c) => c.post_impressions != null);
  const basePosts = followers > 0 ? Math.max(3, Math.round(followers / 1500)) : 0;
  const baseReach = followers * 3;
  const baseEng = Math.round(baseReach * 0.02);
  return {
    followers,
    posts: basePosts + submitted.length,
    reach: baseReach + submitted.reduce((s, c) => s + (c.post_impressions || 0), 0),
    engagements: baseEng + submitted.reduce((s, c) => s + ((c.post_reactions || 0) + (c.post_comments || 0)), 0),
  };
}

export const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : `${n}`);
