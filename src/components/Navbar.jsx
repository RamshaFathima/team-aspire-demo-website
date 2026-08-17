import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'

const navLinks = [
  { label: 'Home',        to: '/' },
  { label: 'About Us',    to: '/about' },
  { label: 'Events',      to: '/events' },
  { label: 'Projects',    to: '/projects' },
  { label: 'Courses',     to: '/courses' },
  { label: 'Initiatives', to: '/initiatives' },
  { label: 'Donate',      to: '/donate' },
  { label: 'Contact',     to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [visible, setVisible]     = useState(true)
  const [menuOpen, setMenuOpen]   = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 20)

      if (currentY < 80) {
        // always show near the top
        setVisible(true)
      } else if (currentY > lastScrollY.current + 6) {
        // scrolling down — hide & close mobile menu
        setVisible(false)
        setMenuOpen(false)
      } else if (currentY < lastScrollY.current - 6) {
        // scrolling up — show
        setVisible(true)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${
        scrolled
          ? 'bg-white/97 backdrop-blur-md shadow-soft border-b border-brand-tertiary/30'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex flex-col leading-tight group flex-shrink-0">
            <span className="font-serif text-2xl font-bold text-brand-primary tracking-wide group-hover:text-brand-dark transition-colors">
              ASPIRE
            </span>
            <span className="text-[10px] font-sans font-medium text-brand-secondary tracking-widest uppercase">
              Team Aspire · Bangalore
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={close}
                className={({ isActive }) =>
                  `relative px-2.5 xl:px-3 py-2 text-sm font-sans font-medium tracking-wide rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-primary'
                      : 'text-gray-700 hover:text-brand-primary hover:bg-brand-neutral/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-2.5 right-2.5 h-0.5 bg-brand-primary rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            <Link
              to="/join"
              onClick={close}
              className="px-4 py-2 text-sm font-sans font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors shadow-soft"
            >
              Join Aspire
            </Link>
            <Link
              to="/login"
              onClick={close}
              className="px-4 py-2 text-sm font-sans font-semibold border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all"
            >
              Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-md hover:bg-brand-neutral transition-colors"
          >
            <span className={`block h-0.5 w-6 bg-brand-primary rounded transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-brand-primary rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-brand-primary rounded transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="border-t border-brand-tertiary/40 pt-3 flex flex-col gap-1">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={close}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-sm font-sans font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary pl-3.5'
                      : 'text-gray-700 hover:bg-brand-neutral hover:text-brand-primary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-brand-tertiary/40">
              <Link
                to="/join"
                onClick={close}
                className="px-4 py-2.5 text-sm font-sans font-semibold text-center bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors"
              >
                Join Aspire
              </Link>
              <Link
                to="/login"
                onClick={close}
                className="px-4 py-2.5 text-sm font-sans font-semibold text-center border-2 border-brand-primary text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
