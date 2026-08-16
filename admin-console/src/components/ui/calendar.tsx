import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** shadcn-styled month calendar (dependency-free). */
export function Calendar({
  selected,
  onSelect,
}: {
  selected?: Date | null;
  onSelect: (date: Date) => void;
}) {
  const base = selected ?? new Date();
  const [view, setView] = useState({ year: base.getFullYear(), month: base.getMonth() });
  const today = new Date();

  const shift = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  return (
    <div className="w-[252px] select-none">
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-[13px] font-semibold">
          {MONTHS[view.month]} {view.year}
        </div>
        <button
          type="button"
          onClick={() => shift(1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-2xs font-semibold text-muted-foreground/70">
            {d}
          </div>
        ))}
        {monthGrid(view.year, view.month).map((date, i) => {
          const outside = date.getMonth() !== view.month;
          const isToday = sameDay(date, today);
          const isSelected = selected ? sameDay(date, selected) : false;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(date)}
              className={cn(
                "mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-[12.5px] tabular-nums transition",
                outside && "text-muted-foreground/35",
                !outside && !isSelected && "text-foreground hover:bg-muted",
                isToday && !isSelected && "font-bold text-primary",
                isSelected && "bg-primary font-semibold text-primary-foreground",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
