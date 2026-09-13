"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlobeIcon } from "../shared/app-icons";
import { upsertProfile } from "@/lib/naano/db";

const btn = "flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#2563EB] text-[15px] font-semibold text-white transition-colors hover:bg-[#1d4fd7] disabled:opacity-60";
const input = "h-[52px] w-full rounded-[14px] border-2 border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2563EB]";
const label = "block text-xs font-semibold uppercase tracking-wide text-gray-500";

function StepBar({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="text-sm font-bold text-[#2563EB]">Step {step} of 2</span>
      <div className="flex gap-1.5">{[1, 2].map((i) => <span key={i} className={`h-1.5 w-16 rounded-full ${i <= step ? "bg-[#2563EB]" : "bg-gray-200"}`} />)}</div>
    </div>
  );
}

function Panel() {
  return (
    <div className="hidden items-center bg-[#2563EB] p-12 text-white lg:flex lg:w-1/2">
      <div className="max-w-md">
        <h2 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold leading-[1.1] tracking-[-0.02em]">Creators. Brands. Results.</h2>
        <p className="mt-5 text-lg leading-relaxed text-blue-100">Run LinkedIn creator campaigns that drive real business - discover creators, track performance, pay in one click.</p>
        <p className="mt-8 text-[15px] text-blue-200">Built for B2B marketing teams</p>
      </div>
    </div>
  );
}

export function BrandOnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const finish = async () => {
    setSaving(true);
    await upsertProfile({ role: "brand", company_name: company || null, website_url: website || null, description: description || null });
    router.push("/brand#marketplace");
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-[family-name:var(--font-inter)] text-gray-900">
      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-1/2">
        <header className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="naano" className="h-8 w-auto" />
          <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50"><GlobeIcon />EN</button>
        </header>

        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[520px] py-10">
            {step === 1 && (
              <>
                <StepBar step={1} />
                <h1 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold tracking-[-0.03em]">Your company</h1>
                <p className="mt-4 text-[17px] leading-relaxed text-gray-500">Tell us about your company. These details are informational — nothing is fetched or verified.</p>

                <label className={`${label} mt-8`}>Company name</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Naano" className={`${input} mt-2`} />

                <label className={`${label} mt-5`}>Website URL</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourcompany.com" className={`${input} mt-2`} />
                <p className="mt-2 text-[13px] text-gray-400">Shown on your profile and campaigns for context — just a link, not scraped.</p>

                <button onClick={() => setStep(2)} disabled={!company.trim()} className={`${btn} mt-6`}>Continue</button>
              </>
            )}

            {step === 2 && (
              <>
                <StepBar step={2} />
                <h1 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold tracking-[-0.03em]">What do you do?</h1>
                <p className="mt-4 text-[17px] leading-relaxed text-gray-500">A short description shown to creators when they receive an invitation — so they understand who they&apos;d be working with.</p>

                <label className={`${label} mt-8`}>Short description / tagline</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="e.g. We help B2B SaaS teams run fixed-price LinkedIn creator campaigns and trace attributed pipeline back to each post." className="mt-2 w-full rounded-[14px] border-2 border-gray-300 bg-white p-4 text-sm outline-none focus:border-[#2563EB]" />

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep(1)} className="rounded-[14px] border border-gray-200 px-6 text-sm font-semibold text-gray-800">Back</button>
                  <button onClick={finish} disabled={saving} className={btn}>{saving ? "Setting up…" : "Continue to AI Matching"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Panel />
    </div>
  );
}
