import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ring-1",
  {
    variants: {
      variant: {
        default: "bg-slate-50 text-slate-600 ring-slate-200",
        success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        info: "bg-sky-50 text-sky-700 ring-sky-200",
        warning: "bg-amber-50 text-amber-700 ring-amber-200",
        destructive: "bg-rose-50 text-rose-700 ring-rose-200",
        indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
        muted: "bg-slate-100 text-slate-500 ring-slate-200",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
