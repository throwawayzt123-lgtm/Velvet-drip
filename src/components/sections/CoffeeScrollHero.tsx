"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from "@/lib/gsap";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
import { BRAND, COFFEE_SEQUENCE, HERO_BEATS, ORIGINS } from "@/lib/site";

const TOTAL = COFFEE_SEQUENCE.last - COFFEE_SEQUENCE.first + 1;

/** Parallel image requests. Enough to saturate the pipe, few enough to stay polite. */
const CONCURRENCY = 8;

/* Subscribing to the media query keeps the preference live if the visitor
   changes it mid-session, and avoids a setState-in-effect cascade. */
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const readMotion = () => window.matchMedia(MOTION_QUERY).matches;

/**
 * Scroll-scrubbed cinematic hero.
 *
 * The asset is a 240-frame image sequence rather than a video, so playback is
 * driven by painting decoded frames onto a canvas. That keeps the scrub
 * frame-accurate and avoids the seek latency and keyframe dependence of
 * `video.currentTime`, which is what makes video scrubbing feel rubbery.
 *
 * ScrollSmoother (installed globally in MotionProvider) already lerps the
 * scroll position *before* ScrollTrigger reads it, so this timeline uses
 * `scrub: true`. Adding scrub inertia on top would stack two smoothing passes
 * and visibly lag behind the wheel.
 */
