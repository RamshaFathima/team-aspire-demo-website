import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, inr } from "@/lib/api";
import { Badge, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";
import { Select } from "@/components/ui/select";

type Campaign = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  goalAmount: string | null;
  raisedAmount: string;
  status: string;
  project?: { id: string; title: string } | null;
};

type Project = { id: string; title: string };

export default function Campaigns() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => api<Campaign[]>("/donations/campaigns/list"),
  });
  const { data: projects } = useQuery({
    queryKey: ["projects-lite"],
    queryFn: async () => (await api<{ data: Project[] }>("/projects?limit=100")).data,
    enabled: can("projects.read"),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["campaigns"] });

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Time-bound fundraising drives, optionally tied to a project."
        actions={can("campaigns.manage") && <button className="btn-primary" onClick={() => setOpen(true)}>+ New campaign</button>}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns?.map((c) => {
            const progress = c.goalAmount ? Math.min(100, Math.round((Number(c.raisedAmount) / Number(c.goalAmount)) * 100)) : 0;
            return (
              <div key={c.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-foreground/90">{c.title}</h3>
                  <Badge value={c.status} />
                </div>
                {c.project && <div className="mt-1 text-xs text-muted-foreground/70">↳ {c.project.title}</div>}
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(2, progress)}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="font-bold text-foreground/80">{inr(c.raisedAmount)}</span>
                    <span className="text-muted-foreground/70">{c.goalAmount ? `of ${inr(c.goalAmount)} (${progress}%)` : "no goal"}</span>
                  </div>
                </div>
                {can("campaigns.manage") && (
                  <button className="btn-secondary mt-4 w-full !py-1.5 text-xs" onClick={() => setEditing(c)}>Edit</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(open || editing) && (
        <CampaignModal
          campaign={editing}
          projects={projects ?? []}
          onClose={() => { setOpen(false); setEditing(null); }}
          onDone={refresh}
        />
      )}
    </>
  );
}

function CampaignModal({ campaign, projects, onClose, onDone }: { campaign: Campaign | null; projects: Project[]; onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState(campaign?.title ?? "");
  const [description, setDescription] = useState(campaign?.description ?? "");
  const [projectId, setProjectId] = useState(campaign?.project?.id ?? "");
  const [goalAmount, setGoalAmount] = useState(campaign?.goalAmount ?? "");
  const [status, setStatus] = useState(campaign?.status ?? "active");

  const mutation = useMutation({
    mutationFn: () => {
      const body = {
        title,
        description: description || null,
        projectId: projectId || null,
        goalAmount: goalAmount ? Number(goalAmount) : null,
        status,
      };
      return campaign
        ? api(`/donations/campaigns/${campaign.id}`, { method: "PATCH", body })
        : api("/donations/campaigns", { method: "POST", body });
    },
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal
      title={campaign ? "Edit campaign" : "New campaign"}
      description="A time-bound fundraising drive, optionally tied to a project."
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
            {mutation.isPending ? "Saving…" : campaign ? "Save changes" : "Create campaign"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Restoring Hope" />
        </Field>
        <Field label="Description">
          <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Linked project">
            <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Goal (₹)">
            <input className="input" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
          </Field>
        </div>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active — accepting donations</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
        <ErrorNote error={mutation.error} />
      </div>
    </Modal>
  );
}
