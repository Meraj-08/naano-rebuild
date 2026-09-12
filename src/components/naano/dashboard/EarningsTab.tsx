import { Card, PageHead } from "./dash-ui";

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sept"];

function BalanceCard({ icon, value, title, sub }: { icon: React.ReactNode; value: string; title?: string; sub: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 text-gray-400">{icon}{title && <span className="text-[13px] font-medium">{title}</span>}</div>
      <div className="mt-3 text-[30px] font-bold leading-none text-gray-900">{value}</div>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-400">{sub}</p>
    </Card>
  );
}

export function EarningsTab() {
  return (
    <div>
      <PageHead
        title="Earnings"
        subtitle="Track revenue from your paid collaborations and withdraw available funds."
        right={<span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-medium text-[#2563EB]"><span className="h-2 w-2 rounded-full bg-[#2563EB]" />Paid collaborations</span>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <BalanceCard icon={<span className="text-[13px] font-medium">↗ Total earned</span>} value="€0" sub="0 paid collaborations · €0 average" />
        <BalanceCard icon={<span className="text-[13px] font-medium">In transit</span>} value="€0" sub="International transfers usually arrive within 1–7 days, depending on the destination and banking network." />
        <BalanceCard icon={<span className="text-[13px] font-medium">Available now</span>} value="€0" sub="Ready to withdraw to your selected payout method." />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Earnings over time</h2>
              <p className="mt-1 text-[14px] text-gray-500">Net collaboration earnings from the last six months.</p>
            </div>
            <span className="text-[13px] text-gray-400">€0 over 6 months</span>
          </div>
          <div className="mt-8 flex items-end gap-4">
            {MONTHS.map((m, i) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[12px] text-gray-400">€0</span>
                <div className="w-full rounded-lg rounded-b-none border-b-2 border-[#2563EB] bg-gray-100" style={{ height: 150 }} />
                <span className={`text-[13px] ${i === MONTHS.length - 1 ? "font-semibold text-[#2563EB]" : "text-gray-400"}`}>{m}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Withdraw earnings</h2>
          <p className="mt-1 text-[14px] text-gray-500">Choose where your available balance should be sent.</p>
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-wide text-gray-400">Payout method</p>

          <div className="mt-2 rounded-2xl border-2 border-[#2563EB] bg-blue-50/40 p-4">
            <div className="flex items-center gap-2 font-semibold text-gray-900"><span className="h-4 w-4 rounded-full border-[5px] border-[#2563EB]" />🏦 Bank transfer</div>
            <p className="mt-2 text-[13px] text-gray-500">No account holder on file<br />No bank details on file</p>
            <button className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800">Edit</button>
          </div>

          <div className="mt-3 rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 font-semibold text-gray-900"><span className="h-4 w-4 rounded-full border-2 border-gray-300" />💳 Stripe</div>
            <p className="mt-2 text-[13px] text-gray-500"><span className="font-semibold text-gray-700">Status:</span> Not connected<br />Instant transfer to your connected Stripe account.</p>
            <button className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800">Connect Stripe</button>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="flex flex-1 items-center rounded-xl border-2 border-gray-300 px-3">
              <span className="text-gray-400">€</span>
              <input placeholder="Amount" className="w-full bg-transparent px-2 py-3 text-sm outline-none" />
            </div>
            <button className="rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-800">Withdraw all</button>
          </div>
          <button className="mt-3 w-full rounded-xl bg-[#93a4f4] py-3 text-sm font-semibold text-white">Confirm withdrawal</button>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-[13px] text-gray-500">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            No earnings are currently waiting for release.
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-bold text-gray-900">Recent activity</h2>
        <p className="mt-1 text-[14px] text-gray-500">Collaboration earnings, withdrawals and invoices in one place.</p>
        <div className="mt-4 flex gap-6 border-b border-gray-100 text-[15px]">
          <span className="border-b-2 border-[#2563EB] pb-3 font-semibold text-gray-900">Earnings and withdrawals</span>
          <span className="flex items-center gap-2 pb-3 text-gray-500">Awaiting release <span className="rounded-full bg-gray-100 px-1.5 text-xs">0</span></span>
          <span className="flex items-center gap-2 pb-3 text-gray-500">Invoices <span className="rounded-full bg-gray-100 px-1.5 text-xs">0</span></span>
        </div>
        <div className="mt-4 grid grid-cols-6 gap-2 border-b border-gray-100 pb-3 text-[13px] font-medium text-gray-400">
          <span>Date</span><span>Type</span><span>Detail</span><span>Amount</span><span>Status</span><span>Invoice</span>
        </div>
        <p className="py-12 text-center text-[14px] text-gray-500">No movements yet. Your first payment will appear here.</p>
      </Card>
    </div>
  );
}
