import { useState } from 'react'

const defaultForm = {
  name: '',
  age: '',
  phone: '',
  email: '',
  address: '',
  occupation: '',
  idFile: null,
  howFound: '',
  consent1: false,
  consent2: false,
  consent3: false,
}

const steps = [
  'Submit Application',
  'Review (5-7 days)',
  'Approval',
  'Welcome Email',
  'Member Portal Access',
]

export default function JoinAspire() {
  const [form, setForm] = useState(defaultForm)
  const [fileName, setFileName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, idFile: 'File size must be under 10MB.' }))
        return
      }
      setForm(prev => ({ ...prev, idFile: file }))
      setFileName(file.name)
      setErrors(prev => ({ ...prev, idFile: '' }))
    }
  }

  function validate() {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required.'
    if (!form.age || parseInt(form.age) < 18 || parseInt(form.age) > 65) newErrors.age = 'Age must be between 18 and 65.'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required.'
    if (!form.email.trim()) newErrors.email = 'Email address is required.'
    if (!form.idFile) newErrors.idFile = 'Please upload an ID proof.'
    if (!form.howFound) newErrors.howFound = 'Please tell us how you found us.'
    if (!form.consent1) newErrors.consent1 = 'This consent is required.'
    if (!form.consent2) newErrors.consent2 = 'This consent is required.'
    if (!form.consent3) newErrors.consent3 = 'This consent is required.'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-neutral pt-16 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl shadow-card p-10 border border-gray-100">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-3">Application Submitted!</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our team will review your application and get back to you within <span className="font-semibold text-brand-primary">5-7 business days</span>.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              You will receive a welcome email with your login credentials upon approval. Your Membership ID will be in the format <span className="font-mono font-bold text-brand-secondary">ASP-2025-XXXX</span>.
            </p>
            <p className="text-sm text-brand-secondary font-semibold">JazakAllah khair for joining our sisterhood!</p>

            <div className="mt-8">
              <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide font-semibold">What happens next?</p>
              <div className="flex flex-col gap-2">
                {steps.map((step, i) => (
                  <div key={step} className={`flex items-center gap-3 px-4 py-2 rounded-lg ${i === 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {i === 0 ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm ${i === 0 ? 'font-semibold text-emerald-700' : 'text-gray-600'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-neutral pt-16">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-secondary font-semibold text-xs uppercase tracking-widest mb-3">Be Part of Something Beautiful</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-primary mb-4">Join the Sisterhood</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A safe, uplifting, and faith-centred community for Muslim women in Bangalore — to grow together, serve together, and thrive together in the light of Islam.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} noValidate className="space-y-8">

              {/* Section 1: Personal Information */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <h2 className="font-serif text-xl font-bold text-brand-primary mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-sm flex items-center justify-center font-bold flex-shrink-0">1</span>
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="As on ID proof"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200'}`} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
                      <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="18–65" min="18" max="65"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors ${errors.age ? 'border-red-400' : 'border-gray-200'}`} />
                      {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} />
                    <p className="text-xs text-gray-400 mt-1">WhatsApp-capable number preferred</p>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Residential Area / Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="e.g. Jayanagar, Bangalore — 560011"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="text" name="occupation" value={form.occupation} onChange={handleChange} placeholder="e.g. Student, Teacher, Homemaker, Engineer"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
                  </div>
                </div>
              </div>

              {/* Section 2: Identity Verification */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <h2 className="font-serif text-xl font-bold text-brand-primary mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-sm flex items-center justify-center font-bold flex-shrink-0">2</span>
                  Identity Verification
                </h2>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Proof Upload <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">(Aadhaar / PAN / Passport)</span>
                </label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer hover:border-brand-primary hover:bg-brand-neutral/50 ${errors.idFile ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-brand-neutral/30'}`}>
                  <input
                    type="file"
                    id="idFile"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <label htmlFor="idFile" className="cursor-pointer flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {fileName ? (
                      <span className="text-sm font-semibold text-brand-primary">{fileName}</span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold text-gray-600">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-400">JPG, PNG, or PDF — max 10MB</span>
                      </>
                    )}
                  </label>
                </div>
                {errors.idFile && <p className="text-xs text-red-500 mt-1">{errors.idFile}</p>}
                <p className="text-xs text-gray-400 mt-2">Your ID is used only for identity verification and is stored securely.</p>
              </div>

              {/* Section 3: How You Found Us */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <h2 className="font-serif text-xl font-bold text-brand-primary mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-sm flex items-center justify-center font-bold flex-shrink-0">3</span>
                  How You Found Us
                </h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">How did you come across Team Aspire? <span className="text-red-500">*</span></label>
                  <select name="howFound" value={form.howFound} onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors ${errors.howFound ? 'border-red-400' : 'border-gray-200'}`}>
                    <option value="">Select an option...</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Friend/Family">Friend / Family</option>
                    <option value="Event">Event</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.howFound && <p className="text-xs text-red-500 mt-1">{errors.howFound}</p>}
                </div>
              </div>

              {/* Section 4: Consent */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <h2 className="font-serif text-xl font-bold text-brand-primary mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-sm flex items-center justify-center font-bold flex-shrink-0">4</span>
                  Consent & Agreement
                </h2>
                <div className="space-y-4">
                  {[
                    { name: 'consent1', text: 'I understand that Team Aspire is a women-only community space and confirm I am eligible to join.', error: errors.consent1, value: form.consent1 },
                    { name: 'consent2', text: 'I commit to actively participating in community activities and upholding the values of sisterhood.', error: errors.consent2, value: form.consent2 },
                    { name: 'consent3', text: 'I consent to my data being stored and used for community management purposes.', error: errors.consent3, value: form.consent3 },
                  ].map(item => (
                    <div key={item.name}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name={item.name} checked={item.value} onChange={handleChange}
                          className="w-4 h-4 mt-0.5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {item.name === 'consent1'
                            ? <>I understand that Team Aspire is a <strong>women-only community space</strong> and confirm I am eligible to join.</>
                            : item.text
                          } <span className="text-red-500">*</span>
                        </span>
                      </label>
                      {item.error && <p className="text-xs text-red-500 mt-1 ml-7">{item.error}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold text-base hover:bg-brand-dark transition-colors shadow-card"
              >
                Submit Application
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <h3 className="font-serif text-lg font-bold text-brand-primary mb-4">What happens next?</h3>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{step}</p>
                      {i === 0 && <p className="text-xs text-gray-400 mt-0.5">Fill and submit this form</p>}
                      {i === 1 && <p className="text-xs text-gray-400 mt-0.5">Our team reviews your application</p>}
                      {i === 2 && <p className="text-xs text-gray-400 mt-0.5">You will be notified via email</p>}
                      {i === 3 && <p className="text-xs text-gray-400 mt-0.5">Credentials sent to your email</p>}
                      {i === 4 && <p className="text-xs text-gray-400 mt-0.5">Access your member dashboard</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-primary rounded-2xl p-6 text-white">
              <h3 className="font-serif text-lg font-bold mb-3">Who Can Join?</h3>
              <p className="text-sm text-brand-tertiary/80 leading-relaxed">
                Team Aspire is open to all Muslim women aged 18+ in Bangalore and surrounding areas — students, professionals, homemakers, and retirees alike.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <h3 className="font-serif text-base font-bold text-brand-primary mb-3">Questions?</h3>
              <p className="text-sm text-gray-600 mb-3">Reach out to us before applying — we are happy to help.</p>
              <a href="mailto:teamaspireblr@gmail.com" className="text-sm font-semibold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                teamaspireblr@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
