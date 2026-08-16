import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";

type Setting = {
  key: string;
  value: unknown;
  description: string | null;
  updatedAt: string;
};

export default function Settings() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Setting | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api<Setting[]>("/settings"),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["settings"] });

  const groups = new Map<string, Setting[]>();
  for (const s of settings ?? []) {
    const group = s.key.split(".")[0];
    groups.set(group, [...(groups.get(group) ?? []), s]);
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Site config, feature flags and business rules. site.*, features.* and donations.* are public."
        actions={<button className="btn-primary" onClick={() => setCreateOpen(true)}>+ New setting</button>}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          {[...groups.entries()].map(([group, items]) => (
            <div key={group} className="card overflow-hidden">
              <div className="border-b border-border/60 bg-muted/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                {group}
              </div>
              <table className="w-full">
                <tbody>
                  {items.map((s) => (
                    <tr key={s.key} className="border-b border-border/40 last:border-0">
                      <td className="td w-72 font-mono text-xs">{s.key}</td>
                      <td className="td font-medium">{JSON.stringify(s.value)}</td>
                      <td className="td text-xs text-muted-foreground/70">{s.description}</td>
                      <td className="td text-right">
                        <button className="btn-secondary !px-2.5 !py-1 text-xs" onClick={() => setEditing(s)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {(editing || createOpen) && (
        <SettingModal setting={editing} onClose={() => { setEditing(null); setCreateOpen(false); }} onDone={refresh} />
      )}
    </>
  );
}

function SettingModal({ setting, onClose, onDone }: { setting: Setting | null; onClose: () => void; onDone: () => void }) {
  const [key, setKey] = useState(setting?.key ?? "");
  const [valueJson, setValueJson] = useState(JSON.stringify(setting?.value ?? ""));
  const [description, setDescription] = useState(setting?.description ?? "");

  const mutation = useMutation({
    mutationFn: () => {
      let value: unknown;
      try {
        value = JSON.parse(valueJson);
      } catch {
        throw { message: "Value must be valid JSON (strings need quotes: \"text\")" };
      }
      return api(`/settings/${encodeURIComponent(key)}`, {
        method: "PUT",
        body: { value, description: description || undefined },
      });
    },
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal title={setting ? `Edit ${setting.key}` : "New setting"} open onClose={onClose}>
      <div className="space-y-4">
        {!setting && (
          <Field label="Key (e.g. site.tagline)"><input className="input font-mono" value={key} onChange={(e) => setKey(e.target.value)} /></Field>
        )}
        <Field label='Value (JSON — e.g. "text", 10, true)'>
          <input className="input font-mono" value={valueJson} onChange={(e) => setValueJson(e.target.value)} />
        </Field>
        <Field label="Description"><input className="input" value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <ErrorNote error={mutation.error} />
        <button className="btn-primary w-full" disabled={!key || mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "Saving…" : "Save setting"}
        </button>
      </div>
    </Modal>
  );
}
