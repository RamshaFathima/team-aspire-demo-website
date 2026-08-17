import { useState } from 'react'
import Modal from '../components/Modal'

const projects = [
  {
    id: 1,
    title: 'Monthly Food Drive — Old Age Homes',
    category: 'Welfare',
    status: 'Ongoing',
    description: 'Each month our volunteers deliver home-cooked meals and spend quality time with elderly residents of local care homes, bringing warmth, companionship, and dignity.',
    impact: '50+ residents/month',
    hasRecurring: false,
  },
  {
    id: 2,
    title: 'Ramadan Food Parcels',
    category: 'Relief',
    status: 'Active',
    description: 'During Ramadan, we distribute food parcels and essential groceries to underprivileged families across Bangalore, ensuring no family goes without during the holy month.',
    impact: '200+ families',
    hasRecurring: false,
  },
  {
    id: 3,
    title: 'Hospital Visits & Welfare Rounds',
    category: 'Welfare',
    status: 'Ongoing',
    description: 'Our sisters regularly visit patients in government hospitals, offering emotional support, essentials, and the comfort of human connection during difficult times.',
    impact: '100+ patients visited',
    hasRecurring: false,
  },
  {
    id: 4,
    title: 'Orphan Sponsorship Drive',
    category: 'Education',
    status: 'Active',
    description: 'We raise funds to support the education and basic needs of orphaned children, partnering with verified organisations to ensure transparent, impactful delivery.',
    impact: '30+ children',
    hasRecurring: true,
  },
  {
    id: 5,
    title: 'Community Iftar Sponsorship',
    category: 'Community',
    status: 'Seasonal',
    description: 'Organising and funding large community iftars during Ramadan for those who may otherwise break their fast alone — sharing food, faith, and fellowship.',
    impact: '500+ plates served',
    hasRecurring: false,
  },
  {
    id: 6,
    title: "Sisters' Emergency Fund",
    category: 'Relief',
    status: 'Active',
    description: 'A discreet, compassionate fund providing emergency financial assistance to sisters in our community facing unexpected hardship with dignity and care.',
    impact: '40+ sisters helped',
    hasRecurring: true,
  },
]

const statusColors = {
  Ongoing: 'bg-green-100 text-green-700',
  Active: 'bg-blue-100 text-blue-700',
  Seasonal: 'bg-amber-100 text-amber-700',
}

const categoryColors = {
  Welfare: 'bg-brand-tertiary text-brand-dark',
  Relief: 'bg-rose-100 text-rose-700',
  Education: 'bg-purple-100 text-purple-700',
  Community: 'bg-brand-primary/10 text-brand-primary',
}

const amountPresets = [500, 1000, 2500, 5000]

const defaultVolunteerForm = { name: '', email: '', phone: '', availability: [], skills: '', health: '', consent: false }
const defaultDonateForm = { name: '', email: '', phone: '', amount: 1000, customAmount: '', recurring: false, frequency: 'monthly' }

