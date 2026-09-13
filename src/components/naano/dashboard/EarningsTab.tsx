"use client";

import { useEffect, useState } from "react";
import { Card, PageHead } from "./dash-ui";
import { listTransactions, type WalletTx } from "@/lib/naano/db";

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sept"];

function BalanceCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <Card className="p-6">
      <div className="text-[13px] font-medium text-gray-400">{title}</div>
      <div className="mt-3 text-[30px] font-bold leading-none text-gray-900">{value}</div>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-400">{sub}</p>
    </Card>
  );
}

export function EarningsTab() {
  const [txs, setTxs] = useState<WalletTx[]>([]);
  useEffect(() => { listTransactions().then(setTxs); }, []);

  const credits = txs.filter((t) => t.type === "credit");
  const debits = txs.filter((t) => t.type === "debit");
  const totalEarned = credits.reduce((s, t) => s + Number(t.amount), 0);
  const available = totalEarned - debits.reduce((s, t) => s + Number(t.amount), 0);
  const count = credits.length;
  const avg = count ? Math.round(totalEarned / count) : 0;

  return (
    <div>
      <PageHead
        title="Earnings"
        subtitle="Track revenue from your paid collaborations."
        right={<span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-medium text-[#2563EB]"><span className="h-2 w-2 rounded-full bg-[#2563EB]" />Paid collaborations</span>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <BalanceCard title="↗ Total earned" value={`€${totalEarned.toLocaleString()}`} sub={`${count} paid collaboration${count === 1 ? "" : "s"} · €${avg.toLocaleString()} average`} />
        <BalanceCard title="In transit" value="€0" sub="International transfers usually arrive within 1–7 days, depending on the destination and banking network." />
        <BalanceCard title="Available now" value={`€${available.toLocaleString()}`} sub="Ready to withdraw to your selected payout method." />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-bold text-gray-900">Earnings over time</h2><p className="mt-1 text-[14px] text-gray-500">Net collaboration earnings from the last six months.</p></div>
            <span className="text-[13px] text-gray-400">€{totalEarned.toLocaleString()} over 6 months</span>
          </div>
          <div className="mt-8 flex items-end gap-4">
            {MONTHS.map((m, i) => {
              const last = i === MONTHS.length - 1;
              const h = last && totalEarned > 0 ? 150 : 150;
              return (
                <div key={m} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[12px] text-gray-400">€{last ? totalEarned.toLocaleString() : 0}</span>
                  <div className="w-full rounded-lg rounded-b-none border-b-2 border-[#2563EB]" style={{ height: h, background: last && totalEarned > 0 ? "#2563EB22" : "#f3f4f6" }} />
                  <span className={`text-[13px] ${last ? "font-semibold text-[#2563EB]" : "text-gray-400"}`}>{m}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Withdraw earnings</h2>
          <p className="mt-1 text-[14px] text-gray-500">Choose where your available balance should be sent.</p>
          <div className="mt-4 rounded-2xl border-2 border-[#2563EB] bg-blue-50/40 p-4"><div className="flex items-center gap-2 font-semibold text-gray-900"><span className="h-4 w-4 rounded-full border-[5px] border-[#2563EB]" />🏦 Bank transfer</div><p className="mt-2 text-[13px] text-gray-500">Add your bank details to withdraw.</p></div>
          <button className="mt-4 w-full rounded-xl bg-[#93a4f4] py-3 text-sm font-semibold text-white">Withdraw €{available.toLocaleString()}</button>
          <p className="mt-3 text-center text-[12px] text-gray-400">Payouts are bookkeeping-only in this build.</p>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-bold text-gray-900">Recent activity</h2>
        <p className="mt-1 text-[14px] text-gray-500">Earnings from completed collaborations.</p>
        <div className="mt-4 grid grid-cols-4 gap-2 border-b border-gray-100 pb-3 text-[13px] font-medium text-gray-400"><span className="col-span-2">Detail</span><span>Type</span><span className="text-right">Amount</span></div>
        {txs.length === 0 ? (
          <p className="py-12 text-center text-[14px] text-gray-500">No movements yet. Your first payment appears here when a brand marks a collaboration complete.</p>
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
