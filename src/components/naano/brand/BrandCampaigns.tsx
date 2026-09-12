"use client";

import { useState } from "react";
import { Card } from "../dashboard/dash-ui";

const FILTERS = ["All", "Active", "Draft", "Completed"] as const;

function CreateCard() {
  return (
    <Card className="p-6">
      <div className="flex h-24 items-center rounded-xl bg-gradient-to-r from-[#eaf0fb] to-white px-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0A66C2] text-xl font-bold text-white">in</span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-[#2563EB]">Create a campaign</h3>
      <p className="mt-1 text-[14px] text-gray-500">Launch a new campaign in 2 minutes — with AI, the Naano team, or an existing link.</p>
      <div className="mt-4 grid grid-cols-3 border-y border-gray-100 py-3 text-[13px] text-gray-400">
        <div><p className="text-gray-900">—</p>Creators</div>
        <div><p className="text-gray-900">—</p>Published</div>
        <div><p className="text-gray-900">—</p>Committed budget</div>
      </div>
      <a href="#campaign-new" className="mt-4 inline-block rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Get started →</a>
    </Card>
  );
}

function CampaignCard() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#eaf0fb] to-white px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0A66C2] text-xl font-bold text-white">in</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">● Active</span>
        </div>
        <span className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Created on 12 Sept 2026</span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-gray-900">https://www.linkedin.com/company/naanooo/ creator brief</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-gray-500">https://www.linkedin.com/company/naanooo/ is described by the company as We help to get customer the Best B2B brand deals. The intended audience is professionals connected to SaaS in Europe, North America. Introduce the product through yo…</p>
      <div className="mt-4 grid grid-cols-3 border-y border-gray-100 py-3 text-[13px] text-gray-400">
        <div><p className="text-lg font-bold text-gray-900">0</p>Creators</div>
        <div><p className="text-lg font-bold text-gray-900">0</p>Published</div>
        <div><p className="text-lg font-bold text-gray-900">€0</p>Committed budget</div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-4 text-sm">
        <a href="#marketplace" className="font-semibold text-gray-900">Open campaign →</a>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500">📄 My brief</span>
        <button className="rounded-lg border border-red-100 p-1.5 text-red-400 hover:bg-red-50"><svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg></button>
      </div>
    </Card>
  );
}

export function BrandCampaigns() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const showCampaign = filter === "All" || filter === "Active";
  const showCreate = filter === "All" || filter === "Draft";
  const empty = !showCampaign && !showCreate;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-jakarta)] text-[36px] font-bold tracking-[-0.03em] text-gray-900">Campaigns</h1>
        <a href="#campaign-new" className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">+ Create a campaign</a>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex rounded-2xl bg-gray-100 p-1 text-sm font-semibold">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-xl px-4 py-2 ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{f}</button>
          ))}
        </div>
        <span className="text-[14px] text-gray-500">{showCampaign ? 1 : 0} campaigns</span>
      </div>

      {empty ? (
        <Card className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">📁</div>
          <p className="font-semibold text-gray-900">No campaigns in this view</p>
          <p className="mt-1 text-[14px] text-gray-500">Change the filter or create a new campaign.</p>
          <a href="#campaign-new" className="mt-5 inline-block rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">+ Create campaign</a>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {showCampaign && <CampaignCard />}
          {showCreate && <CreateCard />}
        </div>
      )}
    </div>
  );
}
