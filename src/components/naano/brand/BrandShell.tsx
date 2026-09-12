import type { ReactNode } from "react";
import {
  GridIcon, StorefrontIcon, LayersIcon, UsersIcon, ChartLineIcon,
  ChatIcon, CreditCardIcon, BellIcon,
} from "../dashboard/dashboard-icons";
import { UserMenu } from "../shared/UserMenu";

export const BRAND_NAV = [
  { key: "overview", label: "Overview", Icon: GridIcon },
  { key: "marketplace", label: "Creators", Icon: StorefrontIcon },
  { key: "campaigns", label: "Campaigns", Icon: LayersIcon },
  { key: "collaborations", label: "Collaborations", Icon: UsersIcon },
  { key: "results", label: "Results", Icon: ChartLineIcon },
  { key: "messages", label: "Messages", Icon: ChatIcon },
  { key: "billing", label: "Billing", Icon: CreditCardIcon },
] as const;

export type BrandTabKey = (typeof BRAND_NAV)[number]["key"];

export function BrandShell({ active, children }: { active: BrandTabKey; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white font-[family-name:var(--font-inter)] text-gray-900">
      {/* Collapsible icon rail */}
      <aside className="group fixed inset-y-0 left-0 z-30 hidden w-[76px] flex-col overflow-hidden border-r border-gray-100 bg-white px-3 py-6 transition-[width,box-shadow] duration-200 ease-out hover:w-[264px] hover:px-5 hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] lg:flex">
        <a href="#overview" className="mb-6 flex h-8 items-center gap-2 px-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="naano" className="h-7 w-7 shrink-0" />
          <span className="whitespace-nowrap font-[family-name:var(--font-jakarta)] text-xl font-bold opacity-0 transition-opacity duration-150 group-hover:opacity-100">naano</span>
        </a>
        <div className="mb-6 hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 group-hover:flex">
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /></svg>
          <span className="flex-1 truncate">naanooo</span>
          <span className="text-gray-400">▾</span>
        </div>
        <nav className="flex flex-col gap-1">
          {BRAND_NAV.map(({ key, label, Icon }) => {
            const on = key === active;
            return (
              <a key={key} href={`#${key}`} aria-current={on ? "page" : undefined} title={label}
                className={`flex items-center gap-3 rounded-xl px-[13px] py-2.5 text-[15px] font-medium transition-colors ${on ? "bg-blue-50 text-[#2563EB] ring-1 ring-blue-100" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <Icon className={`shrink-0 ${on ? "text-[#2563EB]" : "text-gray-400"}`} />
                <span className="whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100">{label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen w-full flex-col lg:pl-[76px]">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-gray-100 bg-white/80 px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-gray-600">
            <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
            <span className="font-mono">NAANO MCP</span>
            <span className="text-gray-300">/</span>
            <span className="flex items-center gap-1 font-mono text-gray-500">Connect <span aria-hidden>→</span></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-semibold">💳 €0.00</span>
            <div className="flex items-center rounded-xl border border-gray-200 p-0.5 text-sm font-medium">
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-900">EN</span>
              <span className="px-2.5 py-1 text-gray-400">FR</span>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 sm:flex">
              <span className="text-[#2563EB]">✦</span>
              <div className="leading-tight"><p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Get started</p><p className="text-[13px] font-semibold text-gray-800">Discover the Marke…</p></div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-100 text-[10px] font-semibold text-[#2563EB]">1/3</span>
            </div>
            <button className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50" aria-label="Notifications"><BellIcon width={18} height={18} /></button>
            <UserMenu variant="brand" initial="M" bg="#111827" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] flex-1 px-6 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
