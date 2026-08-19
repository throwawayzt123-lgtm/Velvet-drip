/** The single site-wide max-width gutter. */
export default function Shell({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "header" | "footer" | "section";
}) {
  return <Tag className={`shell ${className}`}>{children}</Tag>;
}
