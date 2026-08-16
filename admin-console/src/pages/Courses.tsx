import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can } from "@/lib/api";
import { Badge, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";

type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  status: string;
  durationWeeks: number | null;
  isOnline: boolean;
  meetingPlatform: string | null;
  certificateEnabled: boolean;
  minAttendancePct: number | null;
};

type CourseList = { data: Course[]; total: number };

export default function Courses() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Course | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => api<CourseList>("/lms/courses?limit=100"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/lms/courses/${id}/status`, { method: "POST", body: { status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["courses"] });

  return (
    <>
      <PageHeader
        title="Courses"
        subtitle="Curriculum catalogue — publish to open for enrollment."
        actions={can("lms.courses.manage") && <button className="btn-primary" onClick={() => setCreateOpen(true)}>+ New course</button>}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.data.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-800">{c.title}</h3>
                  <div className="mt-0.5 text-xs text-slate-400 capitalize">
                    {c.category} · {c.isOnline ? c.meetingPlatform ?? "online" : "in-person"} · {c.durationWeeks ?? "?"} wks
                    {c.certificateEnabled && ` · cert @ ${c.minAttendancePct}% att.`}
                  </div>
                </div>
                <Badge value={c.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">{c.summary}</p>
              {can("lms.courses.manage") && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {["draft", "review", "published", "archived"].filter((s) => s !== c.status).map((s) => (
                    <button key={s} className="btn-secondary !px-2.5 !py-1 text-xs capitalize" disabled={statusMutation.isPending} onClick={() => statusMutation.mutate({ id: c.id, status: s })}>
                      → {s}
                    </button>
                  ))}
                  <button className="btn-primary ml-auto !px-2.5 !py-1 text-xs" onClick={() => setEditing(c)}>Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(createOpen || editing) && (
        <CourseModal course={editing} onClose={() => { setCreateOpen(false); setEditing(null); }} onDone={refresh} />
      )}
    </>
  );
}

function CourseModal({ course, onClose, onDone }: { course: Course | null; onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState(course?.title ?? "");
  const [summary, setSummary] = useState(course?.summary ?? "");
  const [category, setCategory] = useState(course?.category ?? "deen");
  const [durationWeeks, setDurationWeeks] = useState(String(course?.durationWeeks ?? ""));
  const [isOnline, setIsOnline] = useState(course?.isOnline ?? true);
  const [meetingPlatform, setMeetingPlatform] = useState(course?.meetingPlatform ?? "Zoom");
  const [certificateEnabled, setCertificateEnabled] = useState(course?.certificateEnabled ?? false);
  const [minAttendancePct, setMinAttendancePct] = useState(String(course?.minAttendancePct ?? 80));

  const mutation = useMutation({
    mutationFn: () => {
      const body = {
        title,
        summary: summary || null,
        category,
        durationWeeks: durationWeeks ? Number(durationWeeks) : null,
        isOnline,
        meetingPlatform: meetingPlatform || null,
        certificateEnabled,
        minAttendancePct: minAttendancePct ? Number(minAttendancePct) : null,
      };
      return course
        ? api(`/lms/courses/${course.id}`, { method: "PATCH", body })
        : api("/lms/courses", { method: "POST", body });
    },
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal title={course ? "Edit course" : "New course"} open onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title"><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Summary"><textarea className="input" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {["deen", "skills", "wellbeing"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Duration (weeks)"><input className="input" type="number" value={durationWeeks} onChange={(e) => setDurationWeeks(e.target.value)} /></Field>
          <Field label="Mode">
            <select className="input" value={isOnline ? "online" : "offline"} onChange={(e) => setIsOnline(e.target.value === "online")}>
              <option value="online">Online</option>
              <option value="offline">In-person</option>
            </select>
          </Field>
          <Field label="Platform / venue"><input className="input" value={meetingPlatform} onChange={(e) => setMeetingPlatform(e.target.value)} /></Field>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="h-4 w-4 accent-maroon-700" checked={certificateEnabled} onChange={(e) => setCertificateEnabled(e.target.checked)} />
            Certificate enabled
          </label>
          {certificateEnabled && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              min attendance <input className="input !w-20" type="number" value={minAttendancePct} onChange={(e) => setMinAttendancePct(e.target.value)} /> %
            </div>
          )}
        </div>
        <ErrorNote error={mutation.error} />
        <button className="btn-primary w-full" disabled={mutation.isPending || title.length < 3} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "Saving…" : "Save course"}
        </button>
      </div>
    </Modal>
  );
}
