import Link from "next/link";
import type { Project } from "@/lib/api";
import { inr, pct } from "@/lib/format";
import ProgressBar from "./ProgressBar";

const categoryColors: Record<string, string> = {
  education: "bg-maroon-100 text-maroon-800",
  health: "bg-rose-100 text-rose-800",
  water: "bg-sky-100 text-sky-800",
  food: "bg-amber-100 text-amber-800",
  welfare: "bg-emerald-100 text-emerald-800",
};

export default function ProjectCard({ project }: { project: Project }) {
  const progress = pct(project.raisedAmount, project.goalAmount);
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-40 items-end bg-gradient-to-br from-maroon-700 via-maroon-800 to-maroon-950 p-5">
        <h3 className="font-serif text-2xl leading-snug text-cream-50">{project.title}</h3>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-2 text-xs">
          {project.category && (
            <span className={`rounded-full px-2.5 py-1 font-semibold capitalize ${categoryColors[project.category] ?? "bg-cream-200 text-maroon-800"}`}>
              {project.category}
            </span>
          )}
          {project.location && <span className="text-maroon-950/50">{project.location}</span>}
        </div>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-maroon-950/70">
          {project.summary}
        </p>
        {project.goalAmount ? (
          <div>
            <ProgressBar value={progress} />
            <div className="mt-2 flex items-baseline justify-between text-sm">
              <span className="font-semibold text-maroon-800">{inr(project.raisedAmount)} raised</span>
              <span className="text-maroon-950/50">of {inr(project.goalAmount)}</span>
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
