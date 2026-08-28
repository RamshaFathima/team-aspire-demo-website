const API_URL = process.env.API_URL ?? "http://localhost:8000";

/**
 * Server-side fetch that unwraps the backend's { status, data, message } envelope.
 * Always no-store: admin changes must reflect on the site immediately.
 */
export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed with ${res.status}`);
  }
  const json = await res.json();
  return json.data as T;
}

export async function apiOrNull<T>(path: string): Promise<T | null> {
  try {
    return await api<T>(path);
  } catch {
    return null;
  }
}

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  category: string | null;
  status: string;
  location: string | null;
  goalAmount: string | null;
  raisedAmount: string;
  impactStats: { label: string; value: string }[];
  coverImage: string | null;
  featured: boolean;
  updates?: { id: string; title: string; body: string | null; createdAt: string }[];
};

export type Campaign = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  projectId: string | null;
  goalAmount: string | null;
  raisedAmount: string;
  status: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  category: string | null;
  level: string | null;
  durationWeeks: number | null;
  isOnline: boolean;
  meetingPlatform: string | null;
  certificateEnabled: boolean;
  cohorts?: Cohort[];
};

export type Cohort = {
  id: string;
  name: string;
  code: string;
  startsOn: string | null;
  scheduleNote: string | null;
  status: string;
  capacity: number | null;
};

export type PageBlock = {
  type: "hero" | "richText" | "stats" | "cta" | "faq";
  heading?: string;
  subheading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  items?: { label?: string; value?: string; q?: string; a?: string }[];
};

export type CmsPage = {
  slug: string;
  title: string;
  blocks: PageBlock[];
  seo: { title?: string; description?: string };
};

export type PublicStats = {
  totalRaised: number | string;
  projects: number;
  studentsServed: number;
  certificatesIssued: number;
};

export type UpcomingSession = {
  id: string;
  title: string;
  topic: string | null;
  startsAt: string;
  cohortName: string;
  courseTitle: string;
  courseSlug: string;
};
