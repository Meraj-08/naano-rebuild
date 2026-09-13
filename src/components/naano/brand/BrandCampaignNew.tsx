"use client";

import { useState } from "react";
import { createCampaign } from "@/lib/naano/db";

const CLOUD = { backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.72), rgba(255,255,255,0.96)), url('/naano/images/proof-cloud-atmosphere-v1.png')" };
const TOTAL = 6;

const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const defaultStart = () => isoDate(new Date());
const defaultEnd = () => { const d = new Date(); d.setDate(d.getDate() + 14); return isoDate(d); };

const QUESTIONS: { q: string; options: string[] }[] = [
  { q: "What budget do you want to allocate for this campaign?", options: ["€500–1,000 — first creator test", "€2,000–5,000 — small multi-post wave", "€5,000+ — broader campaign"] },
  { q: "What's the main angle for your launch?", options: ["Cost reduction & procurement savings", "Workflow simplification & team efficiency", "Scaling procurement for high-growth SaaS teams"] },
  { q: "Which LinkedIn post format should creators prioritize?", options: ["Benefits & use case — show concrete business value", "Lead magnet — share a useful resource that drives qualified engagement", "Customer story or thought leadership — build trust"] },
  { q: "What proof should creators emphasize?", options: ["Case studies: real 20%+ reduction examples", "Benchmark report: how your spending stacks up against peer SaaS companies", "Playbook: step-by-step guide to consolidating vendors"] },
  { q: "Which creator personas resonate most with this message?", options: ["Procurement leaders posting about cost optimization and efficiency wins", "Operations/supply-chain execs sharing scaling challenges", "Finance/VP-level voices discussing procurement strategy"] },
];

const ANGLES = [
  ["01", "Peer Benchmark Report", "Lead magnet — Benchmark report", "Offers a free benchmark comparing spend against peers, giving buyers a data point they don't currently have."],
  ["02", "Vendor Consolidation Reality Check", "Retour d'XP / Post texte", "Explores the common pattern of tool sprawl and why consolidation becomes necessary."],
  ["03", "Scaling Readiness Check", "Carrousel", "A diagnostic-style carousel helping leaders self-assess whether their setup can handle growth."],
  ["04", "Efficiency Wins", "Étude de cas", "A pattern-based post on common efficiency wins teams unlock with the product."],
];
const DO = ["Frame the value as a genuinely useful resource for the reader", "Lead with the product's core benefit, stated plainly", "Speak specifically to the target audience, not everyone", "Include a clear, low-friction CTA (comment/DM)", "Keep the tone like advice from a peer, not a product pitch"];
const AVOID = ["Don't invent specific numbers or results not provided", "Don't claim case studies or client results that weren't shared", "Don't use generic jargon like 'streamline synergies'", "Don't make it sound like a paid ad — no 'Buy now'", "Don't reference personal experience the creator doesn't have"];

/** Rule-based: turn the free-text product line into 2–3 Product bullets. */
function productParts(product: string): { name: string; bullets: string[] } {
  const t = product.trim();
  if (!t) return { name: "New campaign", bullets: ["Your product's value proposition will appear here."] };
  const parts = t.split(/\s[—–-]\s|:/);
  const name = (parts[0] || "New campaign").trim();
  const desc = parts.slice(1).join(" — ").trim();
  return {
    name,
    bullets: [
      desc || t,
      `Built for the teams evaluating ${name} — creators keep every product claim factual.`,
      `The core value stays consistent; creators adapt the angle to their own audience.`,
    ],
  };
}

function MethodCard({ badge, title, desc, cta, primary, children }: { badge: string; title: string; desc: string; cta: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5">
      <div className="mb-5 flex h-40 items-center justify-center rounded-xl bg-gradient-to-b from-[#eaf0fb] to-white">{children}</div>
      <p className="text-[13px] font-medium text-gray-500">{badge}</p>
      <h3 className="mt-1 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-gray-500">{desc}</p>
      <button className={`mt-5 rounded-xl py-3 text-sm font-semibold ${primary ? "bg-[#2563EB] text-white hover:bg-[#1d4fd7]" : "border border-gray-200 text-gray-900 hover:bg-gray-50"}`}>{cta}</button>
    </div>
  );
}
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-5 border-t border-gray-100 pt-4"><p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>{children}</div>;
}

