import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Stripe-style dot badge: neutral chip + colored status dot. */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-1.5 py-0.5 text-2xs font-medium capitalize text-foreground/80",
  {
    variants: {
      variant: {
        default: "[--dot:theme(colors.slate.400)]",
        success: "[--dot:theme(colors.emerald.500)]",
        info: "[--dot:theme(colors.sky.500)]",
        warning: "[--dot:theme(colors.amber.500)]",
        destructive: "[--dot:theme(colors.rose.500)]",
        indigo: "[--dot:theme(colors.indigo.500)]",
        muted: "[--dot:theme(colors.slate.300)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[--dot]" />
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
