import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "split";
  badge?: React.ReactNode;
  light?: boolean;
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  badge,
  light = false,
  className,
  children,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        align === "split" &&
          "flex flex-col items-start justify-between gap-4 tablet:flex-row tablet:items-end",
        className,
      )}
    >
      <div className={cn(align === "center" && "mx-auto max-w-2xl")}>
        {kicker ? (
          <p className={cn("lb-kicker", light && "lb-kicker-light")}>{kicker}</p>
        ) : null}
        <h2
          id={id}
          className={cn(
            "mt-2.5 mb-2 text-[clamp(1.875rem,4vw,2.375rem)] font-bold tracking-[-1.8px] text-ink",
            light && "text-white",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "m-0 text-[15px] leading-relaxed",
              light ? "text-[#b6c5db]" : "text-muted",
            )}
          >
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {badge ? (
        <span className="rounded-full border border-[#e0e6ed] bg-[#f2f5f9] px-3 py-2 text-[10px] text-[#59677e]">
          {badge}
        </span>
      ) : null}
    </div>
  );
}
