import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  CalendarCheck,
  Contact,
  FileText,
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Moon,
  Settings as SettingsIcon,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import { can, clearSession, getUser } from "@/lib/api";
import { applyTheme, getTheme, type Theme } from "@/lib/theme";
import { AspireMark } from "@/components/AspireMark";

type NavItem = { to: string; label: string; perm?: string; icon: React.ComponentType<{ className?: string }> };

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [{ to: "/", label: "Dashboard", perm: "dashboard.read", icon: LayoutDashboard }],
  },
  {
    section: "People",
    items: [
      { to: "/people", label: "People", perm: "users.read", icon: Users },
      { to: "/crm", label: "Contacts", perm: "crm.read", icon: Contact },
    ],
  },
  {
    section: "Finance",
    items: [
      { to: "/donations", label: "Donations", perm: "donations.read", icon: HandCoins },
      { to: "/campaigns", label: "Campaigns", perm: "donations.read", icon: Megaphone },
    ],
  },
  {
    section: "Programs",
    items: [
      { to: "/projects", label: "Projects", perm: "projects.read", icon: HeartHandshake },
      { to: "/lms/courses", label: "Courses", perm: "lms.courses.read", icon: BookOpen },
      { to: "/lms/cohorts", label: "Cohorts", perm: "lms.courses.read", icon: BarChart3 },
      { to: "/lms/attendance", label: "Attendance", perm: "lms.attendance.read", icon: CalendarCheck },
      { to: "/certificates", label: "Certificates", perm: "certificates.read", icon: Award },
    ],
  },
  {
    section: "Content",
    items: [{ to: "/cms", label: "Pages", perm: "cms.manage", icon: FileText }],
  },
  {
    section: "System",
    items: [
      { to: "/roles", label: "Roles", perm: "roles.manage", icon: ShieldCheck },
      { to: "/audit", label: "Activity", perm: "audit.read", icon: Activity },
      { to: "/settings", label: "Settings", perm: "settings.manage", icon: SettingsIcon },
    ],
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = getUser();
  const [theme, setTheme] = useState<Theme>(getTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[220px] flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center gap-2.5 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <AspireMark className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">Aspire</div>
            <div className="text-2xs text-muted-foreground">Operations</div>
          </div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 pb-4 pt-2">
          {NAV.map((group) => {
            const visible = group.items.filter((i) => !i.perm || can(i.perm));
            if (!visible.length) return null;
            return (
              <div key={group.section}>
                <div className="px-2.5 pb-1 text-2xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {group.section}
                </div>
                <div className="space-y-px">
                  {visible.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        `group flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium transition ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-[15px] w-[15px] shrink-0 opacity-80" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border p-2.5">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-2xs font-bold text-primary">
              {user ? initials(user.fullName) : "?"}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-xs font-semibold">{user?.fullName}</div>
              <div className="truncate text-2xs text-muted-foreground">
                {user?.roles.join(" · ").toLowerCase().replace(/_/g, " ")}
              </div>
            </div>
          </div>
          <div className="mt-1 flex gap-1">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-2xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              onClick={logout}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-2xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-[220px] flex-1">
        <div className="mx-auto max-w-[1200px] px-8 py-7">{children}</div>
      </main>
    </div>
  );
}
