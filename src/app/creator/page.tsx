import type { Metadata } from "next";
import { CreatorDashboard } from "@/components/naano/dashboard/CreatorDashboard";

export const metadata: Metadata = {
  title: "Naano - Creator",
  description: "Your creator workspace.",
};

export default function CreatorPage() {
  return <CreatorDashboard />;
}
