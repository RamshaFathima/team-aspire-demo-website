import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, fmtDate, inr } from "@/lib/api";
import { Badge, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";

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
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="th">Project</th>
                <th className="th">Category</th>
                <th className="th">Raised / Goal</th>
                <th className="th">Status</th>
                <th className="th">Created</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((p) => (
                <tr key={p.id} className="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50/60" onClick={() => setSelectedId(p.id)}>
                  <td className="td">
                    <div className="font-semibold">{p.title} {p.featured && <span className="text-gold-500">★</span>}</div>
                    <div className="text-xs text-slate-400">/{p.slug}</div>
                  </td>
                  <td className="td capitalize text-slate-500">{p.category ?? "—"}</td>
                  <td className="td">
                    <span className="font-semibold">{inr(p.raisedAmount)}</span>
                    <span className="text-slate-400"> / {p.goalAmount ? inr(p.goalAmount) : "∞"}</span>
                  </td>
                  <td className="td"><Badge value={p.status} /></td>
                  <td className="td text-slate-500">{fmtDate(p.createdAt)}</td>
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
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");

  const { data: project } = useQuery({
    queryKey: ["project", id],
    queryFn: () => api<Project>(`/projects/${id}`),
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => api(`/projects/${id}/status`, { method: "POST", body: { status } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["project", id] }); onDone(); },
  });

  const updateMutation = useMutation({
    mutationFn: () => api(`/projects/${id}/updates`, { method: "POST", body: { title: updateTitle, body: updateBody || undefined } }),
    onSuccess: () => { setUpdateTitle(""); setUpdateBody(""); qc.invalidateQueries({ queryKey: ["project", id] }); },
  });

  if (!project) return null;

  return (
    <Modal title={project.title} open onClose={onClose} wide>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge value={project.status} />
        <span className="text-xs text-slate-400">
          {inr(project.raisedAmount)} raised {project.goalAmount ? `of ${inr(project.goalAmount)}` : ""}
        </span>
        <div className="ml-auto flex gap-2">
          {can("projects.publish") &&
            ["draft", "active", "completed", "archived"]
              .filter((s) => s !== project.status)
              .map((s) => (
                <button key={s} className="btn-secondary !px-2.5 !py-1 text-xs capitalize" disabled={statusMutation.isPending} onClick={() => statusMutation.mutate(s)}>
                  → {s}
                </button>
              ))}
          {can("projects.manage") && (
            <button className="btn-primary !px-2.5 !py-1 text-xs" onClick={() => setEditOpen(true)}>Edit</button>
          )}
        </div>
      </div>
      <ErrorNote error={statusMutation.error} />

      <p className="text-sm text-slate-600">{project.summary}</p>

      {can("projects.manage") && (
        <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50/60 p-4">
          <span className="label">Post an update</span>
          <input className="input" placeholder="Update title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
          <textarea className="input mt-2" rows={2} placeholder="Details (optional)" value={updateBody} onChange={(e) => setUpdateBody(e.target.value)} />
          <button className="btn-primary mt-2 !py-1.5 text-xs" disabled={updateMutation.isPending || updateTitle.length < 3} onClick={() => updateMutation.mutate()}>
            {updateMutation.isPending ? "Posting…" : "Post update"}
          </button>
          <ErrorNote error={updateMutation.error} />
        </div>
      )}

      <div className="mt-5 space-y-3">
        {project.updates?.map((u) => (
          <div key={u.id} className="rounded-lg border border-slate-100 p-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{fmtDate(u.createdAt)}</span>
            </div>
            <div className="mt-0.5 text-sm font-semibold text-slate-800">{u.title}</div>
            {u.body && <p className="mt-1 text-xs text-slate-500">{u.body}</p>}
          </div>
        ))}
      </div>

      {editOpen && <ProjectModal project={project} onClose={() => setEditOpen(false)} onDone={() => { qc.invalidateQueries({ queryKey: ["project", id] }); onDone(); }} />}
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
    <Modal title={project ? "Edit project" : "New project"} open onClose={onClose} wide>
      <div className="space-y-4">
        <Field label="Title"><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Summary (card text)"><textarea className="input" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} /></Field>
        <Field label="Full description"><textarea className="input" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Category">
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {["education", "health", "water", "food", "welfare"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Location"><input className="input" value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
          <Field label="Goal (₹)"><input className="input" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 accent-maroon-700" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured on homepage
        </label>
        <ErrorNote error={mutation.error} />
        <button className="btn-primary w-full" disabled={mutation.isPending || title.length < 3} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "Saving…" : "Save project"}
        </button>
      </div>
    </Modal>
  );
}
