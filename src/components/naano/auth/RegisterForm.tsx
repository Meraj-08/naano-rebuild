"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { GoogleIcon, LinkedInIcon, EyeIcon, EyeOffIcon } from "../shared/app-icons";

const oauthBtn =
  "flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border-2 border-gray-200 bg-white text-[15px] font-semibold text-gray-900 shadow-[0_2px_6px_rgba(15,23,42,0.05)] transition-colors hover:bg-gray-50 disabled:opacity-60";
const fieldLabel = "block text-xs font-semibold uppercase tracking-wide text-gray-500";
const input =
  "h-[52px] w-full rounded-[14px] border-2 border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563EB]";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const notConfigured = () =>
    setError("Authentication isn't configured yet — add your Supabase credentials to .env.local.");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return notConfigured();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // If email confirmation is required, Supabase returns a user but no active session.
    if (data.session) {
      router.push("/welcome");
      router.refresh();
    } else {
      setEmailSent(true);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured()) return notConfigured();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/welcome` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-gray-900">
          Check your email
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-500">
          We sent a confirmation link to <span className="font-semibold text-gray-900">{email}</span>.
          Click it to activate your account, then you&apos;ll pick how you&apos;ll use Naano.
        </p>
        <a
          href="/login"
          className="mt-8 inline-block text-sm font-semibold text-[#2563EB] hover:underline"
        >
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-gray-900">
        Create your account
      </h1>
      <p className="mt-1 text-[15px] text-gray-500">Start on Naano in a couple of minutes.</p>

      <div className="mt-8 space-y-3">
        <button type="button" onClick={handleGoogle} disabled={loading} className={oauthBtn}>
          <LinkedInIcon />
          Sign up with LinkedIn
        </button>
        <button type="button" onClick={handleGoogle} disabled={loading} className={oauthBtn}>
          <GoogleIcon />
          Sign up with Google
        </button>
      </div>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Or sign up with email
        </span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form className="space-y-5" onSubmit={handleSignUp}>
        <div className="space-y-2">
          <label htmlFor="name" className={fieldLabel}>
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className={input}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className={fieldLabel}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
            className={input}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className={fieldLabel}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={`${input} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="h-[52px] w-full rounded-[14px] bg-[#2563EB] text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(37,99,235,0.24)] transition-colors hover:bg-[#1d4fd7] disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-[#2563EB] hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
