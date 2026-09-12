"use client";

import { useEffect, useState } from "react";
import { DashboardShell, NAV, type TabKey } from "./DashboardShell";
import { OverviewTab } from "./OverviewTab";
import { MyCardTab } from "./MyCardTab";
import { OpportunitiesTab, CollaborationsTab, CommunityTab } from "./MiscTabs";
import { AnalyticsTab } from "./AnalyticsTab";
import { EarningsTab } from "./EarningsTab";
import { AffiliateTab } from "./AffiliateTab";
import { MessagesTab } from "./MessagesTab";

const KEYS = NAV.map((n) => n.key) as TabKey[];

function readHash(): TabKey {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace("#", "") as TabKey;
  return KEYS.includes(h) ? h : "home";
}

const TABS: Record<TabKey, React.ComponentType> = {
  home: OverviewTab,
  profile: MyCardTab,
  opportunities: OpportunitiesTab,
  collabs: CollaborationsTab,
  analytics: AnalyticsTab,
  community: CommunityTab,
  earnings: EarningsTab,
  referrals: AffiliateTab,
  messages: MessagesTab,
};

export function CreatorDashboard() {
  const [tab, setTab] = useState<TabKey>("home");

  useEffect(() => {
    setTab(readHash());
    const onHash = () => {
      setTab(readHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const Active = TABS[tab];
  return (
    <DashboardShell active={tab}>
      <Active />
    </DashboardShell>
  );
}
