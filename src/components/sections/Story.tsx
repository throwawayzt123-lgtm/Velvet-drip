"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { useLazyMotion } from "@/lib/useLazyMotion";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
import { STATS } from "@/lib/site";

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const seal = useRef<HTMLDivElement>(null);

  const ready = useLazyMotion(root);

  useGSAP(
    () => {
      if (!ready) return;
      if (prefersReducedMotion()) return;

      /* Line-by-line rise. Splitting to words would strip the background-clip
         off the gilded <em>, so lines it is. */
      const split = new SplitText(heading.current, {
        type: "lines",
        mask: "lines",
      });

      gsap.from(split.lines, {
        yPercent: 118,
        opacity: 0,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: heading.current, start: "top 85%", once: true },
      });

      /* The wax seal turns slowly for the whole length of the section. */
      gsap.to(seal.current, {
        rotate: 220,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* Counting the ledger figures up as they arrive. */
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = parseFloat(el.dataset.count || "0");
        const suffix = el.dataset.countSuffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString() + suffix;
          },
        });
      });

      ScrollTrigger.refresh();
      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="story"
      className="grain relative overflow-hidden bg-espresso py-36 max-lg:py-28 max-sm:py-20"
    >
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-primary/[0.06] blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-2 items-center gap-24 px-12 max-xl:gap-16 max-lg:grid-cols-1 max-lg:gap-28 max-lg:px-8 max-sm:gap-24 max-sm:px-5">
        {/* ── The image stack ─────────────────────────────────── */}
        <div className="stage relative">
          <div
            data-speed="1.05"
            data-reveal="left"
            className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-[2rem] border border-primary/15 shadow-[var(--shadow-float)] [transform:rotateY(6deg)_rotateX(1deg)] max-lg:w-[74%] max-sm:w-full max-sm:[transform:none]"
          >
            <Image
              src="/images/story/beans-sack.jpg"
              alt="A hessian sack of freshly roasted single-origin beans"
              fill
              sizes="(max-width: 1024px) 80vw, 34vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>

          <div
            data-speed="0.9"
            data-reveal="scale"
            className="absolute -bottom-14 right-0 aspect-square w-[48%] overflow-hidden rounded-[1.5rem] border border-primary/20 shadow-[var(--shadow-float)] [transform:rotateY(-8deg)] max-sm:-bottom-8 max-sm:w-[52%] max-sm:[transform:none]"
          >
            <Image
              src="/images/story/pour-over.jpg"
              alt="A barista pouring a hand filter behind the bar"
              fill
              sizes="(max-width: 1024px) 45vw, 18vw"
              className="object-cover"
            />
          </div>

          {/* Rotating gold seal */}
          <div
            ref={seal}
            aria-hidden
            className="absolute -top-10 left-[64%] h-32 w-32 max-lg:h-24 max-lg:w-24 max-sm:hidden"
          >
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path
                  id="seal-path"
                  d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
                  fill="none"
                />
              </defs>
              <circle
                cx="50"
                cy="50"
                r="27"
                fill="none"
                stroke="var(--color-primary)"
                strokeOpacity="0.3"
              />
              <text
                fill="var(--color-primary)"
                fontSize="8"
                letterSpacing="2.15"
                className="font-sans uppercase"
              >
                <textPath href="#seal-path" startOffset="0">
                  · Hand roasted · Small batch ·
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* ── The words ───────────────────────────────────────── */}
        <div>
          <Eyebrow>Our Story</Eyebrow>

          <h2
            ref={heading}
            className="mt-7 font-display text-[clamp(2.4rem,4.4vw,4.4rem)] font-medium leading-[1.03] tracking-[-0.015em] text-cream"
          >
            Crafted for the <em className="text-gilded italic">quiet</em> hours
            between everything else.
          </h2>

          <p
            data-reveal="up"
            className="mt-8 max-w-[54ch] leading-relaxed text-sand max-sm:mt-6 max-sm:text-[0.95rem]"
          >
            Aurélia began in a nine-square-metre room off Marlowe Lane with one
            second-hand lever machine and a stubborn idea: that coffee is a
            craft, not a queue. Nine years on, we still cup every lot blind and
            still refuse to rush a pour.
          </p>

          <p
            data-reveal="up"
            data-reveal-delay="0.08"
            className="mt-5 max-w-[54ch] leading-relaxed text-muted max-sm:text-[0.92rem]"
          >
            We buy directly from eleven farms across four countries, paying two
            to three times the commodity rate, and roast every morning before
            the doors open — so what reaches your table was still green
            yesterday.
          </p>

          {/* Ledger */}
          <div
            data-reveal-group
            className="mt-12 grid grid-cols-4 gap-6 border-y border-bark/70 py-8 max-sm:mt-8 max-sm:grid-cols-2 max-sm:gap-8"
          >
            {STATS.map((s) => {
              const numeric = s.value.replace(/[^0-9]/g, "");
              const suffix = s.value.replace(/[0-9]/g, "");
              return (
                <div key={s.label} data-reveal-item>
                  <p className="text-gilded font-display text-4xl font-medium leading-none max-sm:text-3xl">
                    <span data-count={numeric} data-count-suffix={suffix}>
                      {s.value}
                    </span>
                  </p>
                  <p className="mt-3 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-muted">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div data-reveal="up" className="mt-11 max-sm:mt-8">
            <GoldButton href="#craft" variant="ghost">
              See how we work
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}