export default function Projects() {
  const [activeModal, setActiveModal] = useState(null) // 'volunteer' | 'donate' | null
  const [selectedProject, setSelectedProject] = useState(null)
  const [volunteerForm, setVolunteerForm] = useState(defaultVolunteerForm)
  const [donateForm, setDonateForm] = useState(defaultDonateForm)
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false)
  const [donateSubmitted, setDonateSubmitted] = useState(false)

  function openVolunteer(project) {
    setSelectedProject(project)
    setVolunteerForm(defaultVolunteerForm)
    setVolunteerSubmitted(false)
    setActiveModal('volunteer')
  }

  function openDonate(project) {
    setSelectedProject(project)
    setDonateForm(defaultDonateForm)
    setDonateSubmitted(false)
    setActiveModal('donate')
  }

  function closeModal() {
    setActiveModal(null)
    setSelectedProject(null)
    setVolunteerSubmitted(false)
    setDonateSubmitted(false)
  }

  function handleVolunteerChange(e) {
    const { name, value, type, checked } = e.target
    if (name === 'availability') {
      setVolunteerForm(prev => ({
        ...prev,
        availability: checked
          ? [...prev.availability, value]
          : prev.availability.filter(v => v !== value),
      }))
    } else if (type === 'checkbox') {
      setVolunteerForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setVolunteerForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleDonateChange(e) {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setDonateForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setDonateForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function submitVolunteer(e) {
    e.preventDefault()
    setVolunteerSubmitted(true)
  }

  function submitDonate(e) {
    e.preventDefault()
    setDonateSubmitted(true)
  }

  const finalDonateAmount = donateForm.customAmount ? parseInt(donateForm.customAmount) : donateForm.amount

  return (
    <div className="min-h-screen bg-brand-neutral pt-16">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-secondary font-semibold text-xs uppercase tracking-widest mb-3">Humanitarian Service</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-primary mb-4">Our Projects</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Food drives, welfare visits, orphan sponsorships, and community service — transforming lives one act of kindness at a time, for the sake of Allah.
          </p>
        </div>
      </section>

      {/* Project Cards */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col overflow-hidden hover:shadow-card transition-shadow duration-300">
              <div className="h-1.5 bg-gradient-gold" />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[project.category] || 'bg-gray-100 text-gray-600'}`}>
                    {project.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[project.status] || 'bg-gray-100 text-gray-600'}`}>
                    {project.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-primary mb-2 leading-snug">{project.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>

                <div className="flex items-center gap-2 mb-4 bg-brand-neutral rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-brand-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-brand-secondary">Impact: {project.impact}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openVolunteer(project)}
                    className="flex-1 py-2 px-3 border-2 border-brand-primary text-brand-primary text-sm font-semibold rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200"
                  >
                    Volunteer Now
                  </button>
                  <button
                    onClick={() => openDonate(project)}
                    className="flex-1 py-2 px-3 bg-brand-secondary text-white text-sm font-semibold rounded-lg hover:bg-brand-secondary/90 transition-all duration-200"
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer Modal */}
      <Modal
        isOpen={activeModal === 'volunteer'}
        onClose={closeModal}
        title={selectedProject ? `Volunteer for ${selectedProject.title}` : ''}
        size="md"
      >
        {volunteerSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">Registered!</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Our team will be in touch via WhatsApp. JazakAllah khair for your willingness to serve!</p>
            <button onClick={closeModal} className="mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submitVolunteer} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" required value={volunteerForm.name} onChange={handleVolunteerChange} placeholder="Your full name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" required value={volunteerForm.email} onChange={handleVolunteerChange} placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone (WhatsApp) <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" required value={volunteerForm.phone} onChange={handleVolunteerChange} placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Availability <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {['Weekday mornings', 'Weekday evenings', 'Weekends'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="availability" value={opt} checked={volunteerForm.availability.includes(opt)} onChange={handleVolunteerChange}
                      className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Skills / Experience <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea name="skills" value={volunteerForm.skills} onChange={handleVolunteerChange} rows={2} placeholder="Any relevant skills or prior experience..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Any health limitations? <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea name="health" value={volunteerForm.health} onChange={handleVolunteerChange} rows={2} placeholder="Let us know if you have any physical limitations..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors resize-none" />
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" name="consent" checked={volunteerForm.consent} onChange={handleVolunteerChange} required
                className="w-4 h-4 mt-0.5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
              <span className="text-sm text-gray-600">I consent to being added to the volunteer WhatsApp group for updates. <span className="text-red-500">*</span></span>
            </label>
            <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-soft">
              Register as Volunteer
            </button>
          </form>
        )}
      </Modal>

      {/* Donate Modal */}
      <Modal
        isOpen={activeModal === 'donate'}
        onClose={closeModal}
        title={selectedProject ? `Donate to ${selectedProject.title}` : ''}
        size="md"
      >
        {donateSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">Thank you!</h3>
            <p className="text-gray-600 text-sm leading-relaxed">A receipt will be emailed to you within 24 hours. May Allah accept your donation!</p>
            <button onClick={closeModal} className="mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submitDonate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Donor Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" required value={donateForm.name} onChange={handleDonateChange} placeholder="Your full name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email (for receipt) <span className="text-red-500">*</span></label>
              <input type="email" name="email" required value={donateForm.email} onChange={handleDonateChange} placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" required value={donateForm.phone} onChange={handleDonateChange} placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Donation Amount</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {amountPresets.map(amt => (
                  <button key={amt} type="button"
                    onClick={() => setDonateForm(prev => ({ ...prev, amount: amt, customAmount: '' }))}
                    className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      donateForm.amount === amt && !donateForm.customAmount
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input type="number" name="customAmount" value={donateForm.customAmount} onChange={e => {
                handleDonateChange(e)
                setDonateForm(prev => ({ ...prev, amount: 0, customAmount: e.target.value }))
              }}
                placeholder="Or enter custom amount (₹)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>

            {selectedProject && selectedProject.hasRecurring && (
              <div className="bg-brand-neutral rounded-xl p-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" name="recurring" checked={donateForm.recurring} onChange={handleDonateChange}
                    className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                  <span className="text-sm font-semibold text-gray-700">Make this a recurring donation</span>
                </label>
                {donateForm.recurring && (
                  <div className="flex gap-3">
                    {['monthly', 'quarterly'].map(freq => (
                      <label key={freq} className={`flex-1 text-center py-2 rounded-lg border-2 cursor-pointer text-sm font-semibold capitalize transition-all ${
                        donateForm.frequency === freq ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 text-gray-600 hover:border-brand-primary'
                      }`}>
                        <input type="radio" name="frequency" value={freq} checked={donateForm.frequency === freq} onChange={handleDonateChange} className="sr-only" />
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-brand-neutral border border-brand-tertiary/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-brand-primary mb-1">Payment Instructions</p>
              <p className="text-xs text-gray-600 leading-relaxed">Our team will share payment details with you after your submission. A receipt will be emailed within 24 hours of payment.</p>
            </div>

            {finalDonateAmount > 0 && (
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Donation</span>
                <span className="font-bold text-brand-primary text-lg">₹{finalDonateAmount.toLocaleString('en-IN')}{donateForm.recurring ? ` / ${donateForm.frequency}` : ''}</span>
              </div>
            )}

            <button type="submit" className="w-full bg-brand-secondary text-white py-3 rounded-xl font-semibold hover:bg-brand-secondary/90 transition-colors shadow-soft">
              Confirm Donation
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
