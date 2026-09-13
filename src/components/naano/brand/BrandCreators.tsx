"use client";

import { useEffect, useState } from "react";
import { CreatorDetailModal, BookSelectionModal, InviteModal, AddBudgetModal, type BrandCreator } from "./BrandModals";
import { createCollaboration, listCampaigns, listCreators, getBalance, type CreatorListing, type Campaign } from "@/lib/naano/db";
import { fmt } from "@/lib/naano/creator";

interface Listing extends BrandCreator { userId: string; isSeed: boolean; bio: string }

function toListing(c: CreatorListing): Listing {
  return {
    userId: c.user_id,
    isSeed: c.is_seed,
    name: c.name ?? "Unnamed creator",
    tags: c.tags ?? "",
    bio: c.bio ?? "",
    flag: "",
    followers: c.followers != null ? fmt(c.followers) : "—",
    views: "—",
    cpm: "—",
    cost: c.rate ?? "—",
    avatar: c.avatar ?? "",
  };
}

const FILTERS = ["Industry", "Country", "Price", "Filters"];
const chev = <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} className="text-gray-400"><polyline points="6 9 12 15 18 9" /></svg>;

function Card({ c, onBook, onView }: { c: Listing; onBook: () => void; onView: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 transition-shadow hover:shadow-[0_20px_50px_-30px_rgba(15,23,42,0.4)]">
      <div className="relative h-24 bg-gradient-to-b from-[#cfe3fb] to-[#eef6ff]">
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-300 shadow-sm">☐</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0A66C2] text-xs font-bold text-white">in</span>
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-gray-400 shadow-sm">☆</span>
          <button onClick={onBook} className="rounded-lg bg-[#2563EB] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Book</button>
        </div>
        <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
          {c.avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={c.avatar} alt={c.name} onClick={onView} className="h-[72px] w-[72px] cursor-pointer rounded-full border-4 border-white object-cover shadow" />
          ) : (
            <span onClick={onView} className="flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-full border-4 border-white bg-[#5b6b66] text-lg font-semibold text-white shadow">{c.name[0]}</span>
          )}
        </div>
      </div>
      <div className="px-5 pb-5 pt-12 text-center">
        <h3 className="font-semibold text-gray-900">{c.name}</h3>
        <p className="mt-0.5 text-[13px] text-gray-500">{c.tags || "Creator"}</p>
        <p className="mx-auto mt-2 line-clamp-2 min-h-[36px] max-w-[260px] text-[13px] leading-snug text-gray-400">{c.bio}</p>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-gray-500">
          <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5a3 3 0 0 1 0 6M18 20a5 5 0 0 0-3-4.5" /></svg>
          <span className="font-semibold text-gray-900">{c.followers}</span> followers
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gray-100 py-3">
          <span className="text-lg font-bold text-gray-900">{c.cost}</span>
          <span className="text-[12px] uppercase tracking-wide text-gray-400">/ post</span>
        </div>
        <button onClick={onView} className="mt-4 flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <span className="flex items-center gap-2"><svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#2563EB" strokeWidth={1.8}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>View profile</span>
          <span className="text-gray-400">→</span>
        </button>
      </div>
    </div>
  );
}

