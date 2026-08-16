import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, fmtDateTime, inr } from "@/lib/api";
import { Badge, ErrorNote, Modal, PageHeader, Spinner } from "@/components/ui";

type Donation = {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: string;
  status: string;
  method: string;
  frequency: string;
  isAnonymous: boolean;
  receiptNumber: string | null;
  gatewayRef: string;
  message: string | null;
  refundReason: string | null;
  createdAt: string;
  project?: { title: string } | null;
  campaign?: { title: string } | null;
};

type DonationList = { data: Donation[]; page: number; limit: number; total: number; successTotal: string | number };

const STATUSES = ["", "success", "pending", "initiated", "failed", "refunded"];

export default function Donations() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Donation | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["donations", page, status, search],
    queryFn: () =>
      api<DonationList>(
        `/donations?page=${page}&limit=15&status=${status}&search=${encodeURIComponent(search)}`,
      ),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["donations"] });

  return (
    <>
      <PageHeader
        title="Donations"
        subtitle={data ? `${inr(data.successTotal)} received across ${data.total} records (filtered)` : undefined}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search donor, email, receipt…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select className="input max-w-[160px]" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s ? s : "All statuses"}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Donor</th>
                <th className="th !text-right">Amount</th>
                <th className="th">Towards</th>
                <th className="th">Method</th>
                <th className="th">Status</th>
                <th className="th">Receipt</th>
                <th className="th">When</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((d) => (
                <tr key={d.id} className="cursor-pointer border-b border-border/40 last:border-0 hover:bg-muted/50" onClick={() => setSelected(d)}>
                  <td className="td">
                    <div className="font-semibold">{d.isAnonymous ? "Anonymous" : d.donorName}</div>
                    <div className="text-xs text-muted-foreground/70">{d.donorEmail}</div>
                  </td>
                  <td className="td num font-semibold">{inr(d.amount)}</td>
                  <td className="td text-muted-foreground">{d.campaign?.title ?? d.project?.title ?? "General"}</td>
                  <td className="td text-xs uppercase text-muted-foreground">{d.method.replace("mock_", "")}</td>
                  <td className="td"><Badge value={d.status} /></td>
                  <td className="td font-mono text-xs text-muted-foreground">{d.receiptNumber ?? "—"}</td>
                  <td className="td text-xs text-muted-foreground">{fmtDateTime(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <span>{data?.total} records</span>
            <div className="flex gap-2">
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={!data || page * data.limit >= data.total} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      )}

      {selected && <DonationModal donation={selected} onClose={() => setSelected(null)} onDone={refresh} />}
    </>
  );
}

function DonationModal({ donation, onClose, onDone }: { donation: Donation; onClose: () => void; onDone: () => void }) {
  const [refundReason, setRefundReason] = useState("");

  const confirmMutation = useMutation({
    mutationFn: () => api(`/donations/${donation.id}/confirm`, { method: "POST" }),
    onSuccess: () => { onDone(); onClose(); },
  });
  const refundMutation = useMutation({
    mutationFn: () => api(`/donations/${donation.id}/refund`, { method: "POST", body: { reason: refundReason } }),
    onSuccess: () => { onDone(); onClose(); },
  });

  return (
    <Modal title={`Donation · ${inr(donation.amount)}`} open onClose={onClose}>
      <dl className="space-y-2 text-sm">
        <Row label="Donor" value={`${donation.donorName} (${donation.donorEmail})`} />
        <Row label="Towards" value={donation.campaign?.title ?? donation.project?.title ?? "General fund"} />
        <Row label="Method" value={donation.method} />
        <Row label="Frequency" value={donation.frequency} />
        <Row label="Gateway ref" value={donation.gatewayRef} mono />
        <Row label="Receipt" value={donation.receiptNumber ?? "—"} mono />
        {donation.message && <Row label="Message" value={donation.message} />}
        {donation.refundReason && <Row label="Refund reason" value={donation.refundReason} />}
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <dt className="text-muted-foreground/70">Status</dt>
          <dd><Badge value={donation.status} /></dd>
        </div>
      </dl>

      <div className="mt-5 space-y-3">
        {["pending", "initiated"].includes(donation.status) && can("donations.manage") && (
          <>
            <button className="btn-primary w-full" disabled={confirmMutation.isPending} onClick={() => confirmMutation.mutate()}>
              {confirmMutation.isPending ? "Confirming…" : "Confirm payment received"}
            </button>
            <ErrorNote error={confirmMutation.error} />
          </>
        )}
        {donation.status === "success" && can("donations.refund") && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <span className="label !text-destructive">Refund</span>
            <input className="input" placeholder="Reason for refund…" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
            <button className="btn-danger mt-2 w-full" disabled={refundMutation.isPending || refundReason.length < 3} onClick={() => refundMutation.mutate()}>
              {refundMutation.isPending ? "Refunding…" : "Refund donation"}
            </button>
            <ErrorNote error={refundMutation.error} />
          </div>
        )}
      </div>
    </Modal>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-border/40 pb-2">
      <dt className="shrink-0 text-muted-foreground/70">{label}</dt>
      <dd className={`text-right font-medium text-foreground/80 ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
