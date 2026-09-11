"use client";

import { useEffect } from "react";
import { NaanoNav } from "./NaanoNav";
import { NaanoHero } from "./NaanoHero";
import { NaanoHeroQuote } from "./NaanoHeroQuote";
import { NaanoMarketplace } from "./NaanoMarketplace";
import { NaanoJourney } from "./NaanoJourney";
import { NaanoTestimonials } from "./NaanoTestimonials";
import { NaanoResults } from "./NaanoResults";
import { NaanoPricing } from "./NaanoPricing";
import { NaanoFaq } from "./NaanoFaq";
import { NaanoBookCall } from "./NaanoBookCall";
import { NaanoFooter } from "./NaanoFooter";

const DESIGN_W = 1672;

export function NaanoLanding() {
  useEffect(() => {
    const root = document.documentElement;

    // --- Page zoom (fit the 1672px design group to the viewport) ---
    const applyZoom = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Width-based fit only (matches the source): the 1672px design group is zoomed to
      // exactly fill the viewport width, so it is always full-bleed with no side gutters.
      // Vertical fit is handled independently via --hero-h. (≤1023px CSS resets zoom to 1.)
      const z = Math.max(0.5, vw / DESIGN_W);
      root.style.setProperty("--page-zoom", String(z));
      // Hero design height so the zoomed hero fills the viewport height: rendered = heroH * z ≈ vh.
      const heroH = Math.max(760, vh / z);
      root.style.setProperty("--hero-h", `${heroH}px`);
    };
    applyZoom();
    window.addEventListener("resize", applyZoom);

    // --- Reveal-on-scroll (.rv -> .rv-in) ---
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("rv-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add("rv-in"));
    } else {
      revealEls.forEach((el) => io.observe(el));
    }

    // --- Nav surface toggle (transparent over hero -> glass on page) ---
    const nav = document.getElementById("naano-nav");
    const hero = document.querySelector<HTMLElement>(".lp-canvas");
    const updateSurface = () => {
      if (!nav) return;
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      nav.setAttribute("data-surface", heroBottom <= 70 ? "page" : "hero");
    };
    updateSurface();
    window.addEventListener("scroll", updateSurface, { passive: true });

    // --- Video proof: click-to-play ---
    const onVideoClick = (ev: Event) => {
      const target = ev.target as HTMLElement;
      const container = target.closest<HTMLElement>(".lp-proof-video");
      if (!container) return;
      const video = container.querySelector("video");
      if (!video) return;
      if (video.paused) {
        video.controls = true;
        void video.play();
        container.querySelectorAll<HTMLElement>(":scope > :not(video)").forEach((el) => {
          el.style.display = "none";
        });
      }
    };
    document.addEventListener("click", onVideoClick);

    return () => {
      window.removeEventListener("resize", applyZoom);
      window.removeEventListener("scroll", updateSurface);
      document.removeEventListener("click", onVideoClick);
      io.disconnect();
    };
  }, []);

  return (
    <main className="naano-lp">
      <NaanoNav />
      <div>
        <div id="naano-scale">
          <NaanoHero />
          <NaanoHeroQuote />
          <NaanoMarketplace />
          <NaanoJourney />
        </div>
        <NaanoTestimonials />
        <NaanoResults />
        <NaanoPricing />
        <NaanoFaq />
        <NaanoBookCall />
        <NaanoFooter />
      </div>
    </main>
  );
}
