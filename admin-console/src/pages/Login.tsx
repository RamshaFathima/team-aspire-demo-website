import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api, storeSession, type AdminUser, type ApiError } from "@/lib/api";
import { AspireMark } from "@/components/AspireMark";

type LoginResponse = { user: AdminUser; accessToken: string; refreshToken: string };

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      if (!data.user.permissions.length) {
        setError("This account has no operational permissions.");
        return;
      }
      storeSession(data.accessToken, data.user);
      navigate("/");
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-[#0e1015] text-white lg:block">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 20%, rgba(99,91,255,.35) 0%, transparent 70%), radial-gradient(50% 40% at 85% 75%, rgba(0,201,167,.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <AspireMark className="h-5 w-5 text-[#9184ff]" />
            </span>
            <span className="text-sm font-semibold tracking-wide">ASPIRE OPERATIONS</span>
          </div>
          <div>
            <h1 className="max-w-md text-3xl font-semibold leading-snug tracking-tight">
              One control plane for the whole NGO.
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              Donations, projects, learning circles, certificates and the people behind them —
              measured, auditable, and in one place.
            </p>
            <div className="mt-8 grid max-w-sm grid-cols-3 gap-3">
              {[
                ["₹76k+", "raised"],
                ["8", "R.O. plants"],
                ["120+", "girls mentored"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <div className="text-base font-semibold">{v}</div>
                  <div className="text-2xs text-white/50">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-2xs text-white/40">
            Team Aspire · women-only, rooted in deen &amp; sisterhood · since 2014
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-[360px]">
          <div className="mb-8 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <AspireMark className="h-6 w-6 text-primary" />
            </span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Use your Aspire operations account.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@teamaspire.org"
              />
            </div>
            <div>
              <span className="label">Password</span>
              <input
                className="input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}
            <button className="btn-primary w-full !py-2" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-2xs leading-relaxed text-muted-foreground">
            Access is role-based — every sensitive action is recorded in the activity log.
          </p>
        </div>
      </div>
    </div>
  );
}
