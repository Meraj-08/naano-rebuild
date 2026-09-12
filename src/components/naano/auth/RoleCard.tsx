import type { ReactNode } from "react";

interface RoleCardProps {
  href: string;
  title: string;
  description: string;
  /** Optional footer row (icon + label), used on the /welcome screen. */
  footerIcon?: ReactNode;
  footerLabel?: string;
}

export function RoleCard({ href, title, description, footerIcon, footerLabel }: RoleCardProps) {
  return (
    <a
      href={href}
      className="group flex flex-col rounded-[14px] border-2 border-gray-300 bg-white p-5 text-left transition-all hover:border-[#2563EB] hover:shadow-[0_8px_24px_-12px_rgba(37,99,235,0.35)]"
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-gray-500">{description}</p>
      {footerLabel && (
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-700">
          <span className="text-gray-500">{footerIcon}</span>
          {footerLabel}
        </div>
      )}
    </a>
  );
}
