"use client";

import { useEffect, useState } from "react";
import { Card, PageHead } from "../dashboard/dash-ui";
import { listBrandCollaborations, completeCollaboration, getBalance, listTransactions, addBudget, type Collaboration, type WalletTx } from "@/lib/naano/db";

const dropdown = "flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700";
const chevron = <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>;

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = { invited: "bg-amber-50 text-amber-600", active: "bg-blue-50 text-[#2563EB]", submitted: "bg-violet-50 text-violet-600", completed: "bg-emerald-50 text-emerald-600" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] ?? "bg-blue-50 text-[#2563EB]"}`}>{status[0].toUpperCase() + status.slice(1)}</span>;
}

export function BrandCollaborations() {
  const filters = ["All", "Active", "Invitations received", "Invitations sent", "To do", "Completed"];
  const [rows, setRows] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const load = () => listBrandCollaborations().then((r) => { setRows(r); setLoading(false); });
  useEffect(() => { load(); }, []);
  const markDone = async (id: string) => { setBusy(id); await completeCollaboration(id); await load(); setBusy(null); };
  const committed = rows.reduce((s, r) => s + (parseInt((r.net ?? r.rate ?? "0").replace(/[^\d]/g, "")) || 0), 0);

  return (
    <div>
      <PageHead title="Collaborations" right={<div className="flex gap-6 text-sm"><span><b className="text-gray-900">{rows.length}</b> <span className="text-gray-400">collaborations</span></span><span><b className="text-gray-900">€{committed.toLocaleString()}</b> <span className="text-gray-400">committed</span></span><span><b className="text-gray-900">{rows.length}</b> <span className="text-gray-400">to do</span></span></div>} />
      <div className="mb-4 flex flex-wrap gap-3">
        <button className={`${dropdown} min-w-[220px] justify-between`}>All campaigns {chevron}</button>
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm text-gray-400"><svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>Search creators, campaigns…</div>
      </div>
      <div className="mb-4 flex flex-wrap gap-6 border-b border-gray-100 text-[15px]">
        {filters.map((f, i) => (<span key={f} className={`flex items-center gap-2 pb-3 ${i === 0 ? "border-b-2 border-[#2563EB] font-semibold text-gray-900" : "text-gray-500"}`}>{f}<span className="rounded-full bg-gray-100 px-1.5 text-xs">{i === 0 ? rows.length : 0}</span></span>))}
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 gap-2 border-b border-gray-100 px-6 py-4 text-[13px] font-medium text-gray-400"><span className="col-span-2">Creator</span><span>Status</span><span>Next action</span><span>Due date</span><span>Amount</span><span>Updated</span></div>
        {loading ? (
          <p className="py-16 text-center text-[14px] text-gray-400">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-gray-500">No collaborations yet, invite a creator from the Marketplace.</p>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="grid grid-cols-7 items-center gap-2 border-b border-gray-50 px-6 py-4 text-[14px] last:border-0">
              <div className="col-span-2 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {r.creator_avatar ? <img src={r.creator_avatar} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="h-8 w-8 rounded-full bg-gray-200" />}
                <div><p className="font-semibold text-gray-900">{r.creator_name}</p><p className="text-[12px] text-gray-400">{r.creator_tags}</p></div>
              </div>
              <span><StatusPill status={r.status} /></span>
              <span className="flex items-center gap-2 text-gray-600">
                {r.post_url && <a href={r.post_url} target="_blank" rel="noreferrer" className="text-[#2563EB] hover:underline">View post ↗</a>}
                {r.status === "submitted" ? (
                  <button onClick={() => markDone(r.id)} disabled={busy === r.id} className="rounded-lg bg-[#2563EB] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#1d4fd7] disabled:opacity-60">{busy === r.id ? "…" : "Mark complete"}</button>
                ) : !r.post_url ? r.next_action : null}
              </span>
              <span className="text-gray-500">{r.due_date ?? "—"}</span>
              <span className="font-semibold text-gray-900">{r.net ?? r.rate ?? "—"}</span>
              <span className="text-gray-400">{new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
            </div>
          ))
        )}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 text-[13px] text-gray-500"><span>{rows.length} collaborations</span><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">1</span><span>Rows per page: 10</span></div>
      </Card>
    </div>
  );
}

export function BrandResults() {
  return (
    <div>
      <PageHead title="Results" subtitle="Public LinkedIn performance for your campaigns." />
      <div className="mb-4 flex gap-6 border-b border-gray-100 text-[15px]"><span className="border-b-2 border-[#2563EB] pb-3 font-semibold text-gray-900">Analytics</span><span className="pb-3 text-gray-500">Leads</span><span className="pb-3 text-gray-500">Posts</span></div>
      <button className={`${dropdown} mb-6 min-w-[220px] justify-between`}>All campaigns {chevron}</button>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6"><p className="text-[13px] text-gray-500">Est. reach</p><p className="mt-2 text-[30px] font-bold">0</p><p className="mt-1 text-[13px] text-gray-400">No published posts yet</p></Card>
        <Card className="p-6"><p className="text-[13px] text-gray-500">Qualified clicks ⓘ</p><p className="mt-2 text-[30px] font-bold">0</p><p className="mt-1 text-[13px] text-gray-400">last 30 days</p></Card>
        <Card className="p-6"><p className="text-[13px] text-gray-500">Committed budget ⓘ</p><p className="mt-2 text-[30px] font-bold">0 €</p><p className="mt-1 text-[13px] text-gray-400">0 bookings</p></Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-gray-900">Performance over time</h2></div><button className={dropdown}>Month {chevron}</button></div>
          <div className="mt-8 h-[220px] rounded-xl border-b border-l border-gray-100">
            <svg viewBox="0 0 600 200" className="h-full w-full"><line x1="10" y1="180" x2="590" y2="180" stroke="#2563EB" strokeWidth="2" /></svg>
          </div>
          <div className="mt-2 flex justify-between text-[13px] text-gray-400"><span>13 Aug</span><span>28 Aug</span><span>12 Sept</span></div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-gray-900">Post performance</h2><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">Without a pixel</span></div>
          <p className="mt-1 text-[14px] text-gray-500">Latest metrics collected from your posts.</p>
          {["Posts", "reactions", "comments"].map((l) => (<div key={l} className="flex items-center justify-between border-b border-gray-100 py-3.5 last:border-0"><span className="text-gray-500">{l}</span><b>0</b></div>))}
          <a href="#" className="mt-3 inline-block text-sm font-semibold text-[#2563EB]">View posts →</a>
        </Card>
      </div>
      <Card className="mt-6 flex items-center justify-between p-5"><div className="flex items-center gap-3"><span className="text-[#2563EB]">ⓘ</span><div><p className="font-semibold text-gray-900">Measure site conversions</p><p className="text-[14px] text-gray-500">Connect the pixel to add visits, sign-ups and revenue to your post results.</p></div></div><button className="font-semibold text-gray-900">Install the pixel</button></Card>
    </div>
  );
}

export function BrandBilling() {
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState<WalletTx[]>([]);
  const [amount, setAmount] = useState(2500);
  const [busy, setBusy] = useState(false);
  const load = async () => { setBalance(await getBalance()); setTxs(await listTransactions()); };
  useEffect(() => { load(); }, []);
  const add = async (a: number) => { if (!a) return; setBusy(true); await addBudget(a); await load(); setBusy(false); };

  return (
    <div>
      <PageHead title="Billing" subtitle="Manage your budget and transactions." right={<button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800">? Need help?</button>} />
      <Card className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Available balance</p>
            <p className="mt-2 text-[56px] font-bold leading-none text-gray-900">€{balance.toLocaleString()}</p>
            <p className="mt-2 text-[14px] text-gray-500">Ready to spend across your campaigns.</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border-2 border-gray-300 px-3"><span className="text-gray-400">€</span><input value={amount} onChange={(e) => setAmount(+e.target.value.replace(/[^0-9]/g, "") || 0)} inputMode="numeric" className="w-28 bg-transparent px-2 py-2.5 text-sm outline-none" /></div>
              <button onClick={() => add(amount)} disabled={busy} className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4fd7] disabled:opacity-60">{busy ? "Adding…" : "Add budget"}</button>
              <button onClick={() => add(2500)} disabled={busy} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700">+ €2,500</button>
              <button onClick={() => add(10000)} disabled={busy} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700">+ €10,000</button>
            </div>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-[#2563EB]">€</span>
        </div>
      </Card>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-bold text-gray-900">Transactions</h2>
        <div className="mt-4 grid grid-cols-4 gap-2 border-b border-gray-100 pb-3 text-[13px] font-medium text-gray-400"><span className="col-span-2">Detail</span><span>Type</span><span className="text-right">Amount</span></div>
        {txs.length === 0 ? (
          <p className="py-12 text-center text-[14px] text-gray-500">No transactions yet. Add budget or complete a collaboration.</p>
        ) : (
          txs.map((t) => (
            <div key={t.id} className="grid grid-cols-4 items-center gap-2 border-b border-gray-50 py-3.5 text-[14px] last:border-0">
              <div className="col-span-2"><p className="text-gray-900">{t.description}</p><p className="text-[12px] text-gray-400">{new Date(t.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p></div>
              <span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.type === "credit" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"}`}>{t.type}</span></span>
              <span className={`text-right font-semibold ${t.type === "credit" ? "text-emerald-600" : "text-gray-900"}`}>{t.type === "credit" ? "+" : "−"}€{Number(t.amount).toLocaleString()}</span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

export function BrandMessages() {
  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div>
        <h1 className="font-[family-name:var(--font-jakarta)] text-[28px] font-bold text-gray-900">Messages</h1>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-400"><svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>Search conversations</div>
        <p className="mt-6 text-[14px] leading-relaxed text-gray-400">No conversations yet. Messages with creators appear here once you invite them from the Marketplace.</p>
      </div>
      <Card className="flex flex-col items-center justify-center p-16 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/naano/app/logo.svg" alt="" className="h-10 w-10 opacity-40" />
        <p className="mt-4 font-semibold text-gray-900">No conversation selected</p>
        <p className="mt-1 text-[14px] text-gray-500">Invite a creator and your thread will open here.</p>
      </Card>
    </div>
  );
}
