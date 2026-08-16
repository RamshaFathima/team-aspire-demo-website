import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiOrNull } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { AspireMark } from "@/components/AspireMark";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = { title: "Certificate" };

type CertificateView = {
  valid: boolean;
  status?: string;
  certificateNumber?: string;
  verificationCode?: string;
  holderName?: string;
  title?: string;
  description?: string | null;
  courseTitle?: string | null;
  cohortName?: string | null;
  teacherName?: string | null;
  teacherSignatureUrl?: string | null;
  issuedAt?: string;
};

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cert = await apiOrNull<CertificateView>(
    `/public/certificates/verify/${encodeURIComponent(code)}`,
  );
  if (!cert || !cert.certificateNumber) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="font-serif text-2xl text-maroon-900">Certificate</h1>
          <p className="text-sm text-maroon-950/60">
            {cert.valid
              ? "This certificate is valid and publicly verifiable."
              : "⚠ This certificate is currently revoked or expired."}
          </p>
        </div>
        {cert.valid && <PrintButton label="Download certificate" />}
      </div>

      {/* The certificate itself */}
      <div
        className={`relative overflow-hidden rounded-lg border-[3px] border-gold-500 bg-cream-50 shadow-lg print:rounded-none print:border-2 print:shadow-none ${
          !cert.valid ? "opacity-80 grayscale" : ""
        }`}
      >
        <div className="pointer-events-none absolute inset-2 rounded border border-gold-500/50" />
        {!cert.valid && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="-rotate-12 rounded border-4 border-rose-600/70 px-8 py-3 font-serif text-4xl font-bold uppercase tracking-widest text-rose-600/70">
              Revoked
            </span>
          </div>
        )}

        <div className="relative px-10 py-12 text-center md:px-16">
          <div className="flex items-center justify-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon-700 text-cream-50">
              <AspireMark className="h-7 w-7" />
            </span>
          </div>
          <div className="mt-2 font-serif text-lg tracking-[0.3em] text-maroon-900">ASPIRE</div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-maroon-950/50">
            Women · Deen · Sisterhood · Service
          </div>

          <div className="mt-8 font-serif text-3xl text-maroon-800 md:text-4xl">
            Certificate of Completion
          </div>
          <div className="mx-auto mt-3 h-px w-40 bg-gold-500" />

          <p className="mt-8 text-sm italic text-maroon-950/60">This certifies that</p>
          <div className="mt-2 font-serif text-4xl text-maroon-900 md:text-5xl">
            {cert.holderName}
          </div>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-maroon-950/70">
            has successfully completed{" "}
            <span className="font-semibold text-maroon-900">{cert.courseTitle ?? cert.title}</span>
            {cert.cohortName && <> ({cert.cohortName})</>}
            {cert.description && <> — {cert.description}</>}
          </p>

          {/* Signatures */}
          <div className="mt-12 flex items-end justify-between gap-8 text-left">
            <div className="flex-1 text-center">
              {cert.teacherSignatureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cert.teacherSignatureUrl}
                  alt=""
                  className="mx-auto h-14 object-contain"
                />
              ) : (
                <div className="h-14" />
              )}
              <div className="mx-auto mt-1 h-px w-40 bg-maroon-950/30" />
              <div className="mt-1.5 text-sm font-semibold text-maroon-900">
                {cert.teacherName ?? "Programme Instructor"}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-maroon-950/50">
                Instructor
              </div>
            </div>

            <div className="hidden flex-1 text-center md:block">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-500/60 text-gold-600">
                <AspireMark className="h-8 w-8" />
              </div>
              <div className="mt-1.5 text-[10px] uppercase tracking-widest text-maroon-950/50">
                Official seal
              </div>
            </div>

            <div className="flex-1 text-center">
              <div className="h-14" />
              <div className="mx-auto h-px w-40 bg-maroon-950/30" />
              <div className="mt-1.5 text-sm font-semibold text-maroon-900">Team Aspire</div>
              <div className="text-[10px] uppercase tracking-widest text-maroon-950/50">
                Issuing organisation
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-cream-200 pt-4 text-[11px] text-maroon-950/50">
            <span>
              No. <span className="font-mono">{cert.certificateNumber}</span>
            </span>
            <span>Issued {formatDate(cert.issuedAt)}</span>
            <span>
              Verify at teamaspire.org/verify ·{" "}
              <span className="font-mono">{cert.verificationCode}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center print:hidden">
        <Link href="/verify" className="text-sm font-semibold text-maroon-700 hover:underline">
          Verify another certificate →
        </Link>
      </div>
    </div>
  );
}
