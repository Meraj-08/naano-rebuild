"use client";

import { useState } from "react";
import { OnboardingLayout } from "./OnboardingLayout";
import { MarketplaceCard, type CardProfile } from "../shared/MarketplaceCard";

const HEADLINE = "SDE intern @Amazon | Student Btech CSE | Full stack developer | Undergrad";
const COUNTRIES = ["India", "United States", "United Kingdom", "France", "Germany", "Canada", "Australia"];
const INDUSTRIES = [
  "B2B", "B2C", "AI", "SaaS", "Software", "Sales", "Marketing", "SEO", "Outreach", "CRM",
  "Creative", "Productivity", "Fintech", "HealthTech", "EdTech", "Cybersecurity", "Growth / GTM",
  "HR", "E-commerce", "Developer Tools", "Data / Analytics", "Customer Support", "Design",
  "Real Estate / PropTech", "LegalTech",
];

const stepBtn =
  "flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] text-[15px] font-semibold transition-colors";
const primaryBtn = `${stepBtn} bg-[#2563EB] text-white shadow-[0_6px_16px_rgba(37,99,235,0.28)] hover:bg-[#1d4fd7]`;

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#2563EB" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function BackLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800">
      <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      {children}
    </button>
  );
}
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#2563EB]">{children}</p>
);
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold leading-[1.1] tracking-[-0.03em] text-gray-900">{children}</h1>
);

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [reading, setReading] = useState(false);
  const [country, setCountry] = useState("India");
  const [industries, setIndustries] = useState<string[]>(["Software"]);

  const imported = step >= 1 || reading;
  const toggleIndustry = (name: string) =>
    setIndustries((cur) =>
      cur.includes(name) ? cur.filter((i) => i !== name) : cur.length < 3 ? [...cur, name] : cur,
    );

  const topic = industries[0];
  const baseProfile: CardProfile = {
    name: imported ? "Md Meraj Alam" : "Your name",
    headline: imported ? HEADLINE : undefined,
    avatarInitial: "M",
    countryFlag: imported ? "🇮🇳" : undefined,
    followers: imported ? 867 : null,
  };

  const cardForStep = (): CardProfile => {
    if (step === 0) return { ...baseProfile, reading };
    if (step === 1) return { ...baseProfile, topic, cost: 300, costLabel: "Potential cost" };
    return { ...baseProfile, topic, cost: 100, costLabel: "Chosen cost" };
  };

  const startImport = () => {
    setReading(true);
    setTimeout(() => {
      setReading(false);
      setStep(1);
    }, 1200);
  };

  // Step 4 — card reveal (centered)
  if (step === 4) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 font-[family-name:var(--font-inter)] text-gray-900">
        <h1 className="text-center font-[family-name:var(--font-jakarta)] text-[44px] font-bold tracking-[-0.03em] text-gray-900">
          Here is your Marketplace card
        </h1>
        <p className="mt-3 max-w-xl text-center text-[17px] text-gray-500">
          Tap it to flip it over. You will be able to customize it in the profile coming next.
        </p>
        <div className="mt-10">
          <MarketplaceCard {...baseProfile} topic={topic} cost={100} costLabel="Chosen cost" />
        </div>
        <a href="/creator" className={`${primaryBtn} mt-10 max-w-[440px]`}>
          Continue to my profile
        </a>
      </div>
    );
  }

  return (
    <OnboardingLayout card={<MarketplaceCard {...cardForStep()} />}>
      {step === 0 && (
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#2563EB]">Step 2 of 4</p>
          <Title>Add your public LinkedIn profile</Title>
          <p className="mt-5 text-[18px] leading-relaxed text-gray-500">
            No extension is needed. We&apos;ll retrieve only the minimum public information required to create your Basic card.
          </p>
          <label className="mt-8 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Public LinkedIn profile URL
          </label>
          <input
            className="mt-2 h-[52px] w-full rounded-[14px] border-2 border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2563EB]"
            placeholder="https://www.linkedin.com/in/you"
            defaultValue=""
          />
          <div className="mt-5 flex gap-3 rounded-[14px] bg-[#f4f6fb] p-4 text-[13px] leading-relaxed text-gray-500">
            <ShieldIcon />
            <span>
              By clicking below, you authorize Naano to read your public profile once: name, photo, headline, country and follower count. We do not import your posts, engagement or private analytics.
            </span>
          </div>
          <button
            type="button"
            onClick={startImport}
            disabled={reading}
            className={`${stepBtn} mt-6 bg-[#818cf8] text-white hover:bg-[#6f7bf0] disabled:opacity-90`}
          >
            {reading ? "Reading your profile…" : "Import my public profile"}
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#2563EB]">Step 3 of 4</p>
          <Title>Complete your creator card</Title>
          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5b5148] font-semibold text-white">M</div>
            <div>
              <p className="text-[15px]"><span className="font-bold text-gray-900">867</span> <span className="text-gray-500">followers</span></p>
              <p className="mt-0.5 text-[14px] leading-snug text-gray-500">{HEADLINE}</p>
            </div>
          </div>

          <h2 className="mt-8 text-lg font-semibold text-gray-900">Your country</h2>
          <p className="mt-1 text-[15px] text-gray-500">Confirm your country before continuing.</p>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-3 h-[52px] w-full rounded-[14px] border-2 border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none focus:border-[#2563EB]"
          >
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <h2 className="mt-8 text-lg font-semibold text-gray-900">
            Your industries <span className="text-[15px] font-normal text-gray-400">(pick up to 3)</span>
          </h2>
          <p className="mt-1 text-[15px] text-gray-500">Choose up to 3 industries to help relevant brands find your card.</p>
          <div className="mt-4 flex max-h-[220px] flex-wrap gap-2.5 overflow-y-auto pr-1">
            {INDUSTRIES.map((name) => {
              const on = industries.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleIndustry(name)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    on ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {on && <CheckIcon />}
                  {name}
                </button>
              );
            })}
          </div>

          <button type="button" onClick={() => setStep(2)} className={`${primaryBtn} mt-8`}>
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#2563EB]">Step 4 of 4</p>
          <Title>Complete your creator card</Title>
          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5b5148] font-semibold text-white">M</div>
            <div>
              <p className="text-[15px]"><span className="font-bold text-gray-900">867</span> <span className="text-gray-500">followers</span></p>
              <p className="mt-0.5 text-[14px] leading-snug text-gray-500">{HEADLINE}</p>
            </div>
          </div>
          <BackLink onClick={() => setStep(1)}>Edit my industries</BackLink>

          <div className="mt-2 rounded-[20px] border border-gray-200 p-7 text-center">
            <Eyebrow>Our recommendation</Eyebrow>
            <p className="mx-auto max-w-sm text-[15px] leading-relaxed text-gray-500">
              Naano recommends this starting price from the public audience and performance information currently available. You can change it now or later.
            </p>
            <div className="my-6 flex items-end justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">€</span>
              <span className="text-[64px] font-bold leading-none text-gray-900">100</span>
              <span className="mb-2 text-gray-400">/ post</span>
            </div>
            <p className="text-[13px] text-gray-400">This is your net price per post. You can change it at any time from your Naano profile.</p>
          </div>

          <button type="button" onClick={() => setStep(3)} className={`${primaryBtn} mt-6`}>
            Create my marketplace profile
          </button>
          <button type="button" className={`${stepBtn} mt-3 border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-50`}>
            Add a bundle (optional)
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#2563EB]">Optional</p>
          <Title>Complete your professional information now?</Title>
          <p className="mt-5 text-[18px] leading-relaxed text-gray-500">
            This step is optional now. You can complete it later from your profile, before applying to paid campaigns, accepting bookings, invoicing or withdrawing your earnings.
          </p>
          <div className="mt-6 space-y-4 rounded-[14px] bg-[#f4f6fb] p-5 text-[15px] leading-relaxed text-gray-600">
            <p><span className="font-semibold text-gray-900">France and European Union:</span> a registered professional activity is required to invoice companies and withdraw your earnings.</p>
            <p><span className="font-semibold text-gray-900">United States and outside the European Union:</span> a registered business is not mandatory. You can continue as an individual and add professional information if you have it.</p>
          </div>
          <button type="button" onClick={() => setStep(4)} className={`${primaryBtn} mt-6`}>
            Complete now
          </button>
          <button type="button" onClick={() => setStep(4)} className={`${stepBtn} mt-3 border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-50`}>
            Finish later
          </button>
        </div>
      )}
    </OnboardingLayout>
  );
}
