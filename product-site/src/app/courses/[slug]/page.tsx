import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiOrNull, type Course } from "@/lib/api";
import { formatDate } from "@/lib/format";
import EnrollButton from "./EnrollButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await apiOrNull<Course>(`/public/courses/${slug}`);
  if (!course) return { title: "Course not found" };
  return { title: course.title, description: course.summary ?? undefined };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await apiOrNull<Course>(`/public/courses/${slug}`);
  if (!course) notFound();

  return (
    <>
      <section className="bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 text-cream-50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
            {course.category ?? "course"} · {course.isOnline ? "Online" : "In-person"}
            {course.meetingPlatform ? ` · ${course.meetingPlatform}` : ""}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-cream-100/80">{course.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            {course.durationWeeks && (
              <span className="rounded-full bg-cream-50/10 px-3 py-1.5">{course.durationWeeks} weeks</span>
            )}
            {course.level && (
              <span className="rounded-full bg-cream-50/10 px-3 py-1.5 capitalize">{course.level}</span>
            )}
            {course.certificateEnabled && (
              <span className="rounded-full bg-gold-500/20 px-3 py-1.5 text-gold-300">
                Certificate on completion
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-[1fr_340px]">
        <div className="whitespace-pre-line text-sm leading-relaxed text-maroon-950/80">
          {course.description}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h3 className="font-serif text-xl text-maroon-900">Open batches</h3>
            {course.cohorts && course.cohorts.length > 0 ? (
              <div className="mt-4 space-y-4">
                {course.cohorts.map((cohort) => (
                  <div key={cohort.id} className="rounded-xl border border-cream-200 p-4">
                    <div className="font-semibold text-maroon-900">{cohort.name}</div>
                    <div className="mt-1 text-xs text-maroon-950/60">
                      {cohort.scheduleNote ?? "Schedule announced soon"}
                    </div>
                    {cohort.startsOn && (
                      <div className="mt-1 text-xs text-maroon-950/50">
                        Starts {formatDate(cohort.startsOn)}
                      </div>
                    )}
                    <EnrollButton cohortId={cohort.id} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-maroon-950/60">
                No open batches right now — check back soon insha&apos;Allah.
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
