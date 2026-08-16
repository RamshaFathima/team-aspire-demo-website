import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  GripVertical,
  HelpCircle,
  Heading1,
  LayoutTemplate,
  ListPlus,
  Megaphone,
  Plus,
  Sigma,
  Trash2,
  Type,
} from "lucide-react";
import { api, fmtDateTime } from "@/lib/api";
import { Badge, EmptyState, ErrorNote, Field, Modal, PageHeader, TableSkeleton } from "@/components/ui";
import { Card } from "@/components/ui/card";

type Block = {
  type: "hero" | "richText" | "stats" | "cta" | "faq";
  heading?: string;
  subheading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  items?: { label?: string; value?: string; q?: string; a?: string }[];
};

type Page = {
  id: string;
  slug: string;
  title: string;
  status: string;
  blocks: Block[];
  seo: { title?: string; description?: string };
  updatedAt: string;
};

const BLOCK_META: Record<
  Block["type"],
  { label: string; hint: string; icon: React.ComponentType<{ className?: string }> }
> = {
  hero: { label: "Hero banner", hint: "Big heading at the top of the page", icon: Heading1 },
  richText: { label: "Text section", hint: "A heading with paragraphs", icon: Type },
  stats: { label: "Numbers", hint: "Impact figures in a row", icon: Sigma },
  cta: { label: "Call to action", hint: "A banner with a button", icon: Megaphone },
  faq: { label: "FAQ", hint: "Questions & answers", icon: HelpCircle },
};

