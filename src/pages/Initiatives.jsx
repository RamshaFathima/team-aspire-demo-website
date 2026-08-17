import { useState } from 'react'
import Modal from '../components/Modal'

const initiatives = [
  {
    id: 1,
    title: 'Winter Essentials Drive',
    status: 'Active',
    description: 'Collecting blankets, warm clothes, and essentials for homeless families this winter season. Every contribution brings warmth to someone who needs it most.',
    target: 25000,
    raised: 18400,
    hasMonetary: true,
    impactNote: null,
    cause: 'providing winter essentials to homeless families',
  },
  {
    id: 2,
    title: 'School Stationery Collection',
    status: 'Active',
    description: 'Gathering notebooks, pens, and school supplies for underprivileged children ahead of the academic year. Help a child start their school year with confidence.',
    target: null,
    raised: null,
    hasMonetary: false,
    impactNote: 'Collection drive — donate supplies or volunteer to help sort and distribute.',
    cause: 'school stationery for underprivileged children',
  },
  {
    id: 3,
    title: 'Medical Aid for Sister Fatima',
    status: 'Closed',
    description: 'The community came together beautifully to support treatment costs for a sister in need. Alhamdulillah, the target was exceeded and full treatment was funded.',
    target: 50000,
    raised: 52000,
    hasMonetary: true,
    impactNote: 'Sister received full treatment. Alhamdulillah!',
    cause: null,
  },
  {
    id: 4,
    title: 'Eid Gift Boxes for Orphans',
    status: 'Closed',
    description: 'Gifted Eid clothes, sweets, and goodies to children at a local orphanage. Sisters volunteered to pack and distribute boxes, making it a heartwarming Eid for all.',
    target: null,
    raised: null,
    hasMonetary: false,
    impactNote: '60 children gifted. JazakAllah to every contributor!',
    cause: null,
  },
  {
    id: 5,
    title: 'Emergency Flood Relief — Karnataka',
    status: 'Closed',
    description: 'Raised and distributed relief supplies and funds to families affected by the 2024 Karnataka floods — including food, clothes, and household essentials.',
    target: 100000,
    raised: 120000,
    hasMonetary: true,
    impactNote: 'Target exceeded. Funds distributed to 80+ affected families.',
    cause: null,
  },
]

const amountPresets = [200, 500, 1000, 2500]

const defaultDonateForm = { name: '', email: '', amount: 500, customAmount: '' }

export default function Initiatives() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [donateModal, setDonateModal] = useState(false)
  const [selectedInitiative, setSelectedInitiative] = useState(null)
  const [donateForm, setDonateForm] = useState(defaultDonateForm)
  const [donateSubmitted, setDonateSubmitted] = useState(false)

  const filtered = activeFilter === 'All' ? initiatives : initiatives.filter(i => i.status === activeFilter)

  function openDonate(initiative) {
    setSelectedInitiative(initiative)
    setDonateForm(defaultDonateForm)
    setDonateSubmitted(false)
    setDonateModal(true)
  }

  function closeModal() {
    setDonateModal(false)
    setSelectedInitiative(null)
    setDonateSubmitted(false)
  }

  function handleDonateChange(e) {
    const { name, value } = e.target
    setDonateForm(prev => ({ ...prev, [name]: value }))
  }

  function submitDonate(e) {
    e.preventDefault()
    setDonateSubmitted(true)
  }

  const finalAmount = donateForm.customAmount ? parseInt(donateForm.customAmount) : donateForm.amount

  function progressPercent(raised, target) {
    return Math.min(Math.round((raised / target) * 100), 100)
  }

  return (
    <div className="min-h-screen bg-brand-neutral pt-16">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-secondary font-semibold text-xs uppercase tracking-widest mb-3">Time-Bound Causes</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-primary mb-4">Active Initiatives</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4">
            Initiatives are time-bound drives for specific causes.
          </p>
          <p className="text-sm text-brand-secondary bg-white/70 inline-block px-4 py-2 rounded-full font-medium border border-brand-tertiary">
            They close once the need is met — no recurring commitments.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {['All', 'Active', 'Closed'].map(f => (
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

        {/* Initiative Cards */}
        <div className="space-y-5">
          {filtered.map(initiative => (
            <div key={initiative.id} className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 hover:shadow-card transition-shadow duration-300">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-serif text-xl font-bold text-brand-primary">{initiative.title}</h3>
                    {initiative.status === 'Active' ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Initiative Closed</span>
                    )}
                    {initiative.raised && initiative.target && initiative.raised >= initiative.target && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-secondary/20 text-brand-dark">Target Met</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{initiative.description}</p>

                  {/* Progress bar for monetary drives */}
                  {initiative.hasMonetary && initiative.target && initiative.raised !== null && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                        <span>Raised: ₹{initiative.raised.toLocaleString('en-IN')}</span>
                        <span>Target: ₹{initiative.target.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${initiative.status === 'Closed' ? 'bg-brand-secondary' : 'bg-brand-primary'}`}
                          style={{ width: `${progressPercent(initiative.raised, initiative.target)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progressPercent(initiative.raised, initiative.target)}% funded</p>
                    </div>
                  )}

                  {initiative.impactNote && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-brand-neutral rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 text-brand-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{initiative.impactNote}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 min-w-[130px]">
                  {initiative.status === 'Active' && (
                    <>
                      {initiative.hasMonetary && (
                        <button
                          onClick={() => openDonate(initiative)}
                          className="w-full py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors shadow-soft"
                        >
                          Donate Now
                        </button>
                      )}
                      {!initiative.hasMonetary && (
                        <button
                          onClick={() => openDonate(initiative)}
                          className="w-full py-2.5 bg-brand-secondary text-white rounded-lg text-sm font-semibold hover:bg-brand-secondary/90 transition-colors"
                        >
                          Volunteer / Contribute
                        </button>
                      )}
                    </>
                  )}
                  {initiative.status === 'Closed' && (
                    <div className="text-center text-xs text-gray-400 font-medium bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200">
                      This initiative is closed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No initiatives in this category right now.</p>
          </div>
        )}
      </section>

      {/* Donate Modal */}
      <Modal
        isOpen={donateModal}
        onClose={closeModal}
        title={selectedInitiative ? `Donate to ${selectedInitiative.title}` : ''}
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
            <p className="text-gray-600 text-sm leading-relaxed">A receipt will be emailed to you. May Allah accept your contribution and multiply it manifold!</p>
            <button onClick={closeModal} className="mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submitDonate} className="space-y-4">
            {selectedInitiative && (
              <div className="bg-brand-neutral rounded-xl p-3 text-sm text-gray-600 leading-relaxed">
                All funds go directly to <span className="font-semibold text-brand-primary">{selectedInitiative.cause}</span>. This initiative will close once the target is reached.
              </div>
            )}

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
                    ₹{amt}
                  </button>
                ))}
              </div>
              <input type="number" name="customAmount" value={donateForm.customAmount} onChange={e => {
                setDonateForm(prev => ({ ...prev, amount: 0, customAmount: e.target.value }))
              }}
                placeholder="Or enter custom amount (₹)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
            </div>

            <div className="bg-brand-neutral border border-brand-tertiary/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-brand-primary mb-1">Payment Instructions</p>
              <p className="text-xs text-gray-600 leading-relaxed">Our team will share payment details with you directly after you submit this form. This is a one-time donation — no recurring commitment.</p>
            </div>

            {finalAmount > 0 && (
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">One-time donation</span>
                <span className="font-bold text-brand-primary text-lg">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-soft">
              Confirm Donation
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
