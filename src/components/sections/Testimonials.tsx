"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Eyebrow from "@/components/ui/Eyebrow";
import { TESTIMONIALS } from "@/lib/site";

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const slide = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  /* Auto-advance, paused while the pointer rests on the card. */
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      6500,
    );
    return () => clearInterval(id);
  }, [paused]);

  useGSAP(
    () => {
      if (!slide.current || prefersReducedMotion()) return;
      gsap.fromTo(
        slide.current.children,
        { y: 26, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.07,
        },
      );
    },
    { dependencies: [index] },
  );

  const t = TESTIMONIALS[index];

  return (
    <section
      ref={root}
      className="grain relative overflow-hidden bg-ink py-36 max-lg:py-28 max-sm:py-20"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-[1100px] px-12 text-center max-lg:px-8 max-sm:px-5">
        <Eyebrow align="center">Kind Words</Eyebrow>

        {/* Oversized quotation mark */}
        <p
          aria-hidden
          data-reveal="fade"
          className="mt-10 select-none font-display text-[7rem] leading-[0.4] text-primary/25 max-sm:text-[5rem]"
        >
          &ldquo;
        </p>

        <div
          ref={slide}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-10 max-sm:mt-8"
        >
          <blockquote className="mx-auto max-w-[26ch] font-display text-[clamp(1.6rem,3.1vw,2.9rem)] font-light italic leading-[1.28] text-cream">
            {t.quote}
          </blockquote>

          <div className="mt-10 flex flex-col items-center gap-1 max-sm:mt-8">
            <span className="rule-gold mb-6 w-16" />
            <p className="font-sans text-[0.8rem] uppercase tracking-[0.22em] text-primary">
              {t.name}
            </p>
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted">
              {t.role}
            </p>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center gap-3">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name}
              aria-label={`Show review ${i + 1}`}
              onClick={() => setIndex(i)}
              /* Fixed width scaled on the x-axis rather than an animated
                 `width`: width cannot be composited, so the browser relayouts
                 every frame and Lighthouse flags it. transform + colour are
                 both compositor-friendly. */
              className={`h-1 w-12 origin-left rounded-full transition-[transform,background-color] duration-500 ease-[var(--ease-silk)] ${
                i === index
                  ? "scale-x-100 bg-primary"
                  : "scale-x-[0.42] bg-bark hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
