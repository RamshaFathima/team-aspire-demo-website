"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Campaign, Project } from "@/lib/api";
import { clientApi, getStoredUser, type ApiError } from "@/lib/client-api";
import { inr } from "@/lib/format";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

type Step = "form" | "gateway" | "success" | "failed" | "bank";

type InitResponse = {
  donationId: string;
  gatewayRef: string;
  amount: string;
  status: string;
  checkout: { simulator: boolean; confirmPath: string } | null;
};

export default function DonateFlow({
  projects,
  campaigns,
}: {
  projects: Project[];
  campaigns: Campaign[];
}) {
  const params = useSearchParams();
  const user = typeof window !== "undefined" ? getStoredUser() : null;

  const [step, setStep] = useState<Step>("form");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [init, setInit] = useState<InitResponse | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);

  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [projectId, setProjectId] = useState(params.get("project") ?? "");
  const [campaignId, setCampaignId] = useState(params.get("campaign") ?? "");
  const [donorName, setDonorName] = useState(user?.fullName ?? "");
  const [donorEmail, setDonorEmail] = useState(user?.email ?? "");
  const [donorPhone, setDonorPhone] = useState("");
  const [method, setMethod] = useState<"mock_upi" | "mock_card" | "bank_transfer">("mock_upi");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const data = await clientApi<InitResponse>("/public/donations", {
        method: "POST",
        auth: false,
        body: {
          donorName,
          donorEmail,
          donorPhone: donorPhone || undefined,
          amount: finalAmount,
          projectId: projectId || null,
          campaignId: campaignId || null,
          method,
          isAnonymous,
          message: message || undefined,
        },
      });
      setInit(data);
      setStep(method === "bank_transfer" ? "bank" : "gateway");
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  };

  const settle = async (outcome: "confirm" | "fail") => {
    if (!init) return;
    setBusy(true);
    setError(null);
    try {
      const data = await clientApi<{ receiptNumber?: string }>(
        `/public/donations/${init.donationId}/${outcome}`,
        { method: "POST", auth: false },
      );
      if (outcome === "confirm") {
        setReceipt(data.receiptNumber ?? null);
        setStep("success");
      } else {
        setStep("failed");
      }
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setBusy(false);
    }
  };

  if (step === "success") {
    return (
      <div className="card mt-10 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 font-serif text-2xl text-maroon-900">JazakAllah khair!</h2>
        <p className="mt-2 text-sm text-maroon-950/60">
          Your donation of <strong>{inr(finalAmount)}</strong> was received.
        </p>
        {receipt && (
          <p className="mt-4 rounded-lg bg-cream-100 px-4 py-3 font-mono text-sm text-maroon-800">
            Receipt no: {receipt}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/projects" className="btn-outline !py-2 text-xs">Explore projects</Link>
          <Link href="/account" className="btn-primary !py-2 text-xs">My account</Link>
        </div>
      </div>
    );
  }

  if (step === "failed") {
    return (
      <div className="card mt-10 p-8 text-center">
        <h2 className="font-serif text-2xl text-rose-700">Payment failed</h2>
        <p className="mt-2 text-sm text-maroon-950/60">No amount was charged. You can try again.</p>
        <button className="btn-primary mt-6" onClick={() => setStep("form")}>Try again</button>
      </div>
    );
  }

  if (step === "bank" && init) {
    return (
      <div className="card mt-10 p-8">
        <h2 className="font-serif text-2xl text-maroon-900">Bank transfer details</h2>
        <p className="mt-2 text-sm text-maroon-950/60">
          Transfer {inr(finalAmount)} using the details below. Your donation will be confirmed by
          our finance team once received.
        </p>
        <dl className="mt-5 space-y-2 rounded-xl bg-cream-100 p-5 font-mono text-sm">
          <div className="flex justify-between"><dt>Account name</dt><dd>ASPIRE FOUNDATION</dd></div>
          <div className="flex justify-between"><dt>Account no</dt><dd>9202 8174 274</dd></div>
          <div className="flex justify-between"><dt>IFSC</dt><dd>ASPR0001234</dd></div>
          <div className="flex justify-between"><dt>Reference</dt><dd>{init.gatewayRef.slice(0, 18)}</dd></div>
        </dl>
        <p className="mt-4 text-xs text-maroon-950/50">
          Quote the reference in your transfer note so we can match your donation.
        </p>
      </div>
    );
  }

  if (step === "gateway" && init) {
    return (
      <div className="card mt-10 overflow-hidden">
        <div className="bg-maroon-900 px-6 py-4 text-cream-50">
          <div className="text-xs uppercase tracking-widest text-cream-100/60">Aspire Pay · Simulator</div>
          <div className="mt-1 font-mono text-xs text-cream-100/80">{init.gatewayRef}</div>
        </div>
        <div className="p-8 text-center">
          <p className="text-sm text-maroon-950/60">You are paying</p>
          <div className="mt-1 font-serif text-4xl text-maroon-900">{inr(finalAmount)}</div>
          <p className="mt-2 text-xs text-maroon-950/50">
            via {method === "mock_upi" ? "UPI" : "Card"} · This is a demo gateway — no real money moves.
          </p>
          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
          <div className="mt-8 flex justify-center gap-3">
            <button className="btn-primary" disabled={busy} onClick={() => settle("confirm")}>
              {busy ? "Processing…" : "Pay now"}
            </button>
            <button
              className="btn-outline !border-rose-300 !text-rose-600 hover:!bg-rose-50"
              disabled={busy}
              onClick={() => settle("fail")}
            >
              Simulate failure
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card mt-10 space-y-6 p-6 md:p-8">
      <div>
        <span className="label">Amount</span>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRESET_AMOUNTS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                !customAmount && amount === a
                  ? "border-maroon-700 bg-maroon-700 text-cream-50"
                  : "border-cream-200 bg-white text-maroon-800 hover:border-maroon-300"
              }`}
            >
              ₹{a.toLocaleString("en-IN")}
            </button>
          ))}
        </div>
        <input
          className="input mt-2"
          type="number"
          min={10}
          placeholder="Or enter a custom amount (₹)"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="label">Project (optional)</span>
          <select className="input" value={projectId} onChange={(e) => { setProjectId(e.target.value); if (e.target.value) setCampaignId(""); }}>
            <option value="">Where most needed</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="label">Campaign (optional)</span>
          <select className="input" value={campaignId} onChange={(e) => { setCampaignId(e.target.value); if (e.target.value) setProjectId(""); }}>
            <option value="">None</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="label">Full name</span>
          <input className="input" required minLength={2} value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <span className="label">Email</span>
          <input className="input" required type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="you@example.com" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="label">Phone (optional)</span>
          <input className="input" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} placeholder="+91…" />
        </div>
        <div>
          <span className="label">Payment method</span>
          <select className="input" value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
            <option value="mock_upi">UPI (demo)</option>
            <option value="mock_card">Card (demo)</option>
            <option value="bank_transfer">Bank transfer</option>
          </select>
        </div>
      </div>

      <div>
        <span className="label">Message (optional)</span>
        <textarea className="input" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A dua, a dedication…" />
      </div>

      <label className="flex items-center gap-2 text-sm text-maroon-950/70">
        <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="h-4 w-4 accent-maroon-700" />
        Keep my donation anonymous
      </label>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button className="btn-primary w-full" disabled={busy || !finalAmount || finalAmount < 10}>
        {busy ? "Preparing…" : `Donate ${inr(finalAmount || 0)}`}
      </button>
    </form>
  );
}
