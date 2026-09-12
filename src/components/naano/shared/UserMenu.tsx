"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface Item {
  label: string;
  icon: string;
  href?: string;
}

const MENUS: Record<"brand" | "creator", Item[]> = {
  brand: [
    { label: "Invite Creators", icon: "👥", href: "#marketplace" },
    { label: "Book a call", icon: "📅" },
    { label: "Integrations", icon: "🔗" },
    { label: "Settings", icon: "⚙️" },
  ],
  creator: [
    { label: "My card", icon: "🪪", href: "#profile" },
    { label: "Earnings", icon: "💶", href: "#earnings" },
    { label: "Settings", icon: "⚙️" },
  ],
};

export function UserMenu({ variant, initial, bg }: { variant: "brand" | "creator"; initial: string; bg: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ background: bg }}
      >
        {initial}
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]">
            {MENUS[variant].map((it) => (
              <a
                key={it.label}
                href={it.href ?? "#"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="w-5 text-center text-gray-400">{it.icon}</span>
                {it.label}
              </a>
            ))}
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-[15px] font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="w-5 text-center text-gray-400">↦</span>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