const NEW_BLOCK: Record<Block["type"], Block> = {
  hero: { type: "hero", heading: "", subheading: "" },
  richText: { type: "richText", heading: "", body: "" },
  stats: { type: "stats", items: [{ label: "", value: "" }] },
  cta: { type: "cta", heading: "", body: "", ctaLabel: "Donate", ctaHref: "/donate" },
  faq: { type: "faq", items: [{ q: "", a: "" }] },
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
        subtitle="Build website pages from blocks — no code needed."
        actions={
          <button className="btn-primary" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New page
          </button>
        }
      />

      {isLoading ? (
        <TableSkeleton />
      ) : !pages?.length ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No pages yet"
            description='Create a page like "About" and it appears on the website once published.'
          />
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Page</th>
                <th className="th">Content</th>
                <th className="th">Status</th>
                <th className="th">Updated</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {pages?.map((p) => (
                <tr key={p.id} className="border-b border-border/40 last:border-0">
                  <td className="td">
                    <div className="font-medium">{p.title}</div>
                    <div className="font-mono text-2xs text-muted-foreground/70">/{p.slug}</div>
                  </td>
                  <td className="td text-muted-foreground">
                    {p.blocks.length} {p.blocks.length === 1 ? "block" : "blocks"}
                  </td>
                  <td className="td">
                    <Badge value={p.status} />
                  </td>
                  <td className="td text-xs text-muted-foreground">{fmtDateTime(p.updatedAt)}</td>
                  <td className="td space-x-2 text-right">
                    <button
                      className="btn-secondary !px-2.5 !py-1 text-xs"
                      disabled={publishMutation.isPending}
                      onClick={() => publishMutation.mutate({ id: p.id, publish: p.status !== "published" })}
                    >
                      {p.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button className="btn-primary !px-2.5 !py-1 text-xs" onClick={() => setEditing(p)}>
                      Open builder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {(createOpen || editing) && (
        <PageBuilder
          page={editing}
          onClose={() => {
            setCreateOpen(false);
            setEditing(null);
          }}
          onDone={refresh}
        />
      )}
    </>
  );
}

/* ── Visual page builder ─────────────────────────────────────── */

function PageBuilder({ page, onClose, onDone }: { page: Page | null; onClose: () => void; onDone: () => void }) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [seoTitle, setSeoTitle] = useState(page?.seo?.title ?? "");
  const [seoDescription, setSeoDescription] = useState(page?.seo?.description ?? "");
  const [blocks, setBlocks] = useState<Block[]>(page?.blocks ?? []);
  const [openIndex, setOpenIndex] = useState<number | null>(page?.blocks?.length ? 0 : null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [seoOpen, setSeoOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => {
      const body = {
        title,
        slug: slug || undefined,
        blocks,
        seo: { title: seoTitle || undefined, description: seoDescription || undefined },
      };
      return page ? api(`/cms/pages/${page.id}`, { method: "PATCH", body }) : api("/cms/pages", { method: "POST", body });
    },
    onSuccess: () => {
      onDone();
      onClose();
    },
  });

  const patchBlock = (index: number, patch: Partial<Block>) =>
    setBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));

  const addBlock = (type: Block["type"]) => {
    setBlocks((prev) => [...prev, structuredClone(NEW_BLOCK[type])]);
    setOpenIndex(blocks.length);
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    setOpenIndex(null);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    setBlocks((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setOpenIndex(to);
  };

  const handleDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) return;
    move(dragIndex, target);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <Modal
      title={page ? `Editing “${page.title}”` : "New page"}
      description="Stack blocks, drag ⋮⋮ to reorder, then save. Published pages appear on the website."
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
            disabled={mutation.isPending || title.length < 2}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : "Save page"}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-[1fr_200px] gap-3">
          <Field label="Page title">
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="About Team Aspire" />
          </Field>
          <Field label="Web address">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">/</span>
              <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="about" />
            </div>
          </Field>
        </div>

        {/* Blocks */}
        <div>
          <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Page content</div>
          {blocks.length === 0 && (
            <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
              <LayoutTemplate className="mx-auto mb-2 h-5 w-5 opacity-60" />
              Empty page — add your first block below.
            </div>
          )}
          <div className="space-y-2">
            {blocks.map((block, i) => {
              const meta = BLOCK_META[block.type];
              const open = openIndex === i;
              return (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverIndex(i);
                  }}
                  onDragLeave={() => setOverIndex((v) => (v === i ? null : v))}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className={`rounded-xl border bg-card transition ${
                    overIndex === i && dragIndex !== i
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                  } ${dragIndex === i ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-2 px-2.5 py-2">
                    <span className="cursor-grab text-muted-foreground/50 hover:text-muted-foreground" title="Drag to reorder">
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <meta.icon className="h-4 w-4 text-primary" />
                    <button
                      className="flex-1 text-left"
                      onClick={() => setOpenIndex(open ? null : i)}
                    >
                      <span className="text-[13px] font-medium">{meta.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {block.heading || block.body?.slice(0, 40) || meta.hint}
                      </span>
                    </button>
                    <button className="rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground" onClick={() => move(i, i - 1)} title="Move up">
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-md p-1 text-muted-foreground/60 hover:bg-muted hover:text-foreground" onClick={() => move(i, i + 1)} title="Move down">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-md p-1 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive" onClick={() => removeBlock(i)} title="Remove block">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {open && (
                    <div className="space-y-3 border-t border-border/60 px-3.5 py-3.5">
                      <BlockForm block={block} onChange={(patch) => patchBlock(i, patch)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add block */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(BLOCK_META) as Block["type"][]).map((type) => {
              const meta = BLOCK_META[type];
              return (
                <button
                  key={type}
                  className="btn-secondary !py-1.5 text-xs"
                  onClick={() => addBlock(type)}
                  title={meta.hint}
                >
                  <meta.icon className="h-3.5 w-3.5" /> {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-xl border border-border">
          <button
            className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[13px] font-medium"
            onClick={() => setSeoOpen((v) => !v)}
          >
            Search engine preview (optional)
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${seoOpen ? "rotate-180" : ""}`} />
          </button>
          {seoOpen && (
            <div className="space-y-3 border-t border-border/60 px-3.5 py-3.5">
              <Field label="Title shown on Google">
                <input className="input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || "Page title"} />
              </Field>
              <Field label="Short description">
                <input className="input" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="One sentence about this page" />
              </Field>
            </div>
          )}
        </div>

        <ErrorNote error={mutation.error} />
      </div>
    </Modal>
  );
}

/* ── Per-type block forms ────────────────────────────────────── */

function BlockForm({ block, onChange }: { block: Block; onChange: (patch: Partial<Block>) => void }) {
  const items = block.items ?? [];
  const patchItem = (index: number, patch: Record<string, string>) =>
    onChange({ items: items.map((it, i) => (i === index ? { ...it, ...patch } : it)) });
  const removeItem = (index: number) => onChange({ items: items.filter((_, i) => i !== index) });

  switch (block.type) {
    case "hero":
      return (
        <>
          <Field label="Big heading">
            <input className="input" value={block.heading ?? ""} onChange={(e) => onChange({ heading: e.target.value })} placeholder="A sisterhood rooted in deen & service" />
          </Field>
          <Field label="Line below it (optional)">
            <textarea className="input" rows={2} value={block.subheading ?? ""} onChange={(e) => onChange({ subheading: e.target.value })} />
          </Field>
        </>
      );
    case "richText":
      return (
        <>
          <Field label="Section heading (optional)">
            <input className="input" value={block.heading ?? ""} onChange={(e) => onChange({ heading: e.target.value })} placeholder="Who we are" />
          </Field>
          <Field label="Text">
            <textarea className="input" rows={5} value={block.body ?? ""} onChange={(e) => onChange({ body: e.target.value })} placeholder="Write freely — line breaks are kept." />
          </Field>
        </>
      );
    case "stats":
      return (
        <>
          {items.map((item, i) => (
            <div key={i} className="flex items-end gap-2">
              <Field label={i === 0 ? "Number" : ""}>
                <input className="input !w-32" value={item.value ?? ""} onChange={(e) => patchItem(i, { value: e.target.value })} placeholder="10+" />
              </Field>
              <div className="flex-1">
                <Field label={i === 0 ? "What it means" : ""}>
                  <input className="input" value={item.label ?? ""} onChange={(e) => patchItem(i, { label: e.target.value })} placeholder="Years of service" />
                </Field>
              </div>
              <button className="mb-1.5 rounded-md p-1.5 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive" onClick={() => removeItem(i)}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button className="btn-secondary !py-1.5 text-xs" onClick={() => onChange({ items: [...items, { label: "", value: "" }] })}>
            <ListPlus className="h-3.5 w-3.5" /> Add number
          </button>
        </>
      );
    case "cta":
      return (
        <>
          <Field label="Heading">
            <input className="input" value={block.heading ?? ""} onChange={(e) => onChange({ heading: e.target.value })} placeholder="Walk this journey with us" />
          </Field>
          <Field label="Text (optional)">
            <textarea className="input" rows={2} value={block.body ?? ""} onChange={(e) => onChange({ body: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Button text">
              <input className="input" value={block.ctaLabel ?? ""} onChange={(e) => onChange({ ctaLabel: e.target.value })} placeholder="Get involved" />
            </Field>
            <Field label="Button goes to">
              <input className="input" value={block.ctaHref ?? ""} onChange={(e) => onChange({ ctaHref: e.target.value })} placeholder="/contact" />
            </Field>
          </div>
        </>
      );
    case "faq":
      return (
        <>
          {items.map((item, i) => (
            <div key={i} className="space-y-2 rounded-lg border border-border/60 p-3">
              <div className="flex items-center gap-2">
                <input className="input" value={item.q ?? ""} onChange={(e) => patchItem(i, { q: e.target.value })} placeholder="Question" />
                <button className="rounded-md p-1.5 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive" onClick={() => removeItem(i)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea className="input" rows={2} value={item.a ?? ""} onChange={(e) => patchItem(i, { a: e.target.value })} placeholder="Answer" />
            </div>
          ))}
          <button className="btn-secondary !py-1.5 text-xs" onClick={() => onChange({ items: [...items, { q: "", a: "" }] })}>
            <ListPlus className="h-3.5 w-3.5" /> Add question
          </button>
        </>
      );
    default:
      return null;
  }
}
