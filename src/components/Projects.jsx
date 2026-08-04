import { useState, useEffect } from 'react'

const FILTERS = ['All', 'Education', 'Aid', 'Events', 'Empowerment']

const projects = [
  {
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    tags: ['EDUCATION', 'YOUTH'],
    category: 'Education',
    title: 'Scholarship Program',
    description:
      'Merit and need-based scholarships enabling bright minds to pursue their dreams regardless of financial background.',
  },
  {
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
    tags: ['FOOD AID', 'COMMUNITY'],
    category: 'Aid',
    title: 'Monthly Meal Drive',
    description:
      'Coordinating volunteers to prepare and deliver nutritious meals to homeless individuals and migrant families.',
  },
  {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    tags: ['WOMEN', 'EMPOWERMENT'],
    category: 'Empowerment',
    title: "Shakti Women's Circle",
    description:
      'Workshops on financial literacy, skill development, and mental wellness for women from underserved communities.',
  },
  {
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80',
    tags: ['HEALTHCARE', 'AID'],
    category: 'Aid',
    title: 'Arogya Setu – Health Camps',
    description:
      'Free medical consultations, medicines, and awareness camps serving rural and urban communities in need.',
  },
  {
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    tags: ['EVENTS', 'COMMUNITY'],
    category: 'Events',
    title: 'Community Fest 2025',
    description:
      'A vibrant annual gathering celebrating culture, art, and unity across diverse Bangalore communities.',
  },
  {
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80',
    tags: ['EDUCATION', 'YOUTH'],
    category: 'Education',
    title: 'Vidya Jyoti – Education Drive',
    description:
      'Providing notebooks, school kits, and scholarships to 500+ underprivileged children across Bangalore.',
  },
]

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="animate-pulse bg-brand-tertiary/25 h-56 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="animate-pulse bg-brand-tertiary/30 h-5 w-20 rounded-full" />
          <div className="animate-pulse bg-brand-tertiary/20 h-5 w-24 rounded-full" />
        </div>
        <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded-lg" />
        <div className="space-y-1.5">
          <div className="animate-pulse bg-gray-100 h-3.5 w-full rounded" />
          <div className="animate-pulse bg-gray-100 h-3.5 w-5/6 rounded" />
          <div className="animate-pulse bg-gray-100 h-3.5 w-2/3 rounded" />
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ image, tags, title, description }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-brand-primary/10 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col">
      <div className="overflow-hidden h-56 flex-shrink-0 relative">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold tracking-widest text-brand-secondary bg-[#6B0F1A14] border border-[#6B0F1A26] px-2.5 py-1 rounded-full uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 leading-snug">{title}</h3>
        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed flex-1">{description}</p>
        {/* Link */}
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 text-brand-primary font-semibold text-sm mt-4 group/link hover:gap-3 transition-all duration-200 w-fit"
        >
          Learn More
          <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default function Projects() {
  const [active, setActive]   = useState('All')
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(projects)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setVisible(
      active === 'All'
        ? projects
        : projects.filter((p) => p.category === active),
    )
  }, [active])

  return (
    <section id="initiatives" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-brand-secondary font-bold text-xs uppercase tracking-[0.22em]">
            What We Do
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Our Initiatives
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            From education and healthcare to community events — every initiative is rooted in
            compassion and purpose.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                active === filter
                  ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/25'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brand-primary hover:text-brand-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : visible.map((p) => <ProjectCard key={p.title} {...p} />)}
        </div>

        {!loading && visible.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No initiatives found for this category.
          </div>
        )}
      </div>
    </section>
  )
}
