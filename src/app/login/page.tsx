import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/naano/auth/AuthSplitLayout";
import { LoginForm } from "@/components/naano/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Naano",
  description: "Sign in to manage your campaigns, creators and payouts, all in one place.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout
      panelTitle="Welcome back."
      panelText="Sign in to manage your campaigns, creators and payouts, all in one place."
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
