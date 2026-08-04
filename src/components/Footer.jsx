const JOIN_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScNh8KLNBV2eh11fIpcNArBGmU8N8ItNxFtxSHoLjJ3YuaURw/viewform'

const links = [
  { label: 'Home',             href: '#home' },
  { label: 'About Us',         href: '#about' },
  { label: 'Our Initiatives',  href: '#initiatives' },
  { label: 'Impact & Stats',   href: '#impact' },
  { label: 'Join as Volunteer', href: JOIN_URL, external: true },
  { label: 'Contact Us',       href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-brand-tertiary/80">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Aspire Foundation"
                className="h-10 w-auto object-contain brightness-0 invert opacity-90"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div>
                <div className="font-serif font-bold text-white text-lg tracking-wide">ASPIRE</div>
                <div className="text-[9px] font-semibold tracking-[0.16em] text-brand-tertiary/70 uppercase">
                  Foundation · Bangalore
                </div>
              </div>
            </div>
            <p className="text-sm italic text-brand-tertiary/70 mb-3">
              Where Inspiration Meets Aspiration
            </p>
            <p className="text-sm text-brand-tertiary/60 leading-relaxed">
              A community-driven foundation committed to uplifting lives through education, aid,
              and empowerment in Bangalore and beyond.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {links.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-sm text-brand-tertiary/70 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-brand-tertiary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Bangalore, Karnataka, India
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-brand-tertiary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:teamaspireblr@gmail.com" className="hover:text-white transition-colors">
                  teamaspireblr@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-brand-tertiary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <a href="https://instagram.com/aspirefoundationblr" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors">
                  @aspirefoundationblr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-tertiary/50">
          <span>© 2026 Aspire Foundation Bangalore. All rights reserved.</span>
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-tertiary/70 hover:text-white transition-colors"
          >
            Join the mission →
          </a>
        </div>
      </div>
    </footer>
  )
}
