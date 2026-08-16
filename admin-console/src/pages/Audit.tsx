import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, fmtDateTime } from "@/lib/api";
import { PageHeader, Spinner } from "@/components/ui";

type AuditLog = {
  id: string;
  actorEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  ip: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export default function Audit() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["audit", page, action],
    queryFn: () =>
      api<{ data: AuditLog[]; total: number; limit: number }>(
        `/audit?page=${page}&limit=30&action=${encodeURIComponent(action)}`,
      ),
  });

  return (
    <>
      <PageHeader title="Audit Log" subtitle="Every sensitive operation, recorded. Immutable by policy." />

      <input className="input mb-4 max-w-sm" placeholder="Filter by action (e.g. donation.refund)…" value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="th">When</th>
                <th className="th">Actor</th>
                <th className="th">Action</th>
                <th className="th">Resource</th>
                <th className="th">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 last:border-0">
                  <td className="td whitespace-nowrap text-xs text-slate-500">{fmtDateTime(log.createdAt)}</td>
                  <td className="td text-xs">{log.actorEmail ?? "system"}</td>
                  <td className="td"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{log.action}</code></td>
                  <td className="td text-xs text-slate-500">
                    {log.resourceType}
                    {log.resourceId && <span className="ml-1 font-mono text-[10px] text-slate-400">{log.resourceId.slice(0, 8)}…</span>}
                  </td>
                  <td className="td max-w-xs truncate font-mono text-[10px] text-slate-400">
                    {Object.keys(log.metadata ?? {}).length ? JSON.stringify(log.metadata) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            <span>{data?.total} entries</span>
            <div className="flex gap-2">
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={!data || page * data.limit >= data.total} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