function Brief({ product, answers, created, saving, startDate, endDate, onStartDate, onEndDate, onCreate }: { product: string; answers: string[]; created: boolean; saving: boolean; startDate: string; endDate: string; onStartDate: (v: string) => void; onEndDate: (v: string) => void; onCreate: () => void }) {
  const { name, bullets } = productParts(product);
  const windowInvalid = !startDate || !endDate || endDate < startDate;
  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-3 text-[13px] text-gray-500">Based on your answers, Nao built this brief:</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {product && <span className="rounded-full bg-white px-3 py-1.5 text-[13px] text-gray-700 shadow-sm ring-1 ring-gray-100">📣 {product}</span>}
        {answers.map((a) => <span key={a} className="rounded-full bg-white px-3 py-1.5 text-[13px] text-gray-700 shadow-sm ring-1 ring-gray-100">{a}</span>)}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
        <div className="flex items-center gap-2"><h2 className="text-lg font-bold text-gray-900">{name}</h2><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">Generated</span><span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">v1 · Draft</span></div>
        <Section label="Product"><ul className="mt-1 space-y-1 text-[14px] text-gray-600">{bullets.map((t) => <li key={t}>✓ {t}</li>)}</ul></Section>
        <Section label="Target persona"><p className="mt-1 text-[14px] font-semibold text-gray-900">Decision-makers who match your selected angle & personas · B2B</p><ul className="mt-2 space-y-1 text-[14px] text-gray-600"><li>✓ Focus: {answers[1] ?? "your chosen angle"}</li><li>✓ Emphasize: {answers[3] ?? "your chosen proof"}</li><li>✓ Reach via: {answers[4] ?? "your chosen creator personas"}</li></ul></Section>
        <Section label="Tone"><p className="mt-1 text-[14px] text-gray-600">Direct, peer-to-peer, and pragmatic — one professional giving another a useful data point, not a vendor pitching a product.</p></Section>
        <Section label="Validated angles · 4"><div className="mt-2 space-y-3">{ANGLES.map(([n, t, tag, d]) => (<div key={n} className="rounded-xl border border-gray-100 p-3"><div className="flex items-center justify-between"><p className="text-[14px] font-semibold text-gray-900"><span className="text-gray-400">{n}</span> {t}</p><span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">{tag}</span></div><p className="mt-1 text-[13px] text-gray-500">{d}</p></div>))}</div></Section>
        <Section label="Do and avoid"><div className="mt-2 grid gap-6 sm:grid-cols-2"><div><p className="font-semibold text-gray-900">Do</p><ul className="mt-2 space-y-1.5 text-[13px] text-gray-600">{DO.map((t) => <li key={t} className="text-emerald-700">✓ <span className="text-gray-600">{t}</span></li>)}</ul></div><div><p className="font-semibold text-gray-900">Avoid</p><ul className="mt-2 space-y-1.5 text-[13px] text-gray-600">{AVOID.map((t) => <li key={t} className="text-red-500">✕ <span className="text-gray-600">{t}</span></li>)}</ul></div></div></Section>
        <Section label="Booking window">
          <p className="mt-1 text-[13px] text-gray-500">Creators can only be invited to this campaign between these dates.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-semibold text-gray-500">Start date</label>
              <input type="date" value={startDate} disabled={created} onChange={(e) => onStartDate(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] disabled:bg-gray-50 disabled:text-gray-400" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-500">End date</label>
              <input type="date" value={endDate} disabled={created} min={startDate} onChange={(e) => onEndDate(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] disabled:bg-gray-50 disabled:text-gray-400" />
            </div>
          </div>
          {windowInvalid && !created && <p className="mt-2 text-[13px] text-red-500">End date must be on or after the start date.</p>}
        </Section>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onCreate} disabled={created || saving || windowInvalid} className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${created ? "bg-emerald-500" : "bg-[#2563EB] hover:bg-[#1d4fd7]"}`}>{created ? "✓ Campaign created" : saving ? "Creating…" : "Create a campaign →"}</button>
          <button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800">🔖 Save to drafts</button>
          <button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800">💬 Adjust with AI</button>
        </div>
      </div>
    </div>
  );
}

export function BrandCampaignNew() {
  const [mode, setMode] = useState<"choose" | "ai">("choose");
  const [phase, setPhase] = useState<"quiz" | "processing" | "brief">("quiz");
  const [qIndex, setQIndex] = useState(0); // 0 = product free-text; 1..5 = multiple-choice
  const [product, setProduct] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [created, setCreated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState(defaultStart());
  const [endDate, setEndDate] = useState(defaultEnd());

  const reset = () => { setMode("choose"); setPhase("quiz"); setQIndex(0); setProduct(""); setAnswers([]); setCreated(false); setSaving(false); setStartDate(defaultStart()); setEndDate(defaultEnd()); };

  const create = async () => {
    if (created || saving) return; // guard against double-submit
    setSaving(true);
    const campaign = await createCampaign({ name: productParts(product).name, brief: [product, ...answers].join(" · "), start_date: startDate, end_date: endDate });
    setSaving(false);
    if (campaign) setCreated(true);
  };
  const choose = (opt: string) => {
    const next = [...answers, opt];
    setAnswers(next);
    if (qIndex >= TOTAL - 1) { setPhase("processing"); setTimeout(() => setPhase("brief"), 1800); }
    else setQIndex(qIndex + 1);
  };

  if (mode === "ai") {
    return (
      <div className="rounded-3xl bg-cover bg-center p-10" style={CLOUD}>
        <button onClick={reset} className="mb-6 text-sm text-gray-500 hover:text-gray-800">‹ Back</button>

        {phase === "quiz" && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center justify-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/naano/app/logo.svg" alt="" className="h-8 w-8" />
              <p className="text-[13px] font-bold uppercase tracking-wide text-[#2563EB]">Nao · Question {qIndex + 1} of {TOTAL}</p>
            </div>
            <div className="mb-6 flex gap-1.5">{Array.from({ length: TOTAL }).map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= qIndex ? "bg-[#2563EB]" : "bg-gray-200"}`} />)}</div>

            {(product || answers.length > 0) && (
              <div className="mb-6 space-y-2">
                {product && <div className="flex items-center gap-2 text-[13px] text-gray-500"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>{product}</div>}
                {answers.map((a, i) => (<div key={i} className="flex items-center gap-2 text-[13px] text-gray-500"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>{a}</div>))}
              </div>
            )}

            {qIndex === 0 ? (
              <>
                <h1 className="text-center font-[family-name:var(--font-jakarta)] text-[30px] font-bold leading-tight tracking-[-0.02em] text-gray-900">What are you promoting?</h1>
                <p className="mt-2 text-center text-[15px] text-gray-500">Product or company name + a one-line description.</p>
                <textarea value={product} onChange={(e) => setProduct(e.target.value)} rows={3} placeholder="e.g. Naano — B2B LinkedIn creator marketplace" className="mt-6 w-full rounded-2xl border-2 border-gray-200 bg-white p-4 text-[15px] outline-none focus:border-[#2563EB]" />
                <button onClick={() => setQIndex(1)} disabled={!product.trim()} className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#2563EB] text-[15px] font-semibold text-white hover:bg-[#1d4fd7] disabled:opacity-60">Continue</button>
              </>
            ) : (
              <>
                <h1 className="text-center font-[family-name:var(--font-jakarta)] text-[30px] font-bold leading-tight tracking-[-0.02em] text-gray-900">{QUESTIONS[qIndex - 1].q}</h1>
                <div className="mt-8 space-y-3">
                  {QUESTIONS[qIndex - 1].options.map((opt) => (
                    <button key={opt} onClick={() => choose(opt)} className="flex w-full items-center justify-between rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-left text-[15px] font-medium text-gray-800 transition-colors hover:border-[#2563EB] hover:bg-blue-50/40">
                      {opt}<span className="text-gray-300">›</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {phase === "processing" && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/naano/app/logo.svg" alt="" className="h-12 w-12 animate-pulse" />
            <p className="mt-4 font-[family-name:var(--font-jakarta)] text-2xl font-bold text-gray-900">Preparing your campaign</p>
            <p className="mt-1 text-[14px] text-gray-500">Turning your answers into a creator brief…</p>
          </div>
        )}

        {phase === "brief" && (
          <div>
            <Brief product={product} answers={answers} created={created} saving={saving} startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} onCreate={create} />
            {created && (
              <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[14px] text-gray-500">Brief approved ✓ — next step:</p>
                <div className="mt-2 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span><div><p className="font-semibold text-gray-900">{productParts(product).name} <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">Active</span></p><p className="text-[13px] text-gray-500">Booking window: {startDate} → {endDate}. Browse creators whenever you are ready.</p></div></div>
                <div className="mt-4 flex gap-3"><a href="#marketplace" className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4fd7]">Open marketplace →</a><a href="#campaigns" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800">View campaigns</a></div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-cover bg-center p-10" style={CLOUD}>
      <button onClick={() => { window.location.hash = "campaigns"; }} className="mb-6 text-sm text-gray-500 hover:text-gray-800">‹ Back</button>
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 font-[family-name:var(--font-jakarta)] text-[40px] font-bold tracking-[-0.03em] text-gray-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/naano/app/logo.svg" alt="" className="h-9 w-9" />How do you want to launch your campaign?
        </h1>
        <p className="mt-3 text-[17px] text-gray-500">Choose your method. You can change everything before launch.</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
        <MethodCard badge="Today · 14:30 · 15 min" title="Launch free with the Naano team" desc="A campaign manager turns your selection into a ready-to-launch campaign. You validate, they handle the rest." cta="Book my onboarding →" primary><span className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl">🧑‍💼</span></MethodCard>
        <div onClick={() => setMode("ai")} className="cursor-pointer">
          <MethodCard badge="6 questions · 2 min" title="Create with AI" desc="Answer 6 quick questions and Nao prepares a fully editable brief." cta="Create with AI">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/naano/app/logo.svg" alt="" className="h-12 w-12" />
          </MethodCard>
        </div>
        <MethodCard badge="1 min" title="Start from your link" desc="Paste an influence campaign you already ran: Naano reuses the brief and structure." cta="Start from my link"><span className="rounded-lg bg-white px-3 py-2 text-sm text-gray-500 shadow-sm">🔗 notion.site/brief…</span></MethodCard>
      </div>
    </div>
  );
}
