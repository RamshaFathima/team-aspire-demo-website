import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, subject, message } = formData
    const mailto = `mailto:teamaspireblr@gmail.com?subject=${encodeURIComponent(subject || 'Message from ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`
    window.location.href = mailto
    setSubmitted(true)
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-secondary font-sans font-semibold text-xs uppercase tracking-widest mb-3">We'd Love to Hear from You</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-primary mb-6">Contact Us</h1>
          <p className="font-sans text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
            Have a question, want to collaborate, or just want to say salaam? We're here.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14">

            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-primary mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-brand-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm text-gray-700 mb-0.5">Email</p>
                    <a href="mailto:teamaspireblr@gmail.com" className="font-sans text-brand-primary hover:text-brand-dark transition-colors text-sm">
                      teamaspireblr@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-brand-primary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm text-gray-700 mb-0.5">Instagram</p>
                    <a
                      href="https://instagram.com/teamaspireblr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-brand-primary hover:text-brand-dark transition-colors text-sm"
                    >
                      @teamaspireblr
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 text-brand-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm text-gray-700 mb-0.5">Location</p>
                    <p className="font-sans text-gray-600 text-sm">Bangalore, Karnataka, India</p>
                    <p className="font-sans text-xs text-gray-400 mt-0.5">Founded 2015</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-card p-8 border border-brand-tertiary/20">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">Message Sent!</h3>
                  <p className="font-sans text-gray-600 text-sm">Your email client should have opened. We'll get back to you soon, in sha Allah.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-serif text-xl font-bold text-brand-primary mb-5">Send a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-gray-600 mb-1.5">Your Name *</label>
                      <input
                        type="text" name="name" required value={formData.name} onChange={handleChange}
                        placeholder="Your name"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-sans text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-gray-600 mb-1.5">Email Address *</label>
                      <input
                        type="email" name="email" required value={formData.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-sans text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-gray-600 mb-1.5">Subject</label>
                    <input
                      type="text" name="subject" value={formData.subject} onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-sans text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-gray-600 mb-1.5">Message *</label>
                    <textarea
                      name="message" required value={formData.message} onChange={handleChange} rows={5}
                      placeholder="Your message..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-sans text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-primary text-white font-sans font-bold text-sm rounded-xl hover:bg-brand-dark transition-colors shadow-soft"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
