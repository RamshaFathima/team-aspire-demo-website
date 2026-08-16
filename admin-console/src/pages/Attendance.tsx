import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { api, can, fmtDateTime } from "@/lib/api";
import { Badge, EmptyState, ErrorNote, PageHeader, Spinner } from "@/components/ui";
import { Card } from "@/components/ui/card";
import { monthGrid, sameDay } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type Session = {
  id: string;
  title: string;
  topic: string | null;
  startsAt: string;
  status: string;
  meetingUrl: string | null;
  cohortName: string;
  courseTitle: string;
};

type Sheet = {
  session: Session & { cohortId: string };
  roster: { userId: string; name: string; email: string; status: string | null; markedAt: string | null }[];
};

const MARKS = ["present", "absent", "late", "excused"] as const;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const chipTone: Record<string, string> = {
  scheduled: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-500 line-through",
};

/** Shorten a course title for calendar chips. */
function shortName(title: string) {
  return title.split("—")[0].split("(")[0].trim().slice(0, 18);
}

export default function Attendance() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const sessionId = params.get("session") ?? "";
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [draft, setDraft] = useState<Record<string, string>>({});

  const { data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api<{ data: Session[] }>("/lms/sessions"),
  });

  const { data: sheet, isLoading: sheetLoading } = useQuery({
    queryKey: ["attendance", sessionId],
    queryFn: () => api<Sheet>(`/lms/sessions/${sessionId}/attendance`),
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (sheet) {
      const initial: Record<string, string> = {};
      for (const r of sheet.roster) if (r.status) initial[r.userId] = r.status;
      setDraft(initial);
    }
  }, [sheet]);

  // Jump the calendar to the selected session's month
  useEffect(() => {
    if (sessionId && sessions) {
      const s = sessions.data.find((x) => x.id === sessionId);
      if (s) {
        const d = new Date(s.startsAt);
        setView({ year: d.getFullYear(), month: d.getMonth() });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, !!sessions]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api(`/lms/sessions/${sessionId}/attendance`, {
        method: "PUT",
        body: { marks: Object.entries(draft).map(([studentId, status]) => ({ studentId, status })) },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance", sessionId] }),
  });

  const completeMutation = useMutation({
    mutationFn: () => api(`/lms/sessions/${sessionId}`, { method: "PATCH", body: { status: "completed" } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance", sessionId] });
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const markAll = (status: string) => {
    if (!sheet) return;
    const next: Record<string, string> = {};
    for (const r of sheet.roster) next[r.userId] = status;
    setDraft(next);
  };

  const shift = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  };

  const grid = monthGrid(view.year, view.month);
  const sessionsOn = (date: Date) =>
    (sessions?.data ?? []).filter((s) => sameDay(new Date(s.startsAt), date));

  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle="Every class on a calendar — click one to open its attendance sheet."
      />

      {/* Calendar */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="text-sm font-semibold">
            {MONTHS[view.month]} {view.year}
          </div>
          <div className="flex items-center gap-1">
            <button className="btn-secondary !px-2 !py-1" onClick={() => shift(-1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              className="btn-secondary !px-2.5 !py-1 text-xs"
              onClick={() => setView({ year: now.getFullYear(), month: now.getMonth() })}
            >
              Today
            </button>
            <button className="btn-secondary !px-2 !py-1" onClick={() => shift(1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border/60">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-2 py-1.5 text-center text-2xs font-semibold uppercase tracking-wide text-muted-foreground/70">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {grid.map((date, i) => {
            const outside = date.getMonth() !== view.month;
            const isToday = sameDay(date, now);
            const daySessions = sessionsOn(date);
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[86px] border-b border-r border-border/40 p-1.5 [&:nth-child(7n)]:border-r-0",
                  outside && "bg-muted/30",
                )}
              >
                <div
                  className={cn(
                    "mb-1 flex h-5 w-5 items-center justify-center rounded-full text-2xs tabular-nums",
                    outside ? "text-muted-foreground/40" : "text-muted-foreground",
                    isToday && "bg-primary font-bold text-primary-foreground",
                  )}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {daySessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setParams({ session: s.id })}
                      title={`${s.courseTitle} · ${s.cohortName} · ${s.title}`}
                      className={cn(
                        "block w-full truncate rounded-md border px-1.5 py-1 text-left text-[10.5px] font-medium leading-tight transition hover:brightness-110",
                        chipTone[s.status] ?? chipTone.scheduled,
                        sessionId === s.id && "ring-2 ring-primary/60",
                      )}
                    >
                      {new Date(s.startsAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}{" "}
                      · {shortName(s.courseTitle)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-4 py-2 text-2xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" /> Scheduled</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Completed</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Cancelled</span>
          <span className="ml-auto">Schedule new classes from a cohort page → <Link to="/lms/cohorts" className="font-medium text-primary hover:underline">Cohorts</Link></span>
        </div>
      </Card>

      {/* Attendance sheet for the selected session */}
      {sessionId && sheetLoading && <Spinner />}

      {!sessionId && (
        <Card className="mt-4">
          <EmptyState
            icon={CalendarDays}
            title="Pick a class from the calendar"
            description="Click any session chip above to open its roster and mark attendance."
          />
        </Card>
      )}

      {sheet && (
        <Card className="mt-4 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold">
                  {sheet.session.title}
                  {sheet.session.topic ? ` — ${sheet.session.topic}` : ""}
                </span>
                <Badge value={sheet.session.status} />
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {fmtDateTime(sheet.session.startsAt)}
                {sheet.session.meetingUrl && (
                  <a href={sheet.session.meetingUrl} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 text-primary hover:underline">
                    <Video className="h-3 w-3" /> meeting link
                  </a>
                )}
              </div>
            </div>
            {can("lms.attendance.manage") && (
              <div className="flex gap-2">
                <button className="btn-secondary !py-1 text-xs" onClick={() => markAll("present")}>
                  All present
                </button>
                {sheet.session.status !== "completed" && (
                  <button className="btn-secondary !py-1 text-xs" disabled={completeMutation.isPending} onClick={() => completeMutation.mutate()}>
                    Mark session completed
                  </button>
                )}
                <button
                  className="btn-primary !py-1 text-xs"
                  disabled={saveMutation.isPending || Object.keys(draft).length === 0}
                  onClick={() => saveMutation.mutate()}
                >
                  {saveMutation.isPending ? "Saving…" : "Save attendance"}
                </button>
              </div>
            )}
          </div>
          <ErrorNote error={saveMutation.error ?? completeMutation.error} />
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Student</th>
                <th className="th">Mark</th>
                <th className="th">Last marked</th>
              </tr>
            </thead>
            <tbody>
              {sheet.roster.map((r) => (
                <tr key={r.userId} className="border-b border-border/40 last:border-0">
                  <td className="td">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground/70">{r.email}</div>
                  </td>
                  <td className="td">
                    <div className="flex gap-1.5">
                      {MARKS.map((m) => (
                        <button
                          key={m}
                          disabled={!can("lms.attendance.manage")}
                          onClick={() => setDraft((d) => ({ ...d, [r.userId]: m }))}
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition",
                            draft[r.userId] === m
                              ? m === "present"
                                ? "bg-emerald-600 text-white"
                                : m === "absent"
                                  ? "bg-rose-600 text-white"
                                  : m === "late"
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-500 text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80",
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="td text-xs text-muted-foreground/70">{r.markedAt ? fmtDateTime(r.markedAt) : "—"}</td>
                </tr>
              ))}
              {sheet.roster.length === 0 && (
                <tr>
                  <td colSpan={3} className="td py-10 text-center text-muted-foreground/70">
                    No enrolled students in this cohort
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
