import { useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/** Date-only picker: value is "YYYY-MM-DD". */
export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00:00`) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-input bg-card px-3 py-[7px] text-left text-[13px] shadow-card outline-none transition focus:border-primary/60 focus:ring-[3px] focus:ring-ring/15",
            !selected && "text-muted-foreground/60",
          )}
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          {selected ? fmtDate(selected) : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          selected={selected}
          onSelect={(date) => {
            onChange(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/** Date + time picker: value is "YYYY-MM-DDTHH:mm" (local). */
export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date & time",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value) : null;
  const hour = selected ? selected.getHours() : 11;
  const minute = selected ? selected.getMinutes() : 0;

  const emit = (date: Date, h: number, m: number) => {
    onChange(
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(h)}:${pad(m)}`,
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-input bg-card px-3 py-[7px] text-left text-[13px] shadow-card outline-none transition focus:border-primary/60 focus:ring-[3px] focus:ring-ring/15",
            !selected && "text-muted-foreground/60",
          )}
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          {selected
            ? `${fmtDate(selected)} · ${selected.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
            : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          selected={selected}
          onSelect={(date) => emit(date, hour, minute)}
        />
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <Select
            className="flex-1"
            value={String(hour)}
            onChange={(e) => selected && emit(selected, Number(e.target.value), minute)}
            disabled={!selected}
          >
            {Array.from({ length: 24 }, (_, h) => (
              <option key={h} value={h}>
                {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
              </option>
            ))}
          </Select>
          <Select
            className="flex-1"
            value={String(minute)}
            onChange={(e) => selected && emit(selected, hour, Number(e.target.value))}
            disabled={!selected}
          >
            {[0, 15, 30, 45].concat(minute % 15 ? [minute] : []).sort((a, b) => a - b).map((m) => (
              <option key={m} value={m}>
                :{pad(m)}
              </option>
            ))}
          </Select>
          <button type="button" className="btn-primary !px-3 !py-1.5 text-xs" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
