import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiOrNull, type CmsPage } from "@/lib/api";
import { CmsBlocks } from "@/components/CmsBlocks";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await apiOrNull<CmsPage>(`/public/pages/${slug}`);
  if (!page) return {};
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? undefined,
  };
}

export default async function CmsSlugPage({ params }: Props) {
  const { slug } = await params;
  const page = await apiOrNull<CmsPage>(`/public/pages/${slug}`);
  if (!page) notFound();

  return (
    <div>
      {page.blocks.length > 0 ? (
        <CmsBlocks blocks={page.blocks} />
      ) : (
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-serif text-3xl text-maroon-900">{page.title}</h1>
          <p className="mt-4 text-maroon-950/60">This page doesn&apos;t have any content yet.</p>
        </div>
      )}
    </div>
  );
}
