import { Link } from 'react-router-dom'

// ── Islamic geometric SVG pattern ────────────────────────────────────────────
function GeometricPattern() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-90"
      aria-hidden="true"
    >
      {/* Outer octagon frame */}
      <polygon
        points="100,10 148,28 180,72 180,128 148,172 100,190 52,172 20,128 20,72 52,28"
        stroke="#C7A05C"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner star */}
      <polygon
        points="100,40 114,80 155,80 122,104 133,145 100,120 67,145 78,104 45,80 86,80"
        fill="#6D0B2F"
        fillOpacity="0.25"
        stroke="#C7A05C"
        strokeWidth="1"
      />
      {/* Centre circle */}
      <circle cx="100" cy="100" r="18" fill="#6D0B2F" fillOpacity="0.35" stroke="#C7A05C" strokeWidth="1.5" />
      {/* Radiating lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x2 = 100 + 60 * Math.cos(rad)
        const y2 = 100 + 60 * Math.sin(rad)
        return (
          <line
            key={i}
            x1="100" y1="100"
            x2={x2.toFixed(1)} y2={y2.toFixed(1)}
            stroke="#C7A05C"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
        )
      })}
      {/* Corner diamonds */}
      {[
        [100, 10], [180, 100], [100, 190], [20, 100],
        [148, 28], [180, 72], [180, 128], [148, 172],
        [52, 172], [20, 128], [20, 72], [52, 28],
      ].map(([cx, cy], i) => (
        <polygon
          key={i}
          points={`${cx},${cy - 5} ${cx + 5},${cy} ${cx},${cy + 5} ${cx - 5},${cy}`}
          fill="#C7A05C"
          fillOpacity="0.7"
        />
      ))}
    </svg>
  )
}

// ── Stat item ─────────────────────────────────────────────────────────────────
function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">{value}</span>
      <span className="text-xs font-sans font-medium text-gray-500 tracking-wide mt-0.5">{label}</span>
    </div>
  )
}

// ── Quick-intro card ───────────────────────────────────────────────────────────
function IntroCard({ icon, heading, body, to }) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl p-7 shadow-soft hover:shadow-card border border-brand-tertiary/20 hover:border-brand-secondary/40 transition-all duration-300 flex flex-col gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-primary mb-2">{heading}</h3>
        <p className="text-sm font-sans text-gray-600 leading-relaxed">{body}</p>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors mt-auto">
        <span>Learn more</span>
        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  )
}

