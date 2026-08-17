import { useState } from 'react'
import Modal from '../components/Modal'

const donationTypes = [
  {
    id: 'general',
    title: 'General Fund',
    description: 'Support Aspire\'s day-to-day operations and programs. Your donation keeps our community running.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    allowRecurring: true,
    zakatNote: null,
  },
  {
    id: 'zakat',
    title: 'Zakat',
    description: 'Give your Zakat knowing it reaches those truly in need. We ensure proper, transparent Zakat distribution to eligible recipients.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    allowRecurring: false,
    zakatNote: 'Zakat is distributed only to the 8 eligible categories as defined in the Quran. We maintain a transparent record of Zakat distribution.',
  },
  {
    id: 'sadaqah',
    title: 'Sadaqah Jariyah',
    description: 'Ongoing charity that continues to benefit even after we\'re gone. Invest in the Hereafter through projects that carry forward your blessings.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    allowRecurring: true,
    zakatNote: null,
  },
  {
    id: 'project',
    title: 'Project Donation',
    description: 'Donate to a specific project or initiative of your choice. Your funds go directly to the cause you care about most.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    allowRecurring: false,
    zakatNote: null,
  },
]

const projectOptions = [
  'Monthly Food Drive — Old Age Homes',
  'Ramadan Food Parcels',
  'Hospital Visits & Welfare Rounds',
  'Orphan Sponsorship Drive',
  'Community Iftar Sponsorship',
  "Sisters' Emergency Fund",
]

const amountPresets = [500, 1000, 2500, 5000]

const defaultForm = {
  fundType: 'general',
  projectName: '',
  name: '',
  email: '',
  phone: '',
  amount: 1000,
  customAmount: '',
  recurring: false,
  frequency: 'monthly',
  consent: false,
}

