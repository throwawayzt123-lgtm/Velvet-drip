"use client";

import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import { BRAND } from "@/lib/site";

const DETAILS = [
  { label: "The address", value: BRAND.address },
  { label: "Opening hours", value: BRAND.hours },
  { label: "Telephone", value: BRAND.phone },
  { label: "Correspondence", value: BRAND.email },
];

const FIELDS = [
  { name: "name", label: "Your name", type: "text", placeholder: "Ada Lovelace" },
  { name: "email", label: "Email", type: "email", placeholder: "ada@example.com" },
  { name: "date", label: "Preferred date", type: "text", placeholder: "Sat 14 Sept · 10:30" },
];

export default function Visit() {
  return (
    <section
      id="visit"
      className="grain relative overflow-hidden bg-espresso py-36 max-lg:py-28 max-sm:py-20"
    >
      <div
        aria-hidden
        className="absolute -right-32 top-10 h-[32rem] w-[32rem] rounded-full bg-primary/[0.07] blur-[130px]"
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-[1.05fr_1fr] items-start gap-20 px-12 max-xl:gap-14 max-lg:grid-cols-1 max-lg:px-8 max-sm:gap-12 max-sm:px-5">
        {/* ── Where to find us ────────────────────────────────── */}
        <div>
          <Eyebrow>Visit the Atelier</Eyebrow>

          <h2
            data-reveal="up"
            className="mt-7 max-w-[15ch] font-display text-[clamp(2.4rem,4.6vw,4.6rem)] font-light leading-[1.02] tracking-[-0.015em] text-cream"
          >
            Come and sit <em className="text-gilded italic">a while</em>.
          </h2>

          <p
            data-reveal="up"
            className="mt-7 max-w-[46ch] leading-relaxed text-sand max-sm:text-[0.95rem]"
          >
            Walk-ins are always welcome. Reserve only if you would like the
            mezzanine, a tasting flight, or a table for more than four.
          </p>

          <dl data-reveal-group className="mt-12 max-sm:mt-9">
            {DETAILS.map((d) => (
              <div
                key={d.label}
                data-reveal-item
                className="flex items-baseline justify-between gap-8 border-b border-bark/70 py-5 max-sm:flex-col max-sm:items-start max-sm:gap-1.5 max-sm:py-4"
              >
                <dt className="shrink-0 font-sans text-[0.62rem] uppercase tracking-[0.28em] text-primary">
                  {d.label}
                </dt>
                <dd className="text-right font-display text-xl italic text-cream max-sm:text-left max-sm:text-lg">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Street view */}
          <div
            data-reveal="scale"
            className="relative mt-12 aspect-[16/8] overflow-hidden rounded-[1.75rem] border border-primary/15 shadow-[var(--shadow-lift)] max-sm:mt-9"
          >
            <Image
              src="/images/gallery/interior-bikes.jpg"
              alt="The long bar at the Marlowe Lane atelier"
              fill
              sizes="(max-width: 1024px) 92vw, 46vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6 max-sm:p-5">
              <span className="font-display text-lg italic text-cream">
                Marlowe Lane, W1T
              </span>
              <span className="rounded-full border border-primary/40 px-4 py-1.5 font-sans text-[0.58rem] uppercase tracking-[0.22em] text-primary">
                Open now
              </span>
            </div>
          </div>
        </div>

        {/* ── Reservation card ────────────────────────────────── */}
        <div data-reveal="right" className="stage">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="pane rounded-[2rem] p-10 shadow-[var(--shadow-float)] max-lg:p-8 max-sm:rounded-[1.5rem] max-sm:p-6"
          >
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.3em] text-primary">
              Reservations
            </p>
            <h3 className="mt-4 font-display text-4xl font-light leading-tight text-cream max-sm:text-3xl">
              Reserve a table
            </h3>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
              We hold bookings for thirty minutes. Same-day requests, please
              call the bar.
            </p>

            <div className="mt-9 space-y-6 max-sm:mt-7 max-sm:space-y-5">
              {FIELDS.map((f) => (
                <label key={f.name} className="block">
                  <span className="font-sans text-[0.6rem] uppercase tracking-[0.26em] text-sand">
                    {f.label}
                  </span>
                  <input
                    type={f.type}
                    name={f.name}
                    placeholder={f.placeholder}
                    className="mt-3 w-full border-b border-bark bg-transparent pb-3 font-display text-lg text-cream outline-none transition-colors duration-400 placeholder:text-muted/60 focus:border-primary"
                  />
                </label>
              ))}

              <label className="block">
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.26em] text-sand">
                  Anything we should know
                </span>
                <textarea
                  rows={3}
                  name="notes"
                  placeholder="Six of us, one wheelchair user, celebrating a birthday."
                  className="mt-3 w-full resize-none border-b border-bark bg-transparent pb-3 font-display text-lg text-cream outline-none transition-colors duration-400 placeholder:text-muted/60 focus:border-primary"
                />
              </label>
            </div>

            <button
              type="submit"
              className="group relative mt-10 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-b from-primary-soft via-primary to-primary-deep py-4 font-sans text-[0.7rem] uppercase tracking-[0.24em] text-ink shadow-[0_18px_40px_-14px_rgb(228_199_159/0.55),inset_0_1px_0_rgb(255_255_255/0.6)] transition-transform duration-400 hover:-translate-y-0.5 max-sm:mt-8"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[900ms] ease-[var(--ease-silk)] group-hover:translate-x-full" />
              <span className="relative">Request a table</span>
            </button>

            <p className="mt-5 text-center font-sans text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              Or call {BRAND.phone}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
