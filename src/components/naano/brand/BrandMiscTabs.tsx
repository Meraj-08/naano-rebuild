import { Card, PageHead } from "../dashboard/dash-ui";

const dropdown = "flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700";
const chevron = <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>;

export function BrandCollaborations() {
  const filters = ["All", "Active", "Invitations received", "Invitations sent", "To do", "Completed"];
  return (
    <div>
      <PageHead title="Collaborations" right={<div className="flex gap-6 text-sm"><span><b className="text-gray-900">0</b> <span className="text-gray-400">collaborations</span></span><span><b className="text-gray-900">€0</b> <span className="text-gray-400">committed</span></span><span><b className="text-gray-900">0</b> <span className="text-gray-400">to do</span></span></div>} />
      <div className="mb-4 flex flex-wrap gap-3">
        <button className={`${dropdown} min-w-[220px] justify-between`}>All campaigns {chevron}</button>
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm text-gray-400"><svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>Search creators, campaigns…</div>
      </div>
      <div className="mb-4 flex flex-wrap gap-6 border-b border-gray-100 text-[15px]">
        {filters.map((f, i) => (<span key={f} className={`flex items-center gap-2 pb-3 ${i === 0 ? "border-b-2 border-[#2563EB] font-semibold text-gray-900" : "text-gray-500"}`}>{f}<span className="rounded-full bg-gray-100 px-1.5 text-xs">0</span></span>))}
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 gap-2 border-b border-gray-100 px-6 py-4 text-[13px] font-medium text-gray-400"><span>Creator</span><span>Campaign</span><span>Status</span><span>Next action</span><span>Due date</span><span>Amount</span><span>Updated</span></div>
        <p className="py-16 text-center text-[14px] text-gray-500">No collaborations yet, invite a creator from the Marketplace.</p>
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 text-[13px] text-gray-500"><span>0 collaborations</span><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">1</span><span>Rows per page: 10</span></div>
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
  return (
    <div>
      <PageHead title="Billing" subtitle="Manage your budget, plan and invoices." right={<button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800">? Need help?</button>} />
      <Card className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Available balance</p>
            <p className="mt-2 text-[56px] font-bold leading-none text-gray-900">€0.00</p>
            <p className="mt-2 text-[14px] text-gray-500">Ready to spend across your campaigns.</p>
            <div className="mt-5 flex gap-3">
              <button className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Add budget</button>
              <button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700">+ €2,500</button>
              <button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700">+ €10,000</button>
            </div>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-[#2563EB]">€</span>
        </div>
      </Card>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-bold text-gray-900">Invoices</h2>
        <div className="mt-4 flex gap-6 border-b border-gray-100 text-[15px]"><span className="border-b-2 border-[#2563EB] pb-3 font-semibold text-gray-900">All</span><span className="pb-3 text-gray-500">Top-ups</span><span className="pb-3 text-gray-500">Bookings</span></div>
        <div className="mt-4 grid grid-cols-6 gap-2 border-b border-gray-100 pb-3 text-[13px] font-medium text-gray-400"><span>Reference</span><span>Date</span><span>Type</span><span>Amount</span><span>Status</span><span>Actions</span></div>
        <p className="py-12 text-center text-[14px] text-gray-500">No invoices or entries yet.</p>
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