export default function Donate() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [submitted, setSubmitted] = useState(false)

  function openModal(fundType) {
    setForm({ ...defaultForm, fundType })
    setSubmitted(false)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSubmitted(false)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  const finalAmount = form.customAmount ? parseInt(form.customAmount) : form.amount
  const selectedType = donationTypes.find(d => d.id === form.fundType)

  return (
    <div className="min-h-screen bg-brand-neutral pt-16">
      {/* Hero */}
      <section className="bg-gradient-impact py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-tertiary/70 font-semibold text-xs uppercase tracking-widest mb-3">Give Generously</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Support Our Mission</h1>
          <p className="text-brand-tertiary/80 text-lg leading-relaxed">
            Your donation sustains food drives, welfare programs, Islamic education, and community initiatives. Every rupee is a sadaqah.
          </p>
        </div>
      </section>

      {/* Donation Type Cards */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="font-serif text-2xl font-bold text-brand-primary mb-2 text-center">Choose How to Give</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Select the type of donation that resonates with you</p>

        <div className="grid md:grid-cols-2 gap-5">
          {donationTypes.map(type => (
            <div key={type.id} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 hover:shadow-card transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-brand-primary mb-1">{type.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{type.description}</p>
                  {type.zakatNote && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 leading-relaxed">
                      {type.zakatNote}
                    </p>
                  )}
                  {type.id === 'project' && (
                    <select
                      value={form.projectName}
                      onChange={e => setForm(prev => ({ ...prev, projectName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 mb-3"
                    >
                      <option value="">Select a project...</option>
                      {projectOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  )}
                  <button
                    onClick={() => openModal(type.id)}
                    className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors shadow-soft"
                  >
                    Donate to {type.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-brand-primary mb-8 text-center">Why Donate to Aspire?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Full Transparency',
                description: 'We publish regular impact reports and share how every rupee is used. No hidden costs, no ambiguity.',
                icon: '🔍',
              },
              {
                title: 'Real Impact',
                description: 'Your donation directly funds food drives, education programs, welfare support, and community initiatives.',
                icon: '💛',
              },
              {
                title: 'Official Receipts',
                description: 'Every donor receives an email receipt. We are working towards 80G tax exemption status.',
                icon: '📄',
              },
            ].map(point => (
              <div key={point.title} className="text-center p-6 bg-brand-neutral rounded-2xl border border-brand-tertiary/30">
                <div className="text-3xl mb-3">{point.icon}</div>
                <h3 className="font-serif text-lg font-bold text-brand-primary mb-2">{point.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-brand-neutral rounded-2xl border border-brand-tertiary/30 p-8 text-center">
          <h2 className="font-serif text-xl font-bold text-brand-primary mb-3">Need Help With Your Donation?</h2>
          <p className="font-sans text-gray-600 text-sm leading-relaxed max-w-xl mx-auto mb-4">
            Reach out to us directly and our team will assist you with your donation and share payment details.
          </p>
          <a href="mailto:teamaspireblr@gmail.com"
            className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm hover:text-brand-dark transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            teamaspireblr@gmail.com
          </a>
        </div>
      </section>

      {/* Donation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={selectedType ? `Donate — ${selectedType.title}` : 'Donate'}
        size="md"
      >
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">JazakAllah Khair!</h3>
            <p className="text-gray-600 text-sm leading-relaxed">A receipt will be emailed to <span className="font-semibold text-brand-primary">{form.email}</span> within 24 hours. May Allah accept your donation!</p>
            <button onClick={closeModal} className="mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fund Type</label>
              <select name="fundType" value={form.fundType} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors">
                {donationTypes.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>

            {form.fundType === 'project' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Project <span className="text-red-500">*</span></label>
                <select name="projectName" value={form.projectName} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors">
                  <option value="">Choose a project...</option>
                  {projectOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Donor Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your full name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email (for receipt) <span className="text-red-500">*</span></label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Donation Amount</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {amountPresets.map(amt => (
                  <button key={amt} type="button"
                    onClick={() => setForm(prev => ({ ...prev, amount: amt, customAmount: '' }))}
                    className={`py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      form.amount === amt && !form.customAmount
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input type="number" name="customAmount" value={form.customAmount}
                onChange={e => setForm(prev => ({ ...prev, amount: 0, customAmount: e.target.value }))}
                placeholder="Or enter custom amount (₹)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>

            {selectedType && selectedType.allowRecurring && (
              <div className="bg-brand-neutral rounded-xl p-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input type="checkbox" name="recurring" checked={form.recurring} onChange={handleChange}
                    className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                  <span className="text-sm font-semibold text-gray-700">Make this a recurring donation</span>
                </label>
                {form.recurring && (
                  <div className="flex gap-3">
                    {['monthly', 'quarterly'].map(freq => (
                      <label key={freq} className={`flex-1 text-center py-2 rounded-lg border-2 cursor-pointer text-sm font-semibold capitalize transition-all ${
                        form.frequency === freq ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 text-gray-600 hover:border-brand-primary'
                      }`}>
                        <input type="radio" name="frequency" value={freq} checked={form.frequency === freq} onChange={handleChange} className="sr-only" />
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-brand-neutral border border-brand-tertiary/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-brand-primary mb-1">Payment Instructions</p>
              <p className="text-xs text-gray-600 leading-relaxed">Our team will reach out to you with payment details after your submission is received. A receipt will be emailed to you within 24 hours of payment.</p>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} required
                className="w-4 h-4 mt-0.5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
              <span className="text-sm text-gray-600">I confirm this donation is voluntary and I am the rightful owner of these funds. <span className="text-red-500">*</span></span>
            </label>

            {finalAmount > 0 && (
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">{form.recurring ? `${form.frequency.charAt(0).toUpperCase() + form.frequency.slice(1)} donation` : 'One-time donation'}</span>
                <span className="font-bold text-brand-primary text-lg">₹{finalAmount.toLocaleString('en-IN')}</span>
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
