import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiOrNull } from "@/lib/api";
import { formatDate, inr } from "@/lib/format";
import { AspireLogo } from "@/components/AspireMark";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = { title: "Donation receipt" };

type Receipt = {
  id: string;
  donorName: string;
  amount: string;
  currency: string;
  status: string;
  method: string;
  receiptNumber: string | null;
  projectTitle: string | null;
  createdAt: string;
};

const STATUS_COPY: Record<string, { label: string; tone: string }> = {
  success: { label: "Payment received", tone: "bg-emerald-100 text-emerald-800" },
  pending: { label: "Awaiting bank transfer", tone: "bg-amber-100 text-amber-800" },
  initiated: { label: "Payment not completed", tone: "bg-cream-200 text-maroon-800" },
  failed: { label: "Payment failed", tone: "bg-rose-100 text-rose-800" },
  refunded: { label: "Refunded", tone: "bg-slate-200 text-slate-700" },
};

export default async function DonationReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const receipt = await apiOrNull<Receipt>(`/public/donations/${id}`);
  if (!receipt) notFound();

  const status = STATUS_COPY[receipt.status] ?? STATUS_COPY.initiated;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="font-serif text-2xl text-maroon-900">Donation receipt</h1>
        {receipt.status === "success" && <PrintButton />}
      </div>

      <div className="card overflow-hidden print:border-0 print:shadow-none">
        {/* Letterhead */}
        <div className="flex items-center justify-between border-b border-cream-200 bg-cream-100/60 px-8 py-6">
          <AspireLogo />
          <div className="text-right text-xs text-maroon-950/60">
            <div className="font-semibold text-maroon-900">Team Aspire</div>
            <div>aspireforandaman@gmail.com</div>
            <div>instagram.com/team.aspire</div>
          </div>
        </div>

        <div className="px-8 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gold-600">
                Receipt
              </div>
              <div className="mt-1 font-mono text-lg text-maroon-900">
                {receipt.receiptNumber ?? "— pending —"}
              </div>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${status.tone}`}>
              {status.label}
            </span>
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm text-maroon-950/60">With heartfelt gratitude, received from</div>
            <div className="mt-1 font-serif text-2xl text-maroon-900">{receipt.donorName}</div>
            <div className="mt-6 font-serif text-5xl text-maroon-800">{inr(receipt.amount)}</div>
            <div className="mt-2 text-sm text-maroon-950/60">
              towards <span className="font-semibold text-maroon-900">{receipt.projectTitle ?? "the General Fund"}</span>
            </div>
          </div>

          <dl className="mx-auto mt-10 max-w-sm space-y-2 text-sm">
            <div className="flex justify-between border-b border-cream-200 pb-2">
              <dt className="text-maroon-950/50">Date</dt>
              <dd className="font-medium">{formatDate(receipt.createdAt)}</dd>
            </div>
            <div className="flex justify-between border-b border-cream-200 pb-2">
              <dt className="text-maroon-950/50">Payment method</dt>
              <dd className="font-medium capitalize">{receipt.method.replace("mock_", "").replace("_", " ")}</dd>
            </div>
            <div className="flex justify-between pb-2">
              <dt className="text-maroon-950/50">Reference</dt>
              <dd className="font-mono text-xs">{receipt.id.slice(0, 18)}</dd>
            </div>
          </dl>

          <p className="mt-8 text-center font-serif text-sm italic text-maroon-950/60">
            “Charity does not decrease wealth.” — May Allah accept it from you and multiply your reward.
          </p>
        </div>
      </div>

      <div className="mt-6 text-center print:hidden">
        <Link href="/projects" className="text-sm font-semibold text-maroon-700 hover:underline">
          See the work your giving powers →
        </Link>
      </div>
    </div>
  );
}
