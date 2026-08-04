import { useState } from 'react'

const contactItems = [
  {
    icon: (
      <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Location',
    value: 'Bangalore, Karnataka, India',
    href: null,
  },
  {
    icon: (
      <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'teamaspireblr@gmail.com',
    href: 'mailto:teamaspireblr@gmail.com',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    label: 'Instagram',
    value: '@aspirefoundationblr',
    href: 'https://instagram.com/aspirefoundationblr',
  },
]

export default function Contact() {
  const [form, setForm]         = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1000)
  }

  return (
    <section id="contact" className="py-24 bg-brand-neutral">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-brand-secondary font-semibold text-xs uppercase tracking-[0.2em]">
            Contact Us
          </span>
          <h2 className="font-serif text-4xl font-bold text-brand-primary mt-2 mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Have questions, want to collaborate, or simply feel inspired to reach out?
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-brand-tertiary/20 p-8">
            {submitted ? (
              <div className="text-center py-14">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { name: 'name',    label: 'Full Name',      type: 'text',  placeholder: 'Your full name' },
                  { name: 'email',   label: 'Email Address',  type: 'email', placeholder: 'you@email.com' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how you'd like to get involved or ask us anything..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all resize-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white hover:text-[#CEC5C2] font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-brand-primary/50 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            {contactItems.map(({ icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-white border border-brand-tertiary/30 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-brand-primary/40 transition-colors">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="text-brand-primary font-medium hover:underline text-sm">
                      {value}
                    </a>
                  ) : (
                    <p className="text-gray-700 font-medium text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-8 bg-brand-primary rounded-2xl p-6 text-white">
              <h3 className="font-serif font-bold text-lg mb-2">Ready to make a difference?</h3>
              <p className="text-brand-tertiary/80 text-sm leading-relaxed mb-4">
                Join hundreds of volunteers who have already taken the first step. Every action, big or small, creates ripples of change.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScNh8KLNBV2eh11fIpcNArBGmU8N8ItNxFtxSHoLjJ3YuaURw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-brand-primary font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-brand-neutral transition-all duration-200 active:scale-95"
              >
                Join Us Now
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
