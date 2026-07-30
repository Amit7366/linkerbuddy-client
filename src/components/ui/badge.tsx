import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "sky" | "green" | "orange" | "live";
}

const toneClass: Record<NonNullable<BadgeProps["tone"]>, string> = {
  sky: "lb-eyebrow",
  green: "rounded-full bg-[#e7fbf4] px-2.5 py-1.5 text-[9px] font-bold text-[#087b5a]",
  orange: "rounded px-1.5 py-0.5 text-[8px] font-semibold text-[#a86500] bg-[#fff0d8]",
  live: "rounded-full bg-[#e7fbf4] px-2.5 py-1.5 text-[9px] font-bold text-[#087b5a]",
};

export function Badge({ className, tone = "sky", children, ...props }: BadgeProps) {
  return (
    <span className={cn(toneClass[tone], className)} {...props}>
      {children}
    </span>
  );
}
