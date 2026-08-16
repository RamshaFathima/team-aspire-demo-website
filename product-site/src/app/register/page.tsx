"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi, storeSession, type ApiError, type StoredUser } from "@/lib/client-api";

type AuthResponse = { user: StoredUser; accessToken: string; refreshToken: string };

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await clientApi<AuthResponse>("/auth/register", {
        method: "POST",
        auth: false,
        body: { fullName, email, password, phone: phone || undefined },
      });
      storeSession(data);
      router.push("/account");
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-maroon-900">Join the sisterhood</h1>
        <p className="mt-2 text-sm text-maroon-950/60">
          Create a member account to enroll in courses and track your giving.
        </p>
      </div>
      <form onSubmit={submit} className="card mt-8 space-y-5 p-6 md:p-8">
        <div>
          <span className="label">Full name</span>
          <input className="input" required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <span className="label">Email</span>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <span className="label">Phone (optional)</span>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <span className="label">Password</span>
          <input className="input" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="mt-1 text-xs text-maroon-950/40">At least 8 characters.</p>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-sm text-maroon-950/60">
          Already a member?{" "}
          <Link href="/login" className="font-semibold text-maroon-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
