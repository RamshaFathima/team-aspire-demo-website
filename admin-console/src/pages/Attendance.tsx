import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, fmtDateTime } from "@/lib/api";
import { Badge, ErrorNote, PageHeader, Spinner } from "@/components/ui";

type Session = {
  id: string;
  title: string;
  topic: string | null;
  startsAt: string;
  status: string;
  cohortName: string;
  courseTitle: string;
};

type Sheet = {
  session: Session & { cohortId: string };
  roster: { userId: string; name: string; email: string; status: string | null; markedAt: string | null }[];
};

const MARKS = ["present", "absent", "late", "excused"] as const;

export default function Attendance() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const sessionId = params.get("session") ?? "";
  const [draft, setDraft] = useState<Record<string, string>>({});

  const { data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api<{ data: Session[] }>("/lms/sessions"),
  });

  const { data: sheet, isLoading } = useQuery({
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

  return (
    <>
      <PageHeader title="Attendance" subtitle="Pick a session, mark the roster, save." />

      <select
        className="input mb-6 max-w-xl"
        value={sessionId}
        onChange={(e) => setParams(e.target.value ? { session: e.target.value } : {})}
      >
        <option value="">Select a class session…</option>
        {sessions?.data.map((s) => (
          <option key={s.id} value={s.id}>
            {s.courseTitle} · {s.cohortName} · {s.title} ({fmtDateTime(s.startsAt)}) [{s.status}]
          </option>
        ))}
      </select>

      {sessionId && isLoading && <Spinner />}

      {sheet && (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
            <div>
              <span className="text-sm font-bold text-slate-700">
                {sheet.session.title} {sheet.session.topic ? `— ${sheet.session.topic}` : ""}
              </span>
              <span className="ml-2"><Badge value={sheet.session.status} /></span>
            </div>
            {can("lms.attendance.manage") && (
              <div className="flex gap-2">
                <button className="btn-secondary !py-1 text-xs" onClick={() => markAll("present")}>All present</button>
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
              <tr className="border-b border-slate-100">
                <th className="th">Student</th>
                <th className="th">Mark</th>
                <th className="th">Last marked</th>
              </tr>
            </thead>
            <tbody>
              {sheet.roster.map((r) => (
                <tr key={r.userId} className="border-b border-slate-50 last:border-0">
                  <td className="td">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.email}</div>
                  </td>
                  <td className="td">
                    <div className="flex gap-1.5">
                      {MARKS.map((m) => (
                        <button
                          key={m}
                          disabled={!can("lms.attendance.manage")}
                          onClick={() => setDraft((d) => ({ ...d, [r.userId]: m }))}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                            draft[r.userId] === m
                              ? m === "present"
                                ? "bg-emerald-600 text-white"
                                : m === "absent"
                                  ? "bg-rose-600 text-white"
                                  : m === "late"
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-500 text-white"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="td text-xs text-slate-400">{r.markedAt ? fmtDateTime(r.markedAt) : "—"}</td>
                </tr>
              ))}
              {sheet.roster.length === 0 && (
                <tr><td colSpan={3} className="td py-10 text-center text-slate-400">No enrolled students in this cohort</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
