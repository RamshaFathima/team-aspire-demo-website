import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, storeSession, type AdminUser, type ApiError } from "@/lib/api";

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
        setError("This account has no admin permissions.");
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
    <div className="flex min-h-screen items-center justify-center bg-maroon-950 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center text-white">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-xl font-extrabold text-maroon-950">
            A
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-wide">ASPIRE ADMIN</h1>
          <p className="mt-1 text-sm text-white/50">Operational control plane</p>
        </div>
        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <span className="label">Email</span>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@teamaspire.org" />
          </div>
          <div>
            <span className="label">Password</span>
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
