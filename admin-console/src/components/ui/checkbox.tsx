import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Custom checkbox with label — replaces bare native checkboxes in forms. */
export function Checkbox({
  checked,
  onChange,
  label,
  hint,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-2.5 select-none", className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input bg-card hover:border-primary/50",
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>
      <span className="leading-tight">
        <span className="text-[13px] font-medium text-foreground">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}
