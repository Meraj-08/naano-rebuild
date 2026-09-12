"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlobeIcon } from "../shared/app-icons";

const lavenderBtn =
  "flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#818cf8] text-[15px] font-semibold text-white transition-colors hover:bg-[#6f7bf0] disabled:opacity-90";

function StepBar({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="text-sm font-bold text-[#2563EB]">Step {step} of 3</span>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 w-16 rounded-full ${i <= step ? "bg-[#2563EB]" : "bg-gray-200"}`} />
        ))}
      </div>
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

const CHECKS = ["Reading your website…", "Extracting product signals…", "Identifying your ICP…"];

export function BrandOnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [reading, setReading] = useState(false);
  const [valueProp, setValueProp] = useState("");
  const [opening, setOpening] = useState(false);

  const analyze = () => {
    setReading(true);
    setTimeout(() => {
      setReading(false);
      setStep(2);
    }, 1600);
  };
  const openMatching = () => {
    setOpening(true);
    setTimeout(() => router.push("/brand#marketplace"), 900);
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
            {step === 1 && !reading && (
              <>
                <StepBar step={1} />
                <h1 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold tracking-[-0.03em] text-gray-900">Your website</h1>
                <p className="mt-5 text-[18px] leading-relaxed text-gray-500">We&apos;ll read your site to understand the product and your 3 main ICPs. This usually takes 20–40 seconds.</p>
                <label className="mt-8 block text-xs font-semibold uppercase tracking-wide text-gray-500">Your website</label>
                <div className="mt-2 flex h-[52px] items-center gap-2 rounded-[14px] border-2 border-gray-300 px-4 focus-within:border-[#2563EB]">
                  <GlobeIcon />
                  <input placeholder="https://yourcompany.com" className="w-full bg-transparent text-sm outline-none" />
                </div>
                <button onClick={analyze} className={`${lavenderBtn} mt-6`}>Analyze my website</button>
              </>
            )}

            {step === 1 && reading && (
              <>
                <StepBar step={1} />
                <h1 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold tracking-[-0.03em] text-gray-900">Reading your brand…</h1>
                <p className="mt-5 text-[18px] leading-relaxed text-gray-500">This usually takes 20–40 seconds. We&apos;ll only show you the product and 3 ICPs.</p>
                <div className="my-10 flex justify-center">
                  <div className="flex h-28 w-28 animate-pulse items-center justify-center rounded-full bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/naano/app/logo.svg" alt="" className="h-10 w-10" />
                  </div>
                </div>
                <div className="space-y-4">
                  {CHECKS.map((c) => (
                    <div key={c} className="flex items-center gap-3 text-gray-400">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      {c}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 font-semibold text-gray-900">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[13px] text-[#2563EB]">4</span>
                    Preparing your brand profile…
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <StepBar step={2} />
                <h1 className="flex items-center gap-3 font-[family-name:var(--font-jakarta)] text-[36px] font-bold tracking-[-0.03em] text-gray-900">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A66C2] text-white">in</span>
                  Value prop & ICP
                </h1>
                <p className="mt-4 text-[16px] text-gray-500">Review these details once. Naano turns them into a brief for your creators.</p>

                <label className="mt-8 block text-xs font-semibold uppercase tracking-wide text-gray-500">Value proposition</label>
                <p className="mt-1 text-[13px] text-gray-400">What the company does, for whom, how — 4 to 6 sentences. Edit if needed.</p>
                <textarea value={valueProp} onChange={(e) => setValueProp(e.target.value)} rows={4} placeholder="E.g.: We help... to... by.... The product.... Customers get..." className="mt-2 w-full rounded-[14px] border-2 border-[#2563EB] bg-white p-4 text-sm outline-none" />

                <label className="mt-6 block text-xs font-semibold uppercase tracking-wide text-gray-500">3 Ideal customers (ICP)</label>
                <p className="mt-1 text-[13px] text-gray-400">The audiences your creators need to understand.</p>
                <div className="mt-2 rounded-[14px] border border-gray-200 bg-gray-50 p-4 text-[14px] text-gray-500">No ICPs generated — you can refine sectors in Settings. Continue with the value proposition.</div>

                <div className="mt-5 rounded-2xl bg-[#f3f7ff] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/naano/app/logo.svg" alt="" className="h-6 w-6" />
                      <div><p className="text-[11px] font-bold uppercase tracking-wide text-[#2563EB]">Starter creator brief</p><p className="text-sm font-semibold text-gray-900">What your creators will receive</p></div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">✓ Ready</span>
                  </div>
                  <div className="mt-4 rounded-xl bg-white p-4">
                    <p className="font-semibold text-gray-900">https://www.linkedin.com/company/naanooo/</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                      <div><p className="font-semibold uppercase tracking-wide text-gray-400">Product</p><p className="mt-1 text-gray-700">{valueProp || "—"}</p></div>
                      <div><p className="font-semibold uppercase tracking-wide text-gray-400">Audience</p><p className="mt-1 text-gray-700">SaaS</p></div>
                    </div>
                    <p className="mt-3 rounded-lg bg-blue-50/60 p-2.5 text-[13px] text-gray-600">✦ Creators can adapt the angle to their expertise, while keeping every product claim factual.</p>
                  </div>
                  <p className="mt-3 text-[12px] text-gray-500">✎ Every creator you invite will receive this brief. You can edit it later from Campaigns.</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep(1)} className="rounded-[14px] border border-gray-200 px-6 text-sm font-semibold text-gray-800">Back</button>
                  <button onClick={openMatching} disabled={opening} className={lavenderBtn}>{opening ? "Opening AI Matching…" : "Continue to AI Matching"}</button>
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
