"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearSession,
  clientApi,
  getStoredUser,
  getToken,
  type StoredUser,
} from "@/lib/client-api";
import { formatDate, formatDateTime, inr } from "@/lib/format";

type Donation = {
  id: string;
  amount: string;
  status: string;
  receiptNumber: string | null;
  createdAt: string;
  project?: { title: string } | null;
};

type Enrollment = {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  courseTitle: string;
  courseSlug: string;
  cohortName: string;
  scheduleNote: string | null;
};

type Session = {
  id: string;
  title: string;
  topic: string | null;
  startsAt: string;
  meetingUrl: string | null;
  courseTitle: string;
  cohortName: string;
};

type Certificate = {
  id: string;
  certificateNumber: string;
  verificationCode: string;
  title: string;
  issuedAt: string;
  status: string;
};

type Notice = { id: string; title: string; body: string | null; readAt: string | null; createdAt: string };

const statusStyles: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  initiated: "bg-cream-200 text-maroon-800",
  failed: "bg-rose-100 text-rose-700",
  refunded: "bg-slate-100 text-slate-600",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-maroon-100 text-maroon-800",
  dropped: "bg-slate-100 text-slate-600",
};

function Badge({ value }: { value: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[value] ?? "bg-cream-200 text-maroon-800"}`}>
      {value}
    </span>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [tab, setTab] = useState<"overview" | "donations" | "courses" | "certificates">("overview");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login?next=/account");
      return;
    }
    setUser(getStoredUser());
    Promise.all([
      clientApi<Donation[]>("/me/donations"),
      clientApi<Enrollment[]>("/me/enrollments"),
      clientApi<Session[]>("/me/sessions/upcoming"),
      clientApi<Certificate[]>("/me/certificates"),
      clientApi<Notice[]>("/me/notifications"),
    ])
      .then(([d, e, s, c, n]) => {
        setDonations(d);
        setEnrollments(e);
        setSessions(s);
        setCertificates(c);
        setNotices(n);
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    clearSession();
    router.push("/");
  };

  if (loading) {
    return <div className="py-32 text-center text-maroon-950/50">Loading your account…</div>;
  }

  const totalGiven = donations
    .filter((d) => d.status === "success")
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-maroon-900">
            Assalamu alaikum, {user?.fullName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-maroon-950/50">{user?.email}</p>
        </div>
        <button onClick={logout} className="btn-outline !py-2 text-xs">
          Sign out
        </button>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-cream-200 pb-px">
        {(["overview", "donations", "courses", "certificates"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold capitalize transition ${
              tab === t
                ? "border-b-2 border-maroon-700 text-maroon-800"
                : "text-maroon-950/50 hover:text-maroon-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5 text-center">
              <div className="font-serif text-2xl text-maroon-800">{inr(totalGiven)}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-maroon-950/50">Total given</div>
            </div>
            <div className="card p-5 text-center">
              <div className="font-serif text-2xl text-maroon-800">{enrollments.length}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-maroon-950/50">Courses</div>
            </div>
            <div className="card p-5 text-center">
              <div className="font-serif text-2xl text-maroon-800">{certificates.length}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-maroon-950/50">Certificates</div>
            </div>
          </div>

          {sessions.length > 0 && (
            <div>
              <h2 className="font-serif text-xl text-maroon-900">Your upcoming classes</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {sessions.map((s) => (
                  <div key={s.id} className="card flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-maroon-900">
                        {s.courseTitle}
                      </div>
                      <div className="truncate text-xs text-maroon-950/60">
                        {s.topic ?? s.title} · {formatDateTime(s.startsAt)}
                      </div>
                    </div>
                    {s.meetingUrl && (
                      <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0 !px-4 !py-1.5 text-xs">
                        Join
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {notices.length > 0 && (
            <div>
              <h2 className="font-serif text-xl text-maroon-900">Notifications</h2>
              <div className="mt-4 space-y-2">
                {notices.slice(0, 6).map((n) => (
                  <div key={n.id} className={`card p-4 ${!n.readAt ? "border-gold-400" : ""}`}>
                    <div className="text-sm font-semibold text-maroon-900">{n.title}</div>
                    {n.body && <div className="mt-0.5 text-xs text-maroon-950/60">{n.body}</div>}
                    <div className="mt-1 text-[11px] text-maroon-950/40">{formatDateTime(n.createdAt)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "donations" && (
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-left text-xs uppercase tracking-wide text-maroon-950/50">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Towards</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-cream-100 last:border-0">
                  <td className="px-5 py-3.5 text-maroon-950/70">{formatDate(d.createdAt)}</td>
                  <td className="px-5 py-3.5 font-semibold text-maroon-900">{inr(d.amount)}</td>
                  <td className="px-5 py-3.5 text-maroon-950/70">{d.project?.title ?? "General fund"}</td>
                  <td className="px-5 py-3.5"><Badge value={d.status} /></td>
                  <td className="px-5 py-3.5 font-mono text-xs text-maroon-950/60">{d.receiptNumber ?? "—"}</td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-maroon-950/50">
                    No donations yet.{" "}
                    <Link href="/donate" className="font-semibold text-maroon-700 hover:underline">Make your first one?</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "courses" && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {enrollments.map((e) => (
            <div key={e.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/courses/${e.courseSlug}`} className="font-serif text-lg text-maroon-900 hover:text-maroon-700">
                  {e.courseTitle}
                </Link>
                <Badge value={e.status} />
              </div>
              <div className="mt-1 text-xs text-maroon-950/60">
                {e.cohortName} · {e.scheduleNote ?? "schedule TBA"}
              </div>
              <div className="mt-3 text-xs text-maroon-950/40">Enrolled {formatDate(e.enrolledAt)}</div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <div className="col-span-full py-10 text-center text-maroon-950/50">
              You&apos;re not enrolled in any course yet.{" "}
              <Link href="/courses" className="font-semibold text-maroon-700 hover:underline">Browse courses</Link>
            </div>
          )}
        </div>
      )}

      {tab === "certificates" && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {certificates.map((c) => (
            <div key={c.id} className="card relative overflow-hidden p-6">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gold-500/10" />
              <div className="text-xs font-bold uppercase tracking-widest text-gold-600">Certificate</div>
              <h3 className="mt-2 font-serif text-lg leading-snug text-maroon-900">{c.title}</h3>
              <div className="mt-3 space-y-1 text-xs text-maroon-950/60">
                <div>Issued {formatDate(c.issuedAt)}</div>
                <div className="font-mono">{c.certificateNumber}</div>
              </div>
              <Link href={`/verify?code=${c.verificationCode}`} className="btn-outline mt-4 !px-4 !py-1.5 text-xs">
                Verify publicly · {c.verificationCode}
              </Link>
            </div>
          ))}
          {certificates.length === 0 && (
            <div className="col-span-full py-10 text-center text-maroon-950/50">
              Complete a course to earn your first certificate insha&apos;Allah.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
