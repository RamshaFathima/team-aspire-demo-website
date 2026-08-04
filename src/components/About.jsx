const timeline = [
  {
    year: '2021',
    title: 'A Spark is Born',
    description:
      'Aspire Foundation is founded in Bangalore with a small team of 10 passionate volunteers and a shared dream to make a difference.',
  },
  {
    year: '2022',
    title: 'First Education Drive',
    description:
      'Launched the Vidya Jyoti scholarship program, benefiting 150 children in their first year. Also started monthly food distribution.',
  },
  {
    year: '2023',
    title: 'Community Grows',
    description:
      'Expanded to 80+ active volunteers, launched Arogya Setu health camps, and held our first cultural community fest in Bangalore.',
  },
  {
    year: '2024',
    title: 'Reaching New Heights',
    description:
      'Crossed 3,000 lives touched. Launched Shakti Women\'s Circle for women empowerment and skill-building workshops.',
  },
  {
    year: '2025',
    title: '5,000+ Lives Touched',
    description:
      '120+ active volunteers and 5,000+ lives impacted. Team Aspire stands as a trusted force for good across Bangalore.',
  },
]

const values = [
  {
    title: 'Compassion First',
    description: 'Every action begins with empathy. We listen before we act, and we act with kindness.',
    icon: (
      <svg className="w-7 h-7 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: 'Community Driven',
    description: 'Real change starts with real relationships — in our neighbourhoods, schools, and homes.',
    icon: (
      <svg className="w-7 h-7 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: 'Lasting Impact',
    description: 'We measure our work by the dignity built and the futures opened — not the noise made.',
    icon: (
      <svg className="w-7 h-7 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
]

function MilestoneCard({ year, title, description, badgeOnRight = false }) {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-brand-tertiary/10">
      <div className={`flex ${badgeOnRight ? 'md:justify-end' : 'justify-start'}`}>
        <span className="bg-brand-primary/10 text-brand-primary px-4 py-1 rounded-full text-xs font-bold tracking-wide">
          {year}
        </span>
      </div>
      <h4 className="mt-4 font-serif text-xl font-bold text-gray-900 text-center">{title}</h4>
      <p className="mt-2 text-gray-500 leading-relaxed text-sm text-center">{description}</p>
    </div>
  )
}

export default function About() {
  return (
    <section id="about">

      {/* ── 1. Intro ── */}
      <div className="bg-gradient-hero py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-primary">
            Our Story
          </p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-gray-900">
            Born from a simple belief — <span className="text-brand-primary">everyone deserves a chance</span>.
          </h2>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-gray-500">
            Team Aspire began in 2021 with a small group of friends in Bangalore who refused to walk
            past struggle. Today, we are a thriving community of educators, doctors, artists, and
            dreamers — all united by one purpose.
          </p>
        </div>
      </div>

      {/* ── 2. Mission & Vision ── */}
      <div className="bg-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80"
            alt="Volunteers at a community event"
            loading="lazy"
            className="w-full h-[440px] lg:h-[520px] object-cover rounded-3xl shadow-card"
          />
          <div>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h3>
            <p className="mt-4 text-base lg:text-lg leading-relaxed text-gray-500">
              To empower underserved communities in and around Bangalore through education,
              healthcare, and humanitarian aid — building dignity, opportunity, and lasting change
              one life at a time.
            </p>
            <h3 className="mt-10 font-serif text-3xl md:text-4xl font-bold text-gray-900">Our Vision</h3>
            <p className="mt-4 text-base lg:text-lg leading-relaxed text-gray-500">
              A society where compassion is the currency, where every child can dream freely, and
              where no one is left behind because of where they were born.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Values ── */}
      <div className="bg-brand-neutral py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-primary">
              What We Stand For
            </p>
            <h3 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Our Values
            </h3>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                  {v.icon}
                </div>
                <h4 className="mt-6 font-serif text-2xl font-bold text-gray-900">{v.title}</h4>
                <p className="mt-3 text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Founder ── */}
      <div className="bg-white py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-primary">
              The Heart Behind
            </p>
            <h3 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Meet The Founder
            </h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full ring-8 ring-brand-primary/10 shadow-card overflow-hidden flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6B0F1A 0%, #8C1C2E 100%)' }}>
                  {/* Replace with: <img src="/founder.jpg" className="w-full h-full object-cover" /> */}
                  <svg className="w-32 h-32 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-brand-primary border-4 border-white flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="text-brand-secondary font-bold text-xs uppercase tracking-[0.22em]">
                Founder &amp; Driving Force
              </span>
              <h4 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-gray-900">
                [Founder Name]
              </h4>
              <p className="text-brand-secondary text-sm font-medium mt-1 mb-5">
                Co-Founder, Team Aspire · Bangalore
              </p>
              <blockquote className="font-serif italic text-brand-primary text-lg leading-snug mb-5 pl-4 border-l-2 border-brand-primary/30">
                "Every act of service is a seed. The harvest may come slowly, but it always comes."
              </blockquote>
              <p className="text-gray-500 leading-relaxed">
                [Add 2–3 sentences about the founder — their background, what inspired them to start
                Team Aspire, and their vision for the community.]
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Our Story & History — Alternating Timeline ── */}
      <div className="bg-brand-neutral py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-primary">
              Our Journey
            </p>
            <h3 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Our Story &amp; History
            </h3>
          </div>

          <div className="relative">
            {/* Vertical line — left on mobile, center on desktop */}
            <div
              className="absolute top-2 bottom-2 w-0.5 left-4 md:left-1/2 md:-translate-x-1/2"
              style={{ background: 'linear-gradient(to bottom, #6B0F1A 0%, #8C1C2E 50%, #D9A5A5 100%)' }}
            />

            <div className="space-y-12 md:space-y-16">
              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0
                return (
                  <div key={item.year} className="relative md:grid md:grid-cols-2 md:gap-16">

                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 top-7 -translate-x-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-brand-primary ring-4 ring-[#D9A5A5]/50 shadow-md shadow-brand-primary/40" />
                    </div>

                    {isLeft ? (
                      <>
                        <div className="pl-12 md:pl-0">
                          <MilestoneCard {...item} badgeOnRight />
                        </div>
                        <div className="hidden md:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block" />
                        <div className="pl-12 md:pl-0">
                          <MilestoneCard {...item} />
                        </div>
                      </>
                    )}

                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
