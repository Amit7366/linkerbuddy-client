import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("lb-btn", {
  variants: {
    variant: {
      primary: "",
      ghost: "lb-btn-ghost",
      light: "lb-btn-light",
    },
    size: {
      default: "",
      sm: "lb-btn-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    VariantProps<typeof buttonVariants> {
  href: string;
}

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export function ButtonLink({
  className,
  variant,
  size,
  href,
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  // Use Next.js Link for in-app routes so navigation stays client-side (no full reload)
  if (isInternalHref(href)) {
    return <Link href={href} className={classes} {...props} />;
  }

  return <a href={href} className={classes} {...props} />;
}
