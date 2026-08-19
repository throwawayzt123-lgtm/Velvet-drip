"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsap";
import Eyebrow from "@/components/ui/Eyebrow";
import { ORIGINS } from "@/lib/site";

/** A dark parallax band that lets the page breathe between the busy sections. */
export default function Origins() {
  const root = useRef<HTMLElement>(null);
  const quote = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      /* The quote lights up word by word as it crosses the viewport. */
      const split = new SplitText(quote.current, { type: "words" });

      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: quote.current,
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.7,
          },
        },
      );

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="grain relative flex min-h-[82vh] items-center overflow-hidden bg-ink py-32 max-lg:py-24 max-sm:min-h-0 max-sm:py-20"
    >
      {/* Parallax ground */}
      <div aria-hidden className="absolute inset-0 -top-[12%] h-[124%]" data-speed="0.8">
        <Image
          src="/images/story/beans-slate.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-ink/82" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent_0%,rgb(8_5_3/0.8)_100%)]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
        <Eyebrow align="center">Direct Trade · Four Countries</Eyebrow>

        <p
          ref={quote}
          className="mx-auto mt-12 max-w-[22ch] text-center font-display text-[clamp(2rem,4.6vw,4.4rem)] font-light italic leading-[1.12] text-cream max-sm:mt-8"
        >
          We know every farm by name, and every farmer knows ours.
        </p>

        <div
          data-reveal-group
          className="mt-20 grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-primary/15 bg-primary/15 max-lg:grid-cols-2 max-sm:mt-14 max-sm:grid-cols-1"
        >
          {ORIGINS.map((o) => (
            <div
              key={o.country}
              data-reveal-item
              className="group bg-espresso/90 p-8 backdrop-blur-sm transition-colors duration-500 hover:bg-mocha max-sm:p-6"
            >
              <p className="font-display text-3xl font-light text-cream transition-colors duration-500 group-hover:text-primary max-sm:text-2xl">
                {o.country}
              </p>
              <p className="mt-2 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-primary/80">
                {o.region}
              </p>
              <div className="mt-6 space-y-2 border-t border-bark/70 pt-5">
                <p className="flex justify-between text-[0.78rem] text-muted">
                  <span>Altitude</span>
                  <span className="text-sand">{o.altitude}</span>
                </p>
                <p className="flex justify-between text-[0.78rem] text-muted">
                  <span>Process</span>
                  <span className="text-sand">{o.process}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
