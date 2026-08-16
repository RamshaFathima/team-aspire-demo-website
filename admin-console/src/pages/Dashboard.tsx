import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Award,
  BookOpen,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { api, fmtDateTime, inr } from "@/lib/api";
import { Badge, EmptyState, Skeleton, StatCard } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

type Analytics = {
  donationsByDay: { day: string; total: number; count: number }[];
  donationsByProject: { name: string; value: number }[];
  donationsByStatus: { name: string; value: number }[];
  enrollmentsByCourse: { name: string; value: number }[];
  attendanceBySession: { name: string; present: number; absent: number }[];
  memberGrowth: { week: string; value: number }[];
  recentActivity: {
    id: string;
    actorEmail: string | null;
    action: string;
    resourceType: string;
    createdAt: string;
  }[];
};

const PALETTE = ["#635bff", "#00c9a7", "#f5b93f", "#ff5c72", "#38bdf8", "#a78bfa", "#f97316", "#10b981"];

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  fontSize: 12,
  color: "hsl(var(--foreground))",
  boxShadow: "0 8px 24px -6px rgb(0 0 0 / 0.2)",
};

const axisProps = {
  stroke: "hsl(var(--muted-foreground))",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

function actionLabel(action: string) {
  return action.replace(/[._]/g, " ");
}

export default function Dashboard() {
  const { data: overview } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api<Overview>("/dashboard"),
  });
  const { data: analytics } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: () => api<Analytics>("/dashboard/analytics"),
  });

  if (!overview || !analytics) {
    return (
      <>
        <div className="mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-3.5 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[92px]" />
          ))}
        </div>
        <Skeleton className="mt-6 h-72" />
      </>
    );
  }

  const { totals } = overview;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          The NGO at a glance — funds, programs and community.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Raised all-time"
          value={inr(totals.donationsAllTime)}
          hint={`${totals.donationsAllTimeCount} successful donations`}
          icon={HandCoins}
        />
        <StatCard
          label="Raised this month"
          value={inr(totals.donationsThisMonth)}
          hint={`${totals.donationsThisMonthCount} donations`}
          icon={TrendingUp}
        />
        <StatCard label="Unique donors" value={totals.donors} hint={`${totals.totalUsers} platform users`} icon={Users} />
        <StatCard label="Active projects" value={totals.activeProjects} icon={HeartHandshake} />
        <StatCard label="Active students" value={totals.activeStudents} icon={GraduationCap} />
        <StatCard label="Published courses" value={totals.publishedCourses} icon={BookOpen} />
        <StatCard label="Certificates issued" value={totals.certificatesIssued} icon={Award} />
        <StatCard
          label="Attendance rate"
          value={totals.attendanceRate != null ? `${totals.attendanceRate}%` : "—"}
          hint="present + late / all marks"
          icon={Activity}
        />
      </div>

      {/* Donations over time + by project */}
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle>Donations — last 30 days</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={analytics.donationsByDay} margin={{ left: 4, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="donations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#635bff" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#635bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" {...axisProps} interval={5} />
                <YAxis {...axisProps} tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))} width={40} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name: string) =>
                    name === "total" ? [inr(value), "Raised"] : [value, "Donations"]
                  }
                />
                <Area type="monotone" dataKey="total" stroke="#635bff" strokeWidth={2} fill="url(#donations)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>By project</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {analytics.donationsByProject.length === 0 ? (
              <EmptyState title="No donations yet" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={analytics.donationsByProject}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {analytics.donationsByProject.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => inr(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-1 space-y-1.5">
                  {analytics.donationsByProject.slice(0, 5).map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2 text-xs">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                      <span className="flex-1 truncate text-muted-foreground">{p.name}</span>
                      <span className="font-medium tabular-nums">{inr(p.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enrollment + attendance + growth */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Enrollments by course</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={analytics.enrollmentsByCourse} layout="vertical" margin={{ left: 0, right: 12 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" {...axisProps} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  {...axisProps}
                  width={120}
                  tickFormatter={(v: string) => (v.length > 16 ? `${v.slice(0, 16)}…` : v)}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Students" fill="#635bff" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Attendance by session</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {analytics.attendanceBySession.length === 0 ? (
              <EmptyState title="No completed sessions" />
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={analytics.attendanceBySession} margin={{ right: 8 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" {...axisProps} />
                  <YAxis {...axisProps} allowDecimals={false} width={26} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="present" stackId="a" fill="#00c9a7" radius={[3, 3, 0, 0]} barSize={18} />
                  <Bar dataKey="absent" stackId="a" fill="#ff5c72" radius={[3, 3, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle>New members / week</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={analytics.memberGrowth} margin={{ right: 8 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" {...axisProps} interval={2} />
                <YAxis {...axisProps} allowDecimals={false} width={26} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="value" name="Members" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: recent donations, upcoming classes, activity */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle>Recent donations</CardTitle>
            <Link to="/donations" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <div className="divide-y divide-border/60">
            {overview.recentDonations.slice(0, 6).map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 px-5 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium">
                    {d.isAnonymous ? "Anonymous" : d.donorName}
                  </div>
                  <div className="text-2xs text-muted-foreground">{fmtDateTime(d.createdAt)}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="text-[13px] font-semibold tabular-nums">{inr(d.amount)}</span>
                  <Badge value={d.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle>Upcoming classes</CardTitle>
            <Link to="/lms/attendance" className="text-xs font-medium text-primary hover:underline">
              Attendance
            </Link>
          </CardHeader>
          {overview.upcomingSessions.length === 0 ? (
            <EmptyState title="Nothing scheduled" description="Schedule sessions from a cohort page." />
          ) : (
            <div className="divide-y divide-border/60">
              {overview.upcomingSessions.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 leading-none text-primary">
                    <span className="text-[13px] font-bold">{new Date(s.startsAt).getDate()}</span>
                    <span className="text-[8px] uppercase">
                      {new Date(s.startsAt).toLocaleString("en", { month: "short" })}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium">{s.courseTitle}</div>
                    <div className="truncate text-2xs text-muted-foreground">
                      {s.topic ?? s.title} · {s.cohortName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle>Latest activity</CardTitle>
            <Link to="/audit" className="text-xs font-medium text-primary hover:underline">
              Full log
            </Link>
          </CardHeader>
          {analytics.recentActivity.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <div className="divide-y divide-border/60">
              {analytics.recentActivity.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13px]">
                      <span className="font-medium">{a.actorEmail?.split("@")[0] ?? "system"}</span>{" "}
                      <span className="text-muted-foreground">{actionLabel(a.action)}</span>
                    </div>
                    <div className="text-2xs text-muted-foreground">{fmtDateTime(a.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
