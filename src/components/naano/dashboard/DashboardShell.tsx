import type { ReactNode } from "react";
import {
  GridIcon, IdCardIcon, StorefrontIcon, LayersIcon, ChartLineIcon,
  UsersIcon, WalletIcon, PercentIcon, ChatIcon, BellIcon, CreditCardIcon,
} from "./dashboard-icons";
import { UserMenu } from "../shared/UserMenu";

export const NAV = [
  { key: "home", label: "Overview", Icon: GridIcon },
  { key: "profile", label: "My card", Icon: IdCardIcon },
  { key: "opportunities", label: "Opportunities", Icon: StorefrontIcon },
  { key: "collabs", label: "Collaborations", Icon: LayersIcon },
  { key: "analytics", label: "Analytics", Icon: ChartLineIcon },
  { key: "community", label: "Community", Icon: UsersIcon },
  { key: "earnings", label: "Earnings", Icon: WalletIcon },
  { key: "referrals", label: "Affiliate program", Icon: PercentIcon },
  { key: "messages", label: "Messages", Icon: ChatIcon },
] as const;

export type TabKey = (typeof NAV)[number]["key"];

export function DashboardShell({ active, children }: { active: TabKey; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white font-[family-name:var(--font-inter)] text-gray-900">
      {/* Sidebar — collapsed icon rail that expands on hover */}
      <aside className="group fixed inset-y-0 left-0 z-30 hidden w-[76px] flex-col overflow-hidden border-r border-gray-100 bg-white px-3 py-6 transition-[width,box-shadow] duration-200 ease-out hover:w-[264px] hover:px-5 hover:shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] lg:flex">
        <a href="#home" className="mb-8 flex h-8 items-center gap-2 px-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="naano" className="h-7 w-7 shrink-0" />
          <span className="whitespace-nowrap font-[family-name:var(--font-jakarta)] text-xl font-bold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            naano
          </span>
        </a>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ key, label, Icon }) => {
            const on = key === active;
            return (
              <a
                key={key}
                href={`#${key}`}
                aria-current={on ? "page" : undefined}
                title={label}
                className={`flex items-center gap-3 rounded-xl px-[13px] py-2.5 text-[15px] font-medium transition-colors ${
                  on
                    ? "bg-blue-50 text-[#2563EB] ring-1 ring-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`shrink-0 ${on ? "text-[#2563EB]" : "text-gray-400"}`} />
                <span className="whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {label}
                </span>
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main — padding matches the collapsed rail so content never shifts on hover */}
      <div className="flex min-h-screen w-full flex-col lg:pl-[76px]">
        <header className="sticky top-0 z-20 flex items-center justify-end gap-3 border-b border-gray-100 bg-white/80 px-6 py-3.5 backdrop-blur">
          <span className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-900">
            <CreditCardIcon width={16} height={16} className="text-gray-400" />
            €0
          </span>
          <div className="flex items-center rounded-xl border border-gray-200 p-0.5 text-sm font-medium">
            <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-900">EN</span>
            <span className="px-2.5 py-1 text-gray-400">FR</span>
          </div>
          <button className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50" aria-label="Notifications">
            <BellIcon width={18} height={18} />
          </button>
          <UserMenu variant="creator" initial="V" bg="#3f7f6e" />
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-10 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
