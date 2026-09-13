"use client";

import { useState } from "react";
import { addBudget, getBalance, parseAmount, campaignBookable, type Campaign } from "@/lib/naano/db";

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
                <div><h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2><p className="text-[14px] text-gray-500">{creator.tags} · LinkedIn creator</p><p className="mt-0.5 text-[13px] text-gray-500"><b className="text-gray-900">{creator.followers}</b> followers</p></div>
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
export function InviteModal({ creator, balance, campaigns, campaignId, onCampaignChange, onClose, onSend, onAddBudget }: { creator: BrandCreator; balance: number; campaigns: Campaign[]; campaignId: string | null; onCampaignChange: (id: string | null) => void; onClose: () => void; onSend: () => void; onAddBudget: () => void }) {
  const rate = parseAmount(creator.cost);
  const enough = balance >= rate;
  const selected = campaigns.find((c) => c.id === campaignId) ?? null;
  const bookWindow = selected ? campaignBookable(selected) : { ok: campaigns.length === 0 ? false : true, reason: campaigns.length === 0 ? "Create a campaign first." : "Select a campaign." };
  return (
    <Overlay onClose={onClose}>
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-gray-900">Invite {creator.name}</h2><button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">✕</button></div>
        <div className="mt-5 flex items-center gap-3">
          {creator.avatar ? <img src={creator.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5b6b66] font-semibold text-white">{creator.name[0]}</span>}
          <div><p className="font-semibold text-gray-900">{creator.name} · Single post</p><p className="text-[13px] text-gray-500">LinkedIn · {creator.cost}</p></div>
        </div>

        <label className="mt-6 block text-sm font-semibold text-gray-900">Campaign</label>
        {campaigns.length === 0 ? (
          <p className="mt-2 rounded-xl bg-amber-50 p-3 text-[13px] text-amber-700">No campaigns yet — create one first so this invitation can be attached to it.</p>
        ) : (
          <select value={campaignId ?? ""} onChange={(e) => onCampaignChange(e.target.value || null)} className="mt-2 w-full rounded-xl border-2 border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]">
            {campaigns.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        )}
        <p className="mt-1 text-[12px] text-gray-400">Choose which campaign this creator invitation belongs to.</p>

        <label className="mt-5 block text-sm font-semibold text-gray-900">Post by</label>
        <div className="mt-2 flex gap-2">
          <input type="date" defaultValue="2026-09-27" className="flex-1 rounded-xl border-2 border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB]" />
          <span className="flex items-center rounded-xl bg-gray-100 px-3 text-sm text-gray-500">14 days from now</span>
        </div>
        <p className="mt-1 text-[12px] text-gray-400">Latest date the creator must publish the post. Defaults to 14 days.</p>

        <p className="mt-5 text-sm font-semibold text-gray-900">How should the creator work?</p>
        <div className="mt-2 rounded-2xl border-2 border-[#2563EB] bg-blue-50/30 p-4"><p className="font-semibold text-[#2563EB]">Specific brief</p><p className="text-[13px] text-gray-500">Use detailed instructions from one of your campaign briefs.</p></div>

        <label className="mt-4 flex items-center gap-2 text-[14px] text-gray-700"><input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2563EB]" />I want to approve the content before it is published.</label>

        {!bookWindow.ok && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-[13px] text-amber-700">⚠ {bookWindow.reason}</div>
        )}

        <div className={`mt-4 rounded-xl p-3 text-[13px] ${enough ? "bg-emerald-50/60 text-gray-600" : "bg-amber-50 text-amber-700"}`}>
          ◆ Available budget: <b>€{balance.toLocaleString()}</b>. {enough ? `€${rate.toLocaleString()} will be committed and paid on completion.` : `This post costs €${rate.toLocaleString()} — add funds before inviting.`}
        </div>
        {!bookWindow.ok ? (
          <button disabled className="mt-4 w-full cursor-not-allowed rounded-xl bg-gray-300 py-3 text-sm font-semibold text-white">Send invitation</button>
        ) : enough ? (
          <button onClick={onSend} className="mt-4 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Send invitation</button>
        ) : (
          <button onClick={onAddBudget} className="mt-4 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Add budget</button>
        )}
      </div>
    </Overlay>
  );
}

/* ---------- Add budget: real credit insert, no payment processing ---------- */
export function AddBudgetModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [amount, setAmount] = useState(2500);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<{ added: number; balance: number } | null>(null);

  const submit = async () => {
    if (!amount) return;
    setSaving(true);
    await addBudget(amount);
    const balance = await getBalance();
    onAdded();
    setDone({ added: amount, balance });
    setSaving(false);
  };
  const finish = () => { onClose(); };

  if (done) {
    return (
      <Overlay onClose={finish}>
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Budget added</h2>
          <p className="mt-2 text-[15px] text-gray-500"><span className="font-semibold text-gray-900">€{done.added.toLocaleString()}</span> was credited to your balance.</p>
          <div className="mt-4 rounded-xl bg-gray-50 p-3 text-[14px]"><span className="text-gray-500">New balance</span> <span className="ml-2 font-bold text-gray-900">€{done.balance.toLocaleString()}</span></div>
          <button onClick={finish} className="mt-5 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Done</button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between"><h2 className="text-xl font-bold text-gray-900">Add budget</h2><button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">✕</button></div>
        <p className="mt-1 text-[14px] text-gray-500">Top up your Naano balance. Use it across all campaigns.</p>
        <div className="mt-4 grid grid-cols-4 gap-2">{[2500, 5000, 10000, 25000].map((a) => (<button key={a} onClick={() => setAmount(a)} className={`rounded-xl border py-2 text-sm font-semibold ${amount === a ? "border-[#2563EB] text-[#2563EB]" : "border-gray-200 text-gray-700"}`}>€{a.toLocaleString()}</button>))}</div>
        <div className="mt-3 flex items-center rounded-xl border-2 border-[#2563EB] px-3"><span className="text-gray-400">€</span><input value={amount} onChange={(e) => setAmount(+e.target.value.replace(/[^0-9]/g, "") || 0)} inputMode="numeric" className="w-full bg-transparent px-2 py-3 text-sm outline-none" /></div>
        <button onClick={submit} disabled={saving || !amount} className="mt-4 w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7] disabled:opacity-60">{saving ? "Adding…" : `Add €${amount.toLocaleString()}`}</button>
      </div>
    </Overlay>
  );
}
