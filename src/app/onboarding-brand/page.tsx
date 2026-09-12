import type { Metadata } from "next";
import { BrandOnboardingFlow } from "@/components/naano/brand/BrandOnboardingFlow";

export const metadata: Metadata = { title: "Set up your brand · Naano", description: "Creators. Brands. Results." };

export default function OnboardingBrandPage() {
  return <BrandOnboardingFlow />;
}
