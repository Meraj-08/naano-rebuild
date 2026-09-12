import type { Metadata } from "next";
import { BrandApp } from "@/components/naano/brand/BrandApp";

export const metadata: Metadata = { title: "Naano - Brand", description: "Your brand workspace." };

export default function BrandPage() {
  return <BrandApp />;
}