// ── Preview card ───────────────────────────────────────────────────────────────
function PreviewCard({ tag, title, date, description, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-brand-tertiary/20 overflow-hidden hover:shadow-card transition-all duration-300 group">
      <div className={`h-2 ${color}`} />
      <div className="p-6">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-secondary mb-3 bg-brand-secondary/10 px-2.5 py-1 rounded-full">
          {tag}
        </span>
        <h4 className="font-serif text-base font-bold text-brand-primary mb-1 group-hover:text-brand-dark transition-colors">
          {title}
        </h4>
        {date && (
          <p className="text-xs font-sans text-gray-400 mb-2">{date}</p>
        )}
        <p className="text-sm font-sans text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ── Impact number item ────────────────────────────────────────────────────────
function ImpactStat({ value, label }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-serif text-4xl sm:text-5xl font-bold text-white mb-1">{value}</span>
      <span className="text-sm font-sans font-medium text-brand-tertiary/80 tracking-wide">{label}</span>
    </div>
  )
}

// ── Main Home page ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="pt-16">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-hero min-h-[calc(100vh-4rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Text */}
            <div className="flex flex-col items-start">
              {/* Eyebrow badge */}
              <span className="inline-flex items-center gap-2 bg-brand-secondary/20 border border-brand-secondary/40 text-brand-secondary font-sans font-semibold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                Team Aspire · Bangalore · Est. 2015
              </span>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                <span className="text-gray-900">Where Inspiration</span>
                <br />
                <span className="text-brand-primary">Meets Aspiration</span>
              </h1>

              {/* Subheadline */}
              <p className="font-sans text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                A <strong>women-only space</strong> rooted in deen, sisterhood &amp; humanitarian service.
                Building community for 10+ years.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  to="/projects"
                  className="px-6 py-3 bg-brand-primary text-white font-sans font-semibold rounded-xl hover:bg-brand-dark transition-colors duration-200 shadow-soft hover:shadow-card"
                >
                  Explore Our Work
                </Link>
                <Link
                  to="/join"
                  className="px-6 py-3 border-2 border-brand-primary text-brand-primary font-sans font-semibold rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-200"
                >
                  Join Aspire
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-brand-tertiary/40 pt-8 w-full">
                <Stat value="10+" label="Years Active" />
                <div className="w-px bg-brand-tertiary/40 self-stretch hidden sm:block" />
                <Stat value="5,000+" label="Lives Touched" />
                <div className="w-px bg-brand-tertiary/40 self-stretch hidden sm:block" />
                <Stat value="200+" label="Sisters" />
                <div className="w-px bg-brand-tertiary/40 self-stretch hidden sm:block" />
                <Stat value="2015" label="Founded" />
              </div>
            </div>

            {/* Right: Decorative card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-brand-secondary/10 blur-3xl scale-110" />

                {/* Card */}
                <div className="relative w-full h-full rounded-3xl bg-white shadow-card border border-brand-tertiary/30 flex flex-col items-center justify-center p-8 overflow-hidden">
                  {/* Corner accents */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-brand-secondary/40 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-brand-secondary/40 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-brand-secondary/40 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-brand-secondary/40 rounded-br-lg" />

                  {/* Geometric SVG */}
                  <div className="w-48 h-48 sm:w-56 sm:h-56">
                    <GeometricPattern />
                  </div>

                  {/* Est. badge */}
                  <div className="absolute bottom-6 bg-brand-primary text-white text-xs font-sans font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-soft">
                    Est. 2015
                  </div>
                </div>

                {/* Floating accent dots */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-brand-secondary/20 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-brand-primary/10 blur-xl" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ QUICK INTRO CARDS ════════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-secondary font-sans font-semibold text-xs uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary">Our Pillars of Service</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <IntroCard
              to="/events"
              heading="Community Gatherings"
              body="Spiritually uplifting events that bring sisters together in joy and purpose — from Eid celebrations to halaqahs and knowledge circles."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <IntroCard
              to="/projects"
              heading="Humanitarian Service"
              body="Food drives, fundraisers, hospital visits, and community service activities that transform lives and embody the spirit of giving."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            />
            <IntroCard
              to="/courses"
              heading="Learn &amp; Grow"
              body="Programs and courses that provide a platform for sisters to deepen their knowledge of deen and develop meaningful life skills."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ══ ABOUT PREVIEW STRIP ══════════════════════════════════════════════ */}
      <section className="bg-brand-neutral py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Quote */}
            <div className="relative">
              <div className="absolute -top-4 -left-2 text-7xl font-serif text-brand-secondary/25 leading-none select-none">&ldquo;</div>
              <blockquote className="relative z-10 pl-6 border-l-4 border-brand-secondary">
                <p className="font-serif text-xl sm:text-2xl text-brand-primary italic leading-relaxed font-medium">
                  The goal at Aspire is simple — we make people around us smile in hope that Allah will write it down as an act of charity for us.
                </p>
                <footer className="mt-4 text-sm font-sans text-gray-500 font-medium">— Team Aspire</footer>
              </blockquote>
            </div>

            {/* About snippet */}
            <div>
              <p className="text-brand-secondary font-sans font-semibold text-xs uppercase tracking-widest mb-3">Our Story</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary mb-5">A Decade of Deen &amp; Sisterhood</h2>
              <p className="font-sans text-gray-600 leading-relaxed mb-4">
                Team Aspire was initiated in 2015 with the aim to reach out and has only been growing ever since, by the grace of The Almighty. We are a group of women from Bangalore, India, united by faith and a shared desire to serve.
              </p>
              <p className="font-sans text-gray-600 leading-relaxed mb-8">
                From humble beginnings organising small community gatherings, we have grown into an active collective running food drives, educational programs, and welfare initiatives across the city — always with love, always in service.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-sans font-semibold rounded-xl hover:bg-brand-dark transition-colors duration-200 shadow-soft"
              >
                Read Our Story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ IMPACT NUMBERS ═══════════════════════════════════════════════════ */}
      <section className="bg-gradient-impact py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-tertiary/70 font-sans font-semibold text-xs uppercase tracking-widest mb-3">By the Numbers</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Our Impact</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            <ImpactStat value="10+" label="Years of Service" />
            <ImpactStat value="5,000+" label="Lives Touched" />
            <ImpactStat value="200+" label="Sisters Strong" />
            <ImpactStat value="4" label="Active Programs" />
          </div>
        </div>
      </section>

      {/* ══ RECENT ACTIVITY STRIP ════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-brand-secondary font-sans font-semibold text-xs uppercase tracking-widest mb-2">Latest from Aspire</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary">What We've Been Up To</h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-brand-primary hover:text-brand-dark transition-colors group"
            >
              View All
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PreviewCard
              tag="Event"
              title="Ramadan Iftar Gathering 2024"
              date="March 2024 · Bangalore"
              description="Sisters came together to break fast, share meals, and strengthen the bonds of community during the blessed month of Ramadan."
              color="bg-brand-primary"
            />
            <PreviewCard
              tag="Project"
              title="Monthly Food Drive — Old Age Home"
              date="Ongoing · Bangalore"
              description="Each month our volunteers deliver home-cooked meals and spend quality time with the elderly residents of local care homes."
              color="bg-brand-secondary"
            />
            <PreviewCard
              tag="Course"
              title="Sisters' Quran Circle"
              date="Weekly · Every Saturday"
              description="A warm and nurturing weekly gathering for sisters to recite, reflect, and deepen their connection with the Quran together."
              color="bg-brand-tertiary"
            />
          </div>

          <div className="text-center mt-10">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-primary text-brand-primary font-sans font-semibold rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-200"
            >
              See All Events &amp; Projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ JOIN CTA BANNER ══════════════════════════════════════════════════ */}
      <section className="bg-brand-neutral py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary mb-4">
            Be Part of Something Beautiful
          </h2>
          <p className="font-sans text-gray-600 leading-relaxed mb-8 text-lg">
            Whether you want to volunteer, attend events, or simply connect with like-minded sisters — Aspire is your home. Join us today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/join"
              className="px-8 py-3.5 bg-brand-primary text-white font-sans font-semibold rounded-xl hover:bg-brand-dark transition-colors duration-200 shadow-soft"
            >
              Join Aspire
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 border-2 border-brand-primary text-brand-primary font-sans font-semibold rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
