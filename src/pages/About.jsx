import { Link } from 'react-router-dom'

const values = [
  {
    title: 'Faith & Deen',
    body: 'Every action we take is rooted in our love for Allah and the teachings of Islam, guiding us with sincerity and purpose in all that we do.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    title: 'Sisterhood',
    body: 'We cultivate a safe, nurturing space where every sister feels seen, valued, and supported — a true community built on love and belonging.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Service',
    body: 'From food drives to educational programs, we serve our community with open hearts — bridging the gap between those who need and those who can help.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
  },
  {
    title: 'Community',
    body: 'We believe that a thriving community is built on genuine relationships. Aspire is your home — whether you are seeking or giving.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
]

const programs = [
  {
    label: 'Events',
    description: 'Spiritually uplifting, fun gatherings that strengthen sisterhood and create lasting memories.',
    to: '/events',
    accent: 'bg-brand-primary',
  },
  {
    label: 'Projects',
    description: 'Ongoing humanitarian service — food drives, hospital visits, welfare rounds, and fundraisers.',
    to: '/projects',
    accent: 'bg-brand-secondary',
  },
  {
    label: 'Courses',
    description: 'Educational programs on Quran, Arabic, Fiqh, Seerah, and personal development from an Islamic lens.',
    to: '/courses',
    accent: 'bg-brand-dark',
  },
  {
    label: 'Initiatives',
    description: 'Time-bound drives for specific causes — open until the need is met, then closed with gratitude.',
    to: '/initiatives',
    accent: 'bg-brand-secondary/80',
  },
]

export default function About() {
  return (
    <div className="pt-16 min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-gradient-hero py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-secondary font-sans font-semibold text-xs uppercase tracking-widest mb-4">Who We Are</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-primary mb-6 leading-tight">
            About Team Aspire
          </h1>
          <p className="font-sans text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            A <strong>women-only community</strong> founded in 2015 in Bangalore — built on faith, sisterhood, and a relentless drive to serve.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            <div>
              <p className="text-brand-secondary font-sans font-semibold text-xs uppercase tracking-widest mb-4">Our Story</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary mb-6 leading-snug">
                A Decade of Deen, Sisterhood & Service
              </h2>
              <div className="space-y-4 font-sans text-gray-700 leading-relaxed">
                <p>
                  Team Aspire was initiated in the year 2015 with the aim to reach out and has only been
                  growing ever since, by the grace of The Almighty.
                </p>
                <p>
                  We're a group of women from Bangalore, India who host and be a part of strengthening our
                  sisterhood, providing a sense of community, hosting spiritually boosting fun events,
                  conducting food drives; organising fundraisers, initiating social visits & community
                  service activities — while also conducting programs that provide a platform to learn and grow.
                </p>
                <p>
                  The goal at Aspire is simple: we make people around us smile in hope that Allah will write
                  it down as an act of charity for us. In a world that is too busy discussing problems, we look
                  at solutions — to bridge the gap between those who are in need and those who have the ability
                  to help.
                </p>
                <p className="font-semibold text-brand-primary italic font-serif text-base">
                  For we believe, success awaits those who come looking for it.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/join"
                  className="px-6 py-3 bg-brand-primary text-white font-sans font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-soft"
                >
                  Join Our Community
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 border-2 border-brand-primary text-brand-primary font-sans font-semibold rounded-xl hover:bg-brand-primary hover:text-white transition-all"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Signature quote card */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-brand-primary rounded-3xl p-8 text-white relative overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/5" />
                <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="text-brand-secondary font-serif text-5xl leading-none mb-4 opacity-60">&ldquo;</div>
                  <blockquote className="font-serif text-lg sm:text-xl leading-relaxed text-white/95 mb-6 italic">
                    The goal at Aspire is simple — we make people around us smile in hope that Allah
                    will write it down as an act of charity for us.
                  </blockquote>
                  <div className="text-brand-tertiary/70 font-sans text-sm">— Team Aspire</div>

                  <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 gap-4">
                    {[
                      { value: '2015', label: 'Founded' },
                      { value: '10+', label: 'Years Active' },
                      { value: '5,000+', label: 'Lives Touched' },
                      { value: '200+', label: 'Sisters Strong' },
                    ].map(({ value, label }) => (
                      <div key={label}>
                        <div className="font-serif text-2xl font-bold text-brand-secondary">{value}</div>
                        <div className="font-sans text-xs text-brand-tertiary/70 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className="py-20 bg-brand-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-secondary font-sans font-semibold text-xs uppercase tracking-widest mb-3">Our Programs</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary mb-4">
              What We Do
            </h2>
            <p className="font-sans text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We have mainly four pillars of work — each one a different expression of the same driving mission.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {programs.map(({ label, description, to, accent }) => (
              <Link
                key={label}
                to={to}
                className="group bg-white rounded-2xl shadow-soft border border-brand-tertiary/20 hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className={`h-1.5 ${accent}`} />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-xl font-bold text-brand-primary mb-3 group-hover:text-brand-dark transition-colors">
                    {label}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed flex-1">{description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors">
                    <span>Explore</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-secondary font-sans font-semibold text-xs uppercase tracking-widest mb-3">What We Stand For</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ title, body, icon }) => (
              <div
                key={title}
                className="bg-brand-neutral rounded-2xl p-7 border border-brand-tertiary/20 hover:shadow-soft transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-5">
                  {icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-primary mb-3">{title}</h3>
                <p className="font-sans text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="py-16 bg-brand-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Be Part of Our Story
          </h2>
          <p className="font-sans text-brand-tertiary/80 leading-relaxed mb-8 text-base">
            Whether you're looking for sisterhood, opportunities to serve, or a space to grow in your deen — Aspire is here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/join"
              className="px-8 py-3.5 bg-brand-secondary text-white font-sans font-bold rounded-xl hover:bg-brand-secondary/90 transition-colors shadow-gold"
            >
              Join Aspire
            </Link>
            <Link
              to="/donate"
              className="px-8 py-3.5 border-2 border-white/40 text-white font-sans font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Support Our Mission
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
