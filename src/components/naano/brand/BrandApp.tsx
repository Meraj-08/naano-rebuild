"use client";

import { useEffect, useState } from "react";
import { BrandShell, BRAND_NAV, type BrandTabKey } from "./BrandShell";
import { BrandOverview } from "./BrandOverview";
import { BrandCreators } from "./BrandCreators";
import { BrandCampaigns } from "./BrandCampaigns";
import { BrandCampaignNew } from "./BrandCampaignNew";
import { BrandCollaborations, BrandResults, BrandBilling, BrandMessages } from "./BrandMiscTabs";

const KEYS = BRAND_NAV.map((n) => n.key) as string[];

type Route = BrandTabKey | "campaign-new";

function readHash(): Route {
  if (typeof window === "undefined") return "overview";
  const h = window.location.hash.replace("#", "");
  if (h === "campaign-new") return "campaign-new";
  return (KEYS.includes(h) ? h : "overview") as Route;
}

const TABS: Record<BrandTabKey, React.ComponentType> = {
  overview: BrandOverview,
  marketplace: BrandCreators,
  campaigns: BrandCampaigns,
  collaborations: BrandCollaborations,
  results: BrandResults,
  messages: BrandMessages,
  billing: BrandBilling,
};

export function BrandApp() {
  const [route, setRoute] = useState<Route>("overview");

  useEffect(() => {
    setRoute(readHash());
    const onHash = () => { setRoute(readHash()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // campaign-new highlights the Campaigns nav item
  const active: BrandTabKey = route === "campaign-new" ? "campaigns" : route;
  const Body = route === "campaign-new" ? BrandCampaignNew : TABS[route];

  return (
    <BrandShell active={active}>
      <Body />
    </BrandShell>
  );
}
