import Link from "next/link";
import { apiOrNull, type Project, type PublicStats, type UpcomingSession } from "@/lib/api";
import { inr } from "@/lib/format";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";

export default async function HomePage() {
  const [stats, projects, sessions] = await Promise.all([
    apiOrNull<PublicStats>("/public/stats"),
    apiOrNull<Project[]>("/public/projects"),
    apiOrNull<UpcomingSession[]>("/public/sessions/upcoming"),
  ]);

  const featured = (projects ?? []).filter((p) => p.featured).slice(0, 3);
  const displayProjects = featured.length ? featured : (projects ?? []).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 text-cream-50">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-maroon-500/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-300">
            Women-only · 10+ years of service
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            Rooted in deen, sisterhood &amp; humanitarian service.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/80">
            From mentoring young girls to feeding neighbourhoods and funding medical emergencies —
            Team Aspire turns faith into action, together.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/donate" className="btn-gold">
              Donate now
            </Link>
            <Link href="/projects" className="btn-outline !border-cream-100/50 !text-cream-50 hover:!bg-cream-50 hover:!text-maroon-900">
              Explore our work
            </Link>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      {stats && (
        <section className="mx-auto -mt-10 max-w-5xl px-4">
          <div className="card grid grid-cols-2 gap-6 p-8 md:grid-cols-4">
            {[
              { label: "Raised for good", value: inr(stats.totalRaised) },
              { label: "Active projects", value: String(stats.projects) },
              { label: "Students served", value: String(stats.studentsServed) },
              { label: "Certificates issued", value: String(stats.certificatesIssued) },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-2xl text-maroon-800 md:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-maroon-950/50">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured projects */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          eyebrow="Our Work"
          title="Projects that change lives"
          subtitle="Every project is run by volunteers and funded by people like you."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {displayProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/projects" className="btn-outline">
            View all projects
          </Link>
        </div>
      </section>

      {/* Upcoming classes */}
      {sessions && sessions.length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Learn With Us"
              title="Upcoming classes"
              subtitle="Weekly circles and courses — online and in person."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {sessions.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  href={`/courses/${s.courseSlug}`}
                  className="card flex items-center gap-5 p-5 transition hover:shadow-md"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-maroon-700 text-cream-50">
                    <span className="text-lg font-bold leading-none">
                      {new Date(s.startsAt).getDate()}
                    </span>
                    <span className="text-[10px] uppercase">
                      {new Date(s.startsAt).toLocaleString("en", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-maroon-900">{s.courseTitle}</div>
                    <div className="truncate text-sm text-maroon-950/60">
                      {s.topic ?? s.title} · {s.cohortName}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-maroon-800 to-maroon-950 px-8 py-14 text-center text-cream-50 md:px-16">
          <h2 className="font-serif text-3xl md:text-4xl">Be part of the story.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream-100/75">
            Volunteer your time, learn in our circles, or fuel a project with your giving. Every
            contribution — big or small — ripples further than you know.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-gold">Give today</Link>
            <Link href="/contact?volunteer=1" className="btn-outline !border-cream-100/50 !text-cream-50 hover:!bg-cream-50 hover:!text-maroon-900">
              Volunteer with us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
