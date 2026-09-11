"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What is Naano?",
    a: "Naano is a B2B LinkedIn creator marketplace: companies discover and book vetted creators for sponsored LinkedIn campaigns, each at a fixed price per post set by the creator. The marketplace spans creators from niche voices with around 1,000 followers to established B2B creators with audiences of several hundred thousand.",
  },
  {
    q: "How does Naano find the right creators?",
    a: "Our matching engine scores every creator on audience fit, category relevance and engagement quality across LinkedIn, X and YouTube, so you rank creators by who actually reaches your buyers, not by follower count.",
  },
  {
    q: "Which networks do you support?",
    a: "LinkedIn, X and YouTube today, with more on the way. You can compare creators and track performance across every network in one place.",
  },
  {
    q: "How does per-post pricing work?",
    a: "Campaigns start from €20 per published post, you only pay for posts that go live, with no retainer. Prefer a hands-off setup? Done for you adds our team executing everything end to end.",
  },
  {
    q: "How does attribution work?",
    a: "Naano places a tracking pixel at every stage of the funnel, so each click, lead, pipeline and revenue is tied back to the exact creator and post that drove it.",
  },
  {
    q: "Do you handle creator payouts?",
    a: "Yes. Approve content and pay every creator in one click, securely via Stripe Connect, invoices and approvals are handled for you.",
  },
  {
    q: "What's the difference between Free and Done for you?",
    a: "Free gives your team the platform to source creators and run simple campaigns yourselves. Done for you adds hands-on execution by the Naano team, sourcing, briefs, reporting and optimisation.",
  },
  {
    q: "Can I upgrade or cancel anytime?",
    a: "Absolutely. Plans are month-to-month, you can upgrade, downgrade or cancel whenever you like.",
  },
];

export function NaanoFaq() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div
      id="faq"
      className="lp-system-section lp-system-faq"
      data-screen-label="FAQ"
    >
      <div className="lp-faq-layout">
        <div className="lp-faq-intro rv rv-d0">
          <h2
            style={{
              margin: 0,
              textAlign: "center",
              fontSize: "52px",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "var(--nn-ink, #111318)",
            }}
          >
            Frequently asked questions<span>.</span>
          </h2>
          <p
            style={{
              margin: "16px 0 0 0",
              textAlign: "center",
              fontSize: "19px",
              lineHeight: 1.5,
              color: "#55575E",
            }}
          >
            Everything you need to know before getting started.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "28px",
              fontSize: "15px",
              color: "#70747b",
            }}
          >
            <span>Still have questions?</span>
            <a
              href="/book"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                textDecoration: "none",
                color: "var(--nn-ink, #111318)",
                fontWeight: 650,
              }}
            >
              Talk to our team
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <polyline points="13 5 20 12 13 19" />
              </svg>
            </a>
          </div>
        </div>

        <div
          className="lp-faq-shell rv rv-d1"
          style={{
            maxWidth: "860px",
            margin: "60px auto 0 auto",
            padding: "8px 36px",
            background: "var(--nn-glass-strong, rgba(255,255,255,.88))",
            border: "1px solid var(--nn-glass-border, rgba(255,255,255,.92))",
            borderRadius: "28px",
            boxShadow: "0 28px 80px -56px rgba(56,96,128,.4)",
            backdropFilter: "blur(18px)",
          }}
        >
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} style={{ borderTop: "1px solid #ECEAE6" }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "24px",
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    padding: "30px 0",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      color: "#17181C",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--nn-ink, #111318)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                        transition: "transform 0.28s cubic-bezier(0.22,0.61,0.36,1)",
                      }}
                    >
                      <polyline points="6 15 12 9 18 15" />
                    </svg>
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.32s cubic-bezier(0.22,0.61,0.36,1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        margin: 0,
                        padding: "0 60px 32px 0",
                        fontSize: "16.5px",
                        lineHeight: 1.65,
                        color: "#6B6D74",
                        maxWidth: "680px",
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
