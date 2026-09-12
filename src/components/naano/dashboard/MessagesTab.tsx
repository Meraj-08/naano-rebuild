import { Card } from "./dash-ui";

const ACTIONS = [
  ["📊", "Understand my performance", "Review your analytics"],
  ["🛟", "Get product help", "Get an instant answer"],
  ["🐛", "Report a bug", "Escalated when needed"],
  ["💡", "Suggest an idea", "Share product feedback"],
];

export function MessagesTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px]">
      {/* Conversation list */}
      <div>
        <h1 className="font-[family-name:var(--font-jakarta)] text-[28px] font-bold text-gray-900">Messages</h1>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-400">
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          Search conversations
        </div>
        <div className="mt-4 rounded-xl bg-blue-50/60 p-3 ring-1 ring-blue-100">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/naano/app/logo.svg" alt="" className="h-5 w-5" />NaanoBot
            </span>
            <span className="text-[12px] text-gray-400">Now</span>
          </div>
          <p className="mt-1 text-[13px] text-gray-500">A question or need help? Start here.</p>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-gray-400">No conversations yet - the thread opens with your first Booking.</p>
      </div>

      {/* Chat */}
      <div>
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="" className="h-9 w-9 rounded-lg bg-gray-100 p-1.5" />
          <div>
            <p className="font-semibold text-gray-900">Naano help center</p>
            <p className="text-[13px] text-gray-400">Instant assistant · team when needed</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-[#eef4ff] to-white p-6">
          <div className="flex items-start justify-between">
            <div className="max-w-md">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">✦ Your Naano space</p>
              <h2 className="mt-2 font-[family-name:var(--font-jakarta)] text-[26px] font-bold text-gray-900">How can we help?</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-500">Product question, bug or performance concern: everything stays here and the team steps in when needed.</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-gray-600 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-500" />Available now</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ACTIONS.map(([emoji, title, sub]) => (
            <Card key={title} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">{emoji}</span>
                <div><p className="font-semibold text-gray-900">{title}</p><p className="text-[13px] text-gray-500">{sub}</p></div>
              </div>
              <span className="text-gray-300">↗</span>
            </Card>
          ))}
        </div>

        <Card className="mt-4 p-5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">📈 Performance snapshot</p>
            <span className="text-[12px] text-gray-400">Estimate</span>
          </div>
          <p className="mt-2 font-semibold text-gray-900">Your profile is ready; views are still missing</p>
          <p className="mt-1 text-[14px] text-gray-500">Naano can already help with your profile, but needs more post analytics for performance comparisons.</p>
          <span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-[12px] text-gray-500">Median · 0</span>
        </Card>

        <div className="mt-6 flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="" className="mt-1 h-8 w-8 rounded-lg bg-gray-100 p-1.5" />
          <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-[15px] text-gray-800">
            Hi, I&apos;m the Naano assistant. Ask me a question or choose an option above — the team can step in if needed.
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2">
          <input placeholder="Ask Naano a question…" className="w-full bg-transparent py-2 text-sm outline-none" />
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </div>
      </div>

      {/* Request status */}
      <div className="space-y-6 text-[14px]">
        <div>
          <p className="font-semibold text-gray-900">Request status</p>
          <div className="mt-3 flex items-start gap-2">
            <span className="mt-0.5 text-emerald-500">✓</span>
            <div><p className="font-medium text-gray-800">Assistant available</p><p className="text-gray-500">A human takes over for sensitive requests.</p></div>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Shared context</p>
          <p className="mt-2 leading-relaxed text-gray-500">Naano uses the active page and your account data — campaigns, bookings and analytics — without accessing other accounts.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Important limitation</p>
          <p className="mt-2 leading-relaxed text-gray-500">A drop in views can have many causes. Recommendations are hypotheses to test, never a certain diagnosis.</p>
        </div>
      </div>
    </div>
  );
}
