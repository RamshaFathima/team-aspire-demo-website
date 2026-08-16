import Link from "next/link";
import { Flower2, HeartHandshake, MoonStar } from "lucide-react";
import { apiOrNull, type Project, type PublicStats, type UpcomingSession } from "@/lib/api";
import { inr } from "@/lib/format";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import CountUp from "@/components/CountUp";
import { AspireMark } from "@/components/AspireMark";

const PILLARS = [
  {
    title: "Deen",
    body: "Weekly circles, seerah classes and Quranic Arabic — knowledge that anchors the heart.",
    icon: MoonStar,
  },
  {
    title: "Sisterhood",
    body: "A women-only space where every sister belongs, learns, and grows — for over a decade.",
    icon: Flower2,
  },
  {
    title: "Service",
    body: "From warm breakfasts to R.O. water plants and medical aid — mercy, made practical.",
    icon: HeartHandshake,
  },
];

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
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 text-cream-50">
        <div className="pattern-star absolute inset-0" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-gold-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-32 h-[480px] w-[480px] rounded-full bg-maroon-500/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-24 md:py-32 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-cream-50/15 bg-cream-50/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300">
              <AspireMark className="h-3.5 w-3.5" />
              Women-only · rooted in deen &amp; sisterhood · est. 2014
            </p>
            <h1 className="animate-fade-up animate-fade-up-1 mt-6 font-serif text-4xl leading-[1.15] md:text-6xl">
              Faith in action,
              <br />
              <span className="text-gold-300">sister by sister.</span>
            </h1>
            <p className="animate-fade-up animate-fade-up-2 mt-6 max-w-lg text-base leading-relaxed text-cream-100/80">
              For 10+ years, Team Aspire has mentored young girls, served thousands of meals,
              funded medical emergencies and brought clean water to whole neighbourhoods — powered
              entirely by sisters like you.
            </p>
            <div className="animate-fade-up animate-fade-up-3 mt-9 flex flex-wrap gap-4">
              <Link href="/donate" className="btn-gold">
                Donate now
              </Link>
              <Link
                href="/projects"
                className="btn-outline !border-cream-100/40 !text-cream-50 hover:!bg-cream-50 hover:!text-maroon-900"
              >
                Explore our work
              </Link>
            </div>
          </div>

          {/* Floating cause cards */}
          <div className="relative hidden lg:block">
            <div className="animate-fade-up animate-fade-up-1 absolute right-4 top-2 w-64 rotate-2 rounded-2xl border border-cream-50/10 bg-cream-50/[0.07] p-5 backdrop-blur-sm transition hover:rotate-0">
              <div className="text-xs font-semibold uppercase tracking-widest text-gold-300">
                Project Rehnuma
              </div>
              <p className="mt-2 text-sm leading-relaxed text-cream-100/85">
                Mentoring underprivileged girls — every Sunday, for 3–4 months.
              </p>
              <div className="mt-3 text-2xl font-bold">120+ <span className="text-sm font-normal text-cream-100/60">girls mentored</span></div>
            </div>
            <div className="animate-fade-up animate-fade-up-2 absolute left-0 top-40 w-60 -rotate-2 rounded-2xl border border-cream-50/10 bg-cream-50/[0.07] p-5 backdrop-blur-sm transition hover:rotate-0">
              <div className="text-xs font-semibold uppercase tracking-widest text-gold-300">
                Clean Water
              </div>
              <p className="mt-2 text-sm leading-relaxed text-cream-100/85">
                8 commercial R.O. plants serving 3,000+ people daily.
              </p>
            </div>
            <div className="animate-fade-up animate-fade-up-3 absolute bottom-0 right-10 w-56 rotate-1 rounded-2xl border border-cream-50/10 bg-cream-50/[0.07] p-5 backdrop-blur-sm transition hover:rotate-0">
              <div className="text-xs font-semibold uppercase tracking-widest text-gold-300">
                Breakfast Club
              </div>
              <p className="mt-2 text-sm leading-relaxed text-cream-100/85">
                9,400+ warm breakfasts served, weekend after weekend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact counters ──────────────────────────────────── */}
      {stats && (
        <section className="mx-auto -mt-10 max-w-5xl px-4">
          <div className="card relative z-10 grid grid-cols-2 gap-8 p-8 md:grid-cols-4 md:p-10">
            {[
              { label: "Raised for good", value: inr(stats.totalRaised) },
              { label: "Active projects", value: String(stats.projects) },
              { label: "Students served", value: `${stats.studentsServed}+` },
              { label: "Certificates issued", value: String(stats.certificatesIssued) },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-3xl text-maroon-800 md:text-4xl">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-maroon-950/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Pillars ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-20">
        <SectionHeading
          eyebrow="Who we are"
          title="Three roots, one sisterhood"
          subtitle="Everything we do grows from the same soil."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="card group p-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-maroon-700/10 text-maroon-700 transition group-hover:bg-maroon-700 group-hover:text-cream-50">
                <pillar.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-serif text-2xl text-maroon-900">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-maroon-950/65">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured projects ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Our Work"
          title="Projects that change lives"
          subtitle="Every rupee is tracked against a real project with real people behind it."
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

      {/* ── Verse band ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-maroon-900 py-16 text-center text-cream-50">
        <div className="pattern-star absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4">
          <div className="font-serif text-2xl leading-relaxed md:text-3xl">
            “The believing women are allies of one another — they enjoin what is right, and give
            from what He has provided them.”
          </div>
          <div className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            The spirit of At-Tawbah 9:71
          </div>
        </div>
      </section>

      {/* ── Upcoming classes ─────────────────────────────────── */}
      {sessions && sessions.length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Learn With Us"
              title="Upcoming circles & classes"
              subtitle="Online and in-person — join a class this week."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {sessions.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  href={`/courses/${s.courseSlug}`}
                  className="card group flex items-center gap-5 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-maroon-700 text-cream-50 transition group-hover:bg-maroon-800">
                    <span className="text-lg font-bold leading-none">
                      {new Date(s.startsAt).getDate()}
                    </span>
                    <span className="text-[10px] uppercase">
                      {new Date(s.startsAt).toLocaleString("en", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-maroon-900">{s.courseTitle}</div>
                    <div className="truncate text-sm text-maroon-950/60">
                      {s.topic ?? s.title} · {s.cohortName}
                    </div>
                  </div>
                  <span className="hidden shrink-0 text-xs font-bold uppercase tracking-wide text-gold-600 group-hover:underline sm:block">
                    Details →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/courses" className="btn-outline">
                Browse all courses
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Instagram + CTA ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <a
            href="https://www.instagram.com/team.aspire"
            target="_blank"
            rel="noopener noreferrer"
            className="card group flex flex-col justify-between overflow-hidden p-8 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h3 className="mt-5 font-serif text-2xl text-maroon-900">
                Walk with us, daily.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-maroon-950/65">
                Stories from the field, class announcements and live campaigns — follow
                <span className="font-semibold text-maroon-800"> @team.aspire</span> on Instagram.
              </p>
            </div>
            <span className="mt-6 text-sm font-bold text-gold-600 group-hover:underline">
              Follow along →
            </span>
          </a>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-maroon-800 to-maroon-950 p-8 text-cream-50 md:p-12">
            <div className="pattern-star absolute inset-0" />
            <div className="relative">
              <h2 className="font-serif text-3xl leading-snug md:text-4xl">
                Be part of the story.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-100/75">
                Volunteer your hands, learn in our circles, or fuel a project with your giving.
                Every contribution ripples further than you know.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/donate" className="btn-gold">
                  Give today
                </Link>
                <Link
                  href="/contact?volunteer=1"
                  className="btn-outline !border-cream-100/40 !text-cream-50 hover:!bg-cream-50 hover:!text-maroon-900"
                >
                  Volunteer with us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
