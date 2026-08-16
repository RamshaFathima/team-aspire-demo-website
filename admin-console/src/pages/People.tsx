import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, fmtDate } from "@/lib/api";
import { Badge, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  roles: string[];
  createdAt: string;
};

type UserList = { data: User[]; page: number; limit: number; total: number };
type Role = { id: string; key: string; name: string };

export default function People() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => api<UserList>(`/users?page=${page}&limit=15&search=${encodeURIComponent(search)}`),
  });

  const { data: roles } = useQuery({
    queryKey: ["rbac-roles-lite"],
    queryFn: () => api<Role[]>("/rbac/roles"),
    enabled: can("roles.manage"),
  });

  return (
    <>
      <PageHeader
        title="People"
        subtitle="Members, students, teachers and staff — one identity each."
        actions={
          can("users.create") && (
            <button className="btn-primary" onClick={() => setCreateOpen(true)}>+ New person</button>
          )
        }
      />

      <input
        className="input mb-4 max-w-sm"
        placeholder="Search name or email…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="th">Name</th>
                <th className="th">Email</th>
                <th className="th">Roles</th>
                <th className="th">Status</th>
                <th className="th">Joined</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="td font-semibold">{u.fullName}</td>
                  <td className="td text-slate-500">{u.email}</td>
                  <td className="td">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length ? u.roles.map((r) => <Badge key={r} value={r.toLowerCase()} />) : <span className="text-slate-300">—</span>}
                    </div>
                  </td>
                  <td className="td"><Badge value={u.status} /></td>
                  <td className="td text-slate-500">{fmtDate(u.createdAt)}</td>
                  <td className="td text-right">
                    {(can("users.update") || can("roles.manage")) && (
                      <button className="btn-secondary !px-2.5 !py-1 text-xs" onClick={() => setEditUser(u)}>
                        Manage
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            <span>{data?.total} people</span>
            <div className="flex gap-2">
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={!data || page * data.limit >= data.total} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} roles={roles ?? []} onDone={() => qc.invalidateQueries({ queryKey: ["users"] })} />
      {editUser && (
        <EditUserModal user={editUser} roles={roles ?? []} onClose={() => setEditUser(null)} onDone={() => qc.invalidateQueries({ queryKey: ["users"] })} />
      )}
    </>
  );
}

function CreateUserModal({ open, onClose, roles, onDone }: { open: boolean; onClose: () => void; roles: Role[]; onDone: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleKeys, setRoleKeys] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: () => api("/users", { method: "POST", body: { fullName, email, password, roleKeys } }),
    onSuccess: () => { onDone(); onClose(); setFullName(""); setEmail(""); setPassword(""); setRoleKeys([]); },
  });

  return (
    <Modal title="New person" open={open} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Full name"><input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} /></Field>
        <Field label="Email"><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Temporary password"><input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" /></Field>
        {roles.length > 0 && (
          <Field label="Roles">
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRoleKeys((prev) => prev.includes(r.key) ? prev.filter((k) => k !== r.key) : [...prev, r.key])}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    roleKeys.includes(r.key) ? "border-maroon-700 bg-maroon-700 text-white" : "border-slate-200 text-slate-600 hover:border-maroon-300"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </Field>
        )}
        <ErrorNote error={mutation.error} />
        <button className="btn-primary w-full" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "Creating…" : "Create person"}
        </button>
      </div>
    </Modal>
  );
}

function EditUserModal({ user, roles, onClose, onDone }: { user: User; roles: Role[]; onClose: () => void; onDone: () => void }) {
  const [status, setStatus] = useState(user.status);
  const [roleKeys, setRoleKeys] = useState<string[]>(user.roles);

  const statusMutation = useMutation({
    mutationFn: () => api(`/users/${user.id}`, { method: "PATCH", body: { status } }),
    onSuccess: onDone,
  });
  const rolesMutation = useMutation({
    mutationFn: () => api(`/users/${user.id}/roles`, { method: "PUT", body: { roleKeys } }),
    onSuccess: onDone,
  });

  return (
    <Modal title={`Manage · ${user.fullName}`} open onClose={onClose}>
      <div className="space-y-5">
        {can("users.update") && (
          <div>
            <Field label="Account status">
              <div className="flex gap-2">
                <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
                <button className="btn-secondary shrink-0" disabled={statusMutation.isPending} onClick={() => statusMutation.mutate()}>
                  Save
                </button>
              </div>
            </Field>
            <ErrorNote error={statusMutation.error} />
          </div>
        )}
        {can("roles.manage") && (
          <div>
            <Field label="Roles">
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRoleKeys((prev) => prev.includes(r.key) ? prev.filter((k) => k !== r.key) : [...prev, r.key])}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      roleKeys.includes(r.key) ? "border-maroon-700 bg-maroon-700 text-white" : "border-slate-200 text-slate-600 hover:border-maroon-300"
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </Field>
            <button className="btn-primary mt-3 w-full" disabled={rolesMutation.isPending} onClick={() => rolesMutation.mutate()}>
              {rolesMutation.isPending ? "Saving…" : "Save roles"}
            </button>
            <ErrorNote error={rolesMutation.error} />
          </div>
        )}
      </div>
    </Modal>
  );
}
