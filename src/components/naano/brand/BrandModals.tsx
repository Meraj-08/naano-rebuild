"use client";

import { useState } from "react";

export interface BrandCreator {
  name: string;
  tags: string;
  flag: string;
  followers: string;
  views: string;
  cpm: string;
  cost: string;
  avatar: string;
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full">{children}</div>
    </div>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3 text-[13px]">
      <span className="flex-1 text-gray-600">{label}</span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${pct}%` }} /></div>
      <span className="w-8 text-right font-semibold text-gray-900">{pct}%</span>
    </div>
  );
}

/* ---------- Creator detail ---------- */
export function CreatorDetailModal({ creator, onClose, onBook }: { creator: BrandCreator; onClose: () => void; onBook: () => void }) {
  const [tab, setTab] = useState<"overview" | "audience" | "content">("overview");
  return (
    <Overlay onClose={onClose}>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid md:grid-cols-[1.6fr_1fr]">
          {/* Left */}
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={creator.avatar} alt={creator.name} className="h-16 w-16 rounded-full object-cover" />
                <div><h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2><p className="text-[14px] text-gray-500">{creator.tags} · LinkedIn creator</p></div>
              </div>
              <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">✕</button>
            </div>

            <div className="mt-6 flex gap-6 border-b border-gray-100 text-[15px]">
              {(["overview", "audience", "content"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`pb-3 capitalize ${tab === t ? "border-b-2 border-[#2563EB] font-semibold text-gray-900" : "text-gray-500"}`}>{t}</button>
              ))}
            </div>

            {tab !== "content" && (
              <div className="mt-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">✦ Creator overview</h3>
                <p className="mt-1 text-[14px] text-gray-500">Review this creator&apos;s audience and recent content before booking.</p>
                <div className="mt-3 flex flex-wrap gap-4 text-[14px] text-gray-600"><span>✓ 48% in observed audience · Marketing</span><span>✓ {creator.views} typical reach</span></div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">Audience snapshot</h3>
                <div className="mt-3 grid gap-6 sm:grid-cols-2">
                  <div><p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-gray-400">Job title</p><div className="space-y-2"><Bar label="Marketing" pct={48} /><Bar label="Founders" pct={29} /><Bar label="Engineering" pct={15} /><Bar label="Other" pct={8} /></div></div>
                  <div><p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-gray-400">Seniority</p><div className="space-y-2"><Bar label="Founder" pct={58} /><Bar label="Manager" pct={32} /><Bar label="Vp" pct={9} /><Bar label="Other" pct={1} /></div></div>
                </div>
              </div>
            )}
            {tab !== "audience" && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900">Content performance</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 p-4"><p className="text-[12px] text-gray-500">Reach across recent posts</p><svg viewBox="0 0 200 90" className="mt-3 w-full"><polyline points="0,60 40,45 80,25 120,55 160,35 200,20" fill="none" stroke="#2563EB" strokeWidth="2.5" /></svg></div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2"><img src={creator.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /><div><p className="text-[13px] font-semibold text-gray-900">{creator.name}</p><p className="text-[11px] text-gray-400">Public LinkedIn post</p></div></div>
                    <p className="mt-2 line-clamp-3 text-[13px] text-gray-600">I basically turned Claude into my outbound team. And no, I don&apos;t mean it &quot;helps&quot; with outbound. It actually runs it…</p>
                    <div className="mt-2 flex gap-3 text-[11px] text-gray-400"><span>👁 {creator.views}</span><span>👍 109</span><span>💬 76</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: book panel */}
          <div className="border-t border-gray-100 bg-gray-50/60 p-8 md:border-l md:border-t-0">
            <h3 className="text-lg font-bold text-gray-900">Book this creator</h3>
            <div className="mt-4 rounded-2xl border-2 border-[#2563EB] bg-white p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 font-semibold text-gray-900"><span className="h-4 w-4 rounded-full border-[5px] border-[#2563EB]" />Single post</span><span className="font-bold text-gray-900">{creator.cost}</span></div></div>
            <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4"><div className="flex items-center justify-between"><span className="font-semibold text-gray-900">Bundle · 5</span><span className="font-bold text-gray-900">625 €</span></div></div>
            <div className="mt-5 space-y-2.5 text-[14px]">
              <div className="flex justify-between"><span className="text-gray-500">Typical reach</span><b>{creator.views}</b></div>
              <div className="flex justify-between"><span className="text-gray-500">Estimated CPM</span><b>{creator.cpm}</b></div>
              <div className="flex justify-between"><span className="text-gray-500">Posts analyzed</span><b>5</b></div>
            </div>
            <button onClick={onBook} className="mt-6 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Collaborate with {creator.name.split(" ")[0]}</button>
            <p className="mt-3 text-center text-[12px] text-gray-400">🛡 Secure booking · Creator approves first</p>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

/* ---------- Booking: your selection ---------- */
export function BookSelectionModal({ creator, onBack, onClose, onBook }: { creator: BrandCreator; onBack?: () => void; onClose: () => void; onBook: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          {onBack ? <button onClick={onBack} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600">‹ Back</button> : <span />}
          <h2 className="text-lg font-bold text-gray-900">Your selection</h2>
          <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">✕</button>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-blue-50/50 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#2563EB]">📄</span>
          <div className="flex-1"><p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Creator rate</p><p className="font-semibold text-gray-900">Single post</p></div>
          <div className="text-right"><p className="text-xl font-bold text-gray-900">{creator.cost}</p><p className="text-[11px] text-gray-400">Standard rate</p></div>
        </div>
        <p className="mt-4 text-[14px] text-gray-500">Book this option at the listed price, or propose a lower price.</p>
        <div className="mt-4 flex gap-3">
          <button className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-200">↔ Negotiate</button>
          <button onClick={onBook} className="flex-1 rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Book · {creator.cost}</button>
        </div>
      </div>
    </Overlay>
  );
}

/* ---------- Booking: invite ---------- */
export function InviteModal({ creator, onClose, onContinue }: { creator: BrandCreator; onClose: () => void; onContinue: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-gray-900">Invite {creator.name}</h2><button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">✕</button></div>
        <div className="mt-5 flex items-center gap-3"><img src={creator.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /><div><p className="font-semibold text-gray-900">{creator.name} · Single post</p><p className="text-[13px] text-gray-500">LinkedIn · {creator.cost}</p></div></div>

        <label className="mt-6 block text-sm font-semibold text-gray-900">Post by</label>
        <div className="mt-2 flex gap-2">
          <input type="date" defaultValue="2026-09-26" className="flex-1 rounded-xl border-2 border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
          <span className="flex items-center rounded-xl bg-gray-100 px-3 text-sm text-gray-500">14 days from now</span>
        </div>
        <p className="mt-1 text-[12px] text-gray-400">Latest date the creator must publish the post. Defaults to 14 days.</p>

        <p className="mt-5 text-sm font-semibold text-gray-900">How should the creator work?</p>
        <div className="mt-2 rounded-2xl border-2 border-[#2563EB] bg-blue-50/30 p-4"><p className="font-semibold text-[#2563EB]">Specific brief</p><p className="text-[13px] text-gray-500">Use detailed instructions from one of your campaign briefs.</p></div>

        <label className="mt-5 block text-sm font-semibold text-gray-900">Campaign</label>
        <select className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none"><option>https://www.linkedin.com/company/naanooo/ creator brief</option></select>

        <label className="mt-4 flex items-center gap-2 text-[14px] text-gray-700"><input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2563EB]" />I want to approve the content before it is published.</label>
        <div className="mt-4 rounded-xl bg-blue-50/50 p-3 text-[13px] text-gray-500">◆ Available budget: €0.00. Add funds before sending this invitation.</div>
        <button onClick={onContinue} className="mt-4 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Add €500.00 and continue</button>
      </div>
    </Overlay>
  );
}

/* ---------- Add budget (static show-piece) ---------- */
export function AddBudgetModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState(500);
  return (
    <Overlay onClose={onClose}>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between"><div><span className="text-[12px] font-bold uppercase tracking-wide text-[#2563EB]">🔒 Secure payment</span><h2 className="mt-1 text-xl font-bold text-gray-900">Add budget</h2></div><button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">✕</button></div>
        <p className="mt-1 text-[14px] text-gray-500">One-time deposit to your Naano balance. Use it across all campaigns — no subscription.</p>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-gray-200 p-4"><div className="flex items-center gap-2"><span>💳</span><div><p className="text-sm font-semibold text-gray-900">Suggested for your selection</p><p className="text-[12px] text-gray-500">Covers the creators you picked. Adjust below if needed.</p></div></div><span className="rounded-full bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white">€500</span></div>
        <p className="mt-4 text-[12px] font-semibold uppercase tracking-wide text-gray-400">Choose an amount</p>
        <div className="mt-2 grid grid-cols-4 gap-2">{[2500, 5000, 10000, 25000].map((a) => (<button key={a} onClick={() => setAmount(a)} className={`rounded-xl border py-2 text-sm font-semibold ${amount === a ? "border-[#2563EB] text-[#2563EB]" : "border-gray-200 text-gray-700"}`}>€{a.toLocaleString()}</button>))}</div>
        <div className="mt-3 flex items-center rounded-xl border-2 border-[#2563EB] px-3"><span className="text-gray-400">€</span><input value={amount} onChange={(e) => setAmount(+e.target.value || 0)} className="w-full bg-transparent px-2 py-3 text-sm outline-none" /></div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 p-3 text-[14px]"><span className="text-gray-500">You will credit</span><b className="text-gray-900">€{amount.toLocaleString()}</b></div>
        <button className="mt-4 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Add €{amount.toLocaleString()}</button>
        <p className="mt-3 text-center text-[12px] text-gray-400">🔒 End-to-end encrypted · powered by Stripe</p>
      </div>
    </Overlay>
  );
}
