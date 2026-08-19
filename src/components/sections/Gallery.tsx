"use client";

import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
import { GALLERY } from "@/lib/site";

/* Three columns drifting at slightly different rates — the parallax is what
   turns a flat grid into a room you can look into. */
const COLUMNS = [
  { speed: "1.12", items: [GALLERY[0], GALLERY[1]] },
  { speed: "0.9", items: [GALLERY[2], GALLERY[3]] },
  { speed: "1.06", items: [GALLERY[4], GALLERY[5]] },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="grain relative overflow-hidden bg-espresso py-36 max-lg:py-28 max-sm:py-20"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-[26rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-12 max-lg:px-8 max-sm:px-5">
        <div className="flex items-end justify-between gap-10 max-md:flex-col max-md:items-start max-md:gap-6">
          <div>
            <Eyebrow>The Room</Eyebrow>
            <h2
              data-reveal="up"
              className="mt-7 max-w-[16ch] font-display text-[clamp(2.4rem,4.6vw,4.6rem)] font-light leading-[1.02] tracking-[-0.015em] text-cream"
            >
              Warm brass, low light,{" "}
              <em className="text-gilded italic">long</em> tables.
            </h2>
          </div>
          <p
            data-reveal="up"
            className="max-w-[34ch] pb-3 leading-relaxed text-muted max-sm:text-[0.93rem]"
          >
            Forty covers across two floors, a marble bar, and a mezzanine that
            stays quiet even at nine on a Saturday.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-7 max-lg:gap-5 max-md:grid-cols-2 max-sm:mt-12 max-sm:grid-cols-1">
          {COLUMNS.map((col, ci) => (
            <div
              key={ci}
              data-speed={col.speed}
              className={`flex flex-col gap-7 max-lg:gap-5 ${
                ci === 1 ? "mt-14 max-md:mt-0" : ""
              } ${
                ci === 2
                  ? "max-md:col-span-2 max-md:grid max-md:grid-cols-2 max-sm:col-span-1 max-sm:flex"
                  : ""
              }`}
            >
              {col.items.map((item) => (
                <figure
                  key={item.src}
                  data-reveal="scale"
                  className="group relative overflow-hidden rounded-[1.75rem] border border-primary/12 shadow-[var(--shadow-lift)]"
                >
                  <div
                    className={`relative ${
                      item.span === "tall" ? "aspect-[3/4]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-silk)] group-hover:scale-[1.08]"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />

                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6 max-sm:p-5">
                    <span className="font-display text-xl italic text-cream">
                      {item.caption}
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/40 text-primary opacity-0 transition-all duration-500 group-hover:opacity-100">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>

        <div data-reveal="up" className="mt-16 flex justify-center max-sm:mt-12">
          <GoldButton href="#visit" variant="ghost">
            Book the mezzanine
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
