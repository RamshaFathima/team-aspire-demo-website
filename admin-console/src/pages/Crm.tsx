import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, fmtDate, fmtDateTime, inr } from "@/lib/api";
import { Avatar, Badge, ErrorNote, Modal, PageHeader, TableSkeleton } from "@/components/ui";

type Contact = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  type: string;
  tags: string[];
  updatedAt: string;
};

type Person360 = Contact & {
  totalDonated: number;
  donations: { id: string; amount: string; status: string; receiptNumber: string | null; createdAt: string }[];
  enrollments: { id: string; status: string; courseTitle: string; cohortName: string }[];
  certificates: { id: string; title: string; certificateNumber: string; status: string }[];
  timeline: { id: string; kind: string; subject: string; detail: string | null; occurredAt: string }[];
  notes: string | null;
};

const KIND_ICONS: Record<string, string> = {
  donation: "₹",
  enrollment: "📚",
  event: "★",
  form: "✉",
  note: "✎",
  email: "@",
  call: "☎",
  meeting: "⧉",
};

export default function Crm() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["contacts", page, search, type],
    queryFn: () =>
      api<{ data: Contact[]; total: number; limit: number }>(
        `/crm/contacts?page=${page}&limit=15&search=${encodeURIComponent(search)}&type=${type}`,
      ),
  });

  return (
    <>
      <PageHeader title="CRM · Contacts" subtitle="Everyone the NGO relates to — donors, students, volunteers." />

      <div className="mb-4 flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search name or email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select className="input max-w-[160px]" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <option value="">All types</option>
          {["donor", "volunteer", "student", "teacher", "partner", "other"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Name</th>
                <th className="th">Contact</th>
                <th className="th">Type</th>
                <th className="th">Tags</th>
                <th className="th">Updated</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((c) => (
                <tr key={c.id} className="cursor-pointer border-b border-border/40 last:border-0 hover:bg-muted/50" onClick={() => setSelectedId(c.id)}>
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.fullName} />
                      <span className="font-medium">{c.fullName}</span>
                    </div>
                  </td>
                  <td className="td text-xs text-muted-foreground">
                    {c.email ?? "—"}{c.phone ? ` · ${c.phone}` : ""}
                  </td>
                  <td className="td"><Badge value={c.type} /></td>
                  <td className="td text-xs text-muted-foreground">{c.tags.join(", ") || "—"}</td>
                  <td className="td text-xs text-muted-foreground">{fmtDate(c.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <span>{data?.total} contacts</span>
            <div className="flex gap-2">
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={!data || page * data.limit >= data.total} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}

      {selectedId && <Person360Modal id={selectedId} onClose={() => setSelectedId(null)} />}
    </>
  );
}

function Person360Modal({ id, onClose }: { id: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [note, setNote] = useState("");

  const { data: person } = useQuery({
    queryKey: ["person360", id],
    queryFn: () => api<Person360>(`/crm/contacts/${id}`),
  });

  const noteMutation = useMutation({
    mutationFn: () =>
      api(`/crm/contacts/${id}/interactions`, {
        method: "POST",
        body: { kind: "note", subject: note },
      }),
    onSuccess: () => { setNote(""); qc.invalidateQueries({ queryKey: ["person360", id] }); },
  });

  if (!person) return null;

  return (
    <Modal title={person.fullName} open onClose={onClose} wide>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge value={person.type} />
        {person.email && <span>{person.email}</span>}
        {person.phone && <span>· {person.phone}</span>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-muted/60 p-3 text-center">
          <div className="text-lg font-bold text-foreground/90">{inr(person.totalDonated)}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Donated</div>
        </div>
        <div className="rounded-lg bg-muted/60 p-3 text-center">
          <div className="text-lg font-bold text-foreground/90">{person.enrollments.length}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Courses</div>
        </div>
        <div className="rounded-lg bg-muted/60 p-3 text-center">
          <div className="text-lg font-bold text-foreground/90">{person.certificates.length}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Certificates</div>
        </div>
      </div>

      {person.enrollments.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground/70">Learning</div>
          <div className="mt-1.5 space-y-1">
            {person.enrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                <span>{e.courseTitle} <span className="text-xs text-muted-foreground/70">· {e.cohortName}</span></span>
                <Badge value={e.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {can("crm.manage") && (
        <div className="mt-4 flex gap-2">
          <input className="input" placeholder="Add a note to the timeline…" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn-primary shrink-0" disabled={note.length < 2 || noteMutation.isPending} onClick={() => noteMutation.mutate()}>
            Add note
          </button>
        </div>
      )}
      <ErrorNote error={noteMutation.error} />

      <div className="mt-5">
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground/70">Timeline</div>
        <div className="mt-2 max-h-64 space-y-2 overflow-y-auto pr-1">
          {person.timeline.map((t) => (
            <div key={t.id} className="flex gap-3 rounded-lg border border-border/60 px-3 py-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-primary">
                {KIND_ICONS[t.kind] ?? "·"}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground/90">{t.subject}</div>
                {t.detail && <div className="truncate text-xs text-muted-foreground">{t.detail}</div>}
                <div className="text-[10px] text-muted-foreground/70">{fmtDateTime(t.occurredAt)}</div>
              </div>
            </div>
          ))}
          {person.timeline.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground/70">No interactions yet.</p>}
        </div>
      </div>
    </Modal>
  );
}
