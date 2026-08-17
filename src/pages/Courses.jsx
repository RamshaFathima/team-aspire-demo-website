import { useState } from 'react'
import Modal from '../components/Modal'

const courses = [
  {
    id: 1,
    title: 'Quran Memorisation — Beginners',
    category: 'Quran & Tajweed',
    status: 'Ongoing',
    schedule: 'Every Saturday 10am',
    format: 'In-Person',
    fee: 500,
    feeType: 'recurring',
    feeLabel: '₹500/month',
    feeDetail: '₹500/month × 6 months = ₹3,000 total',
    instructor: 'Ustadha Fatima',
    level: 'Beginner',
    hasCertificate: true,
    description: 'A structured Quran memorisation programme for beginners covering Tajweed rules, proper pronunciation, and memorisation techniques in a nurturing in-person environment.',
  },
  {
    id: 2,
    title: 'Introduction to Fiqh',
    category: 'Fiqh',
    status: 'Upcoming',
    schedule: 'Every Friday 7pm',
    format: 'Online',
    fee: 0,
    feeType: 'free',
    feeLabel: 'Free',
    feeDetail: null,
    instructor: 'Ustadha Aisha',
    level: 'Beginner',
    hasCertificate: false,
    description: 'An accessible introduction to Islamic jurisprudence covering purification, prayer, fasting, and everyday rulings. Perfect for sisters new to structured Islamic study.',
  },
  {
    id: 3,
    title: 'Seerah: Life of the Prophet ﷺ',
    category: 'Seerah',
    status: 'Ongoing',
    schedule: 'Every Sunday 11am',
    format: 'Hybrid',
    fee: 1000,
    feeType: 'onetime',
    feeLabel: '₹1,000 (one-time)',
    feeDetail: '₹1,000 one-time enrolment fee',
    instructor: 'Ustadha Mariam',
    level: 'Intermediate',
    hasCertificate: true,
    description: 'An in-depth journey through the blessed life of Prophet Muhammad, covering key events, lessons, and the transformative impact of the Seerah on our daily lives.',
  },
  {
    id: 4,
    title: 'Arabic Language Foundation',
    category: 'Arabic Language',
    status: 'Upcoming',
    schedule: 'Mon & Wed 6pm',
    format: 'Online',
    fee: 800,
    feeType: 'recurring',
    feeLabel: '₹800/month',
    feeDetail: '₹800/month × 4 months = ₹3,200 total',
    instructor: 'Ustadha Zainab',
    level: 'Beginner',
    hasCertificate: false,
    description: 'A comprehensive Arabic foundation course covering the alphabet, grammar basics, reading, and writing to help you connect more deeply with the Quran and Islamic texts.',
  },
  {
    id: 5,
    title: 'Islamic Psychology & Wellbeing',
    category: 'Personal Development',
    status: 'Past',
    schedule: 'Saturdays',
    format: 'Hybrid',
    fee: 1500,
    feeType: 'onetime',
    feeLabel: '₹1,500 (one-time)',
    feeDetail: '₹1,500 one-time enrolment fee',
    instructor: 'Ustadha Sara',
    level: 'All Levels',
    hasCertificate: true,
    description: 'An enlightening course exploring mental health, emotional wellbeing, and self-care through an Islamic framework. Combining spiritual wisdom with evidence-based psychology.',
  },
]

const allCategories = ['All', 'Quran & Tajweed', 'Arabic Language', 'Fiqh', 'Seerah', 'Personal Development']

const statusColors = {
  Ongoing: 'bg-blue-100 text-blue-700',
  Upcoming: 'bg-emerald-100 text-emerald-700',
  Past: 'bg-gray-100 text-gray-500',
}

const formatColors = {
  'In-Person': 'bg-purple-100 text-purple-700',
  Online: 'bg-cyan-100 text-cyan-700',
  Hybrid: 'bg-amber-100 text-amber-700',
}

const howHeardOptions = ['Instagram', 'WhatsApp', 'Friend / Family', 'Event', 'Other']

