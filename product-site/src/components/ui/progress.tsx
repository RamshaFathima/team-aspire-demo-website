import * as React from "react";
import { cn } from "@/lib/utils";

/** shadcn-style progress without the Radix dependency (SSR-friendly). */
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(value)}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    {...props}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-gold-500 to-maroon-600 transition-all"
      style={{ width: `${Math.min(100, Math.max(2, value))}%` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
