import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200/80 bg-white ${className}`}>{children}</div>
  );
}

export function PageHead({ eyebrow, title, subtitle, right }: { eyebrow?: string; title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[#2563EB]">{eyebrow}</p>}
        <h1 className="font-[family-name:var(--font-jakarta)] text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-gray-900">{title}</h1>
        {subtitle && <p className="mt-2 text-[17px] text-gray-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function StatCard({ icon, label, value, sub }: { icon?: ReactNode; label: string; value: ReactNode; sub?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-[12px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-3 text-[32px] font-bold leading-none text-gray-900">{value}</div>
      {sub && <div className="mt-2 text-[13px] text-gray-400">{sub}</div>}
    </Card>
  );
}
