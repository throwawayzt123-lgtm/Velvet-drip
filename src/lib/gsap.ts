"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

/* Registering once, from a single module, keeps plugin setup out of every
   component and avoids duplicate registration during Fast Refresh. */
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

/** Honour the OS "reduce motion" setting before we animate anything. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText };

/**
 * Anchor navigation that works with the smoother's transformed content.
 * Falls back to native scrolling when the rig is absent (reduced motion).
 */
export function scrollToSection(href: string) {
  if (!href.startsWith("#")) return;
  const target = document.querySelector<HTMLElement>(href);
  if (!target) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, true, "top 84px");
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
