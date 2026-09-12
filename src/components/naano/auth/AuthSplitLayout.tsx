import type { ReactNode } from "react";
import { GlobeIcon } from "../shared/app-icons";

interface AuthSplitLayoutProps {
  children: ReactNode;
  panelTitle: string;
  panelText: string;
}

export function AuthSplitLayout({ children, panelTitle, panelText }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white text-gray-900 font-[family-name:var(--font-inter)]">
      {/* Left: form column */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-1/2">
        <header className="flex items-center justify-between">
          <a href="/" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/naano/app/logo.svg" alt="naano" className="h-9 w-auto" />
          </a>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <GlobeIcon />
            EN
          </button>
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[448px]">{children}</div>
        </div>
      </div>

      {/* Right: blue brand panel */}
      <div className="hidden items-center justify-center bg-[#2563EB] p-12 text-white lg:flex lg:w-1/2">
        <div className="max-w-md">
          <h2 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold leading-[1.1] tracking-[-0.02em]">
            {panelTitle}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-blue-100">{panelText}</p>
        </div>
      </div>
    </div>
  );
}
