import type { Metadata } from "next";
import { api, type Course } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Courses",
  description: "Learn with Team Aspire — deen circles, skills tracks and more.",
};

export default async function CoursesPage() {
  const courses = await api<Course[]>("/public/courses");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading
        eyebrow="Learn With Us"
        title="Courses & circles"
        subtitle="Faith, knowledge and skills — taught with love, for sisters of every age."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}
