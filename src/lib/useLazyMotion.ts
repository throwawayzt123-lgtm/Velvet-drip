"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gates a section's GSAP setup until it is near the viewport.
 *
 * `useGSAP` runs on `useLayoutEffect`, so every section building its timeline
 * at mount means all of them execute in one synchronous block during
 * hydration — SplitText line measurement, ScrollTrigger creation and the
 * reflows each of those forces. That block was the bulk of the page's total
 * blocking time. Deferring the below-the-fold sections spreads the work and
 * keeps it off the critical path, while the generous root margin means the
 * timeline is always ready long before it is scrolled into view.
 */
export function useLazyMotion<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
) {
  /* Environments without IntersectionObserver start armed, so the gate is a
     no-op there rather than a synchronous setState during the effect. */
  const [active, setActive] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const armed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || armed.current || typeof IntersectionObserver === "undefined") {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          armed.current = true;
          setActive(true);
          io.disconnect();
        }
      },
      /* Two viewports of lead time — well before anything is visible. */
      { rootMargin: "200% 0px 200% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return active;
}
