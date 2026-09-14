"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  prefersReducedMotion,
} from "@/lib/gsap";

type RevealKind = "up" | "fade" | "scale" | "mask" | "left" | "right";

const REVEALS: Record<RevealKind, gsap.TweenVars> = {
  up: { y: 56, opacity: 0 },
  fade: { opacity: 0 },
  scale: { scale: 0.9, opacity: 0, transformOrigin: "50% 60%" },
  mask: { yPercent: 110, opacity: 0 },
  left: { x: -70, opacity: 0 },
  right: { x: 70, opacity: 0 },
};

/**
 * Wraps the whole page:
 *  · builds the ScrollSmoother rig (and its `data-speed` parallax engine)
 *  · runs the site-wide `[data-reveal]` scroll-in choreography
 *  · drives the gold progress bar pinned to the top of the viewport
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      document.documentElement.classList.add("js-anim");

      if (reduced) {
        gsap.set("[data-reveal]", { opacity: 1, clearProps: "all" });
        return;
      }

      /* ── Inertial scrolling — desktop only ──────────────────────────
         ScrollSmoother works by transforming #smooth-content every frame.
         That content is the whole page (~700 elements, ~17,000px tall), which
         a desktop GPU shrugs off but a phone does not: it turns every scroll
         frame into a full-page composite and is the main reason scrolling
         drags on mobile. Phones get native scrolling, which is hardware
         accelerated and already has momentum.

         ScrollTrigger does not need the smoother — without it, triggers use
         the viewport as scroller and pin via position:fixed, which is both
         correct and cheaper. `data-speed` parallax is a smoother effect, so it
         simply doesn't apply on mobile; elements sit at their natural
         position, which is the right trade for smooth scrolling. */
      const touch =
        ScrollTrigger.isTouch === 1 ||
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;

      const smoother = touch
        ? null
        : ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1.15,
            effects: true, // enables data-speed / data-lag parallax
            normalizeScroll: false,
            ignoreMobileResize: true,
          });

      /* ── Site-wide reveal choreography ──────────────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const kind = (el.dataset.reveal || "up") as RevealKind;
        const from = REVEALS[kind] ?? REVEALS.up;
        const delay = parseFloat(el.dataset.revealDelay || "0");

        gsap.fromTo(
          el,
          { ...from },
          {
            x: 0,
            y: 0,
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      /* ── Staggered groups: children of [data-reveal-group] ──────── */
      gsap.utils
        .toArray<HTMLElement>("[data-reveal-group]")
        .forEach((group) => {
          const items = gsap.utils.toArray<HTMLElement>(
            "[data-reveal-item]",
            group,
          );
          if (!items.length) return;

          gsap.fromTo(
            items,
            { y: 64, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              stagger: 0.09,
              scrollTrigger: { trigger: group, start: "top 82%", once: true },
            },
          );
        });

      /* ── Reading-progress bar ───────────────────────────────────── */
      if (progress.current) {
        gsap.to(progress.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
        });
      }

      /* Web fonts change line heights; re-measure once they land. */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => smoother?.kill();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div
        ref={progress}
        aria-hidden
        className="fixed inset-x-0 top-0 z-[90] h-px origin-left scale-x-0 bg-gradient-to-r from-primary-deep via-primary to-primary-soft"
      />
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
    </div>
  );
}
