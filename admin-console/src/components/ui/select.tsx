import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Styled native select — themed trigger with chevron; list follows color-scheme. */
const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <div className={cn("relative", className)}>
      <select
        ref={ref}
        className="w-full cursor-pointer appearance-none rounded-lg border border-input bg-card py-[7px] pl-3 pr-8 text-[13px] text-foreground shadow-card outline-none transition focus:border-primary/60 focus:ring-[3px] focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
    </div>
  ),
);
Select.displayName = "Select";

export { Select };
