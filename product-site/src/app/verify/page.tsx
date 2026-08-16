"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clientApi } from "@/lib/client-api";

type VerifyResult = {
  valid: boolean;
  status?: string;
  certificateNumber?: string;
  holderName?: string;
  title?: string;
  courseTitle?: string | null;
  issuedAt?: string;
  expiresAt?: string | null;
};

function VerifyForm() {
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("code")?.toUpperCase() ?? "");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runVerify = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await clientApi<VerifyResult>(
        `/public/certificates/verify/${encodeURIComponent(value.trim())}`,
        { auth: false },
      );
      setResult(data);
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify when arriving with ?code=
  useEffect(() => {
    const initial = params.get("code");
    if (initial) void runVerify(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    await runVerify(code);
  };

  return (
    <>
      <form onSubmit={verify} className="card mt-8 flex gap-3 p-4">
        <input
          className="input flex-1 uppercase"
          placeholder="XXXX-XXXX"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={12}
        />
        <button className="btn-primary" disabled={loading}>
          {loading ? "Checking…" : "Verify"}
        </button>
      </form>

      {result && (
        <div
          className={`card mt-6 p-6 ${
            result.valid ? "border-emerald-200 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50"
          }`}
        >
          {result.valid ? (
            <>
              <div className="flex items-center gap-2 text-emerald-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="font-semibold">Certificate valid</span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-maroon-950/50">Name</dt>
                  <dd className="font-semibold text-maroon-900">{result.holderName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-maroon-950/50">Certificate</dt>
                  <dd className="text-right font-medium text-maroon-900">{result.title}</dd>
                </div>
                {result.courseTitle && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-maroon-950/50">Course</dt>
                    <dd className="text-right">{result.courseTitle}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-maroon-950/50">Certificate no.</dt>
                  <dd className="font-mono text-xs">{result.certificateNumber}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-maroon-950/50">Issued</dt>
                  <dd>{result.issuedAt ? new Date(result.issuedAt).toLocaleDateString("en-IN") : "—"}</dd>
                </div>
              </dl>
              <Link href={`/certificates/${encodeURIComponent(code.trim())}`} className="btn-primary mt-5 w-full !py-2 text-xs">
                View & download the certificate
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 text-rose-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              <div>
                <div className="font-semibold">
                  {result.status === "revoked" ? "Certificate revoked" : "No matching certificate"}
                </div>
                <div className="text-xs text-rose-600/80">
                  Double-check the code, or contact us if you believe this is an error.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Certificates</p>
        <h1 className="mt-2 font-serif text-3xl text-maroon-900 md:text-4xl">
          Verify a certificate
        </h1>
        <p className="mt-3 text-sm text-maroon-950/60">
          Enter the verification code printed on the certificate (e.g. 7FK3-Q9ZM).
        </p>
      </div>
      <Suspense>
        <VerifyForm />
      </Suspense>
    </div>
  );
}