export default function CoffeeScrollHero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const loaderBar = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);

  /* Frame store lives in refs — nothing here may trigger a React render. */
  const frames = useRef<HTMLImageElement[]>([]);
  const ready = useRef<boolean[]>([]);
  const painted = useRef(-1);

  const reduced = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  const [loaded, setLoaded] = useState(false);

  /** Paints a frame, falling back to the nearest one already decoded. */
  const paint = useCallback((index: number) => {
    const el = canvas.current;
    if (!el) return;

    let i = gsap.utils.clamp(0, TOTAL - 1, Math.round(index));
    if (!ready.current[i]) {
      let found = -1;
      for (let k = i; k >= 0; k--) if (ready.current[k]) { found = k; break; }
      if (found < 0) {
        for (let k = i + 1; k < TOTAL; k++) if (ready.current[k]) { found = k; break; }
      }
      if (found < 0) return;
      i = found;
    }
    if (i === painted.current) return;

    const ctx = el.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.drawImage(frames.current[i], 0, 0, el.width, el.height);
    painted.current = i;
  }, []);

  /* ── Preload ───────────────────────────────────────────────────────────
     Frame 1 is fetched first and painted the moment it lands, so the café
     scene is on screen instead of an empty canvas. */
  useEffect(() => {
    /* Tracked locally so teardown never has to read a ref that may have moved
       on by the time cleanup runs. */
    const opened: HTMLImageElement[] = [];
    let cancelled = false;
    let cursor = 0;
    let done = 0;

    /* Halving the sequence on phones saves ~3 MB; the shorter mobile scroll
       distance means the dropped frames are never missed. */
    const step =
      typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
        ? 2
        : 1;

    const queue: number[] = [];
    for (let i = 0; i < TOTAL; i += step) queue.push(i);
    if (queue[queue.length - 1] !== TOTAL - 1) queue.push(TOTAL - 1);

    const next = () => {
      if (cancelled || cursor >= queue.length) return;
      const i = queue[cursor++];
      const img = new Image();
      img.decoding = "async";

      const settle = () => {
        if (cancelled) return;
        ready.current[i] = img.naturalWidth > 0;
        done += 1;
        const pct = done / queue.length;
        if (loaderBar.current) loaderBar.current.style.transform = `scaleX(${pct})`;
        if (ready.current[i] && painted.current < 0) paint(i);
        if (done === queue.length) setLoaded(true);
        next();
      };

      img.onload = settle;
      img.onerror = settle;
      img.src = COFFEE_SEQUENCE.path(COFFEE_SEQUENCE.first + i);
      frames.current[i] = img;
      opened.push(img);
    };

    for (let c = 0; c < CONCURRENCY; c++) next();

    return () => {
      cancelled = true;
      opened.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [paint]);

  /* Dismiss the loading veil once every frame is decoded. */
  useGSAP(
    () => {
      if (!loaded || !loader.current) return;
      gsap.to(loader.current, {
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { dependencies: [loaded] },
  );

  /* ── The scroll timeline ──────────────────────────────────────────────── */
  useGSAP(
    () => {
      /* `reduced` comes from a store that reports `false` during hydration to
         match the server render, so the media query is re-read here. Without
         this, a pinned trigger is briefly created for reduced-motion visitors
         and its pin transform survives the revert. */
      if (reduced || prefersReducedMotion()) return;

      /* Rebuilt per breakpoint: the portrait crop needs its own treatment, and
         matchMedia tears the old timeline down cleanly when you cross over. */
      const mm = gsap.matchMedia();

      mm.add(
        { phone: "(max-width: 640px)", wide: "(min-width: 641px)" },
        (ctx) => {
          const phone = Boolean(ctx.conditions?.phone);
          const playhead = { frame: 0 };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              /* Fixed pixel distance, NOT "bottom bottom".
                 When mobile browser chrome slides away, innerHeight grows and
                 an svh-sized section grows with it — by 3x the change, since
                 it is 300svh — while the pinned stage keeps its measured pixel
                 height. Deriving the end from the section therefore moved the
                 whole pin range mid-scroll and the page lurched. Pinning for a
                 distance that does not depend on the section's height keeps
                 the two in agreement. */
              end: () =>
                "+=" + Math.round(window.innerHeight * (phone ? 2 : 3.2)),
              pin: stage.current,
              pinSpacing: false, // the section already reserves the scroll length
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onRefresh: () => {
                painted.current = -1;
                paint(playhead.frame);
              },
            },
          });

          /* Frame playback occupies the whole timeline; beats ride on top. */
          tl.to(
            playhead,
            {
              frame: TOTAL - 1,
              duration: 1,
              onUpdate: () => paint(playhead.frame),
            },
            0,
          );

          /* Portrait shows only ~26% of a 16:9 frame's width, and the subject
             drifts left as the camera drops — from roughly 73% of the frame
             early on to 58% at the climax. Panning the crop with it keeps the
             cup and the pour centred instead of letting them slide out. */
          if (phone) {
            tl.fromTo(
              canvas.current,
              { objectPosition: "73% 50%" },
              {
                objectPosition: "58% 50%",
                duration: 0.3,
                ease: "power1.inOut",
              },
              0.2,
            );

            /* Hand the readable band from the top of the frame to the bottom,
               following the subject rather than covering it. */
            tl.to(
              "[data-scrim-intro]",
              { autoAlpha: 0, duration: 0.08, ease: "power1.in" },
              0.13,
            );
            tl.to(
              "[data-scrim-beats]",
              { autoAlpha: 1, duration: 0.08, ease: "power1.out" },
              0.19,
            );
          }

          /* Opening lockup clears out as the cup leaves the table. */
          tl.to("[data-beat='intro']", { autoAlpha: 0, y: -30, duration: 0.07 }, 0.14);

          HERO_BEATS.forEach((beat) => {
            const [inStart, inEnd, outStart, outEnd] = beat.window;
            const el = `[data-beat='${beat.id}']`;

            tl.fromTo(
              el,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, duration: inEnd - inStart, ease: "power2.out" },
              inStart,
            );
            if (outStart < 1) {
              tl.to(
                el,
                { autoAlpha: 0, y: -26, duration: outEnd - outStart, ease: "power2.in" },
                outStart,
              );
            }
          });

          /* A brand veil rises over the last stretch: it buys contrast for the
             closing line and hands off into the section below without a cut. */
          tl.fromTo(
            "[data-veil]",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.12, ease: "power1.in" },
            0.88,
          );

          /* Restrained entrance for the opening lockup, matching the home hero. */
          const split = new SplitText(heading.current, {
            type: "lines",
            mask: "lines",
          });

          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .from("[data-intro-eyebrow]", { y: 22, autoAlpha: 0, duration: 0.9 }, 0.15)
            .from(split.lines, { yPercent: 115, opacity: 0, duration: 1.2, stagger: 0.11 }, 0.3)
            .from("[data-intro-lede]", { y: 26, autoAlpha: 0, duration: 1 }, 0.8)
            .from("[data-intro-cta]", { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.09 }, 0.95)
            .from("[data-intro-meta]", { y: 18, autoAlpha: 0, duration: 0.9 }, 1.1);

          return () => split.revert();
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [reduced, paint] },
  );

  /* In reduced-motion the sequence is presented as a held frame, so park the
     canvas on the pour rather than the empty opening table. */
  useEffect(() => {
    if (reduced && loaded) paint(Math.round(TOTAL * 0.72));
  }, [reduced, loaded, paint]);

  const beatCopy = (beat: (typeof HERO_BEATS)[number], stacked: boolean) => (
    <>
      <Eyebrow reveal={false}>{beat.eyebrow}</Eyebrow>
      <h2
        className={`mt-6 font-display text-[clamp(2.2rem,4.4vw,4.4rem)] font-light leading-[1.04] tracking-[-0.015em] text-cream ${
          stacked ? "" : "drop-shadow-[0_4px_26px_rgb(8_5_3/0.95)]"
        }`}
      >
        {beat.title} <em className="text-gilded italic">{beat.titleAccent}</em>
        {beat.titleTail}
      </h2>
      {beat.body && (
        <p className="mt-6 max-w-[42ch] leading-relaxed text-sand max-sm:mt-4 max-sm:text-[0.94rem]">
          {beat.body}
        </p>
      )}
      {beat.id === "yours" && (
        <div className="mt-9 flex items-center gap-4 max-sm:mt-7 max-sm:gap-2.5">
          <GoldButton href="#menu">Explore Menu</GoldButton>
          <GoldButton href="#visit" variant="ghost">
            Get Delivery
          </GoldButton>
        </div>
      )}
    </>
  );

  return (
    <section
      ref={root}
      id="home"
      /* The tall track is what the pinned stage scrubs against. Phones get a
         shorter throw so the sequence does not overstay its welcome.
         `lvh` (large viewport height) is deliberate: it is the one viewport
         unit that does NOT change when mobile browser chrome slides in and
         out, so this track stays the same height as the pin distance measured
         above. `vh`/`svh` here caused the page to lurch on every chrome
         transition. The 1x stage height is added on top of the pin distance. */
      className={
        reduced
          ? "relative bg-ink"
          : "relative h-[420lvh] bg-ink max-lg:h-[420lvh] max-sm:h-[300lvh]"
      }
    >
      <div
        ref={stage}
        className="grain relative h-[100lvh] w-full overflow-hidden bg-ink"
      >
        {/* ── The sequence ────────────────────────────────────────────── */}
        <div className="absolute inset-0">
          <canvas
            ref={canvas}
            width={COFFEE_SEQUENCE.width}
            height={COFFEE_SEQUENCE.height}
            aria-label="A cup of coffee lifting from a café table and pouring toward the viewer"
            role="img"
            /* object-fit does the cover maths for us, and object-position keeps
               the cup — which sits centre-right — inside the crop. On phones
               the timeline pans this value as the subject drifts left. */
            className="h-full w-full object-cover object-[58%_50%] max-sm:object-[73%_50%]"
          />
        </div>

        {/* Readability scrims, using the same ink gradient device as the
            home hero. Kept light so the café lighting survives. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-ink/92 via-ink/45 to-transparent"
        />
        {/* Desktop reads left-to-right into the negative space. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-ink/72 via-ink/28 to-transparent max-sm:hidden"
        />

        {/* Portrait has no side room, and the subject moves: it sits low while
            the cup is on the table, then high once the camera drops. So the
            scrims trade places on the timeline rather than fighting for the
            same band. */}
        <div
          data-scrim-intro
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-[56%] bg-gradient-to-b from-ink via-ink/78 to-transparent max-sm:block"
        />
        <div
          data-scrim-beats
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[62%] bg-gradient-to-t from-ink via-ink/86 to-transparent opacity-0 max-sm:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink via-ink/45 to-transparent"
        />

        {/* Closing veil — rises only over the last 12% of the scroll. */}
        {!reduced && (
          <div
            data-veil
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-ink/48 opacity-0"
          />
        )}

        {/* ── Copy, held in the negative space on the left ─────────────── */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center max-sm:items-start max-sm:pt-24">
          <div className="mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
            {/* Opening lockup — the home hero's own content and hierarchy. */}
            <div
              data-beat="intro"
              className="pointer-events-auto max-w-[54ch] max-sm:max-w-none max-sm:text-center"
            >
              <div data-intro-eyebrow className="max-sm:justify-center">
                <Eyebrow reveal={false} className="max-sm:justify-center">
                  {BRAND.tagline} · Fitzrovia
                </Eyebrow>
              </div>

              <h1
                ref={heading}
                className="mt-8 max-w-[14ch] font-display text-[clamp(3rem,7vw,7.5rem)] font-light leading-[0.94] tracking-[-0.02em] text-cream drop-shadow-[0_4px_26px_rgb(8_5_3/0.95)] max-sm:mx-auto max-sm:mt-5"
              >
                A slow ritual, <em className="text-gilded italic">poured</em> with
                intent.
              </h1>

              <p
                data-intro-lede
                className="mt-8 max-w-[46ch] leading-relaxed text-sand max-sm:mx-auto max-sm:mt-5 max-sm:text-[0.93rem]"
              >
                A speciality coffee house hand-roasting single-origin lots in
                small batches — pulled to the second, poured with patience.
              </p>

              <div className="mt-10 flex items-center gap-4 max-sm:mt-7 max-sm:justify-center max-sm:gap-2.5">
                <span data-intro-cta>
                  <GoldButton href="#menu">Explore Menu</GoldButton>
                </span>
                <span data-intro-cta>
                  <GoldButton href="#visit" variant="ghost">
                    Get Delivery
                  </GoldButton>
                </span>
              </div>

              <p
                data-intro-meta
                className="mt-10 font-sans text-[0.62rem] uppercase tracking-[0.28em] text-sand drop-shadow-[0_2px_12px_rgb(8_5_3/0.95)] max-sm:mt-6 max-sm:text-[0.52rem] max-sm:tracking-[0.18em]"
              >
                {ORIGINS.slice(0, 3)
                  .map((o) => o.country)
                  .join(" · ")}
              </p>
            </div>

            {/* Story beats — stacked in the same slot, cross-faded by scroll. */}
            {!reduced &&
              HERO_BEATS.map((beat) => (
                <div
                  key={beat.id}
                  data-beat={beat.id}
                  /* Phones anchor the copy to the bottom veil, matching where
                     the opening lockup sits. */
                  className="pointer-events-auto absolute inset-y-0 left-0 flex w-full max-w-[1440px] flex-col justify-center px-12 opacity-0 max-lg:px-8 max-sm:justify-end max-sm:px-5 max-sm:pb-14 max-sm:text-center"
                >
                  <div className="max-w-[46ch] max-sm:mx-auto">
                    {beatCopy(beat, false)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ── Loading veil, in the site's own vocabulary ───────────────── */}
        <div
          ref={loader}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-ink"
        >
          <p className="font-display text-2xl italic text-primary">
            {BRAND.name}
          </p>
          <div className="h-px w-48 overflow-hidden bg-bark max-sm:w-32">
            <div
              ref={loaderBar}
              className="h-full origin-left scale-x-0 bg-gradient-to-r from-primary-deep via-primary to-primary-soft"
            />
          </div>
          <p className="font-sans text-[0.58rem] uppercase tracking-[0.32em] text-muted">
            Warming the cup
          </p>
        </div>
      </div>

      {/* Reduced motion: the beats become ordinary reading matter beneath the
          held frame, so no copy is lost with the animation switched off. */}
      {reduced && (
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-3 gap-12 px-12 py-24 max-lg:grid-cols-1 max-lg:gap-16 max-lg:px-8 max-sm:px-5 max-sm:py-16">
          {HERO_BEATS.map((beat) => (
            <div key={beat.id}>{beatCopy(beat, true)}</div>
          ))}
        </div>
      )}
    </section>
  );
}
