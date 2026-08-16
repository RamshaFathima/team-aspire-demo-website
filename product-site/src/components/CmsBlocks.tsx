import Link from "next/link";
import type { PageBlock } from "@/lib/api";

export function CmsBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "hero":
            return (
              <section key={i} className="bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 text-cream-50">
                <div className="mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
                  <h1 className="font-serif text-4xl leading-tight md:text-5xl">{block.heading}</h1>
                  {block.subheading && (
                    <p className="mx-auto mt-5 max-w-2xl text-cream-100/80">{block.subheading}</p>
                  )}
                </div>
              </section>
            );
          case "richText":
            return (
              <section key={i} className="mx-auto max-w-3xl px-4 py-12">
                {block.heading && (
                  <h2 className="font-serif text-2xl text-maroon-900 md:text-3xl">{block.heading}</h2>
                )}
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-maroon-950/75">
                  {block.body}
                </p>
              </section>
            );
          case "stats":
            return (
              <section key={i} className="mx-auto max-w-4xl px-4 py-8">
                <div className="card grid grid-cols-1 gap-6 p-8 sm:grid-cols-3">
                  {(block.items ?? []).map((item, j) => (
                    <div key={j} className="text-center">
                      <div className="font-serif text-3xl text-maroon-800">{item.value}</div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-maroon-950/50">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          case "cta":
            return (
              <section key={i} className="mx-auto max-w-4xl px-4 py-12">
                <div className="rounded-3xl bg-maroon-900 px-8 py-12 text-center text-cream-50">
                  <h2 className="font-serif text-3xl">{block.heading}</h2>
                  {block.body && (
                    <p className="mx-auto mt-3 max-w-xl text-sm text-cream-100/75">{block.body}</p>
                  )}
                  {block.ctaLabel && block.ctaHref && (
                    <Link href={block.ctaHref} className="btn-gold mt-6">
                      {block.ctaLabel}
                    </Link>
                  )}
                </div>
              </section>
            );
          case "faq":
            return (
              <section key={i} className="mx-auto max-w-3xl px-4 py-12">
                <div className="space-y-4">
                  {(block.items ?? []).map((item, j) => (
                    <details key={j} className="card p-5">
                      <summary className="cursor-pointer font-semibold text-maroon-900">
                        {item.q}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-maroon-950/70">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
