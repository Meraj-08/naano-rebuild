import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/naano/auth/AuthSplitLayout";
import { RegisterForm } from "@/components/naano/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create your account · Naano",
  description: "One platform. Two sides. Creators get paid to post. B2B brands get real pipeline.",
};

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      panelTitle="One platform. Two sides."
      panelText="Creators get paid to post. B2B brands get real pipeline. Pick where you fit and we'll set the rest up in a couple of minutes."
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
