"use client";

import { useRef, useState } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  scrollToSection,
} from "@/lib/gsap";
import { BRAND, NAV_LINKS } from "@/lib/site";

function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="font-display text-[1.55rem] italic tracking-wide text-cream max-sm:text-[1.35rem]">
        {BRAND.name}
      </span>
      <span className="mt-1 font-sans text-[0.5rem] uppercase tracking-[0.36em] text-primary/70 max-sm:text-[0.45rem]">
        {BRAND.established}
      </span>
    </span>
  );
}

export default function Header() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  /* Glass-morph the bar once the hero starts leaving, and tuck the header
     away while scrolling down so the reading column stays clear. */
  useGSAP(
    () => {
      const el = bar.current;
      if (!el) return;

      const morph = gsap.to(el, {
        backgroundColor: "rgb(18 11 7 / 0.72)",
        borderColor: "rgb(228 199 159 / 0.16)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 22px 48px -28px rgb(0 0 0 / 0.9)",
        paddingTop: "0.7rem",
        paddingBottom: "0.7rem",
        duration: 0.5,
        ease: "power2.out",
        paused: true,
      });

      ScrollTrigger.create({
        start: 40,
        end: "max",
        onToggle: (self) => (self.isActive ? morph.play() : morph.reverse()),
        onUpdate: (self) => {
          if (open) return;
          gsap.to(root.current, {
            yPercent: self.direction === 1 && self.scroll() > 620 ? -140 : 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });
    },
    { scope: root, dependencies: [open] },
  );

  /* Full-bleed mobile menu. */
  useGSAP(
    () => {
      const el = overlay.current;
      if (!el) return;
      const items = el.querySelectorAll("[data-m-item]");

      /* Freeze the page behind the sheet. */
      ScrollSmoother.get()?.paused(open);

      if (open) {
        gsap.set(el, { display: "flex" });
        gsap
          .timeline()
          .fromTo(
            el,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.7,
              ease: "power4.inOut",
            },
          )
          .fromTo(
            items,
            { y: 44, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" },
            "-=0.28",
          );
      } else {
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => gsap.set(el, { display: "none" }),
        });
      }
    },
    { dependencies: [open] },
  );

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    /* Release the freeze before we ask the smoother to travel. */
    ScrollSmoother.get()?.paused(false);
    scrollToSection(href);
  };

  return (
    <>
      {/* The overlay lives OUTSIDE <header>: GSAP puts a transform on the
          header to tuck it away on scroll, and a transformed ancestor becomes
          the containing block for `position: fixed` children — which would
          clip this to the height of the bar. */}
      <div
        ref={overlay}
        style={{ display: "none" }}
        className="grain fixed inset-0 z-[85] flex-col justify-center bg-espresso px-8 max-sm:px-6"
      >
        <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-primary/10 blur-[90px]" />
        <nav className="relative flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              data-m-item
              href={link.href}
              onClick={(e) => go(e, link.href)}
              className="group flex items-baseline gap-5 border-b border-bark/50 py-5 max-sm:py-4"
            >
              <span className="font-sans text-[0.6rem] tracking-[0.3em] text-primary/60">
                0{i + 1}
              </span>
              <span className="font-display text-5xl font-light text-cream transition-colors duration-300 group-hover:text-primary max-sm:text-4xl">
                {link.label}
              </span>
            </a>
          ))}
        </nav>
        <div data-m-item className="relative mt-10 space-y-1">
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-primary">
            Visit the atelier
          </p>
          <p className="font-display text-xl italic text-sand">{BRAND.address}</p>
        </div>
      </div>

      <header ref={root} className="fixed inset-x-0 top-0 z-[90]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-5 max-lg:px-4 max-sm:px-3 max-sm:pt-3">
        <div
          ref={bar}
          className="flex items-center justify-between rounded-full border border-transparent px-7 py-4 max-lg:px-5 max-sm:px-4 max-sm:py-3"
        >
          <a href="#home" onClick={(e) => go(e, "#home")} className="shrink-0">
            <Wordmark />
          </a>

          {/* Desktop navigation */}
          <nav className="flex items-center gap-9 max-lg:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="group relative font-sans text-[0.78rem] uppercase tracking-[0.18em] text-sand transition-colors duration-300 hover:text-cream"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-500 ease-[var(--ease-silk)] group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-primary/15 text-sand transition-all duration-300 hover:border-primary/50 hover:text-primary max-sm:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.6-3.6" strokeLinecap="round" />
              </svg>
            </button>

            <button
              aria-label="Order bag"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-primary/15 text-sand transition-all duration-300 hover:border-primary/50 hover:text-primary max-sm:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
                <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" strokeLinecap="round" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[0.55rem] text-ink">
                2
              </span>
            </button>

            <a
              href="#visit"
              onClick={(e) => go(e, "#visit")}
              className="rounded-full bg-gradient-to-b from-primary-soft via-primary to-primary-deep px-6 py-3 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] transition-transform duration-300 hover:-translate-y-0.5 max-lg:hidden"
            >
              Reserve
            </a>

            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="hidden h-10 w-10 place-items-center rounded-full border border-primary/25 text-primary max-lg:grid"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

    </header>
    </>
  );
}
