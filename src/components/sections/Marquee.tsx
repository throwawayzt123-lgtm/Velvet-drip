"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { TICKER } from "@/lib/site";

/**
 * The endless credits band. It runs on its own clock, then leans into the
 * direction you are scrolling — a small trick that makes the whole page feel
 * connected to the wheel.
 */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el || prefersReducedMotion()) return;

      /* The track holds the list twice; wrap at the half-way mark. */
      const half = el.scrollWidth / 2;

      const loop = gsap.to(el, {
        x: `-=${half}`,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => (parseFloat(x) % half).toString()),
        },
      });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 5, Math.abs(self.getVelocity()) / 700);
          gsap.to(loop, {
            timeScale: self.direction === 1 ? boost : -boost,
            duration: 0.5,
            overwrite: true,
          });
        },
      });
    },
    { scope: root },
  );

  const row = [...TICKER, ...TICKER];

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y border-bark/60 bg-mocha py-7 max-sm:py-5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-mocha to-transparent max-sm:w-16"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-mocha to-transparent max-sm:w-16"
      />

      <div ref={track} className="flex w-max items-center whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-9 font-display text-[1.55rem] italic text-primary/90 max-sm:px-5 max-sm:text-lg">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-primary/45" />
          </span>
        ))}
      </div>
    </div>
  );
}
