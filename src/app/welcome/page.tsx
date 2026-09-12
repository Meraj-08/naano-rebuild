import type { Metadata } from "next";
import { RoleCard } from "@/components/naano/auth/RoleCard";
import { LogoutButton } from "@/components/naano/auth/LogoutButton";
import { UserIcon, BuildingIcon } from "@/components/naano/shared/app-icons";

export const metadata: Metadata = {
  title: "Welcome · Naano",
  description: "How will you use Naano?",
};

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#fcfcfb] px-6 py-12 font-[family-name:var(--font-inter)] text-gray-900">
      <div className="w-full max-w-3xl rounded-[28px] border border-gray-200/80 bg-white p-10 shadow-[0_28px_80px_-56px_rgba(56,96,128,0.4)] sm:p-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/naano/app/logo.svg" alt="naano" className="mx-auto h-9 w-auto" />
        <h1 className="mt-8 text-center font-[family-name:var(--font-jakarta)] text-[32px] font-bold tracking-[-0.02em] text-gray-900">
          One quick question
        </h1>
        <p className="mt-2 text-center text-[17px] text-gray-500">How will you use Naano?</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <RoleCard
            href="/onboarding"
            title="Creator"
            description="For B2B creators who want to collaborate with companies."
            footerIcon={<UserIcon />}
            footerLabel="Creator"
          />
          <RoleCard
            href="/onboarding-brand"
            title="Company"
            description="For SaaS / B2B companies that want to launch or scale a creator program."
            footerIcon={<BuildingIcon />}
            footerLabel="Company"
          />
        </div>
      </div>

      <LogoutButton className="mt-8 flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:underline">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Not your account? Log out
      </LogoutButton>
    </div>
  );
}
