import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  FileText,
  HandCoins,
  HeartHandshake,
  KeyRound,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { api } from "@/lib/api";
import { Avatar, EmptyState, PageHeader, TableSkeleton } from "@/components/ui";
import { Card } from "@/components/ui/card";

type AuditLog = {
  id: string;
  actorEmail: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

const DOMAIN_ICONS: { match: RegExp; icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { match: /^donation|^campaign/, icon: HandCoins, tint: "text-emerald-500 bg-emerald-500/10" },
  { match: /^project/, icon: HeartHandshake, tint: "text-rose-500 bg-rose-500/10" },
  { match: /^course|^cohort|^session|^enrollment|^attendance/, icon: BookOpen, tint: "text-sky-500 bg-sky-500/10" },
  { match: /^certificate/, icon: Award, tint: "text-amber-500 bg-amber-500/10" },
  { match: /^page/, icon: FileText, tint: "text-violet-500 bg-violet-500/10" },
  { match: /^user|^contact/, icon: UserRound, tint: "text-indigo-500 bg-indigo-500/10" },
  { match: /^role/, icon: ShieldCheck, tint: "text-fuchsia-500 bg-fuchsia-500/10" },
  { match: /^auth/, icon: KeyRound, tint: "text-muted-foreground bg-slate-500/10" },
  { match: /^setting/, icon: SettingsIcon, tint: "text-teal-500 bg-teal-500/10" },
];

function iconFor(action: string) {
  return (
    DOMAIN_ICONS.find((d) => d.match.test(action)) ?? {
      icon: FileText,
      tint: "text-muted-foreground bg-slate-500/10",
    }
  );
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function describe(log: AuditLog): string {
  const verbMap: Record<string, string> = {
    create: "created",
    update: "updated",
    confirm: "confirmed",
    refund: "refunded",
    issue: "issued",
    revoke: "revoked",
    publish: "published",
    unpublish: "unpublished",
    login: "signed in",
    register: "registered",
    mark: "marked",
    delete: "deleted",
  };
  const [, verb = ""] = log.action.split(".");
  const verbText = verbMap[verb] ?? verb.replace(/_/g, " ");
  const resource = log.resourceType.replace(/_/g, " ");
  if (log.action === "auth.login") return "signed in";
  if (log.action === "auth.register") return "created an account";
  if (log.action === "attendance.mark") {
    const count = (log.metadata as { count?: number })?.count;
    return `marked attendance${count ? ` for ${count} students` : ""}`;
  }
  return `${verbText} a ${resource}`;
}

export default function Audit() {
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["audit", page, action],
    queryFn: () =>
      api<{ data: AuditLog[]; total: number; limit: number }>(
        `/audit?page=${page}&limit=40&action=${encodeURIComponent(action)}`,
      ),
  });

  // group by day
  const groups: { day: string; items: AuditLog[] }[] = [];
  for (const log of data?.data ?? []) {
    const day = dayLabel(log.createdAt);
    const last = groups[groups.length - 1];
    if (last?.day === day) last.items.push(log);
    else groups.push({ day, items: [log] });
  }

  return (
    <>
      <PageHeader
        title="Activity"
        subtitle="A complete, immutable trail of every sensitive operation."
      />

      <div className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
        <input
          className="input !pl-9"
          placeholder="Filter by action — e.g. donation, login, attendance"
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : !groups.length ? (
        <Card>
          <EmptyState
            title="No activity found"
            description="Actions like sign-ins, donations, edits and attendance marking appear here automatically."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.day}>
              <div className="mb-2 text-xs font-semibold text-muted-foreground">{group.day}</div>
              <Card className="overflow-hidden">
                <div className="divide-y divide-border/60">
                  {group.items.map((log) => {
                    const { icon: Icon, tint } = iconFor(log.action);
                    const actor = log.actorEmail?.split("@")[0] ?? "system";
                    return (
                      <div key={log.id} className="flex items-center gap-3.5 px-4 py-2.5">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tint}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <Avatar name={actor} className="hidden sm:flex" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px]">
                            <span className="font-semibold">{actor}</span>{" "}
                            <span className="text-muted-foreground">{describe(log)}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-2xs text-muted-foreground/70">
                            <code className="rounded bg-muted px-1 py-px font-mono text-[10px]">{log.action}</code>
                            {log.resourceId && (
                              <span className="hidden font-mono md:inline">{log.resourceId.slice(0, 8)}</span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-2xs tabular-nums text-muted-foreground">
                          {timeLabel(log.createdAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          ))}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{data?.total} events</span>
            <div className="flex gap-2">
              <button className="btn-secondary !px-2.5 !py-1 text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <button
                className="btn-secondary !px-2.5 !py-1 text-xs"
                disabled={!data || page * data.limit >= data.total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
