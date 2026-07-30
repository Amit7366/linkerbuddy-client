import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={cn("lb-container", className)}>{children}</Tag>;
}
