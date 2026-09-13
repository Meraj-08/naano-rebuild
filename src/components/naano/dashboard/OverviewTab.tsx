"use client";

import { useEffect, useState } from "react";
import { Card, PageHead, StatCard } from "./dash-ui";
import { MarketplaceCard } from "../shared/MarketplaceCard";
import { ChartLineIcon } from "./dashboard-icons";
import { IdCardIcon } from "./dashboard-icons";
import { getProfile, listCreatorCollaborations, type Profile, type Collaboration } from "@/lib/naano/db";
import { computeSnapshot, toCardProps, fmt } from "@/lib/naano/creator";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function PostIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}
function UsersMini() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5a3 3 0 0 1 0 6M18 20a5 5 0 0 0-3-4.5" />
    </svg>
  );
}
const outlineBtn =
  "flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50";

export function OverviewTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  useEffect(() => {
    getProfile().then(setProfile);
    listCreatorCollaborations().then(setCollabs);
  }, []);

  const snap = computeSnapshot(profile, collabs);
  const firstName = (profile?.name || "there").split(" ")[0];

  return (
    <div>
      <PageHead eyebrow="Creator workspace" title={`Good to see you, ${firstName}`} subtitle="Your creator activity, at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<EyeIcon />} label="Public post reach" value={fmt(snap.reach)} sub="Estimated reach across your posts" />
        <StatCard icon={<PostIcon />} label="Public posts" value={String(snap.posts)} sub="Posts contributing to your reach" />
        <StatCard icon={<ChartLineIcon width={16} height={16} />} label="Public engagements" value={fmt(snap.engagements)} sub="Reactions, comments and reposts" />
        <StatCard icon={<UsersMini />} label="LinkedIn followers" value={fmt(snap.followers)} sub="From your creator profile" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Creator card */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your creator card</h2>
              <p className="mt-1 max-w-xs text-[14px] text-gray-500">This is how brands discover your positioning and collaboration offer.</p>
            </div>
            <div className="flex flex-col items-stretch gap-2">
              <button className={outlineBtn}><IdCardIcon width={16} height={16} className="text-gray-400" />Open card</button>
              <button className={outlineBtn}>Copy card link</button>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Share my card</button>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <MarketplaceCard {...toCardProps(profile)} avatarInitial={(profile?.name || "M")[0].toUpperCase()} costLabel="Chosen cost" />
          </div>
        </Card>

        {/* Launch guide */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your launch guide</h2>
              <p className="mt-1 text-[14px] text-gray-500">1 of 1 steps complete</p>
            </div>
            <a href="#profile" className="text-sm font-semibold text-[#2563EB] hover:underline">Open card</a>
          </div>
          <div className="mt-6 flex items-center gap-4 rounded-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Card and price ready</p>
              <p className="text-[14px] text-gray-500">Your positioning and offer are ready to review.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">Complete</span>
            <button className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recommended opportunities</h2>
            <a href="#opportunities" className="text-sm font-semibold text-[#2563EB] hover:underline">Explore</a>
          </div>
          <p className="mt-1 text-[14px] text-gray-500">The 3 campaigns that best match your audience.</p>
          <p className="mt-4 text-[14px] leading-relaxed text-gray-500">
            Open the Opportunities tab to browse campaigns matched to your audience and apply.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Active collaborations</h2>
            <a href="#collabs" className="text-sm font-semibold text-[#2563EB] hover:underline">See all</a>
          </div>
          <p className="mt-1 text-[14px] text-gray-500">Everything currently moving from brief to publication.</p>
          <div className="mt-4 grid grid-cols-5 gap-2 border-b border-gray-100 pb-2 text-[13px] font-medium text-gray-400">
            <span>Brand</span><span>Status</span><span>Next action</span><span>Due</span><span>Net</span>
          </div>
          {collabs.filter((c) => c.status !== "invited").length === 0 ? (
            <p className="py-10 text-center text-[14px] text-gray-400">No active collaborations.</p>
          ) : (
            collabs.filter((c) => c.status !== "invited").slice(0, 4).map((c) => (
              <div key={c.id} className="grid grid-cols-5 items-center gap-2 border-b border-gray-50 py-3 text-[13px] last:border-0">
                <span className="truncate font-medium text-gray-900">{c.creator_name}</span>
                <span className="capitalize text-gray-500">{c.status}</span>
                <span className="truncate text-gray-500">{c.next_action || "—"}</span>
                <span className="text-gray-500">{c.due_date || "—"}</span>
                <span className="font-semibold text-gray-900">{c.net || c.rate || "—"}</span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
