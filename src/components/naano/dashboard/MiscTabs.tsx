"use client";

import { useEffect, useState } from "react";
import { Card, PageHead } from "./dash-ui";
import { listCreatorCollaborations, acceptCollaboration, submitPost, listCampaigns, type Collaboration, type Campaign } from "@/lib/naano/db";
import { fmt } from "@/lib/naano/creator";

function CStatus({ s }: { s: string }) {
  const map: Record<string, string> = { active: "bg-blue-50 text-[#2563EB]", submitted: "bg-amber-50 text-amber-600", completed: "bg-emerald-50 text-emerald-600" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[s] ?? "bg-gray-100 text-gray-500"}`}>{s[0].toUpperCase() + s.slice(1)}</span>;
}

export function OpportunitiesTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { listCampaigns().then((c) => { setCampaigns(c); setLoading(false); }); }, []);

  return (
    <div>
      <PageHead title="Opportunities" subtitle="Open brand campaigns - apply, the brand accepts, and the booking is created on your terms." />
      {loading ? (
        <p className="py-16 text-center text-[14px] text-gray-400">Loading opportunities…</p>
      ) : campaigns.length === 0 ? (
        <Card className="mx-auto max-w-xl p-12 text-center shadow-[0_28px_80px_-60px_rgba(56,96,128,0.5)]">
          <h2 className="mt-2 text-xl font-bold text-gray-900">No open campaigns right now</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-gray-500">
            When brands launch campaigns that match your audience, they&apos;ll appear here for you to apply.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((c) => (
            <Card key={c.id} className="flex flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-[#2563EB]">{(c.name || "C")[0].toUpperCase()}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">Open</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">{c.name}</h3>
              <p className="mt-2 line-clamp-3 flex-1 text-[14px] leading-relaxed text-gray-500">{c.brief || "A brand is looking for creators to collaborate on a single LinkedIn post."}</p>
              <p className="mt-3 text-[12px] text-gray-400">Posted {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
              <button className="mt-4 rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Express interest</button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


export function CollaborationsTab() {
  const [rows, setRows] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => listCreatorCollaborations().then((r) => { setRows(r); setLoading(false); });
  useEffect(() => { load(); }, []);

  const accept = async (id: string) => {
    setBusy(id);
    await acceptCollaboration(id);
    await load();
    setBusy(null);
  };

  const [links, setLinks] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState<{ collab: Collaboration; phase: "processing" | "done" } | null>(null);
  const submit = async (id: string) => {
    const url = (links[id] || "").trim();
    if (!url) return;
    setBusy(id);
    await submitPost(id, url);
    const fresh = await listCreatorCollaborations();
    setRows(fresh);
    setLoading(false);
    setBusy(null);
    const row = fresh.find((r) => r.id === id);
    if (row) {
      setReveal({ collab: row, phase: "processing" });
      setTimeout(() => setReveal((cur) => (cur && cur.collab.id === id ? { ...cur, phase: "done" } : cur)), 1600);
    }
  };

  const invites = rows.filter((r) => r.status === "invited");
  const toSubmit = rows.filter((r) => r.status === "active");
  const active = rows.filter((r) => r.status !== "invited");

  return (
    <div>
      <PageHead title="Collaborations" subtitle="Every step tells you where you stand, what to do, and what happens if you do nothing." />

      {invites.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#2563EB]">
            Invitations received <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs">{invites.length}</span>
          </p>
          <div className="grid gap-3">
            {invites.map((r) => (
              <Card key={r.id} className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A66C2] text-sm font-bold text-white">in</span>
                  <div>
                    <p className="font-semibold text-gray-900">A brand invited you to collaborate</p>
                    <p className="text-[13px] text-gray-500">Single post · <span className="font-semibold text-gray-700">{r.net ?? r.rate}</span> · invited {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Decline</button>
                  <button onClick={() => accept(r.id)} disabled={busy === r.id} className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4fd7] disabled:opacity-60">{busy === r.id ? "Accepting…" : "Accept"}</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {toSubmit.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-600">
            Action needed — submit your post <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs">{toSubmit.length}</span>
          </p>
          <div className="grid gap-3">
            {toSubmit.map((r) => (
              <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A66C2] text-sm font-bold text-white">in</span>
                  <div><p className="font-semibold text-gray-900">Post live? Add the LinkedIn link</p><p className="text-[13px] text-gray-500">Paying <span className="font-semibold text-gray-700">{r.net ?? r.rate}</span> on approval</p></div>
                </div>
                <div className="flex flex-1 items-center gap-2 sm:min-w-[320px]">
                  <input value={links[r.id] ?? ""} onChange={(e) => setLinks({ ...links, [r.id]: e.target.value })} placeholder="https://www.linkedin.com/posts/…" className="flex-1 rounded-xl border-2 border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563EB]" />
                  <button onClick={() => submit(r.id)} disabled={busy === r.id} className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4fd7] disabled:opacity-60">{busy === r.id ? "Submitting…" : "Submit"}</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="grid grid-cols-6 gap-2 border-b border-gray-100 px-6 py-4 text-[13px] font-medium text-gray-400">
          <span className="col-span-2">Brand</span><span>Status</span><span>Next action</span><span>Due date</span><span>Your net</span>
        </div>
        {loading ? (
          <p className="py-16 text-center text-[14px] text-gray-400">Loading…</p>
        ) : active.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-gray-500">No active collaborations yet. Accept an invitation above and it lands here.</p>
        ) : (
          active.map((r) => (
            <div key={r.id} className="grid grid-cols-6 items-center gap-2 border-b border-gray-50 px-6 py-4 text-[14px] last:border-0">
              <div className="col-span-2 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A66C2] text-xs font-bold text-white">in</span>
                <span className="font-semibold text-gray-900">{r.creator_name} campaign</span>
              </div>
              <span><CStatus s={r.status} /></span>
              <span className="text-gray-600">{r.post_url ? <a href={r.post_url} target="_blank" rel="noreferrer" className="text-[#2563EB] hover:underline">View post ↗</a> : r.next_action}</span>
              <span className="text-gray-500">{r.due_date ?? "—"}</span>
              <span className="font-semibold text-gray-900">{r.net ?? r.rate ?? "—"}</span>
            </div>
          ))
        )}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 text-[13px] text-gray-500">
          <span>{active.length} active · {invites.length} invited</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">1</span>
        </div>
      </Card>

      {reveal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => reveal.phase === "done" && setReveal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {reveal.phase === "processing" ? (
              <>
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#2563EB]" />
                <h3 className="mt-6 text-lg font-bold text-gray-900">Reading your post…</h3>
                <p className="mt-2 text-[14px] text-gray-500">We&apos;re pulling in the performance metrics for your published post.</p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">Post metrics captured</h3>
                <p className="mt-2 text-[14px] text-gray-500">These now feed your analytics total and this collaboration record.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-4"><p className="text-2xl font-bold text-gray-900">{fmt(reveal.collab.post_impressions || 0)}</p><p className="text-[12px] uppercase tracking-wide text-gray-400">Impressions</p></div>
                  <div className="rounded-xl bg-gray-50 p-4"><p className="text-2xl font-bold text-gray-900">{fmt(reveal.collab.post_reactions || 0)}</p><p className="text-[12px] uppercase tracking-wide text-gray-400">Reactions</p></div>
                  <div className="rounded-xl bg-gray-50 p-4"><p className="text-2xl font-bold text-gray-900">{fmt(reveal.collab.post_comments || 0)}</p><p className="text-[12px] uppercase tracking-wide text-gray-400">Comments</p></div>
                  <div className="rounded-xl bg-gray-50 p-4"><p className="text-2xl font-bold text-gray-900">{fmt(reveal.collab.post_clicks || 0)}</p><p className="text-[12px] uppercase tracking-wide text-gray-400">Clicks</p></div>
                </div>
                <button onClick={() => setReveal(null)} className="mt-6 w-full rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Done</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CommunityTab() {
  return (
    <div>
      <PageHead title="Community" subtitle="Connect with other B2B creators, share playbooks and grow together." />
      <Card className="mx-auto max-w-xl p-12 text-center shadow-[0_28px_80px_-60px_rgba(56,96,128,0.5)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
          <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900">The creator community is coming soon</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-gray-500">
          Once your profile is live, you&apos;ll be able to join creator spaces, compare notes and unlock community perks.
        </p>
      </Card>
    </div>
  );
}
