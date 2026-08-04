const JOIN_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScNh8KLNBV2eh11fIpcNArBGmU8N8ItNxFtxSHoLjJ3YuaURw/viewform'

const benefits = [
  'Flexible volunteering that fits your schedule',
  'Meaningful roles across education, events & more',
  'A warm, welcoming community you\'ll love',
  'Skill-building workshops and leadership growth',
]

export default function JoinUs() {
  return (
    <section
      id="join"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #6B0F1A 0%, #8C1C2E 60%, #5a0a15 100%)' }}
    >
      {/* Decorative circles — same language as Impact */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, #D9A5A5, transparent)' }} />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #D9A5A5, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── Left: image ── */}
          <div className="relative rounded-3xl overflow-hidden shadow-card">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80"
              alt="Aspire Foundation volunteers"
              loading="lazy"
              className="w-full h-[500px] object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(160deg, rgba(107,15,26,0.25) 0%, rgba(107,15,26,0.60) 100%)',
              }}
            />
            {/* Quote card */}
            <div
              className="absolute bottom-6 left-6 right-6 rounded-2xl px-5 py-4"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)' }}
            >
              <p className="font-serif italic text-white text-base leading-snug mb-1.5">
                "Every volunteer brings a spark. Together, we are the flame."
              </p>
              <span className="text-white/65 text-xs font-medium">— Aspire Foundation Team</span>
            </div>
          </div>

          {/* ── Right: content ── */}
          <div>
            <span className="text-brand-tertiary font-bold text-xs uppercase tracking-[0.22em] mb-3 block">
              Be The Change
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Join Our Family of<br />Changemakers
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-7">
              Whether you have a few hours a week or boundless enthusiasm, there's a place for you
              at Aspire Foundation. Your time, skills, and heart can transform lives — including
              your own.
            </p>

            {/* Benefits */}
            <ul className="space-y-3.5 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-brand-tertiary flex-shrink-0 mt-0.5"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-white/80 text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA — light button on dark bg */}
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white hover:bg-brand-neutral text-brand-primary font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-card hover:shadow-none active:scale-95 text-sm"
            >
              Become a Volunteer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
