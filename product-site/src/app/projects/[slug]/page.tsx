import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiOrNull, type Project } from "@/lib/api";
import { formatDate, inr, pct } from "@/lib/format";
import ProgressBar from "@/components/ProgressBar";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await apiOrNull<Project>(`/public/projects/${slug}`);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary ?? undefined };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await apiOrNull<Project>(`/public/projects/${slug}`);
  if (!project) notFound();

  const progress = pct(project.raisedAmount, project.goalAmount);

  return (
    <>
      <section className="bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 text-cream-50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
            {project.category ?? "Project"} {project.location ? `· ${project.location}` : ""}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-cream-100/80">{project.summary}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="prose-sm max-w-none whitespace-pre-line leading-relaxed text-maroon-950/80">
            {project.description}
          </div>

          {project.impactStats?.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
              {project.impactStats.map((s) => (
                <div key={s.label} className="card p-5 text-center">
                  <div className="font-serif text-2xl text-maroon-800">{s.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-maroon-950/50">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {project.updates && project.updates.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl text-maroon-900">Latest updates</h2>
              <div className="mt-5 space-y-5 border-l-2 border-maroon-200 pl-6">
                {project.updates.map((u) => (
                  <div key={u.id} className="relative">
                    <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-maroon-600" />
                    <div className="text-xs text-maroon-950/50">{formatDate(u.createdAt)}</div>
                    <h3 className="mt-0.5 font-semibold text-maroon-900">{u.title}</h3>
                    {u.body && <p className="mt-1 text-sm text-maroon-950/70">{u.body}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            {project.goalAmount ? (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-2xl text-maroon-800">{inr(project.raisedAmount)}</span>
                  <span className="text-sm text-maroon-950/50">of {inr(project.goalAmount)}</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={progress} />
                </div>
                <div className="mt-2 text-right text-xs font-semibold text-maroon-700">
                  {progress}% funded
                </div>
              </>
            ) : (
              <p className="text-sm text-maroon-950/60">
                This project is sustained by your generous giving.
              </p>
            )}
            <Link href={`/donate?project=${project.id}`} className="btn-primary mt-5 w-full">
              Donate to this project
            </Link>
            <p className="mt-3 text-center text-xs text-maroon-950/50">
              100% of your donation goes to the cause.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
