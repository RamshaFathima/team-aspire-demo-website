import { NavLink, useNavigate } from "react-router-dom";
import { can, clearSession, getUser } from "@/lib/api";

const NAV: { section: string; items: { to: string; label: string; perm?: string }[] }[] = [
  {
    section: "Overview",
    items: [{ to: "/", label: "Dashboard", perm: "dashboard.read" }],
  },
  {
    section: "People & CRM",
    items: [
      { to: "/people", label: "People", perm: "users.read" },
      { to: "/crm", label: "CRM · Contacts", perm: "crm.read" },
    ],
  },
  {
    section: "Finance",
    items: [
      { to: "/donations", label: "Donations", perm: "donations.read" },
      { to: "/campaigns", label: "Campaigns", perm: "donations.read" },
    ],
  },
  {
    section: "Programs",
    items: [{ to: "/projects", label: "Projects", perm: "projects.read" }],
  },
  {
    section: "LMS",
    items: [
      { to: "/lms/courses", label: "Courses", perm: "lms.courses.read" },
      { to: "/lms/cohorts", label: "Cohorts", perm: "lms.courses.read" },
      { to: "/lms/attendance", label: "Attendance", perm: "lms.attendance.read" },
      { to: "/certificates", label: "Certificates", perm: "certificates.read" },
    ],
  },
  {
    section: "Content",
    items: [{ to: "/cms", label: "Pages", perm: "cms.manage" }],
  },
  {
    section: "System",
    items: [
      { to: "/roles", label: "Roles & Permissions", perm: "roles.manage" },
      { to: "/audit", label: "Audit Log", perm: "audit.read" },
      { to: "/settings", label: "Settings", perm: "settings.manage" },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-slate-200 bg-maroon-950 text-white">
        <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-sm font-extrabold text-maroon-950">
            A
          </span>
          <div className="text-sm font-bold tracking-wide">ASPIRE ADMIN</div>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {NAV.map((group) => {
            const visible = group.items.filter((i) => !i.perm || can(i.perm));
            if (!visible.length) return null;
            return (
              <div key={group.section}>
                <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-white/35">
                  {group.section}
                </div>
                <div className="mt-1.5 space-y-0.5">
                  {visible.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                          isActive
                            ? "bg-white/10 text-gold-400"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="truncate text-sm font-semibold">{user?.fullName}</div>
          <div className="truncate text-xs text-white/50">{user?.roles.join(", ")}</div>
          <button onClick={logout} className="mt-3 w-full rounded-lg bg-white/10 py-1.5 text-xs font-semibold hover:bg-white/20">
            Sign out
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
}
