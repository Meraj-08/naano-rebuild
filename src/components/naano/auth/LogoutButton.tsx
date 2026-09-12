"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function LogoutButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();
  const handle = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };
  return (
    <button type="button" onClick={handle} className={className}>
      {children}
    </button>
  );
}
