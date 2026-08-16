import Link from "next/link";
import { AspireLogo } from "@/components/AspireMark";

export default function Footer() {
  return (
    <footer className="mt-20 bg-maroon-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <AspireLogo dark />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-100/80">
            A women-only space rooted in deen, sisterhood &amp; humanitarian service. Building
            community for 10+ years.
          </p>
          <p className="mt-4 font-serif text-sm italic text-gold-300/90">
            “And whoever saves a life — it is as if they had saved all of humanity.”
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream-100/80">
            <li><Link href="/projects" className="hover:text-gold-300">Our Work</Link></li>
            <li><Link href="/courses" className="hover:text-gold-300">Courses</Link></li>
            <li><Link href="/donate" className="hover:text-gold-300">Donate</Link></li>
            <li><Link href="/verify" className="hover:text-gold-300">Verify a Certificate</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg">Connect</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream-100/80">
            <li><Link href="/contact" className="hover:text-gold-300">Contact us</Link></li>
            <li><Link href="/contact?volunteer=1" className="hover:text-gold-300">Volunteer</Link></li>
            <li>
              <a
                href="https://www.instagram.com/team.aspire"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-300"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-maroon-800 py-5 text-center text-xs text-cream-100/60">
        © {new Date().getFullYear()} Team Aspire. Made with love, for the ummah.
      </div>
    </footer>
  );
}
