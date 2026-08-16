import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, fmtDateTime } from "@/lib/api";
import { Badge, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";

type Page = {
  id: string;
  slug: string;
  title: string;
  status: string;
  blocks: unknown[];
  seo: { title?: string; description?: string };
  updatedAt: string;
};

export default function Cms() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Page | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: pages, isLoading } = useQuery({
    queryKey: ["cms-pages"],
    queryFn: () => api<Page[]>("/cms/pages"),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      api(`/cms/pages/${id}/publish`, { method: "POST", body: { publish } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cms-pages"] }),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["cms-pages"] });

  return (
    <>
      <PageHeader
        title="Pages"
        subtitle="Block-based CMS pages rendered on the public site (e.g. /about)."
        actions={<button className="btn-primary" onClick={() => setCreateOpen(true)}>+ New page</button>}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Page</th>
                <th className="th">Blocks</th>
                <th className="th">Status</th>
                <th className="th">Updated</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {pages?.map((p) => (
                <tr key={p.id} className="border-b border-border/40 last:border-0">
                  <td className="td">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs text-muted-foreground/70">/{p.slug}</div>
                  </td>
                  <td className="td text-muted-foreground">{p.blocks.length} blocks</td>
                  <td className="td"><Badge value={p.status} /></td>
                  <td className="td text-xs text-muted-foreground">{fmtDateTime(p.updatedAt)}</td>
                  <td className="td space-x-2 text-right">
                    <button
                      className="btn-secondary !px-2.5 !py-1 text-xs"
                      disabled={publishMutation.isPending}
                      onClick={() => publishMutation.mutate({ id: p.id, publish: p.status !== "published" })}
                    >
                      {p.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button className="btn-primary !px-2.5 !py-1 text-xs" onClick={() => setEditing(p)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(createOpen || editing) && (
        <PageModal page={editing} onClose={() => { setCreateOpen(false); setEditing(null); }} onDone={refresh} />
      )}
    </>
  );
}

function PageModal({ page, onClose, onDone }: { page: Page | null; onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [seoTitle, setSeoTitle] = useState(page?.seo?.title ?? "");
  const [seoDescription, setSeoDescription] = useState(page?.seo?.description ?? "");
  const [blocksJson, setBlocksJson] = useState(JSON.stringify(page?.blocks ?? [], null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      let blocks: unknown[];
      try {
        blocks = JSON.parse(blocksJson);
        if (!Array.isArray(blocks)) throw new Error("Blocks must be a JSON array");
      } catch (e) {
        setJsonError((e as Error).message);
        throw { message: "Invalid blocks JSON" };
      }
      setJsonError(null);
      const body = {
        title,
        slug: slug || undefined,
        blocks,
        seo: { title: seoTitle || undefined, description: seoDescription || undefined },
      };
      return page
        ? api(`/cms/pages/${page.id}`, { method: "PATCH", body })
        : api("/cms/pages", { method: "POST", body });
    },
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal title={page ? `Edit /${page.slug}` : "New page"} open onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Title"><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Slug"><input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="about" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="SEO title"><input className="input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></Field>
          <Field label="SEO description"><input className="input" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></Field>
        </div>
        <Field label="Blocks (JSON — hero | richText | stats | cta | faq)">
          <textarea
            className="input font-mono !text-xs"
            rows={16}
            value={blocksJson}
            onChange={(e) => setBlocksJson(e.target.value)}
            spellCheck={false}
          />
        </Field>
        {jsonError && <p className="text-xs text-rose-600">{jsonError}</p>}
        <ErrorNote error={mutation.error} />
        <button className="btn-primary w-full" disabled={mutation.isPending || title.length < 2} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "Saving…" : "Save page"}
        </button>
      </div>
    </Modal>
  );
}
