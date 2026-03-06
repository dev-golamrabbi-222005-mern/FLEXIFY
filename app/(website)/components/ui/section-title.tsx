type SectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
};

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionTitleProps) {
  const alignStyle =
    align === "center"
      ? "items-center text-center"
      : align === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <div className={`flex flex-col gap-3 mt-8 md:mt-12 lg:mt-16 mb-10 ${alignStyle} ${className}`}>
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {/* Decorative line */}
      <span className="h-1 w-14 rounded-full bg-orange-500" />
      {subtitle && (
        <p className="max-w-xl text-[var(--text-secondary)]">{subtitle}</p>
      )}
    </div>
  );
}
