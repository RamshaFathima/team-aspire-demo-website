"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredUser, type StoredUser } from "@/lib/client-api";
import { AspireLogo } from "@/components/AspireMark";

const links = [
  { href: "/projects", label: "Our Work" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    sync();
    window.addEventListener("aspire-auth-changed", sync);
    return () => window.removeEventListener("aspire-auth-changed", sync);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="Team Aspire home">
          <AspireLogo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition hover:text-maroon-600 ${
                pathname?.startsWith(l.href) ? "text-maroon-700" : "text-maroon-950/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link href="/account" className="btn-outline !px-4 !py-2">
              {user.fullName.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium text-maroon-950/70 hover:text-maroon-600">
              Login
            </Link>
          )}
          <Link href="/donate" className="btn-primary !px-5 !py-2.5">
            Donate
          </Link>
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-maroon-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-cream-200 bg-cream-50 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-maroon-950/80">
                {l.label}
              </Link>
            ))}
            <Link href={user ? "/account" : "/login"} className="text-sm font-medium text-maroon-950/80">
              {user ? "My Account" : "Login"}
            </Link>
            <Link href="/donate" className="btn-primary w-full">
              Donate
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
