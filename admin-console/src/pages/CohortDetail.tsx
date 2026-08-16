import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, fmtDate, fmtDateTime } from "@/lib/api";
import { Badge, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";

type CohortDetailData = {
  id: string;
  name: string;
  code: string;
  status: string;
  scheduleNote: string | null;
  courseTitle: string;
  enrollments: { id: string; userId: string; status: string; studentName: string; studentEmail: string; enrolledAt: string }[];
  sessions: { id: string; title: string; topic: string | null; startsAt: string; status: string }[];
  teachers: { id: string; teacherId: string; role: string; teacherName: string }[];
};

type UserLite = { id: string; fullName: string; email: string; roles: string[] };

export default function CohortDetail() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);

  const { data: cohort, isLoading } = useQuery({
    queryKey: ["cohort", id],
    queryFn: () => api<CohortDetailData>(`/lms/cohorts/${id}`),
    enabled: !!id,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["cohort", id] });

  if (isLoading || !cohort) return <Spinner />;

  return (
    <>
      <PageHeader
        title={cohort.name}
        subtitle={`${cohort.courseTitle} · ${cohort.code} · ${cohort.scheduleNote ?? ""}`}
        actions={
          <>
            {can("lms.cohorts.manage") && (
              <>
                <button className="btn-secondary" onClick={() => setTeacherOpen(true)}>+ Teacher</button>
                <button className="btn-secondary" onClick={() => setSessionOpen(true)}>+ Session</button>
              </>
            )}
            {can("lms.enrollments.manage") && (
              <button className="btn-primary" onClick={() => setEnrollOpen(true)}>+ Enroll student</button>
            )}
          </>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <Badge value={cohort.status} />
        <span className="text-xs text-slate-400">{cohort.enrollments.length} students · {cohort.sessions.length} sessions</span>
        {cohort.teachers.length > 0 && (
          <span className="text-xs text-slate-500">
            Teachers: {cohort.teachers.map((t) => t.teacherName).join(", ")}
          </span>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-700">Roster</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="th">Student</th>
                <th className="th">Status</th>
                <th className="th">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {cohort.enrollments.map((e) => (
                <tr key={e.id} className="border-b border-slate-50 last:border-0">
                  <td className="td">
                    <div className="font-medium">{e.studentName}</div>
                    <div className="text-xs text-slate-400">{e.studentEmail}</div>
                  </td>
                  <td className="td"><Badge value={e.status} /></td>
                  <td className="td text-xs text-slate-500">{fmtDate(e.enrolledAt)}</td>
                </tr>
              ))}
              {cohort.enrollments.length === 0 && (
                <tr><td colSpan={3} className="td py-8 text-center text-slate-400">No students yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-700">Class sessions</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="th">Session</th>
                <th className="th">When</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {cohort.sessions.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 last:border-0">
                  <td className="td">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-slate-400">{s.topic}</div>
                  </td>
                  <td className="td text-xs text-slate-500">{fmtDateTime(s.startsAt)}</td>
                  <td className="td"><Badge value={s.status} /></td>
                  <td className="td text-right">
                    <Link to={`/lms/attendance?session=${s.id}`} className="btn-secondary !px-2 !py-1 text-xs">Attendance</Link>
                  </td>
                </tr>
              ))}
              {cohort.sessions.length === 0 && (
                <tr><td colSpan={4} className="td py-8 text-center text-slate-400">No sessions scheduled</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {enrollOpen && <EnrollModal cohortId={cohort.id} onClose={() => setEnrollOpen(false)} onDone={refresh} />}
      {teacherOpen && <TeacherModal cohortId={cohort.id} onClose={() => setTeacherOpen(false)} onDone={refresh} />}
      {sessionOpen && <SessionModal cohortId={cohort.id} onClose={() => setSessionOpen(false)} onDone={refresh} />}
    </>
  );
}

function UserPicker({ role, value, onChange }: { role?: string; value: string; onChange: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["user-picker", search, role],
    queryFn: () =>
      api<{ data: UserLite[] }>(`/users?limit=10&search=${encodeURIComponent(search)}${role ? `&role=${role}` : ""}`),
  });
  return (
    <div>
      <input className="input" placeholder="Search people…" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="mt-2 max-h-44 space-y-1 overflow-y-auto">
        {data?.data.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => onChange(u.id)}
            className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
              value === u.id ? "border-maroon-700 bg-maroon-50" : "border-slate-100 hover:border-maroon-200"
            }`}
          >
            <span className="font-medium">{u.fullName}</span>
            <span className="ml-2 text-xs text-slate-400">{u.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EnrollModal({ cohortId, onClose, onDone }: { cohortId: string; onClose: () => void; onDone: () => void }) {
  const [userId, setUserId] = useState("");
  const mutation = useMutation({
    mutationFn: () => api(`/lms/cohorts/${cohortId}/enrollments`, { method: "POST", body: { userId } }),
    onSuccess: () => { onDone(); onClose(); },
  });
  return (
    <Modal title="Enroll a student" open onClose={onClose}>
      <UserPicker value={userId} onChange={setUserId} />
      <ErrorNote error={mutation.error} />
      <button className="btn-primary mt-4 w-full" disabled={!userId || mutation.isPending} onClick={() => mutation.mutate()}>
        {mutation.isPending ? "Enrolling…" : "Enroll student"}
      </button>
    </Modal>
  );
}

function TeacherModal({ cohortId, onClose, onDone }: { cohortId: string; onClose: () => void; onDone: () => void }) {
  const [teacherId, setTeacherId] = useState("");
  const mutation = useMutation({
    mutationFn: () => api(`/lms/cohorts/${cohortId}/teachers`, { method: "POST", body: { teacherId } }),
    onSuccess: () => { onDone(); onClose(); },
  });
  return (
    <Modal title="Assign a teacher" open onClose={onClose}>
      <UserPicker role="TEACHER" value={teacherId} onChange={setTeacherId} />
      <ErrorNote error={mutation.error} />
      <button className="btn-primary mt-4 w-full" disabled={!teacherId || mutation.isPending} onClick={() => mutation.mutate()}>
        {mutation.isPending ? "Assigning…" : "Assign teacher"}
      </button>
    </Modal>
  );
}

function SessionModal({ cohortId, onClose, onDone }: { cohortId: string; onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api("/lms/sessions", {
        method: "POST",
        body: { cohortId, title, topic: topic || null, startsAt, meetingUrl: meetingUrl || null },
      }),
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal title="Schedule a class" open onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title"><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Week 6" /></Field>
        <Field label="Topic"><input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Starts at"><input className="input" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} /></Field>
        <Field label="Meeting URL (optional)"><input className="input" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://zoom.us/…" /></Field>
        <ErrorNote error={mutation.error} />
        <button className="btn-primary w-full" disabled={mutation.isPending || !title || !startsAt} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "Scheduling…" : "Schedule class"}
        </button>
      </div>
    </Modal>
  );
}
