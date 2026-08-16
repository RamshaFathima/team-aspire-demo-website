import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, fmtDate } from "@/lib/api";
import { Badge, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datetime-picker";

type Cohort = {
  id: string;
  name: string;
  code: string;
  status: string;
  startsOn: string | null;
  scheduleNote: string | null;
  capacity: number | null;
  courseTitle: string;
  enrolled: number;
};

type Course = { id: string; title: string };

export default function Cohorts() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["cohorts"],
    queryFn: () => api<{ data: Cohort[] }>("/lms/cohorts"),
  });
  const { data: courses } = useQuery({
    queryKey: ["courses-lite"],
    queryFn: async () => (await api<{ data: Course[] }>("/lms/courses?limit=100")).data,
  });

  return (
    <>
      <PageHeader
        title="Cohorts"
        subtitle="Batches of a course — with roster, sessions and teachers."
        actions={can("lms.cohorts.manage") && <button className="btn-primary" onClick={() => setCreateOpen(true)}>+ New cohort</button>}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Cohort</th>
                <th className="th">Course</th>
                <th className="th">Schedule</th>
                <th className="th">Enrolled</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((c) => (
                <tr key={c.id} className="border-b border-border/40 last:border-0 hover:bg-muted/50">
                  <td className="td">
                    <div className="font-semibold">{c.name}</div>
                    <div className="font-mono text-xs text-muted-foreground/70">{c.code}</div>
                  </td>
                  <td className="td text-muted-foreground">{c.courseTitle}</td>
                  <td className="td text-xs text-muted-foreground">
                    {c.scheduleNote ?? "—"}
                    {c.startsOn && <div className="text-muted-foreground/70">from {fmtDate(c.startsOn)}</div>}
                  </td>
                  <td className="td">{c.enrolled}{c.capacity ? ` / ${c.capacity}` : ""}</td>
                  <td className="td"><Badge value={c.status} /></td>
                  <td className="td text-right">
                    <Link to={`/lms/cohorts/${c.id}`} className="btn-secondary !px-2.5 !py-1 text-xs">Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {createOpen && <CohortModal courses={courses ?? []} onClose={() => setCreateOpen(false)} onDone={() => qc.invalidateQueries({ queryKey: ["cohorts"] })} />}
    </>
  );
}

function CohortModal({ courses, onClose, onDone }: { courses: Course[]; onClose: () => void; onDone: () => void }) {
  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");
  const [startsOn, setStartsOn] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("upcoming");

  const mutation = useMutation({
    mutationFn: () =>
      api("/lms/cohorts", {
        method: "POST",
        body: {
          courseId,
          name,
          scheduleNote: scheduleNote || null,
          startsOn: startsOn || null,
          capacity: capacity ? Number(capacity) : null,
          status,
        },
      }),
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal
      title="New cohort"
      description="A cohort is one batch of a course — with its own students, schedule and sessions."
      open
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={mutation.isPending || !courseId || name.length < 2}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Creating…" : "Create cohort"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Course">
          <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">Select course…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Cohort name">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Batch 2026-A" />
        </Field>
        <Field label="Schedule note">
          <input
            className="input"
            value={scheduleNote}
            onChange={(e) => setScheduleNote(e.target.value)}
            placeholder="Every Sunday 11:00–12:30"
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Starts on">
            <DatePicker value={startsOn} onChange={setStartsOn} />
          </Field>
          <Field label="Capacity">
            <input className="input" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="No limit" />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Select>
          </Field>
        </div>
        <ErrorNote error={mutation.error} />
      </div>
    </Modal>
  );
}
