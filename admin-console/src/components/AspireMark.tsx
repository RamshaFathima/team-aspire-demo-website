import { cn } from "@/lib/utils";

/** Team Aspire calligraphy-flame mark (from the brand's Instagram identity). */
export function AspireMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-6 w-6", className)} aria-hidden>
      <path
        d="M27.2 4.5c-1.6 4.4-4.9 7.8-7.4 11.6-2.6 3.9-4.6 8.2-4.2 13 .3 4 2.3 7.7 5.4 10.2 1.1.9 2.4 1.7 3.7 2.2-2.3-2.7-3.6-6.3-3.3-9.9.3-3.9 2.4-7.2 4.5-10.3 2.3-3.4 4.7-6.9 5.3-11.1.3-2.1 0-4.1-.9-6-.8 .1-2.2-.5-3.1.3z"
        fill="currentColor"
      />
      <path
        d="M30.9 20.6c-1.2 2.6-3 4.9-4.6 7.3-1.6 2.5-2.9 5.3-2.7 8.4.2 2.9 1.8 5.5 4.2 7.1.5.3 1 .6 1.5.8-1.3-2-1.9-4.5-1.5-6.9.5-2.8 2.2-5.1 3.7-7.4 1.7-2.5 3.3-5.2 3.4-8.3 0-1.5-.3-3-1-4.3-1 1-2.3 2-3 3.3z"
        fill="currentColor"
        opacity=".65"
      />
    </svg>
  );
}
