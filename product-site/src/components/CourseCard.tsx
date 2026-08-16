import Link from "next/link";
import type { Course } from "@/lib/api";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card group flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span className="rounded-full bg-maroon-100 px-2.5 py-1 capitalize text-maroon-800">
          {course.category ?? "course"}
        </span>
        <span className="text-maroon-950/40">{course.isOnline ? "Online" : "In-person"}</span>
      </div>
      <h3 className="mt-4 font-serif text-xl leading-snug text-maroon-900 group-hover:text-maroon-700">
        {course.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-maroon-950/70">
        {course.summary}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-maroon-950/60">
        {course.durationWeeks && <span>{course.durationWeeks} weeks</span>}
        {course.meetingPlatform && <span>{course.meetingPlatform}</span>}
        {course.certificateEnabled && (
          <span className="font-semibold text-gold-600">Certificate</span>
        )}
      </div>
    </Link>
  );
}
