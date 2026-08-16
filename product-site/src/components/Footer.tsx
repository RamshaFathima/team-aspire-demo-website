import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-maroon-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 font-serif text-lg font-bold text-maroon-800">
              A
            </span>
            <span className="font-serif text-xl font-semibold tracking-wide">TEAM ASPIRE</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-100/80">
            A women-only space rooted in deen, sisterhood &amp; humanitarian service. Building
            community for 10+ years.
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
