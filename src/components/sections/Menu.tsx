"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useLazyMotion } from "@/lib/useLazyMotion";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
import TiltCard from "@/components/ui/TiltCard";
import { MENU, MENU_CATEGORIES, type MenuCategory } from "@/lib/site";

export default function Menu() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<MenuCategory | "All">("All");

  const items = MENU.filter((m) => filter === "All" || m.category === filter);

  /* Cards fly in on first sight, and re-deal whenever the filter changes. */
  const ready = useLazyMotion(root);

  useGSAP(
    () => {
      if (!ready) return;
      if (!grid.current || prefersReducedMotion()) return;
      const cards = grid.current.querySelectorAll("[data-card]");

      gsap.fromTo(
        cards,
        { y: 70, opacity: 0, rotateX: -12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: grid.current, start: "top 85%" },
        },
      );
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [filter, ready] },
  );

  return (
    <section
      ref={root}
      id="menu"
      className="grain relative overflow-hidden bg-ink py-36 max-lg:py-28 max-sm:py-20"
    >
      <div
        aria-hidden
        className="absolute right-0 top-1/4 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-primary/[0.05] blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-end justify-between gap-12 max-lg:flex-col max-lg:items-start max-lg:gap-8">
          <div>
            <Eyebrow>The Menu</Eyebrow>
            <h2
              data-reveal="up"
              className="mt-7 max-w-[18ch] font-display text-[clamp(2.4rem,4.6vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.015em] text-cream"
            >
              Signature pours, <em className="text-gilded italic">plated</em>{" "}
              with care.
            </h2>
          </div>
          <p
            data-reveal="up"
            className="max-w-[38ch] pb-3 leading-relaxed text-muted max-sm:text-[0.93rem]"
          >
            A short list, changed with the seasons. Everything below is roasted
            in-house and priced to pay our growers properly.
          </p>
        </div>

        {/* ── Filters ─────────────────────────────────────────── */}
        <div
          data-reveal="fade"
          className="mt-14 flex flex-wrap items-center gap-3 border-b border-bark/60 pb-6 max-sm:mt-10 max-sm:gap-2"
        >
          {MENU_CATEGORIES.map((c) => {
            const active = c === filter;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-6 py-2.5 font-sans text-[0.68rem] uppercase tracking-[0.2em] transition-all duration-400 ease-[var(--ease-silk)] max-sm:px-4 max-sm:py-2 max-sm:text-[0.6rem] ${
                  active
                    ? "bg-gradient-to-b from-primary-soft via-primary to-primary-deep text-ink shadow-[0_10px_28px_-12px_rgb(228_199_159/0.6)]"
                    : "border border-primary/20 text-sand hover:border-primary/50 hover:text-primary"
                }`}
              >
                {c}
              </button>
            );
          })}
          <span className="ml-auto font-sans text-[0.65rem] uppercase tracking-[0.24em] text-muted max-sm:ml-0 max-sm:mt-1 max-sm:w-full">
            {items.length} items
          </span>
        </div>

        {/* ── Cards ───────────────────────────────────────────── */}
        <div
          ref={grid}
          className="mt-14 grid grid-cols-3 gap-8 max-xl:gap-6 max-lg:grid-cols-2 max-sm:mt-10 max-sm:grid-cols-1 max-sm:gap-6"
        >
          {items.map((item) => (
            <div key={item.id} data-card>
              <TiltCard max={7} lift={30}>
                <article className="pane relative flex h-full flex-col overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)] transition-[border-color,box-shadow] duration-500 hover:border-primary/40 hover:shadow-[var(--shadow-float),var(--shadow-gold)]">
                  {/* Photograph */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      className="object-cover transition-transform duration-[900ms] ease-[var(--ease-silk)] group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/25 to-transparent" />

                    <span className="absolute left-5 top-5 rounded-full border border-primary/25 bg-ink/60 px-3.5 py-1.5 font-sans text-[0.56rem] uppercase tracking-[0.22em] text-primary backdrop-blur-md">
                      {item.category}
                    </span>

                    <span className="absolute right-5 top-5 rounded-full bg-gradient-to-b from-primary-soft via-primary to-primary-deep px-4 py-1.5 font-sans text-[0.72rem] tracking-[0.08em] text-ink shadow-[0_8px_20px_-8px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.55)]">
                      {item.price}
                    </span>
                  </div>

                  {/* Copy */}
                  <div className="flex flex-1 flex-col p-7 pt-6 max-sm:p-6">
                    <h3 className="font-display text-[1.75rem] font-medium leading-tight text-cream transition-colors duration-400 group-hover:text-primary">
                      {item.name}
                    </h3>
                    <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted">
                      {item.blurb}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.notes.map((n) => (
                        <span
                          key={n}
                          className="rounded-full border border-bark px-3 py-1 font-sans text-[0.6rem] uppercase tracking-[0.16em] text-sand"
                        >
                          {n}
                        </span>
                      ))}
                    </div>

                    <button className="mt-7 flex items-center justify-between border-t border-bark/70 pt-5 font-sans text-[0.66rem] uppercase tracking-[0.24em] text-primary">
                      Add to order
                      <span className="grid h-8 w-8 place-items-center rounded-full border border-primary/30 transition-all duration-400 group-hover:bg-primary group-hover:text-ink">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </article>
              </TiltCard>
            </div>
          ))}
        </div>

        <div data-reveal="up" className="mt-16 flex justify-center max-sm:mt-12">
          <GoldButton href="#visit">Download the full card</GoldButton>
        </div>
      </div>
    </section>
  );
}
