import { Card, PageHead } from "./dash-ui";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width={40} height={40} fill="none" stroke="#111827" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function OpportunitiesTab() {
  return (
    <div>
      <PageHead title="Opportunities" subtitle="Open brand campaigns - apply, the brand accepts, and the booking is created on your terms." />
      <Card className="mx-auto max-w-xl p-12 text-center shadow-[0_28px_80px_-60px_rgba(56,96,128,0.5)]">
        <LockIcon />
        <h2 className="mt-5 text-xl font-bold text-gray-900">Paid campaigns open at 1,000 followers</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-gray-500">
          You have 0 followers. Keep posting and come back - re-check your count once a week from Settings.
        </p>
      </Card>
    </div>
  );
}

const FILTERS = ["All", "Active", "Needs action", "Applications sent", "Declined", "Completed"];

export function CollaborationsTab() {
  return (
    <div>
      <PageHead title="Collaborations" subtitle="Every step tells you where you stand, what to do, and what happens if you do nothing." />
      <div className="mb-4 flex flex-wrap gap-6 border-b border-gray-100 text-[15px]">
        {FILTERS.map((f, i) => (
          <span key={f} className={`flex items-center gap-2 pb-3 ${i === 0 ? "border-b-2 border-[#2563EB] font-semibold text-gray-900" : "text-gray-500"}`}>
            {f}
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">0</span>
          </span>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 gap-2 border-b border-gray-100 px-6 py-4 text-[13px] font-medium text-gray-400">
          <span>Brand</span><span>Campaign</span><span>Status</span><span>Performance</span><span>Next action</span><span>Due date</span><span>Your net</span>
        </div>
        <p className="py-16 text-center text-[14px] text-gray-500">No collaborations yet. Brand invitations and your accepted applications land here.</p>
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 text-[13px] text-gray-500">
          <span>0 collaborations</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">1</span>
        </div>
      </Card>
    </div>
  );
}

export function CommunityTab() {
  return (
    <div>
      <PageHead title="Community" subtitle="Connect with other B2B creators, share playbooks and grow together." />
      <Card className="mx-auto max-w-xl p-12 text-center shadow-[0_28px_80px_-60px_rgba(56,96,128,0.5)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
          <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900">The creator community is coming soon</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-gray-500">
          Once your profile is live, you&apos;ll be able to join creator spaces, compare notes and unlock community perks.
        </p>
      </Card>
    </div>
  );
}
