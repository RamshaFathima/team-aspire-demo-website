import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, can, fmtDate } from "@/lib/api";
import { Badge, ErrorNote, Field, Modal, PageHeader, Spinner } from "@/components/ui";
import { Select } from "@/components/ui/select";

type Certificate = {
  id: string;
  certificateNumber: string;
  verificationCode: string;
  title: string;
  status: string;
  issuedAt: string;
  holderName: string;
  holderEmail: string;
  courseTitle: string | null;
};

type CohortLite = { id: string; name: string; courseTitle: string; courseId: string };

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "http://localhost:3000";

type Eligibility = {
  cohort: { id: string; name: string; courseId: string; courseTitle: string; minAttendancePct: number };
  students: {
    userId: string;
    name: string;
    enrollmentStatus: string;
    totalSessions: number;
    attended: number;
    attendancePct: number;
    eligible: boolean;
    alreadyIssued: boolean;
    hasRevoked: boolean;
    certificateNumber: string | null;
  }[];
};

export default function Certificates() {
  const qc = useQueryClient();
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [revoking, setRevoking] = useState<Certificate | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: () => api<{ data: Certificate[]; total: number }>("/certificates?limit=50"),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["certificates"] });

  const reinstateMutation = useMutation({
    mutationFn: (id: string) => api(`/certificates/${id}/reinstate`, { method: "POST" }),
    onSuccess: refresh,
  });

  return (
    <>
      <PageHeader
        title="Certificates"
        subtitle="Issue, verify and revoke — every certificate is publicly verifiable."
        actions={can("certificates.issue") && (
          <button className="btn-primary" onClick={() => setEligibilityOpen(true)}>Issue from cohort</button>
        )}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Holder</th>
                <th className="th">Certificate</th>
                <th className="th">Code</th>
                <th className="th">Issued</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((c) => (
                <tr key={c.id} className="border-b border-border/40 last:border-0">
                  <td className="td">
                    <div className="font-semibold">{c.holderName}</div>
                    <div className="text-xs text-muted-foreground/70">{c.holderEmail}</div>
                  </td>
                  <td className="td">
                    <div className="font-medium">{c.title}</div>
                    <div className="font-mono text-xs text-muted-foreground/70">{c.certificateNumber}</div>
                  </td>
                  <td className="td font-mono text-xs">{c.verificationCode}</td>
                  <td className="td text-muted-foreground">{fmtDate(c.issuedAt)}</td>
                  <td className="td"><Badge value={c.status} /></td>
                  <td className="td text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`${SITE_URL}/certificates/${c.verificationCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary !px-2.5 !py-1 text-xs"
                      >
                        View
                      </a>
                      {c.status === "active" && can("certificates.revoke") && (
                        <button className="btn-danger !px-2.5 !py-1 text-xs" onClick={() => setRevoking(c)}>Revoke</button>
                      )}
                      {c.status === "revoked" && can("certificates.issue") && (
                        <button
                          className="btn-primary !px-2.5 !py-1 text-xs"
                          disabled={reinstateMutation.isPending}
                          onClick={() => reinstateMutation.mutate(c.id)}
                        >
                          Reinstate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {eligibilityOpen && <EligibilityModal onClose={() => setEligibilityOpen(false)} onDone={refresh} />}
      {revoking && <RevokeModal certificate={revoking} onClose={() => setRevoking(null)} onDone={refresh} />}
    </>
  );
}

function EligibilityModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [cohortId, setCohortId] = useState("");
  const [issued, setIssued] = useState<Record<string, boolean>>({});

  const { data: cohorts } = useQuery({
    queryKey: ["cohorts-lite"],
    queryFn: async () => (await api<{ data: CohortLite[] }>("/lms/cohorts")).data,
  });

  const { data: eligibility } = useQuery({
    queryKey: ["eligibility", cohortId],
    queryFn: () => api<Eligibility>(`/certificates/eligibility/${cohortId}`),
    enabled: !!cohortId,
  });

  const issueMutation = useMutation({
    mutationFn: (student: Eligibility["students"][number]) =>
      api("/certificates", {
        method: "POST",
        body: {
          userId: student.userId,
          courseId: eligibility!.cohort.courseId,
          cohortId: eligibility!.cohort.id,
          title: `Certificate of Completion — ${eligibility!.cohort.courseTitle}`,
          description: `Completed ${eligibility!.cohort.name} with ${student.attendancePct}% attendance.`,
        },
      }),
    onSuccess: (_, student) => {
      setIssued((prev) => ({ ...prev, [student.userId]: true }));
      onDone();
    },
  });

  return (
    <Modal
      title="Issue certificates"
      description="Pick a cohort — eligibility is computed from marked attendance."
      open
      onClose={onClose}
      wide
      footer={
        <button className="btn-secondary" onClick={onClose}>
          Done
        </button>
      }
    >
      <Select value={cohortId} onChange={(e) => setCohortId(e.target.value)}>
        <option value="">Select cohort…</option>
        {cohorts?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.courseTitle} · {c.name}
          </option>
        ))}
      </Select>

      {eligibility && (
        <>
          <p className="mt-3 text-xs text-muted-foreground">
            Requirement: ≥{eligibility.cohort.minAttendancePct}% attendance across completed sessions.
          </p>
          <table className="mt-3 w-full">
            <thead>
              <tr className="border-b border-border/60">
                <th className="th">Student</th>
                <th className="th">Attendance</th>
                <th className="th">Eligible</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {eligibility.students.map((s) => (
                <tr key={s.userId} className="border-b border-border/40 last:border-0">
                  <td className="td font-medium">{s.name}</td>
                  <td className="td">
                    {s.attended}/{s.totalSessions} ({s.attendancePct}%)
                  </td>
                  <td className="td">{s.eligible ? <Badge value="active" /> : <Badge value="failed" />}</td>
                  <td className="td text-right">
                    {s.alreadyIssued ? (
                      <span className="text-xs font-semibold text-emerald-600" title={s.certificateNumber ?? undefined}>
                        Already issued ✓
                      </span>
                    ) : s.hasRevoked ? (
                      <span className="text-xs font-medium text-amber-600" title="This student's certificate was revoked. Reinstate it from the certificates list instead of issuing a duplicate.">
                        Revoked — reinstate from list
                      </span>
                    ) : issued[s.userId] ? (
                      <span className="text-xs font-semibold text-emerald-600">Issued ✓</span>
                    ) : (
                      <button
                        className="btn-primary !px-2.5 !py-1 text-xs"
                        disabled={!s.eligible || issueMutation.isPending}
                        onClick={() => issueMutation.mutate(s)}
                      >
                        Issue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ErrorNote error={issueMutation.error} />
        </>
      )}
    </Modal>
  );
}

function RevokeModal({ certificate, onClose, onDone }: { certificate: Certificate; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const mutation = useMutation({
    mutationFn: () => api(`/certificates/${certificate.id}/revoke`, { method: "POST", body: { reason } }),
    onSuccess: () => { onDone(); onClose(); },
  });
  return (
    <Modal
      title="Revoke certificate"
      description={`${certificate.certificateNumber} · ${certificate.holderName}`}
      open
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-danger"
            disabled={reason.length < 3 || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Revoking…" : "Revoke certificate"}
          </button>
        </>
      }
    >
      <Field label="Reason">
        <input className="input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this being revoked?" />
      </Field>
      <p className="mt-2 text-2xs text-muted-foreground">
        The public verification page will show this certificate as revoked.
      </p>
      <ErrorNote error={mutation.error} />
    </Modal>
  );
}
