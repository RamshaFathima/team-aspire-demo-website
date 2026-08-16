import Link from "next/link";
import { MoveLeft, Search } from "lucide-react";
import { AspireMark } from "@/components/AspireMark";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="pattern-star absolute inset-0 opacity-[0.35]" aria-hidden />
      <div className="relative mx-auto flex min-h-[62vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-maroon-900/5 text-maroon-800">
          <AspireMark className="h-9 w-9" />
        </span>
        <p className="mt-6 font-serif text-7xl leading-none text-maroon-900/15 md:text-8xl">404</p>
        <h1 className="mt-2 font-serif text-3xl text-maroon-900 md:text-4xl">
          This page has wandered off
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-maroon-950/60">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or hasn&apos;t been
          published yet. If you typed the address, double-check the spelling.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            <MoveLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <Link href="/projects" className="btn-outline">
            <Search className="mr-2 h-4 w-4" />
            Explore our work
          </Link>
        </div>
        <p className="mt-10 text-xs italic text-maroon-950/40">
          &ldquo;Indeed, with hardship comes ease.&rdquo; — Qur&rsquo;an 94:6
        </p>
      </div>
    </div>
  );
}
