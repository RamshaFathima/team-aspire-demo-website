import type { Metadata } from "next";
import { apiOrNull, type CmsPage } from "@/lib/api";
import { CmsBlocks } from "@/components/CmsBlocks";

export async function generateMetadata(): Promise<Metadata> {
  const page = await apiOrNull<CmsPage>("/public/pages/about");
  return {
    title: page?.seo?.title ?? "About",
    description: page?.seo?.description ?? undefined,
  };
}

export default async function AboutPage() {
  const page = await apiOrNull<CmsPage>("/public/pages/about");

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-maroon-900">About Team Aspire</h1>
        <p className="mt-4 text-maroon-950/60">Our story is being written — check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      <CmsBlocks blocks={page.blocks} />
    </div>
  );
}
