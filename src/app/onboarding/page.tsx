import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/naano/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Complete your profile · Naano",
  description: "Build a marketplace card brands can trust.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
