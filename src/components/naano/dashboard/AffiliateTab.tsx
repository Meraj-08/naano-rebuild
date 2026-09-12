"use client";

import { useState } from "react";
import { Card } from "./dash-ui";

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card className="p-6">
      <p className="text-[13px] text-gray-400">{label}</p>
      <p className="mt-2 text-[30px] font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-[13px] text-gray-400">{sub}</p>
    </Card>
  );
}

const STEPS = [
  ["01", "Share the right link", "Use your Naano link for an introduction, or your Creator Card for a direct collaboration."],
  ["02", "They launch a campaign", "The company creates its account and completes its first paid campaign."],
  ["03", "Earn for 3 months", "You receive 25% of Naano's commission on its eligible campaigns."],
];

export function AffiliateTab() {
  const [tab, setTab] = useState<"brands" | "creators">("brands");
  const [volume, setVolume] = useState(5000);
  const [brands, setBrands] = useState(2);
  const monthly = Math.round(volume * 0.05 * brands);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Toggle */}
      <div className="mx-auto mb-10 flex w-fit rounded-2xl bg-gray-100 p-1 text-sm font-medium">
        <button onClick={() => setTab("brands")} className={`rounded-xl px-5 py-2.5 ${tab === "brands" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>🏢 Invite brands</button>
        <button onClick={() => setTab("creators")} className={`rounded-xl px-5 py-2.5 ${tab === "creators" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>👥 Invite creators</button>
      </div>

      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-gray-600 shadow-sm ring-1 ring-gray-100"><span className="h-2 w-2 rounded-full bg-[#2563EB]" />Creator affiliation · 25% for 3 months</span>
        <h1 className="mx-auto mt-6 max-w-2xl font-[family-name:var(--font-jakarta)] text-[56px] font-bold leading-[1.05] tracking-[-0.03em] text-gray-900">Recommend Naano. Earn for 3 months.</h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-gray-500">Share your personal link with a company. If it joins Naano and launches paid campaigns, you receive 25% of Naano&apos;s commission for three months.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black">Copy my referral link</button>
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-900">See how it works →</button>
        </div>
      </div>

      {/* Intro-link panel */}
      <div className="mt-12 rounded-3xl bg-[#f3f7ff] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">🏢</span>
              <div>
                <p className="font-semibold text-gray-900">Introduce a company to Naano</p>
                <p className="text-[13px] text-gray-500">Your link identifies you automatically</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Your personal referral link</p>
              <p className="text-[15px] font-medium text-[#2563EB]">naano.com/invite/you</p>
            </div>
            <button className="mt-3 text-sm font-semibold text-[#2563EB]">Copy link</button>
          </Card>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Your share of Naano&apos;s commission</p>
            <p className="mt-1 text-[52px] font-bold leading-none text-gray-900">25%</p>
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-[14px]"><span className="text-gray-500">Reward period</span><span className="font-semibold text-gray-900">3 months</span></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Rewards earned" value="€0.00" sub="" />
        <Stat label="Brands introduced" value="0" sub="0 have generated rewards" />
        <Stat label="Earning now" value="0" sub="Inside the three-month window" />
      </div>

      {/* How you get paid */}
      <div className="mt-16">
        <p className="text-sm font-bold uppercase tracking-wide text-[#2563EB]">How you get paid</p>
        <h2 className="mt-3 font-[family-name:var(--font-jakarta)] text-[40px] font-bold leading-[1.1] tracking-[-0.03em] text-gray-900">Share once. Naano tracks the rest.</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map(([n, t, d]) => (
            <div key={n} className="border-t border-gray-200 pt-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[13px] font-semibold text-[#2563EB]">{n}</span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-500">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reward simulator */}
      <div className="mt-14 rounded-3xl border border-gray-200/80 bg-[#f7f9fc] p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">Reward simulator</p>
            <h3 className="mt-3 font-[family-name:var(--font-jakarta)] text-[34px] font-bold leading-tight tracking-[-0.02em] text-gray-900">What could your network earn?</h3>
            <div className="mt-6 rounded-2xl bg-gray-900 p-6 text-white">
              <p className="text-[13px] text-gray-300">Potential over 3 months</p>
              <p className="mt-2 text-[44px] font-bold leading-none">€{(monthly * 3).toLocaleString("en-US")}</p>
              <p className="mt-4 border-t border-white/10 pt-3 text-[13px] text-gray-300">€{monthly.toLocaleString("en-US")} estimated per month</p>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between"><span className="text-[15px] text-gray-700">Monthly paid campaign volume per brand</span><span className="text-xl font-bold text-gray-900">€{volume.toLocaleString("en-US")}</span></div>
              <input type="range" min={1000} max={25000} step={500} value={volume} onChange={(e) => setVolume(+e.target.value)} className="mt-3 w-full accent-[#2563EB]" />
              <div className="mt-1 flex justify-between text-[12px] text-gray-400"><span>€1,000</span><span>€25,000</span></div>
            </div>
            <div>
              <div className="flex items-center justify-between"><span className="text-[15px] text-gray-700">Active referred brands</span><span className="text-xl font-bold text-gray-900">{brands}</span></div>
              <input type="range" min={1} max={10} value={brands} onChange={(e) => setBrands(+e.target.value)} className="mt-3 w-full accent-[#2563EB]" />
              <div className="mt-1 flex justify-between text-[12px] text-gray-400"><span>1</span><span>10</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Live tracking */}
      <div className="mt-16">
        <p className="text-sm font-bold uppercase tracking-wide text-[#2563EB]">Live tracking</p>
        <div className="mt-3 flex items-end justify-between">
          <h2 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold tracking-[-0.03em] text-gray-900">Your introduced brands</h2>
          <div className="text-right"><p className="text-[28px] font-bold text-gray-900">€0.00</p><p className="text-[12px] uppercase tracking-wide text-gray-400">Total earned</p></div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-8">
          <p className="text-lg font-semibold text-gray-900">Your first brand will appear here</p>
          <p className="mt-2 text-[14px] text-gray-500">Share your referral link. Signup, reward window and earnings will update here automatically.</p>
          <button className="mt-4 text-sm font-semibold text-[#2563EB]">Copy my referral link</button>
        </div>
      </div>
    </div>
  );
}
