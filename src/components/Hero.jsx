const JOIN_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScNh8KLNBV2eh11fIpcNArBGmU8N8ItNxFtxSHoLjJ3YuaURw/viewform'

const stats = [
  { value: '5,000+', label: 'Lives Touched' },
  { value: '120+',   label: 'Volunteers' },
  { value: '3 Yrs',  label: 'Of Service' },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden"
    >
      {/* Subtle background texture circles */}
      <div className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full opacity-[0.06] translate-x-1/3 -translate-y-1/4"
        style={{ background: 'radial-gradient(circle, #6B0F1A, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.04] -translate-x-1/4 translate-y-1/4"
        style={{ background: 'radial-gradient(circle, #8C1C2E, transparent)' }} />

      {/* Brand flame watermark — large, faint, behind content */}
      <svg
        viewBox="0 0 40 48"
        fill="currentColor"
        aria-hidden="true"
        className="absolute left-[-2rem] top-1/2 -translate-y-1/2 w-[460px] h-[560px] text-brand-primary opacity-[0.04] pointer-events-none hidden lg:block"
      >
        <path d="M20 2C20 2 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 19 27 14 24 11C24 11 25 18 20 21C20 21 16 16 20 2Z" />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── LEFT: text ── */}
          <div className="flex flex-col">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 self-start mb-7 px-4 py-2 rounded-full border border-brand-primary/30 bg-white/70 backdrop-blur-sm shadow-soft">
              <svg viewBox="0 0 40 48" fill="currentColor" className="w-3.5 h-4 text-brand-primary">
                <path d="M20 2C20 2 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 19 27 14 24 11C24 11 25 18 20 21C20 21 16 16 20 2Z" />
              </svg>
              <span className="text-[10px] font-bold tracking-[0.2em] text-brand-primary uppercase">
                Team Aspire · Bangalore
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] mb-6">
              <span className="text-gray-900">Where </span>
              <span className="text-brand-primary">Inspiration</span>
              <br />
              <span className="text-gray-900">Meets </span>
              <span className="text-brand-secondary">Aspiration</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-9 max-w-lg">
              We are a community-driven foundation in Bangalore dedicated to transforming lives
              through education, humanitarian aid, and empowering the people around us.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#initiatives"
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white hover:text-[#CEC5C2] font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-brand-primary/50 active:scale-95 text-sm"
              >
                Explore Initiatives
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary hover:bg-brand-dark hover:text-[#CEC5C2] hover:border-brand-dark font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-brand-primary/50 active:scale-95 text-sm"
              >
                Join Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

            {/* Inline stats */}
            <div className="flex items-center gap-8 pt-8 border-t border-brand-primary/10">
              {stats.map((s, i) => (
                <div key={s.label} className={`${i !== 0 ? 'border-l border-brand-primary/15 pl-8' : ''}`}>
                  <div className="font-serif text-2xl md:text-3xl font-bold text-brand-primary">
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: image ── */}
          <div className="relative flex items-center justify-center">
            {/* Decorative large circle */}
            <div
              className="absolute -right-16 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full"
              style={{ background: 'radial-gradient(circle at 40% 40%, #8C1C2E, #6B0F1A)' }}
            />

            {/* Main photo */}
            <div className="relative z-10 w-full max-w-[480px] rounded-3xl overflow-hidden shadow-2xl shadow-brand-primary/20">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
                alt="Aspire Foundation children"
                className="w-full h-[520px] object-cover object-center"
                loading="eager"
              />
            </div>

            {/* Floating "Serving Since" badge */}
            <div className="absolute bottom-8 left-0 z-20 bg-white rounded-2xl shadow-xl shadow-brand-primary/15 px-5 py-3.5 flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4.5 h-4.5 text-brand-primary w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                  Serving Since
                </div>
                <div className="font-serif font-bold text-brand-primary text-xl leading-tight">2021</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
