import { Suspense } from "react";
import type { Metadata } from "next";
import { apiOrNull, type Campaign, type Project } from "@/lib/api";
import DonateFlow from "./DonateFlow";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Team Aspire's projects — every rupee goes further than you know.",
};

export default async function DonatePage() {
  const [projects, campaigns] = await Promise.all([
    apiOrNull<Project[]>("/public/projects"),
    apiOrNull<Campaign[]>("/public/campaigns"),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Give</p>
        <h1 className="mt-2 font-serif text-3xl text-maroon-900 md:text-4xl">Make a donation</h1>
        <p className="mt-3 text-sm text-maroon-950/60">
          Your giving funds mentorship, meals, medical aid and clean water. JazakAllah khair.
        </p>
      </div>
      <Suspense>
        <DonateFlow projects={projects ?? []} campaigns={campaigns ?? []} />
      </Suspense>
    </div>
  );
}
