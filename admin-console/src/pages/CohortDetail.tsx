import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { api, can, fmtDate, fmtDateTime } from "@/lib/api";
import { Badge, ConfirmDialog, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";
import { DateTimePicker } from "@/components/ui/datetime-picker";

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
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  const { data: cohort, isLoading } = useQuery({
    queryKey: ["cohort", id],
    queryFn: () => api<CohortDetailData>(`/lms/cohorts/${id}`),
    enabled: !!id,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["cohort", id] });

  const deleteCohortMutation = useMutation({
    mutationFn: () => api(`/lms/cohorts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cohorts"] });
      navigate("/lms/cohorts");
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => api(`/lms/sessions/${sessionId}`, { method: "DELETE" }),
    onSuccess: () => {
      setDeleteSessionId(null);
      refresh();
    },
  });

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
                <button className="btn-danger" onClick={() => setDeleteOpen(true)} title="Delete cohort">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
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
        <span className="text-xs text-muted-foreground/70">{cohort.enrollments.length} students · {cohort.sessions.length} sessions</span>
        {cohort.teachers.length > 0 && (
          <span className="text-xs text-muted-foreground">
            Teachers: {cohort.teachers.map((t) => t.teacherName).join(", ")}
          </span>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="border-b border-border/60 px-4 py-3 text-sm font-bold text-foreground/80">Roster</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Student</th>
                <th className="th">Status</th>
                <th className="th">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {cohort.enrollments.map((e) => (
                <tr key={e.id} className="border-b border-border/40 last:border-0">
                  <td className="td">
                    <div className="font-medium">{e.studentName}</div>
                    <div className="text-xs text-muted-foreground/70">{e.studentEmail}</div>
                  </td>
                  <td className="td"><Badge value={e.status} /></td>
                  <td className="td text-xs text-muted-foreground">{fmtDate(e.enrolledAt)}</td>
                </tr>
              ))}
              {cohort.enrollments.length === 0 && (
                <tr><td colSpan={3} className="td py-8 text-center text-muted-foreground/70">No students yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-border/60 px-4 py-3 text-sm font-bold text-foreground/80">Class sessions</div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Session</th>
                <th className="th">When</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {cohort.sessions.map((s) => (
                <tr key={s.id} className="border-b border-border/40 last:border-0">
                  <td className="td">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground/70">{s.topic}</div>
                  </td>
                  <td className="td text-xs text-muted-foreground">{fmtDateTime(s.startsAt)}</td>
                  <td className="td"><Badge value={s.status} /></td>
                  <td className="td text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/lms/attendance?session=${s.id}`} className="btn-secondary !px-2 !py-1 text-xs">Attendance</Link>
                      {can("lms.cohorts.manage") && (
                        <button
                          className="rounded-md p-1.5 text-muted-foreground/50 transition hover:bg-destructive/10 hover:text-destructive"
                          title="Delete session"
                          onClick={() => setDeleteSessionId(s.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {cohort.sessions.length === 0 && (
                <tr><td colSpan={4} className="td py-8 text-center text-muted-foreground/70">No sessions scheduled</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {enrollOpen && <EnrollModal cohortId={cohort.id} onClose={() => setEnrollOpen(false)} onDone={refresh} />}
      {teacherOpen && <TeacherModal cohortId={cohort.id} onClose={() => setTeacherOpen(false)} onDone={refresh} />}
      {sessionOpen && <SessionModal cohortId={cohort.id} onClose={() => setSessionOpen(false)} onDone={refresh} />}

      <ConfirmDialog
        open={deleteOpen}
        title={`Delete “${cohort.name}”?`}
        message="Removes this cohort with all its sessions, enrollments and attendance records."
        confirmLabel="Delete cohort"
        busy={deleteCohortMutation.isPending}
        error={deleteCohortMutation.error}
        onConfirm={() => deleteCohortMutation.mutate()}
        onCancel={() => setDeleteOpen(false)}
      />
      <ConfirmDialog
        open={!!deleteSessionId}
        title="Delete this class session?"
        message="Its attendance records are removed with it."
        confirmLabel="Delete session"
        busy={deleteSessionMutation.isPending}
        error={deleteSessionMutation.error}
        onConfirm={() => deleteSessionId && deleteSessionMutation.mutate(deleteSessionId)}
        onCancel={() => setDeleteSessionId(null)}
      />
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
              value === u.id ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/30"
            }`}
          >
            <span className="font-medium">{u.fullName}</span>
            <span className="ml-2 text-xs text-muted-foreground/70">{u.email}</span>
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
    <Modal
      title="Enroll a student"
      description="Search by name or email, pick the student, then enroll."
      open
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={!userId || mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Enrolling…" : "Enroll student"}
          </button>
        </>
      }
    >
      <UserPicker value={userId} onChange={setUserId} />
      <ErrorNote error={mutation.error} />
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
    <Modal
      title="Assign a teacher"
      description="Only people with the Teacher role are shown."
      open
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={!teacherId || mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Assigning…" : "Assign teacher"}
          </button>
        </>
      }
    >
      <UserPicker role="TEACHER" value={teacherId} onChange={setTeacherId} />
      <ErrorNote error={mutation.error} />
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
    <Modal
      title="Schedule a class"
      description="Students see scheduled classes in their account."
      open
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={mutation.isPending || !title || !startsAt} onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Scheduling…" : "Schedule class"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Week 6" />
        </Field>
        <Field label="Topic">
          <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What will be covered?" />
        </Field>
        <Field label="Starts at">
          <DateTimePicker value={startsAt} onChange={setStartsAt} />
        </Field>
        <Field label="Meeting link (optional)">
          <input className="input" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://zoom.us/…" />
        </Field>
        <ErrorNote error={mutation.error} />
      </div>
    </Modal>
  );
}
