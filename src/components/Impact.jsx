const stats = [
  {
    value: '5000,+',
    label: 'People Helped',
    sub: 'Lives meaningfully touched',
    icon: (
      <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    value: '80+',
    label: 'Events Conducted',
    sub: 'Community gatherings & camps',
    icon: (
      <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: '1200,+',
    label: 'Children Educated',
    sub: 'Through scholarships & kits',
    icon: (
      <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    value: '120+',
    label: 'Active Volunteers',
    sub: 'Dedicated change-makers',
    icon: (
      <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
]

export default function Impact() {
  return (
    <section
      id="impact"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #6B0F1A 0%, #8C1C2E 60%, #5a0a15 100%)' }}
    >
      {/* Decorative background circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, #D9A5A5, transparent)' }} />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #D9A5A5, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-brand-tertiary font-bold text-xs uppercase tracking-[0.22em]">
            Our Impact
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-3">
            The Numbers Tell Our Story
          </h2>
        </div>

        {/* Stat cards — glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl p-7 border border-white/15 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                {stat.icon}
              </div>
              {/* Number */}
              <div className="font-serif text-4xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-200 origin-left">
                {stat.value}
              </div>
              {/* Label */}
              <div className="font-semibold text-white text-sm mb-1">{stat.label}</div>
              {/* Sub */}
              <div className="text-white/55 text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
