import { useQuery } from "@tanstack/react-query";
import { api, fmtDateTime, inr } from "@/lib/api";
import { Badge, PageHeader, Spinner, StatCard } from "@/components/ui";

type Overview = {
  totals: {
    donationsAllTime: string | number;
    donationsAllTimeCount: number;
    donationsThisMonth: string | number;
    donationsThisMonthCount: number;
    donors: number;
    activeProjects: number;
    activeStudents: number;
    publishedCourses: number;
    certificatesIssued: number;
    totalUsers: number;
    attendanceRate: number | null;
  };
  donationTrend: { month: string; total: string; count: number }[];
  recentDonations: {
    id: string;
    donorName: string;
    amount: string;
    status: string;
    isAnonymous: boolean;
    createdAt: string;
  }[];
  upcomingSessions: {
    id: string;
    title: string;
    topic: string | null;
    startsAt: string;
    cohortName: string;
    courseTitle: string;
  }[];
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api<Overview>("/dashboard"),
  });

  if (isLoading || !data) return <Spinner />;
  const { totals } = data;
  const maxTrend = Math.max(...data.donationTrend.map((t) => Number(t.total)), 1);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="The NGO at a glance — donations, programs, learning." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Raised all-time" value={inr(totals.donationsAllTime)} hint={`${totals.donationsAllTimeCount} donations`} />
        <StatCard label="This month" value={inr(totals.donationsThisMonth)} hint={`${totals.donationsThisMonthCount} donations`} />
        <StatCard label="Unique donors" value={totals.donors} />
        <StatCard label="Active projects" value={totals.activeProjects} />
        <StatCard label="Active students" value={totals.activeStudents} />
        <StatCard label="Published courses" value={totals.publishedCourses} />
        <StatCard label="Certificates issued" value={totals.certificatesIssued} />
        <StatCard label="Attendance rate" value={totals.attendanceRate != null ? `${totals.attendanceRate}%` : "—"} hint={`${totals.totalUsers} total users`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-700">Donation trend (6 months)</h2>
          <div className="mt-5 flex h-40 items-end gap-3">
            {data.donationTrend.length === 0 && (
              <p className="text-sm text-slate-400">No successful donations yet.</p>
            )}
            {data.donationTrend.map((t) => (
              <div key={t.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="text-[10px] font-semibold text-slate-500">{inr(t.total)}</div>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-maroon-700 to-maroon-500"
                  style={{ height: `${Math.max(6, (Number(t.total) / maxTrend) * 100)}%` }}
                />
                <div className="text-[10px] text-slate-400">{t.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-700">Upcoming classes</h2>
          <div className="mt-3 space-y-2.5">
            {data.upcomingSessions.length === 0 && (
              <p className="text-sm text-slate-400">Nothing scheduled.</p>
            )}
            {data.upcomingSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">{s.courseTitle}</div>
                  <div className="truncate text-xs text-slate-500">
                    {s.topic ?? s.title} · {s.cohortName}
                  </div>
                </div>
                <div className="shrink-0 text-xs font-medium text-slate-500">{fmtDateTime(s.startsAt)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <div className="border-b border-slate-100 px-5 py-3.5 text-sm font-bold text-slate-700">
          Recent donations
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="th">Donor</th>
              <th className="th">Amount</th>
              <th className="th">Status</th>
              <th className="th">When</th>
            </tr>
          </thead>
          <tbody>
            {data.recentDonations.map((d) => (
              <tr key={d.id} className="border-b border-slate-50 last:border-0">
                <td className="td font-medium">{d.isAnonymous ? "Anonymous" : d.donorName}</td>
                <td className="td font-semibold">{inr(d.amount)}</td>
                <td className="td"><Badge value={d.status} /></td>
                <td className="td text-slate-500">{fmtDateTime(d.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
