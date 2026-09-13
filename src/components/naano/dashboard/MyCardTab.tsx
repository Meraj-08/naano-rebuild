"use client";

import { useEffect, useState } from "react";
import { Card } from "./dash-ui";
import { getProfile, parseAmount, type Profile } from "@/lib/naano/db";
import { fmt } from "@/lib/naano/creator";

const CHIP_COLORS = ["bg-orange-50 text-orange-600", "bg-blue-50 text-[#2563EB]", "bg-emerald-50 text-emerald-600", "bg-purple-50 text-purple-600"];

function Section({ title, children, hideable = true }: { title: string; children: React.ReactNode; hideable?: boolean }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="cursor-grab text-gray-300">⠿</span>
          <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
        </div>
        {hideable && (
          <div className="flex items-center gap-3 text-gray-400">
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 8 10 8a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
          </div>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

export function MyCardTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { getProfile().then(setProfile); }, []);

  const name = profile?.name || "Your name";
  const initial = name[0].toUpperCase();
  const followers = profile?.followers ?? 0;
  const tags = (profile?.tags || "").split(/[·,]/).map((t) => t.trim()).filter(Boolean);
  const rate = profile?.rate ? parseAmount(profile.rate) : 0;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <div className="flex rounded-xl border border-gray-200 p-0.5 text-sm font-medium">
          <span className="rounded-lg bg-gray-100 px-4 py-1.5 text-gray-900">Edit</span>
          <span className="px-4 py-1.5 text-gray-400">Preview</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        <div className="space-y-5">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                {profile?.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={profile.avatar} alt={name} className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#5b6b66] text-2xl font-semibold text-white">{initial}</span>
                )}
                <div>
                  <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-gray-900">{name}</h2>
                  <button className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-[#2563EB]">Change profile photo</button>
                </div>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-[13px] font-medium text-gray-600"><span className="h-2 w-2 rounded-full bg-gray-400" />Private Marketplace card</span>
            </div>
            <div className="mt-6"><p className="text-2xl font-bold text-gray-900">{fmt(followers)}</p><p className="text-[13px] uppercase tracking-wide text-gray-400">Followers</p></div>
          </Card>

          <Section title="About">
            {profile?.bio && <p className="mb-3 text-[14px] leading-relaxed text-gray-600">{profile.bio}</p>}
            <div className="flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <span className="text-[13px] text-gray-400">No topics added yet.</span>
              ) : (
                tags.map((t, i) => (
                  <span key={t} className={`rounded-full px-3 py-1 text-sm font-medium ${CHIP_COLORS[i % CHIP_COLORS.length]}`}>{t}</span>
                ))
              )}
            </div>
          </Section>

          <Section title="Audience & average metrics">
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl bg-gray-50 p-4"><p className="text-2xl font-bold text-gray-900">{fmt(followers)}</p><p className="text-[13px] uppercase tracking-wide text-gray-400">Followers</p></div>
              <div className="flex-1 rounded-xl bg-gray-50 p-4"><p className="text-2xl font-bold text-gray-900">Global</p><p className="text-[13px] uppercase tracking-wide text-gray-400">Based in</p></div>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4"><p className="text-2xl font-bold text-gray-900">€{rate}</p><p className="text-[13px] uppercase tracking-wide text-gray-400">Price per post</p></div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4"><div><p className="text-lg font-bold text-gray-900">None set</p><p className="text-[13px] uppercase tracking-wide text-gray-400">Bundle</p></div><span className="text-gray-400">▾</span></div>
            </div>
            <button className="mt-4 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-800">Edit price & bundles</button>
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">🛡️</span>
              <div className="flex-1">
                <div className="flex items-center justify-between"><p className="font-semibold text-gray-900">LinkedIn data</p><span className="text-gray-300">?</span></div>
                <p className="text-[13px] text-gray-500">Public profile · unverified</p>
              </div>
            </div>
            <p className="mt-4 text-[13px] font-medium text-red-500">The Naano extension was not detected in this browser.</p>
            <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#2563EB]">
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
              Refresh profile and followers
            </button>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-500">Available once a week. Updates your profile and followers, not your post history. Naano collaboration posts are added automatically after you submit their published link.</p>
            <div className="mt-4 rounded-xl border border-gray-200 p-4">
              <p className="font-semibold text-gray-900">Become Naano Verified</p>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-500">Public profile refresh is fine for basic card data. To unlock Naano Verified analytics, connect with the Naano browser extension.</p>
              <button className="mt-4 w-full rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Use the extension</button>
            </div>
          </Card>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white hover:bg-[#1d4fd7]">+ Add a section</button>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Hidden sections</p>
            <p className="mt-2 text-[13px] leading-relaxed text-gray-400">Sections you hide move here. Click one to add it back.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
