import { useState } from 'react'
import Modal from '../components/Modal'

const events = [
  {
    id: 1,
    title: 'Ramadan Iftar Gathering 2025',
    category: 'Community',
    status: 'Upcoming',
    date: 'March 2025',
    location: 'Bangalore',
    description: 'Join us for a blessed evening of breaking fast together as a community. Enjoy a warm, home-cooked Iftar meal, dua sessions, and sisterhood bonding in a welcoming atmosphere.',
    fee: 0,
    feeLabel: 'Free',
  },
  {
    id: 2,
    title: "Sisters' Halaqah Circle",
    category: 'Spiritual',
    status: 'Ongoing',
    date: 'Monthly',
    location: 'Bangalore',
    description: 'A regular circle of knowledge and reflection where sisters gather to discuss Islamic topics, share experiences, and strengthen their connection with Allah and each other.',
    fee: 0,
    feeLabel: 'Free',
  },
  {
    id: 3,
    title: 'Islamic Psychology Workshop',
    category: 'Education',
    status: 'Upcoming',
    date: 'September 2025',
    location: 'Bangalore',
    description: 'A transformative workshop exploring mental wellbeing through an Islamic lens. Learn evidence-based techniques integrated with Quranic wisdom for emotional resilience.',
    fee: 200,
    feeLabel: '₹200 per person',
  },
  {
    id: 4,
    title: "Eid Celebration & Sisters' Picnic",
    category: 'Celebration',
    status: 'Past',
    date: 'April 2024',
    location: 'Bangalore',
    description: "A joyous Eid celebration where sisters came together for a community picnic, games, food, and memorable moments of sisterhood. A day of gratitude and togetherness.",
    fee: 0,
    feeLabel: 'Free',
  },
  {
    id: 5,
    title: 'Qiyam Night',
    category: 'Spiritual',
    status: 'Past',
    date: 'January 2024',
    location: 'Bangalore',
    description: 'An overnight spiritual retreat dedicated to night prayers, Quran recitation, and deep reflection. Sisters came together to revive their hearts in the final third of the night.',
    fee: 0,
    feeLabel: 'Free',
  },
  {
    id: 6,
    title: 'Annual Community Dinner',
    category: 'Community',
    status: 'Upcoming',
    date: 'December 2025',
    location: 'Bangalore',
    description: 'Our flagship annual gathering celebrating another year of sisterhood, service, and growth. An evening of appreciation, recognition, and setting intentions for the year ahead.',
    fee: 500,
    feeLabel: '₹500 per person',
  },
]

const statusColors = {
  Upcoming: 'bg-emerald-100 text-emerald-700',
  Ongoing: 'bg-blue-100 text-blue-700',
  Past: 'bg-gray-100 text-gray-500',
}

const categoryColors = {
  Community: 'bg-brand-tertiary text-brand-dark',
  Spiritual: 'bg-purple-100 text-purple-700',
  Education: 'bg-amber-100 text-amber-700',
  Celebration: 'bg-rose-100 text-rose-700',
}

const filters = ['All', 'Upcoming', 'Ongoing', 'Past']

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  attendees: '1',
  dietary: 'none',
  requests: '',
}

export default function Events() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [submitted, setSubmitted] = useState(false)

  const filtered = activeFilter === 'All' ? events : events.filter(e => e.status === activeFilter)

  function openModal(event) {
    setSelectedEvent(event)
    setForm(defaultForm)
    setSubmitted(false)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSelectedEvent(null)
    setSubmitted(false)
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-brand-neutral pt-16">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-secondary font-semibold text-xs uppercase tracking-widest mb-3">Community</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-primary mb-4">Our Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From spiritual gatherings to educational workshops and community celebrations — every Aspire event is a chance to grow, connect, and serve together as sisters.
          </p>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-brand-primary text-white shadow-soft'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(event => (
            <div key={event.id} className="bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col overflow-hidden hover:shadow-card transition-shadow duration-300">
              <div className="h-1.5 bg-brand-primary" />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[event.category] || 'bg-gray-100 text-gray-600'}`}>
                    {event.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-primary mb-2 leading-snug">{event.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {event.location}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{event.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`text-sm font-semibold ${event.fee === 0 ? 'text-emerald-600' : 'text-brand-secondary'}`}>
                    {event.feeLabel}
                  </span>
                  <button
                    onClick={() => openModal(event)}
                    disabled={event.status === 'Past'}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      event.status === 'Past'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-primary text-white hover:bg-brand-dark shadow-soft hover:shadow-card'
                    }`}
                  >
                    {event.status === 'Past' ? 'Event Ended' : 'Register Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No events in this category right now.</p>
            <p className="text-sm mt-1">Check back soon — we are always planning something new!</p>
          </div>
        )}
      </section>

      {/* Registration Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={selectedEvent ? `Register for ${selectedEvent.title}` : ''}
        size="md"
      >
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">Registration Confirmed!</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              You will receive a confirmation email shortly. We look forward to seeing you at the event, in sha Allah!
            </p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedEvent && (
              <div className="bg-brand-neutral rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">Event</p>
                    <p className="font-semibold text-brand-primary text-sm">{selectedEvent.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedEvent.date} · {selectedEvent.location}</p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${selectedEvent.fee === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {selectedEvent.fee === 0 ? 'Free Event' : selectedEvent.feeLabel}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number (WhatsApp) <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Attendees</label>
                <select
                  name="attendees"
                  value={form.attendees}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Dietary Requirements</label>
                <select
                  name="dietary"
                  value={form.dietary}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
                >
                  <option value="none">None</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="halal">Halal only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Special Requests <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="requests"
                value={form.requests}
                onChange={handleChange}
                rows={3}
                placeholder="Any special accommodations or requests..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors resize-none"
              />
            </div>

            {selectedEvent && selectedEvent.fee > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Event Fee</span>
                  <span className="font-bold text-brand-secondary text-lg">{selectedEvent.feeLabel}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Payment details will be shared with you after registration is confirmed.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-soft"
            >
              Confirm Registration
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
