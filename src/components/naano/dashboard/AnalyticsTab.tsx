import { Card, PageHead, StatCard } from "./dash-ui";

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-gray-600 shadow-sm ring-1 ring-gray-100"><span className="h-2 w-2 rounded-full bg-emerald-500" />{children}</span>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3.5 last:border-0">
      <span className="text-[15px] text-gray-500">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}

export function AnalyticsTab() {
  return (
    <div>
      <PageHead
        title="Analytics"
        subtitle="Public LinkedIn performance imported for this profile."
        right={
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700">
            All time
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-r from-[#eef4ff] to-[#dbeafe] p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <Chip>Public LinkedIn snapshot</Chip>
            <h2 className="mt-4 font-[family-name:var(--font-jakarta)] text-[34px] font-bold tracking-[-0.02em] text-gray-900">Public LinkedIn posts are being imported</h2>
            <p className="mt-2 text-[16px] text-gray-600">The profile is ready. Post history and reach will appear after the public-data job completes.</p>
          </div>
          <div className="shrink-0 lg:border-l lg:border-white/60 lg:pl-8">
            <div className="text-[44px] font-bold leading-none text-gray-900">0%</div>
            <p className="mt-1 text-[14px] text-gray-600">of imported posts include reach data</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[13px] font-medium text-gray-600"><span className="h-2 w-2 rounded-full bg-emerald-500" />No public post found yet</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Public posts" value="0" sub="Original LinkedIn posts found" />
        <StatCard label="Public post reach" value="Pending" sub="Waiting for public post data" />
        <StatCard label="Public engagements" value="0" sub="Reactions, comments and reposts" />
        <StatCard label="LinkedIn followers" value="Pending" sub="Imported from the public profile" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Recent LinkedIn posts</h2>
          <p className="mt-1 text-[14px] text-gray-500">Open the original post on LinkedIn.</p>
          <div className="py-16 text-center">
            <p className="font-semibold text-gray-700">Public post import in progress</p>
            <p className="mt-1 text-[14px] text-gray-500">The first public LinkedIn posts will appear here automatically.</p>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900">Public profile summary</h2>
          <p className="mt-1 text-[14px] text-gray-500">Automatically collected from public LinkedIn data.</p>
          <div className="mt-4">
            <SummaryRow label="LinkedIn followers" value="0" />
            <SummaryRow label="Public posts" value="0" />
            <SummaryRow label="Posts with reach data" value="0" />
            <SummaryRow label="Public engagements" value="0" />
          </div>
        </Card>
      </div>

      <Card className="mt-6 flex items-start gap-3 p-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
        </span>
        <div>
          <p className="font-semibold text-gray-900">Public LinkedIn data is being prepared</p>
          <p className="text-[14px] text-gray-500">Naano is collecting the creator&apos;s recent public posts. No personal LinkedIn connection is required.</p>
        </div>
      </Card>
    </div>
  );
}
