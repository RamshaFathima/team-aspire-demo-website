import { useState, useEffect } from 'react'

const JOIN_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScNh8KLNBV2eh11fIpcNArBGmU8N8ItNxFtxSHoLjJ3YuaURw/viewform'

const NAV_LINKS = [
  { label: 'Home',        href: '#home' },
  { label: 'About Us',    href: '#about' },
  { label: 'Initiatives', href: '#initiatives' },
  { label: 'Impact',      href: '#impact' },
  { label: 'Contact',     href: '#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen]    = useState(false)
  const [scrolled, setScrolled]    = useState(false)
  const [activeSection, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['home', 'about', 'initiatives', 'impact', 'join', 'contact']
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }) },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-soft'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* ── Logo ── */}
        <a href="#home" className="flex items-center gap-2.5 group flex-shrink-0">
          <img
            src="/logo.png"
            alt="Team Aspire"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
          <span style={{ display: 'none' }}
            className="w-9 h-9 items-center justify-center rounded-lg bg-brand-primary/10">
            <svg viewBox="0 0 40 48" fill="none" className="w-6 h-7">
              <path d="M20 2C20 2 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 19 27 14 24 11C24 11 25 18 20 21C20 21 16 16 20 2Z"
                fill="#6B0F1A" />
              <path d="M20 40C20 40 14 35 14 29C14 25.7 16.5 23 20 23C23.5 23 26 25.7 26 29C26 35 20 40 20 40Z"
                fill="#8C1C2E" opacity="0.6"/>
            </svg>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-bold text-base text-brand-primary tracking-wide group-hover:text-brand-secondary transition-colors">
              Team Aspire
            </span>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-brand-secondary/70 uppercase">
              Bangalore
            </span>
          </div>
        </a>

        {/* ── Right group: nav links + CTA ── */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.replace('#', '')
              const isActive = activeSection === id
              return (
                <li key={label}>
                  <a
                    href={href}
                    className={`relative text-sm font-medium pb-0.5 transition-colors ${
                      isActive
                        ? 'text-brand-primary'
                        : 'text-gray-600 hover:text-brand-primary'
                    }`}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-brand-primary rounded-full" />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white hover:text-[#CEC5C2] text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-soft hover:shadow-card active:scale-95"
          >
            Join Us
          </a>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 rounded-lg text-brand-primary hover:bg-brand-primary/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          }
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/98 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}
              className="text-gray-700 font-medium hover:text-brand-primary transition-colors py-1"
              onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a href={JOIN_URL} target="_blank" rel="noopener noreferrer"
            className="bg-brand-primary text-white text-center font-semibold px-5 py-2.5 rounded-xl mt-1 hover:bg-brand-dark hover:text-[#CEC5C2] transition-all"
            onClick={() => setMenuOpen(false)}>
            Join Us
          </a>
        </div>
      </div>
    </nav>
  )
}
