import type { ReactNode } from "react";
import { GlobeIcon } from "../shared/app-icons";

interface OnboardingLayoutProps {
  children: ReactNode;
  card: ReactNode;
}

export function OnboardingLayout({ children, card }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white font-[family-name:var(--font-inter)] text-gray-900">
      {/* Left: form column */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-1/2">
        <header className="flex items-center justify-between">
          <a href="/" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/naano/app/logo.svg" alt="naano" className="h-8 w-auto" />
          </a>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <GlobeIcon />
            EN
          </button>
        </header>
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[520px] py-10">{children}</div>
        </div>
      </div>

      {/* Right: live marketplace-card panel */}
      <div className="hidden flex-col items-center justify-center bg-gradient-to-b from-white to-[#eaf0fb] px-10 py-16 lg:flex lg:w-1/2">
        <p className="text-center text-[13px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">
          Your marketplace card
        </p>
        <h2 className="mt-3 text-center font-[family-name:var(--font-jakarta)] text-[34px] font-bold tracking-[-0.02em] text-gray-900">
          Build a card brands can trust.
        </h2>
        <p className="mt-2 max-w-md text-center text-[16px] text-gray-500">
          It updates live with your profile, analytics, positioning and price.
        </p>
        <div className="mt-10 flex w-full justify-center">{card}</div>
      </div>
    </div>
  );
}
