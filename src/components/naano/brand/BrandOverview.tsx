import { Card } from "../dashboard/dash-ui";

const NEW_CREATORS = [
  { name: "Sandhya Mishra", tags: "AI · Marketing · SaaS", price: 625, initial: "S", bg: "#c9885b" },
  { name: "Marcel Velica", tags: "AI · SaaS · Cybersecurity", price: 2019, initial: "M", bg: "#b5643a" },
  { name: "Amney Mounir", tags: "AI · SaaS · EdTech", price: 1150, initial: "A", bg: "#1f5c46" },
  { name: "Amber Cheema", tags: "AI · Marketing · SaaS", price: 188, initial: "A", bg: "#7ba05b" },
  { name: "Sunny Grewal", tags: "AI · SEO · SaaS", price: 1249, initial: "S", bg: "#2f6b8f" },
];

function Stat({ icon, label }: { icon: string; label: string }) {
  return (
    <Card className="p-5">
      <p className="flex items-center gap-2 text-[13px] text-gray-500"><span>{icon}</span>{label}</p>
      <p className="mt-3 text-[32px] font-bold text-gray-900">0</p>
    </Card>
  );
}

function TodoRow({ label, badge, tone }: { label: string; badge: string; tone: "blocked" | "suggested" }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="h-5 w-5 rounded-full border-2 border-gray-200" />
      <span className="flex-1 font-semibold text-gray-900">{label}</span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone === "blocked" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"}`}>{badge}</span>
      <button className="rounded-lg border border-gray-200 p-1 text-gray-400"><svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg></button>
    </div>
  );
}

export function BrandOverview() {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-gray-400">Hello Md 👋</p>
          <h1 className="mt-1 max-w-4xl font-[family-name:var(--font-jakarta)] text-[38px] font-bold leading-[1.1] tracking-[-0.03em] text-gray-900">
            Here is what is happening for https://www.linkedin.com/company/naanooo/ on Naano.
          </h1>
        </div>
        <a href="#campaign-new" className="shrink-0 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">+ New campaign</a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon="👥" label="Creators activated" />
        <Stat icon="📄" label="Posts published" />
        <Stat icon="💬" label="Profiles engaged" />
        <Stat icon="👁" label="Impressions" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-gray-900">To do</h2><p className="text-[14px] text-gray-500">Priority actions</p></div><a href="#" className="text-sm font-semibold text-[#2563EB]">See all</a></div>
          <div className="mt-3 divide-y divide-gray-100">
            <TodoRow label="Top up your wallet" badge="Blocked" tone="blocked" />
            <TodoRow label="Book a call for your next campaign" badge="Suggested" tone="suggested" />
            <TodoRow label="Find new creators for your next campaign" badge="Suggested" tone="suggested" />
          </div>
        </Card>
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-b from-[#eef4ff] to-white p-6">
          <div className="flex items-start justify-between"><div><p className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">Recently engaged companies</p><h2 className="mt-1 text-lg font-bold text-gray-900">ICP accounts in your target</h2></div><a href="#" className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#2563EB] shadow-sm">See all</a></div>
          <p className="py-16 text-center text-[14px] text-gray-400">No company has engaged yet.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="p-6"><h2 className="text-lg font-bold text-gray-900">Messages</h2><p className="text-[14px] text-gray-500">Waiting on your reply</p><p className="py-10 text-[14px] text-gray-400">No conversation yet.</p></Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><h2 className="text-lg font-bold text-gray-900">New creators</h2><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#2563EB]">8</span></div>
            <a href="#marketplace" className="text-sm font-semibold text-[#2563EB]">Explore</a>
          </div>
          <p className="text-[14px] text-gray-500">Profiles that fit your buyers</p>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {NEW_CREATORS.map((c) => (
              <div key={c.name} className="w-[190px] shrink-0 overflow-hidden rounded-2xl border border-gray-200/80">
                <div className="h-14 bg-gradient-to-b from-[#eaf0fb] to-white" />
                <div className="-mt-7 flex flex-col items-center px-4 pb-4 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-lg font-semibold text-white" style={{ background: c.bg }}>{c.initial}</span>
                  <p className="mt-2 font-semibold text-gray-900">{c.name}</p>
                  <p className="text-[12px] text-gray-500">{c.tags}</p>
                  <span className="mt-2 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">90% ICP</span>
                  <p className="mt-2 text-[12px] text-gray-400">from</p>
                  <p className="text-lg font-bold text-gray-900">{c.price}€ <span className="text-[12px] font-normal text-gray-400">/post</span></p>
                  <button className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-sm font-semibold text-[#2563EB] hover:bg-gray-50">Add</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
