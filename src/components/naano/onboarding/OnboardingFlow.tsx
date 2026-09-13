"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "./OnboardingLayout";
import { MarketplaceCard } from "../shared/MarketplaceCard";
import { upsertProfile } from "@/lib/naano/db";

const AV = "/naano/images";
const AVATARS = ["avatar-a", "avatar-b", "avatar-c", "avatar-d", "avatar-e", "avatar-f", "avatar-g", "avatar-h"].map((n) => `${AV}/${n}.png`);
const CATEGORIES = ["B2B SaaS", "Tech", "Marketing", "AI", "Sales", "Growth / GTM", "SEO", "Design", "Productivity", "Fintech", "Developer Tools", "Cybersecurity"];

const primaryBtn = "flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#2563EB] text-[15px] font-semibold text-white transition-colors hover:bg-[#1d4fd7] disabled:opacity-60";
const input = "h-[52px] w-full rounded-[14px] border-2 border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2563EB]";
const label = "block text-xs font-semibold uppercase tracking-wide text-gray-500";

function StepEyebrow({ n }: { n: number }) {
  return <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#2563EB]">Step {n} of 3</p>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="font-[family-name:var(--font-jakarta)] text-[38px] font-bold leading-[1.1] tracking-[-0.03em] text-gray-900">{children}</h1>;
}

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [rate, setRate] = useState("100");
  const [followers, setFollowers] = useState("");

  const toggleTag = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : cur.length < 3 ? [...cur, t] : cur));

  const card = (
    <MarketplaceCard
      name={name || "Your name"}
      avatarUrl={avatar}
      topic={tags.join(" · ") || undefined}
      headline={bio || "Your tagline and topics will appear here."}
      followers={followers ? parseInt(followers) : null}
      cost={rate ? parseInt(rate) : null}
      costLabel="Cost / post"
    />
  );

  const finish = async () => {
    setSaving(true);
    await upsertProfile({
      role: "creator",
      name: name || null,
      bio: bio || null,
      tags: tags.join(", ") || null,
      rate: rate ? `€${rate}` : null,
      avatar,
      linkedin_url: linkedin || null,
      followers: followers ? parseInt(followers) : 0,
    });
    router.push("/creator");
  };

  // Reveal (centered)
  if (step === 4) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 font-[family-name:var(--font-inter)] text-gray-900">
        <h1 className="text-center font-[family-name:var(--font-jakarta)] text-[44px] font-bold tracking-[-0.03em]">Here is your Marketplace card</h1>
        <p className="mt-3 max-w-xl text-center text-[17px] text-gray-500">This is what brands will see. You can edit it anytime from your profile.</p>
        <div className="mt-10">{card}</div>
        <button onClick={finish} disabled={saving} className={`${primaryBtn} mt-10 max-w-[440px]`}>{saving ? "Creating your profile…" : "Continue to my profile"}</button>
      </div>
    );
  }

  return (
    <OnboardingLayout card={card}>
      {step === 1 && (
        <div>
          <StepEyebrow n={1} />
          <Title>Tell us who you are</Title>
          <p className="mt-4 text-[17px] leading-relaxed text-gray-500">Enter your details manually — nothing is imported or verified from LinkedIn.</p>
          <label className="mt-8 block text-xs font-semibold uppercase tracking-wide text-gray-500">Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={`${input} mt-2`} />
          <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-gray-500">LinkedIn profile URL</label>
          <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/you" className={`${input} mt-2`} />
          <p className="mt-2 text-[13px] text-gray-400">Just a link shown on your card — we don&apos;t fetch or verify anything.</p>
          <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-gray-500">LinkedIn follower count</label>
          <input value={followers} onChange={(e) => setFollowers(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="e.g. 4200" className={`${input} mt-2`} />
          <p className="mt-2 text-[13px] text-gray-400">Enter your current follower count — it powers your card and analytics estimates.</p>
          <button onClick={() => setStep(2)} disabled={!name.trim()} className={`${primaryBtn} mt-6`}>Continue</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <StepEyebrow n={2} />
          <Title>Complete your creator card</Title>

          <label className={`${label} mt-8`}>Choose an avatar</label>
          <div className="mt-3 flex flex-wrap gap-3">
            {AVATARS.map((a) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={a} src={a} alt="" onClick={() => setAvatar(a)} className={`h-12 w-12 cursor-pointer rounded-full object-cover ring-2 ring-offset-2 transition ${avatar === a ? "ring-[#2563EB]" : "ring-transparent hover:ring-gray-200"}`} />
            ))}
          </div>

          <label className={`${label} mt-6`}>Short bio / tagline</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="e.g. I help B2B SaaS teams turn product updates into LinkedIn pipeline." className="mt-2 w-full rounded-[14px] border-2 border-gray-300 bg-white p-4 text-sm outline-none focus:border-[#2563EB]" />

          <label className={`${label} mt-6`}>Categories <span className="font-normal normal-case text-gray-400">(pick up to 3)</span></label>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((t) => {
              const on = tags.includes(t);
              return (
                <button key={t} type="button" onClick={() => toggleTag(t)} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  {on ? "✓ " : ""}{t}
                </button>
              );
            })}
          </div>

          <button onClick={() => setStep(3)} className={`${primaryBtn} mt-8`}>Continue</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <StepEyebrow n={3} />
          <Title>Set your price</Title>
          <p className="mt-4 text-[17px] leading-relaxed text-gray-500">Your net price per post. You can change it anytime from your profile.</p>
          <label className={`${label} mt-8`}>Price per post</label>
          <div className="mt-2 flex h-[52px] items-center rounded-[14px] border-2 border-gray-300 px-4 focus-within:border-[#2563EB]">
            <span className="text-gray-400">€</span>
            <input value={rate} onChange={(e) => setRate(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" className="w-full bg-transparent px-2 text-sm outline-none" />
            <span className="text-gray-400">/ post</span>
          </div>
          <button onClick={() => setStep(4)} className={`${primaryBtn} mt-8`}>Create my marketplace profile</button>
        </div>
      )}
    </OnboardingLayout>
  );
}
