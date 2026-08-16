import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-lg border border-input bg-card px-3 py-[7px] text-[13px] shadow-card outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-[3px] focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
