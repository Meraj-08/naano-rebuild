"use client";

import { useState } from "react";

function MethodCard({ badge, title, desc, cta, primary, children }: { badge: string; title: string; desc: string; cta: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5">
      <div className="mb-5 flex h-40 items-center justify-center rounded-xl bg-gradient-to-b from-[#eaf0fb] to-white">{children}</div>
      <p className="text-[13px] font-medium text-gray-500">{badge}</p>
      <h3 className="mt-1 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-gray-500">{desc}</p>
      <button className={`mt-5 rounded-xl py-3 text-sm font-semibold ${primary ? "bg-[#2563EB] text-white hover:bg-[#1d4fd7]" : "border border-gray-200 text-gray-900 hover:bg-gray-50"}`}>{cta}</button>
    </div>
  );
}

export function BrandCampaignNew() {
  const [mode, setMode] = useState<"choose" | "ai">("choose");

  if (mode === "ai") {
    return (
      <div className="rounded-3xl bg-gradient-to-b from-[#eef4ff] to-white p-10">
        <button onClick={() => setMode("choose")} className="mb-6 text-sm text-gray-500 hover:text-gray-800">‹ Back</button>
        <div className="mx-auto max-w-3xl text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <h1 className="flex items-center justify-center gap-3 font-[family-name:var(--font-jakarta)] text-[40px] font-bold tracking-[-0.03em] text-gray-900"><img src="/naano/app/logo.svg" alt="" className="h-9 w-9" />Generate your campaign in one click</h1>
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm">
            <p className="text-[15px] leading-relaxed text-gray-700">We want creators to post about our product launch on LinkedIn, focusing on tech and SaaS audiences. Looking for authentic posts. Budget around $2000 for this campaign, targeting creators with 5k-50k followers.</p>
            <div className="mt-4 flex justify-end"><button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB] text-white">↑</button></div>
          </div>
          <p className="mt-6 text-[13px] text-gray-400">The AI follow-up questions and generated brief are wired in the next build phase.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#eef4ff] to-white p-10">
      <button onClick={() => { window.location.hash = "campaigns"; }} className="mb-6 text-sm text-gray-500 hover:text-gray-800">‹ Back</button>
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 font-[family-name:var(--font-jakarta)] text-[40px] font-bold tracking-[-0.03em] text-gray-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="" className="h-9 w-9" />How do you want to launch your campaign?
        </h1>
        <p className="mt-3 text-[17px] text-gray-500">Choose your method. You can change everything before launch.</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
        <MethodCard badge="Today · 14:30 · 15 min" title="Launch free with the Naano team" desc="A campaign manager turns your selection into a ready-to-launch campaign. You validate, they handle the rest." cta="Book my onboarding →" primary>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl">🧑‍💼</span>
        </MethodCard>
        <div onClick={() => setMode("ai")} className="cursor-pointer">
          <MethodCard badge="5 min" title="Create with AI" desc="AI asks the right questions and prepares a fully editable brief." cta="Create with AI">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/naano/app/logo.svg" alt="" className="h-12 w-12" />
          </MethodCard>
        </div>
        <MethodCard badge="1 min" title="Start from your link" desc="Paste an influence campaign you already ran: Naano reuses the brief and structure." cta="Start from my link">
          <span className="rounded-lg bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">🔗 notion.site/brief…</span>
        </MethodCard>
      </div>
    </div>
  );
}
