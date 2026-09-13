import { LinkedInIcon } from "./app-icons";

export interface CardProfile {
  name?: string;
  topic?: string;
  headline?: string;
  avatarInitial?: string;
  avatarUrl?: string;
  countryFlag?: string;
  followers?: number | null;
  impressions?: number | null;
  cost?: number | null;
  costLabel?: string;
  reading?: boolean;
}

const fmt = (n?: number | null) => (n == null ? "—" : n.toLocaleString("en-US"));

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 px-4 py-5 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-[13px] text-gray-400">{label}</div>
    </div>
  );
}

export function MarketplaceCard({
  name = "Your name",
  topic,
  headline = "Your LinkedIn headline and topics will appear here.",
  avatarInitial = "M",
  avatarUrl,
  countryFlag,
  followers = null,
  impressions = null,
  cost = null,
  costLabel = "Cost / post",
  reading = false,
}: CardProfile) {
  return (
    <div className="w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-[0_40px_90px_-50px_rgba(37,99,235,0.5)]">
      {/* Blue banner */}
      <div className="relative h-[104px] bg-gradient-to-br from-[#2f6bff] to-[#2559e0]">
        <span className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
          <LinkedInIcon width={18} height={18} />
        </span>
        <span className="absolute left-1/2 top-6 flex -translate-x-1/2 items-center gap-2 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="" className="h-4 w-auto brightness-0 invert" />
          <span className="font-[family-name:var(--font-jakarta)] text-lg font-bold">naano</span>
        </span>
        {reading && (
          <span className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#2563EB] shadow">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#2563EB]" />
            Reading your profile…
          </span>
        )}
        {countryFlag && (
          <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
            {countryFlag}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="relative z-10 -mt-9 flex justify-center">
        {avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={avatarUrl} alt={name} className="h-[76px] w-[76px] rounded-full border-4 border-white object-cover shadow" />
        ) : (
          <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-white bg-[#5b5148] text-2xl font-semibold text-white shadow">
            {avatarInitial}
          </div>
        )}
      </div>

      <div className="px-6 pb-2 pt-3 text-center">
        <h3 className="font-[family-name:var(--font-jakarta)] text-[26px] font-bold text-gray-900">{name}</h3>
        {topic && <p className="mt-1 text-[15px] text-gray-500">{topic}</p>}
        <p className="mx-auto mt-3 max-w-[300px] text-[15px] leading-relaxed text-gray-500">{headline}</p>
      </div>

      {/* Data status */}
      <div className="flex items-center gap-3 px-6 py-4 text-[13px] text-gray-400">
        <span>Data</span>
        <span className="h-1 flex-1 rounded-full bg-gray-100" />
        <span>Pending</span>
      </div>

      {/* Stats */}
      <div className="flex divide-x divide-gray-100 border-t border-gray-100">
        <Stat value={fmt(followers)} label="Followers" />
        <Stat value={fmt(impressions)} label="Est. impressions" />
        <Stat value={cost == null ? "—" : `€${cost}`} label={costLabel} />
      </div>
    </div>
  );
}
