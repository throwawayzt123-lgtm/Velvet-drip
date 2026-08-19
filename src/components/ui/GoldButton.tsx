import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
};

/**
 * The house CTA. The solid variant carries a lit top edge and a warm cast
 * shadow so it reads as a raised, physical key rather than a flat rectangle.
 */
export default function GoldButton({
  href,
  children,
  variant = "solid",
  className = "",
}: Props) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-9 py-4 font-sans text-[0.72rem] uppercase tracking-[0.24em] transition-all duration-500 ease-[var(--ease-silk)] max-sm:gap-2 max-sm:px-4 max-sm:py-3.5 max-sm:text-[0.58rem] max-sm:tracking-[0.16em]";

  const skin =
    variant === "solid"
      ? "bg-gradient-to-b from-primary-soft via-primary to-primary-deep text-ink shadow-[0_18px_40px_-14px_rgb(228_199_159/0.55),inset_0_1px_0_rgb(255_255_255/0.6)] hover:-translate-y-0.5 hover:shadow-[0_26px_55px_-14px_rgb(228_199_159/0.7),inset_0_1px_0_rgb(255_255_255/0.75)]"
      : "border border-primary/35 bg-ink/35 text-cream backdrop-blur-md hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5";

  return (
    <Link href={href} className={`${base} ${skin} ${className}`}>
      {/* sweeping specular highlight */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-[900ms] ease-[var(--ease-silk)] group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="relative h-3 w-3 transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-x-1"
      >
        <path
          d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