export function BrandCreators() {
  const [tab, setTab] = useState<"ai" | "market">("market");
  const [creators, setCreators] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Listing | null>(null);
  const [bookStep, setBookStep] = useState<"selection" | "invite" | "budget" | null>(null);
  const [bookCreator, setBookCreator] = useState<Listing | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  const loadBalance = () => getBalance().then(setBalance);
  useEffect(() => {
    listCreators().then((cs) => { setCreators(cs.map(toListing)); setLoading(false); });
    listCampaigns().then((cs) => { setCampaigns(cs); setCampaignId(cs[0]?.id ?? null); });
    loadBalance();
  }, []);

  const openBooking = (c: Listing) => { setBookCreator(c); setBookStep("selection"); };
  const closeAll = () => { setDetail(null); setBookStep(null); setBookCreator(null); };
  const confirmInvite = async (c: Listing) => {
    // Enforced by the modal too, but guard here: can't book above balance.
    if (balance < Number((c.cost || "").replace(/[^0-9]/g, ""))) { setBookStep("budget"); return; }
    await createCollaboration({
      campaign_id: campaignId,
      creator_user_id: c.isSeed ? null : c.userId, // real creators are routable; seeds aren't
      creator_name: c.name, creator_avatar: c.avatar || null, creator_tags: c.tags, rate: c.cost, net: c.cost,
    });
    closeAll();
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-jakarta)] text-[36px] font-bold tracking-[-0.03em] text-gray-900">All creators</h1>
          <p className="mt-1 max-w-xl text-[15px] text-gray-500">All creators are shown from most to least relevant, using sector fit first and verified performance statistics to refine the order.</p>
        </div>
        <div className="flex rounded-2xl bg-gray-100 p-1 text-sm font-semibold">
          <button onClick={() => setTab("ai")} className={`rounded-xl px-4 py-2 ${tab === "ai" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>✦ AI Matching</button>
          <button onClick={() => setTab("market")} className={`rounded-xl px-4 py-2 ${tab === "market" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>👥 Creator Marketplace</button>
        </div>
      </div>

      {tab === "ai" ? (
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200/80 bg-cover bg-center p-10 text-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.95)), url('/naano/images/proof-cloud-atmosphere-v1.png')" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="" className="mx-auto h-10 w-10" />
          <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-2xl font-bold text-gray-900">Nao is using your campaign brief</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-gray-500">Your starter brief is attached. Tell Nao what matters most, open profiles, and save the creators you want to invite.</p>
          <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2"><input placeholder="Ask Nao a question, or find creators…" className="w-full bg-transparent py-2 text-sm outline-none" /><button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white">↑</button></div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-5 border-b border-gray-100 text-[15px]">
            <span className="flex items-center gap-2 border-b-2 border-[#2563EB] pb-3 font-semibold text-gray-900">All creators <span className="rounded-full bg-blue-50 px-1.5 text-xs text-[#2563EB]">{creators.length}</span></span>
            <span className="flex items-center gap-2 pb-3 text-gray-500">Shortlist <span className="rounded-full bg-gray-100 px-1.5 text-xs">0</span></span>
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm text-gray-400"><svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg><input placeholder="Search for a creator…" className="w-full bg-transparent py-2.5 outline-none" /></div>
            {FILTERS.map((f) => <button key={f} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700">{f} {chev}</button>)}
            <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-700"><span className="text-gray-400">Sort by</span> Best match {chev}</button>
          </div>

          <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-gray-400">Top ranked creators</p>
          {loading ? (
            <p className="py-16 text-center text-[14px] text-gray-400">Loading creators…</p>
          ) : creators.length === 0 ? (
            <p className="py-16 text-center text-[14px] text-gray-500">No creators yet. Registered creators appear here.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {creators.map((c) => (<Card key={c.userId} c={c} onBook={() => openBooking(c)} onView={() => setDetail(c)} />))}
            </div>
          )}
        </>
      )}

      {detail && <CreatorDetailModal creator={detail} onClose={closeAll} onBook={() => { setBookCreator(detail); setDetail(null); setBookStep("selection"); }} />}
      {bookStep === "selection" && bookCreator && <BookSelectionModal creator={bookCreator} onClose={closeAll} onBook={() => setBookStep("invite")} />}
      {bookStep === "invite" && bookCreator && <InviteModal creator={bookCreator} balance={balance} campaigns={campaigns} campaignId={campaignId} onCampaignChange={setCampaignId} onClose={closeAll} onSend={() => confirmInvite(bookCreator)} onAddBudget={() => setBookStep("budget")} />}
      {bookStep === "budget" && <AddBudgetModal onClose={closeAll} onAdded={loadBalance} />}
    </div>
  );
}
