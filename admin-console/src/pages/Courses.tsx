import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Loader2 } from "lucide-react";
import { api, can } from "@/lib/api";
import { Badge, EmptyState, ErrorNote, Field, Modal, PageHeader, TableSkeleton } from "@/components/ui";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft — hidden from the site" },
  { value: "review", label: "In review" },
  { value: "published", label: "Published — open for enrollment" },
  { value: "archived", label: "Archived" },
];

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
        <TableSkeleton />
      ) : !data?.data.length ? (
        <Card>
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Create your first course, then add a cohort to open enrollment."
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data?.data.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                  <div className="mt-1 text-xs capitalize text-muted-foreground">
                    {c.category} · {c.isOnline ? (c.meetingPlatform ?? "online") : "in-person"} ·{" "}
                    {c.durationWeeks ?? "?"} weeks
                    {c.certificateEnabled && ` · certificate at ${c.minAttendancePct}% attendance`}
                  </div>
                </div>
                <Badge value={c.status} />
              </div>
              <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{c.summary}</p>
              {can("lms.courses.manage") && (
                <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3.5">
                  <div className="w-56">
                    <Select
                      value={c.status}
                      disabled={statusMutation.isPending}
                      onChange={(e) => statusMutation.mutate({ id: c.id, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  {statusMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                  <button className="btn-secondary ml-auto !px-3 !py-1.5 text-xs" onClick={() => setEditing(c)}>
                    Edit details
                  </button>
                </div>
              )}
            </Card>
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
    <Modal
      title={course ? "Edit course" : "New course"}
      description={course ? course.title : "Set up the basics — you can refine everything later."}
      open
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={mutation.isPending || title.length < 3}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : course ? "Save changes" : "Create course"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Seerah Circle — Mercy to the Aalameen"
          />
        </Field>
        <Field label="Summary">
          <textarea
            className="input"
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One or two lines shown on the public site"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="deen">Deen</option>
              <option value="skills">Skills</option>
              <option value="wellbeing">Wellbeing</option>
            </Select>
          </Field>
          <Field label="Duration (weeks)">
            <input
              className="input"
              type="number"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(e.target.value)}
              placeholder="12"
            />
          </Field>
          <Field label="Mode">
            <Select
              value={isOnline ? "online" : "offline"}
              onChange={(e) => setIsOnline(e.target.value === "online")}
            >
              <option value="online">Online</option>
              <option value="offline">In-person</option>
            </Select>
          </Field>
          <Field label={isOnline ? "Platform" : "Venue"}>
            <input
              className="input"
              value={meetingPlatform}
              onChange={(e) => setMeetingPlatform(e.target.value)}
              placeholder={isOnline ? "Zoom" : "Community Centre"}
            />
          </Field>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-3.5">
          <Checkbox
            checked={certificateEnabled}
            onChange={setCertificateEnabled}
            label="Award a certificate on completion"
            hint="Students who meet the attendance requirement can be issued a verified certificate."
          />
          {certificateEnabled && (
            <div className="mt-3 flex items-center gap-2 pl-7 text-[13px] text-muted-foreground">
              Requires
              <input
                className="input !w-16 text-center"
                type="number"
                min={0}
                max={100}
                value={minAttendancePct}
                onChange={(e) => setMinAttendancePct(e.target.value)}
              />
              % attendance
            </div>
          )}
        </div>
        <ErrorNote error={mutation.error} />
      </div>
    </Modal>
  );
}
