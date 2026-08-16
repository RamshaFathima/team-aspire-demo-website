import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HeartHandshake, Loader2, Send } from "lucide-react";
import { api, can, fmtDate, inr } from "@/lib/api";
import { Badge, ConfirmDialog, EmptyState, ErrorNote, Field, Modal, PageHeader, TableSkeleton } from "@/components/ui";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft — hidden from the site" },
  { value: "active", label: "Active — live & accepting donations" },
  { value: "completed", label: "Completed — shown as finished" },
  { value: "archived", label: "Archived — removed from the site" },
];

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  category: string | null;
  status: string;
  location: string | null;
  goalAmount: string | null;
  raisedAmount: string;
  featured: boolean;
  createdAt: string;
  updates?: { id: string; title: string; body: string | null; createdAt: string }[];
};

type ProjectList = { data: Project[]; total: number };

export default function Projects() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api<ProjectList>("/projects?limit=100"),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["projects"] });

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="The NGO's real work — publish to show on the public site."
        actions={can("projects.manage") && <button className="btn-primary" onClick={() => setCreateOpen(true)}>+ New project</button>}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : !data?.data.length ? (
        <Card>
          <EmptyState icon={HeartHandshake} title="No projects yet" description="Create your first project to start telling the NGO's story." />
        </Card>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Project</th>
                <th className="th">Category</th>
                <th className="th">Raised / Goal</th>
                <th className="th">Status</th>
                <th className="th">Created</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((p) => (
                <tr key={p.id} className="cursor-pointer border-b border-border/40 last:border-0 hover:bg-muted/50" onClick={() => setSelectedId(p.id)}>
                  <td className="td">
                    <div className="font-semibold">{p.title} {p.featured && <span className="text-amber-500">★</span>}</div>
                    <div className="text-xs text-muted-foreground/70">/{p.slug}</div>
                  </td>
                  <td className="td capitalize text-muted-foreground">{p.category ?? "—"}</td>
                  <td className="td">
                    <span className="font-semibold">{inr(p.raisedAmount)}</span>
                    <span className="text-muted-foreground/70"> / {p.goalAmount ? inr(p.goalAmount) : "∞"}</span>
                  </td>
                  <td className="td"><Badge value={p.status} /></td>
                  <td className="td text-muted-foreground">{fmtDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {createOpen && <ProjectModal project={null} onClose={() => setCreateOpen(false)} onDone={refresh} />}
      {selectedId && <ProjectDetail id={selectedId} onClose={() => setSelectedId(null)} onDone={refresh} />}
    </>
  );
}

function ProjectDetail({ id, onClose, onDone }: { id: string; onClose: () => void; onDone: () => void }) {
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const { data: project } = useQuery({
    queryKey: ["project", id],
    queryFn: () => api<Project>(`/projects/${id}`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api(`/projects/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      onDone();
      onClose();
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api(`/projects/${id}/status`, { method: "POST", body: { status } }),
    onSuccess: () => {
      setPendingStatus(null);
      qc.invalidateQueries({ queryKey: ["project", id] });
      onDone();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      api(`/projects/${id}/updates`, {
        method: "POST",
        body: { title: updateTitle, body: updateBody || undefined },
      }),
    onSuccess: () => {
      setUpdateTitle("");
      setUpdateBody("");
      qc.invalidateQueries({ queryKey: ["project", id] });
    },
  });

  if (!project) return null;

  const progress = project.goalAmount
    ? Math.min(100, Math.round((Number(project.raisedAmount) / Number(project.goalAmount)) * 100))
    : null;
  const statusValue = pendingStatus ?? project.status;

  return (
    <Modal
      title={project.title}
      description={project.summary ?? undefined}
      open
      onClose={onClose}
      wide
      footer={
        <>
          {can("projects.manage") && (
            <button className="btn-danger mr-auto" onClick={() => setDeleteOpen(true)}>
              Delete
            </button>
          )}
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {can("projects.manage") && (
            <button className="btn-primary" onClick={() => setEditOpen(true)}>
              Edit details
            </button>
          )}
        </>
      }
    >
      <div className="space-y-5">
        {/* Funding overview */}
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xl font-semibold tabular-nums">
                {inr(project.raisedAmount)}
                {project.goalAmount && (
                  <span className="text-sm font-normal text-muted-foreground"> raised of {inr(project.goalAmount)}</span>
                )}
              </div>
              <div className="mt-0.5 text-xs capitalize text-muted-foreground">
                {project.category} · {project.location ?? "—"} · created {fmtDate(project.createdAt)}
              </div>
            </div>
            <Badge value={project.status} />
          </div>
          {progress !== null && (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(2, progress)}%` }} />
              </div>
              <div className="mt-1 text-right text-2xs font-medium text-muted-foreground">{progress}% funded</div>
            </div>
          )}
        </div>

        {/* Visibility */}
        {can("projects.publish") && (
          <div>
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Visibility on the website</div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select value={statusValue} onChange={(e) => setPendingStatus(e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              {pendingStatus && pendingStatus !== project.status && (
                <button
                  className="btn-primary shrink-0"
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate(pendingStatus)}
                >
                  {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                </button>
              )}
            </div>
            <ErrorNote error={statusMutation.error} />
          </div>
        )}

        {/* Post an update */}
        {can("projects.manage") && (
          <div>
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Share a progress update</div>
            <div className="space-y-2 rounded-xl border border-border p-3.5">
              <input
                className="input"
                placeholder="Headline — e.g. 8th R.O. plant goes live"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
              />
              <textarea
                className="input"
                rows={2}
                placeholder="A few details (optional)"
                value={updateBody}
                onChange={(e) => setUpdateBody(e.target.value)}
              />
              <button
                className="btn-secondary !py-1.5 text-xs"
                disabled={updateMutation.isPending || updateTitle.length < 3}
                onClick={() => updateMutation.mutate()}
              >
                <Send className="h-3 w-3" />
                {updateMutation.isPending ? "Posting…" : "Post update"}
              </button>
              <ErrorNote error={updateMutation.error} />
            </div>
          </div>
        )}

        {/* Timeline */}
        {project.updates && project.updates.length > 0 && (
          <div>
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Updates ({project.updates.length})</div>
            <div className="space-y-2">
              {project.updates.map((u) => (
                <div key={u.id} className="rounded-xl border border-border/60 px-3.5 py-2.5">
                  <div className="text-2xs text-muted-foreground/70">{fmtDate(u.createdAt)}</div>
                  <div className="mt-0.5 text-[13px] font-semibold">{u.title}</div>
                  {u.body && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{u.body}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {editOpen && (
        <ProjectModal
          project={project}
          onClose={() => setEditOpen(false)}
          onDone={() => {
            qc.invalidateQueries({ queryKey: ["project", id] });
            onDone();
          }}
        />
      )}
      <ConfirmDialog
        open={deleteOpen}
        title={`Delete “${project.title}”?`}
        message="The project and its updates are removed. Past donations stay on record, just no longer linked to it."
        confirmLabel="Delete project"
        busy={deleteMutation.isPending}
        error={deleteMutation.error}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleteOpen(false)}
      />
    </Modal>
  );
}

function ProjectModal({ project, onClose, onDone }: { project: Project | null; onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [category, setCategory] = useState(project?.category ?? "education");
  const [location, setLocation] = useState(project?.location ?? "");
  const [goalAmount, setGoalAmount] = useState(project?.goalAmount ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);

  const mutation = useMutation({
    mutationFn: () => {
      const body = {
        title,
        summary: summary || null,
        description: description || null,
        category,
        location: location || null,
        goalAmount: goalAmount ? Number(goalAmount) : null,
        featured,
      };
      return project
        ? api(`/projects/${project.id}`, { method: "PATCH", body })
        : api("/projects", { method: "POST", body });
    },
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal
      title={project ? "Edit project" : "New project"}
      description={project ? project.title : "Tell the story — what it is, where it runs, what it needs."}
      open
      onClose={onClose}
      wide
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
            {mutation.isPending ? "Saving…" : project ? "Save changes" : "Create project"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Clean Water Initiative" />
        </Field>
        <Field label="Summary (shown on cards)">
          <textarea className="input" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </Field>
        <Field label="Full description">
          <textarea className="input" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="water">Water</option>
              <option value="food">Food</option>
              <option value="welfare">Welfare</option>
            </Select>
          </Field>
          <Field label="Location">
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bengaluru, India" />
          </Field>
          <Field label="Fundraising goal (₹)">
            <input className="input" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} placeholder="No goal" />
          </Field>
        </div>
        <Checkbox
          checked={featured}
          onChange={setFeatured}
          label="Feature on the homepage"
          hint="Featured projects appear in the top row of the public site."
        />
        <ErrorNote error={mutation.error} />
      </div>
    </Modal>
  );
}
