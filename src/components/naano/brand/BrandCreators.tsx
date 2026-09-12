"use client";

import { useState } from "react";

const CREATORS = [
  { name: "Eric Djavid", tags: "B2B · SaaS", flag: "🇫🇷", followers: "79.4K", views: "12.1K", cpm: "€14", cost: "€1,125", bg: "#3a5a8c" },
  { name: "Jeanette Gomez", tags: "Sales · Growth / GTM", flag: "🇦🇪", followers: "86.3K", views: "9.8K", cpm: "€1", cost: "€107", bg: "#8c5a3a" },
  { name: "Phil Shorland", tags: "B2B · Marketing", flag: "🇬🇧", followers: "41.2K", views: "7.2K", cpm: "€12", cost: "€488", bg: "#3a8c6a" },
  { name: "Josue Valles", tags: "Marketing", flag: "🇲🇽", followers: "29.3K", views: "6.4K", cpm: "€27", cost: "€788", bg: "#5a3a8c" },
  { name: "Gunveen Kaur", tags: "Marketing · SaaS", flag: "🇬🇧", followers: "4.9K", views: "700", cpm: "€36", cost: "€25", bg: "#8c3a5a" },
  { name: "Usman Ahmad", tags: "B2B · SaaS", flag: "🇵🇰", followers: "58.8K", views: "2.2K", cpm: "€66", cost: "€150", bg: "#c9885b" },
  { name: "Guillaume Deramchi", tags: "AI · Software", flag: "🇫🇷", followers: "6.2K", views: "7.6K", cpm: "€49", cost: "€375", bg: "#2f6b8f" },
  { name: "Amber Cheema", tags: "AI · Marketing", flag: "🇬🇧", followers: "17.3K", views: "17.3K", cpm: "€11", cost: "€188", bg: "#7ba05b" },
];

function Stat({ v, l }: { v: string; l: string }) {
  return <div className="text-center"><p className="text-sm font-bold text-gray-900">{v}</p><p className="text-[10px] uppercase tracking-wide text-gray-400">{l}</p></div>;
}

export function BrandCreators() {
  const [tab, setTab] = useState<"ai" | "market">("market");

  return (
    <div>
      <div className="mx-auto mb-8 flex w-fit rounded-2xl bg-gray-100 p-1 text-sm font-semibold">
        <button onClick={() => setTab("ai")} className={`rounded-xl px-6 py-2.5 ${tab === "ai" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>✦ AI Matching</button>
        <button onClick={() => setTab("market")} className={`rounded-xl px-6 py-2.5 ${tab === "market" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>👥 Creator Marketplace</button>
      </div>

      {tab === "ai" ? (
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200/80 bg-gradient-to-b from-[#eef4ff] to-white p-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="" className="mx-auto h-10 w-10" />
          <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-2xl font-bold text-gray-900">Nao is using your campaign brief</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-gray-500">Your starter brief is attached. Tell Nao what matters most, open profiles, and save the creators you want to invite.</p>
          <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2">
            <input placeholder="Ask Nao a question, or find creators…" className="w-full bg-transparent py-2 text-sm outline-none" />
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white">↑</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {CREATORS.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-2xl border border-gray-200/80">
              <div className="relative h-16 bg-gradient-to-r from-[#eaf0fb] to-white">
                <span className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-md bg-[#0A66C2] text-xs font-bold text-white">in</span>
                <span className="absolute right-4 top-4">{c.flag}</span>
              </div>
              <div className="px-5 pb-5">
                <div className="-mt-8 flex items-end justify-between">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-lg font-semibold text-white" style={{ background: c.bg }}>{c.name[0]}</span>
                  <button className="rounded-lg bg-[#2563EB] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Book</button>
                </div>
                <p className="mt-3 font-semibold text-gray-900">{c.name}</p>
                <p className="text-[13px] text-gray-500">{c.tags}</p>
                <div className="mt-4 grid grid-cols-4 gap-1 border-t border-gray-100 pt-3">
                  <Stat v={c.followers} l="Followers" /><Stat v={c.views} l="Median views" /><Stat v={c.cpm} l="CPM" /><Stat v={c.cost} l="Post cost" />
                </div>
                <button className="mt-4 flex w-full items-center justify-between rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900"><span>👤 View profile</span><span>→</span></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
