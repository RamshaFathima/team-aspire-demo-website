import { useState } from "react";
import { Fragment } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ErrorNote, PageHeader, Spinner } from "@/components/ui";

type Role = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: string[];
};

type Permission = { id: string; key: string; description: string | null };

export default function Roles() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string[]>>({});

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["rbac-roles"],
    queryFn: () => api<Role[]>("/rbac/roles"),
  });
  const { data: permissions, isLoading: permsLoading } = useQuery({
    queryKey: ["rbac-permissions"],
    queryFn: () => api<Permission[]>("/rbac/permissions"),
  });

  const saveMutation = useMutation({
    mutationFn: ({ roleId, permissionKeys }: { roleId: string; permissionKeys: string[] }) =>
      api(`/rbac/roles/${roleId}/permissions`, { method: "PUT", body: { permissionKeys } }),
    onSuccess: (_, { roleId }) => {
      setDraft((d) => {
        const next = { ...d };
        delete next[roleId];
        return next;
      });
      qc.invalidateQueries({ queryKey: ["rbac-roles"] });
    },
  });

  if (rolesLoading || permsLoading) return <Spinner />;

  const grants = (role: Role) => draft[role.id] ?? role.permissions;

  const toggle = (role: Role, permKey: string) => {
    if (role.key === "SUPER_ADMIN") return;
    const current = grants(role);
    const next = current.includes(permKey) ? current.filter((p) => p !== permKey) : [...current, permKey];
    setDraft((d) => ({ ...d, [role.id]: next }));
  };

  const domains = [...new Set((permissions ?? []).map((p) => p.key.split(".")[0]))];

  return (
    <>
      <PageHeader title="Roles & Permissions" subtitle="The permission matrix — backend enforces every grant." />
      <ErrorNote error={saveMutation.error} />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border/60">
              <th className="th sticky left-0 bg-card">Permission</th>
              {roles?.map((r) => (
                <th key={r.id} className="th text-center">
                  <div>{r.name}</div>
                  {draft[r.id] && (
                    <button
                      className="mt-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white"
                      disabled={saveMutation.isPending}
                      onClick={() => saveMutation.mutate({ roleId: r.id, permissionKeys: draft[r.id] })}
                    >
                      Save
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <Fragment key={domain}>
                <tr className="bg-muted/60">
                  <td colSpan={1 + (roles?.length ?? 0)} className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                    {domain}
                  </td>
                </tr>
                {permissions
                  ?.filter((p) => p.key.startsWith(`${domain}.`) || p.key === domain)
                  .map((perm) => (
                    <tr key={perm.id} className="border-b border-border/40 last:border-0">
                      <td className="td sticky left-0 bg-card font-mono text-xs">{perm.key}</td>
                      {roles?.map((role) => {
                        const has = grants(role).includes(perm.key);
                        const locked = role.key === "SUPER_ADMIN";
                        return (
                          <td key={role.id} className="td text-center">
                            <button
                              disabled={locked}
                              onClick={() => toggle(role, perm.key)}
                              className={`h-5 w-5 rounded border text-[11px] font-bold leading-none transition ${
                                has
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-input bg-card text-transparent hover:border-primary/50"
                              } ${locked ? "opacity-60" : ""}`}
                            >
                              ✓
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