const defaultStep1 = { name: '', age: '', email: '', phone: '', occupation: '', howHeard: '' }

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [step, setStep] = useState(1)
  const [step1Form, setStep1Form] = useState(defaultStep1)
  const [submitted, setSubmitted] = useState(false)

  const filtered = activeCategory === 'All' ? courses : courses.filter(c => c.category === activeCategory)

  function openModal(course) {
    setSelectedCourse(course)
    setStep1Form(defaultStep1)
    setStep(1)
    setSubmitted(false)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSelectedCourse(null)
    setSubmitted(false)
    setStep(1)
  }

  function handleStep1Change(e) {
    const { name, value } = e.target
    setStep1Form(prev => ({ ...prev, [name]: value }))
  }

  function handleStep1Submit(e) {
    e.preventDefault()
    if (selectedCourse && selectedCourse.fee === 0) {
      setSubmitted(true)
    } else {
      setStep(2)
    }
  }

  function handleFinalSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-brand-neutral pt-16">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-secondary font-semibold text-xs uppercase tracking-widest mb-3">Learn & Grow</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-primary mb-4">Islamic Education Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Structured programmes and knowledge circles designed to deepen your understanding of Islam, strengthen your faith, and empower you as a Muslimah.
          </p>
        </div>
      </section>

      {/* Filter Pills */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-primary text-white shadow-soft'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <div key={course.id} className="bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col overflow-hidden hover:shadow-card transition-shadow duration-300">
              <div className="h-1.5 bg-brand-primary" />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
                    {course.category}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[course.status]}`}>
                    {course.status}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${formatColors[course.format]}`}>
                    {course.format}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-brand-primary mb-1 leading-snug">{course.title}</h3>
                <p className="text-xs text-brand-secondary font-semibold mb-2">with {course.instructor}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{course.level}</span>
                  {course.hasCertificate && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Certificate</span>
                  )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-1">{course.description}</p>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.schedule}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                  <span className={`text-sm font-bold ${course.fee === 0 ? 'text-emerald-600' : 'text-brand-secondary'}`}>
                    {course.feeLabel}
                  </span>
                  <button
                    onClick={() => openModal(course)}
                    disabled={course.status === 'Past'}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      course.status === 'Past'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-primary text-white hover:bg-brand-dark shadow-soft'
                    }`}
                  >
                    {course.status === 'Past' ? 'Course Ended' : 'Register Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No courses in this category right now.</p>
          </div>
        )}
      </section>

      {/* Registration Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={selectedCourse ? `Register for ${selectedCourse.title}` : ''}
        size="lg"
      >
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">You are enrolled!</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A confirmation email will be sent to <span className="font-semibold text-brand-primary">{step1Form.email}</span>. Our team will contact you with payment details in sha Allah.
            </p>
            <button onClick={closeModal} className="mt-6 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            {selectedCourse && selectedCourse.fee > 0 && (
              <div className="flex items-center gap-2 mb-6">
                {[1, 2].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step >= s ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-500'
                    }`}>{s}</div>
                    <span className={`text-xs font-semibold ${step >= s ? 'text-brand-primary' : 'text-gray-400'}`}>
                      {s === 1 ? 'Personal Details' : 'Payment'}
                    </span>
                    {s === 1 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" required value={step1Form.name} onChange={handleStep1Change} placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
                    <input type="number" name="age" required min="10" max="80" value={step1Form.age} onChange={handleStep1Change} placeholder="e.g. 25"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" required value={step1Form.email} onChange={handleStep1Change} placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number (WhatsApp) <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" required value={step1Form.phone} onChange={handleStep1Change} placeholder="+91 98765 43210"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text" name="occupation" value={step1Form.occupation} onChange={handleStep1Change} placeholder="e.g. Student, Teacher, Homemaker"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">How did you hear about us?</label>
                  <select name="howHeard" value={step1Form.howHeard} onChange={handleStep1Change}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors">
                    <option value="">Select an option</option>
                    {howHeardOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-soft">
                  {selectedCourse && selectedCourse.fee > 0 ? 'Next →' : 'Confirm Enrolment'}
                </button>
              </form>
            )}

            {step === 2 && selectedCourse && (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="bg-brand-neutral rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Course Fee</p>
                  <p className="font-serif text-2xl font-bold text-brand-primary mb-1">{selectedCourse.feeLabel}</p>
                  {selectedCourse.feeDetail && (
                    <p className="text-sm text-gray-600">{selectedCourse.feeDetail}</p>
                  )}
                </div>

                <div className="bg-brand-neutral border border-brand-tertiary/40 rounded-xl p-4">
                  <p className="text-xs font-semibold text-brand-primary mb-1">Payment Instructions</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Our team will contact you with payment details after your enrolment is confirmed.
                    A receipt will be emailed to <span className="font-semibold">{step1Form.email}</span> within 24 hours of payment.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border-2 border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white transition-all">
                    Back
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-soft">
                    Confirm Enrolment
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </Modal>
    </div>
  )
}
