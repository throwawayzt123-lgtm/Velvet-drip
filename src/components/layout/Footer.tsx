"use client";

import { BRAND, NAV_LINKS } from "@/lib/site";
import { scrollToSection } from "@/lib/gsap";

const SOCIALS = ["Instagram", "Substack", "Pinterest", "LinkedIn"];

const COLUMNS = [
  {
    title: "Atelier",
    links: ["Our story", "The roastery", "Sourcing ethics", "Press"],
  },
  {
    title: "Shop",
    links: ["Subscriptions", "Whole bean", "Brew kit", "Gift cards"],
  },
];

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-espresso pt-28 max-sm:pt-20">
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-96 w-[80vw] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[110px]"
      />
      <div className="rule-gold absolute inset-x-0 top-0 opacity-50" />

      <div className="relative mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
        {/* ── Call to the counter ─────────────────────────────── */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-14 max-lg:grid-cols-2 max-lg:gap-10 max-sm:grid-cols-1">
          <div data-reveal="up">
            <p className="font-display text-4xl italic leading-tight text-cream max-sm:text-3xl">
              {BRAND.name}
            </p>
            <p className="mt-2 font-sans text-[0.6rem] uppercase tracking-[0.34em] text-primary">
              {BRAND.established}
            </p>
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-muted">
              A speciality coffee atelier built on direct trade, slow roasting
              and the belief that a good cup deserves an unhurried room.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} data-reveal="up">
              <p className="font-sans text-[0.62rem] uppercase tracking-[0.32em] text-primary">
                {col.title}
              </p>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-sand transition-colors duration-300 hover:text-primary"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div data-reveal="up">
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.32em] text-primary">
              Navigate
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(l.href);
                    }}
                    className="text-sm text-sand transition-colors duration-300 hover:text-primary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-sand">{BRAND.email}</p>
            <p className="text-sm text-sand">{BRAND.phone}</p>
          </div>
        </div>

        {/* ── Oversized wordmark ──────────────────────────────── */}
        <div className="mt-20 max-sm:mt-14" data-reveal="fade">
          <p className="text-gilded select-none whitespace-nowrap text-center font-display text-[clamp(3.5rem,15vw,15rem)] font-light leading-[0.8] tracking-tight">
            {BRAND.name.toUpperCase()}
          </p>
        </div>

        {/* ── Fine print ──────────────────────────────────────── */}
        <div className="mt-12 flex items-center justify-between border-t border-bark/60 py-8 max-md:flex-col max-md:gap-5 max-sm:mt-8">
          <p className="font-sans text-[0.68rem] tracking-[0.14em] text-muted">
            © {new Date().getFullYear()} {BRAND.name} {BRAND.tagline}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-7 max-sm:flex-wrap max-sm:justify-center max-sm:gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-sand transition-colors duration-300 hover:text-primary"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
