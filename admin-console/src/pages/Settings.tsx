import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
  const initial = setting?.value;
  const initialKind: "text" | "number" | "toggle" =
    typeof initial === "number" ? "number" : typeof initial === "boolean" ? "toggle" : "text";
  const [kind, setKind] = useState<"text" | "number" | "toggle">(initialKind);
  const [textValue, setTextValue] = useState(typeof initial === "string" ? initial : "");
  const [numberValue, setNumberValue] = useState(typeof initial === "number" ? String(initial) : "");
  const [boolValue, setBoolValue] = useState(initial === true);
  const [description, setDescription] = useState(setting?.description ?? "");

  const mutation = useMutation({
    mutationFn: () => {
      const value: unknown =
        kind === "number" ? Number(numberValue || 0) : kind === "toggle" ? boolValue : textValue;
      return api(`/settings/${encodeURIComponent(key)}`, {
        method: "PUT",
        body: { value, description: description || undefined },
      });
    },
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal
      title={setting ? `Edit setting` : "New setting"}
      description={setting ? setting.key : "site.*, features.* and donations.* are visible to the public website."}
      open
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={!key || mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Saving…" : "Save setting"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {!setting && (
          <Field label="Key (e.g. site.tagline)">
            <input className="input font-mono" value={key} onChange={(e) => setKey(e.target.value)} />
          </Field>
        )}
        <Field label="Type">
          <Select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="toggle">On / Off</option>
          </Select>
        </Field>
        <Field label="Value">
          {kind === "text" && (
            <input className="input" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
          )}
          {kind === "number" && (
            <input className="input" type="number" value={numberValue} onChange={(e) => setNumberValue(e.target.value)} />
          )}
          {kind === "toggle" && (
            <Checkbox checked={boolValue} onChange={setBoolValue} label={boolValue ? "Enabled" : "Disabled"} />
          )}
        </Field>
        <Field label="Description">
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <ErrorNote error={mutation.error} />
      </div>
    </Modal>
  );
}
