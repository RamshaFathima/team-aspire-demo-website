const stats = [
  { value: '5,000+', label: 'Lives Touched',    icon: '❤️' },
  { value: '120+',   label: 'Volunteers',         icon: '🤝' },
  { value: '3 Yrs',  label: 'Of Service',         icon: '🌱' },
  { value: '2021',   label: 'Serving Since',       icon: '⭐' },
]

export default function StatsBar() {
  return (
    <section id="about" className="bg-brand-primary py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center group"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-serif font-bold text-white group-hover:scale-105 transition-transform duration-200">
                {stat.value}
              </div>
              <div className="text-sm font-medium mt-1 text-brand-tertiary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
