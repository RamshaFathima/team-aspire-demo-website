import type { Metadata } from "next";
import { api, type Project } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore Team Aspire's projects — education, food, medical aid and clean water.",
};

export default async function ProjectsPage() {
  const projects = await api<Project[]>("/public/projects");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionHeading
        eyebrow="Our Work"
        title="Projects & initiatives"
        subtitle="A decade of grassroots service — powered by sisterhood and your support."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
