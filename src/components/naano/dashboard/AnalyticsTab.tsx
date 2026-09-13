"use client";

import { useEffect, useState } from "react";
import { Card, PageHead, StatCard } from "./dash-ui";
import { getProfile, listCreatorCollaborations, type Profile, type Collaboration } from "@/lib/naano/db";
import { computeSnapshot, fmt } from "@/lib/naano/creator";

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-gray-600 shadow-sm ring-1 ring-gray-100"><span className="h-2 w-2 rounded-full bg-emerald-500" />{children}</span>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3.5 last:border-0">
      <span className="text-[15px] text-gray-500">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}

export function AnalyticsTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  useEffect(() => {
    getProfile().then(setProfile);
    listCreatorCollaborations().then(setCollabs);
  }, []);

  const snap = computeSnapshot(profile, collabs);
  const submitted = collabs.filter((c) => c.post_impressions != null);
  const withReach = snap.posts > 0 ? Math.round((submitted.length / snap.posts) * 100) : 0;

  return (
    <div>
      <PageHead
        title="Analytics"
        subtitle="LinkedIn performance for this profile."
        right={
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700">
            All time
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-[#eef4ff] to-[#dbeafe] p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <Chip>LinkedIn snapshot</Chip>
            <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-[34px] font-bold tracking-[-0.02em] text-gray-900">Your reach across {snap.posts} posts</h2>
            <p className="mt-2 text-[16px] text-gray-600">Estimated from your {fmt(snap.followers)} followers, updated automatically as you submit collaboration posts.</p>
          </div>
          <div className="shrink-0 lg:border-l lg:border-white/60 lg:pl-8">
            <div className="text-[44px] font-bold leading-none text-gray-900">{fmt(snap.reach)}</div>
            <p className="mt-1 text-[14px] text-gray-600">total estimated reach</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[13px] font-medium text-gray-600"><span className="h-2 w-2 rounded-full bg-emerald-500" />{submitted.length} collaboration post{submitted.length === 1 ? "" : "s"} tracked</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Public posts" value={String(snap.posts)} sub="Posts contributing to your reach" />
        <StatCard label="Public post reach" value={fmt(snap.reach)} sub="Estimated reach across your posts" />
        <StatCard label="Public engagements" value={fmt(snap.engagements)} sub="Reactions, comments and reposts" />
        <StatCard label="LinkedIn followers" value={fmt(snap.followers)} sub="From your creator profile" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Collaboration posts</h2>
          <p className="mt-1 text-[14px] text-gray-500">Metrics from posts you submitted for brand collaborations.</p>
          {submitted.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-semibold text-gray-700">No collaboration posts yet</p>
              <p className="mt-1 text-[14px] text-gray-500">Submit a published post link from an active collaboration to see its metrics here.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {submitted.map((c) => (
                <div key={c.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{c.creator_name}</p>
                    {c.post_url && <a href={c.post_url} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-[#2563EB] hover:underline">Open post →</a>}
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    <div><p className="text-lg font-bold text-gray-900">{fmt(c.post_impressions || 0)}</p><p className="text-[12px] text-gray-400">Impressions</p></div>
                    <div><p className="text-lg font-bold text-gray-900">{fmt(c.post_reactions || 0)}</p><p className="text-[12px] text-gray-400">Reactions</p></div>
                    <div><p className="text-lg font-bold text-gray-900">{fmt(c.post_comments || 0)}</p><p className="text-[12px] text-gray-400">Comments</p></div>
                    <div><p className="text-lg font-bold text-gray-900">{fmt(c.post_clicks || 0)}</p><p className="text-[12px] text-gray-400">Clicks</p></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Profile summary</h2>
          <p className="mt-1 text-[14px] text-gray-500">Your current creator profile metrics.</p>
          <div className="mt-4">
            <SummaryRow label="LinkedIn followers" value={fmt(snap.followers)} />
            <SummaryRow label="Public posts" value={String(snap.posts)} />
            <SummaryRow label="Posts with reach data" value={`${withReach}%`} />
            <SummaryRow label="Public engagements" value={fmt(snap.engagements)} />
          </div>
        </Card>
      </div>

      <Card className="mt-6 flex items-start gap-3 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
        </span>
        <div>
          <p className="font-semibold text-gray-900">Estimates are based on your follower count</p>
          <p className="text-[14px] text-gray-500">Reach and engagement figures are modelled from your profile. Collaboration posts add verified metrics as you submit them.</p>
        </div>
      </Card>
    </div>
  );
}
