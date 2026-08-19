/** Small-caps section label, flanked by a gold hairline. */
export default function Eyebrow({
  children,
  align = "left",
  className = "",
  reveal = true,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /**
   * Opts out of the site-wide `[data-reveal]` scroll choreography — needed
   * inside pinned sections that drive their own timeline.
   */
  reveal?: boolean;
}) {
  return (
    <div
      {...(reveal ? { "data-reveal": "fade" } : {})}
      className={`flex items-center gap-4 ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary-deep" />
      <span className="font-sans text-[0.68rem] uppercase leading-none tracking-[0.42em] text-primary max-sm:text-[0.6rem] max-sm:tracking-[0.3em]">
        {children}
      </span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary-deep" />
    </div>
  );
}
