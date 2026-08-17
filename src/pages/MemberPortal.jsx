import { useState } from 'react'
import { Link } from 'react-router-dom'

const MEMBER = {
  name: 'Fatima Al-Rashid',
  id: 'ASP-2025-0042',
  email: 'fatima.alrashid@example.com',
  phone: '+91 98765 43210',
  area: 'Jayanagar, Bangalore',
  occupation: 'Graphic Designer',
  joined: 'February 2025',
  status: 'Active',
  initials: 'FA',
}

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'courses', label: 'My Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'events', label: 'My Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { key: 'donations', label: 'My Donations', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { key: 'payments', label: 'My Payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { key: 'certificates', label: 'My Certificates', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { key: 'volunteer', label: 'Volunteer History', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
]

const myCourses = [
  { name: 'Quran Memorisation — Beginners', status: 'Ongoing', next: 'Sat Aug 23, 10:00 AM', payment: 'Paid', canDownload: false },
  { name: 'Seerah: Life of the Prophet ﷺ', status: 'Completed', next: 'Completed June 2024', payment: 'Paid', canDownload: true },
]

const myEvents = [
  { name: "Sisters' Halaqah Circle", date: 'Aug 20, 2025', status: 'Upcoming' },
  { name: 'Ramadan Iftar Gathering 2025', date: 'March 2025', status: 'Upcoming' },
  { name: 'Eid Celebration & Picnic', date: 'April 2024', status: 'Attended' },
  { name: 'Qiyam Night', date: 'January 2024', status: 'Attended' },
  { name: 'Islamic Knowledge Workshop', date: 'December 2023', status: 'Attended' },
]

const myDonations = [
  { date: 'Jul 15, 2025', fund: 'General Fund', amount: '₹1,000', receipt: '#RCT-0031' },
  { date: 'Apr 10, 2025', fund: 'Ramadan Food Parcels', amount: '₹2,500', receipt: '#RCT-0022' },
  { date: 'Jan 5, 2025', fund: 'Orphan Sponsorship', amount: '₹500', receipt: '#RCT-0011' },
]

const myPayments = [
  { course: 'Quran Memorisation', plan: '₹500/month × 6', amount: '₹500', dueDate: 'Sep 1, 2025', status: 'Pending' },
  { course: 'Quran Memorisation', plan: '₹500/month × 6', amount: '₹500', dueDate: 'Aug 1, 2025', status: 'Paid' },
  { course: 'Seerah: Life of the Prophet ﷺ', plan: 'One-time', amount: '₹1,000', dueDate: 'Jan 10, 2024', status: 'Paid' },
]

const volunteerHistory = [
  { date: 'Jul 12, 2025', initiative: 'Monthly Food Drive — Old Age Homes', hours: 3 },
  { date: 'Jun 5, 2025', initiative: 'Hospital Visits & Welfare Rounds', hours: 2 },
  { date: 'Mar 28, 2025', initiative: 'Ramadan Food Parcels — Packing Day', hours: 3 },
]

export default function MemberPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: MEMBER.name,
    email: MEMBER.email,
    phone: MEMBER.phone,
    area: MEMBER.area,
    occupation: MEMBER.occupation,
  })
  const [profileSaved, setProfileSaved] = useState(false)

  function NavItem({ item }) {
    return (
      <button
        onClick={() => { setActiveTab(item.key); setSidebarOpen(false) }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          activeTab === item.key
            ? 'bg-white text-brand-primary shadow-soft'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
        </svg>
        {item.label}
      </button>
    )
  }

  function StatusBadge({ status }) {
    const colors = {
      Paid: 'bg-emerald-100 text-emerald-700',
      Pending: 'bg-amber-100 text-amber-700',
      Overdue: 'bg-red-100 text-red-700',
      Upcoming: 'bg-blue-100 text-blue-700',
      Attended: 'bg-gray-100 text-gray-600',
      Ongoing: 'bg-blue-100 text-blue-700',
      Completed: 'bg-emerald-100 text-emerald-700',
      Active: 'bg-emerald-100 text-emerald-700',
    }
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Member info */}
      <div className="p-6 border-b border-white/10">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-serif font-bold text-xl text-white mb-3">
          {MEMBER.initials}
        </div>
        <p className="font-serif font-bold text-white text-base leading-tight">{MEMBER.name}</p>
        <p className="text-xs text-brand-tertiary/70 mt-0.5">{MEMBER.id}</p>
        <span className="inline-block mt-2 text-xs font-semibold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full">
          {MEMBER.status}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => <NavItem key={item.key} item={item} />)}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/login"
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </Link>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile tab bar — sits just below the navbar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 shadow-soft">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          className="p-2 rounded-lg text-brand-primary hover:bg-brand-primary/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-brand-primary">
          {navItems.find(n => n.key === activeTab)?.label}
        </span>
      </div>

      {/* Body row: sidebar + content */}
      <div className="flex flex-1 min-h-0">

        {/* Desktop sidebar — sticky, fills the remaining viewport height */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-brand-primary sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto z-20">
          {sidebar}
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="relative w-72 max-w-[85vw] bg-brand-primary flex flex-col h-full overflow-y-auto">
              {/* Close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {sidebar}
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 min-w-0 overflow-y-auto">

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-2xl font-bold text-brand-primary">Assalamu Alaikum, Fatima ✨</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome to your member dashboard</p>
            </div>

            {/* Dua of the Week */}
            <div className="bg-brand-primary rounded-2xl p-6 text-white">
              <p className="text-xs font-semibold text-brand-tertiary/70 uppercase tracking-wide mb-2">Dua of the Week</p>
              <p className="font-serif text-lg leading-relaxed mb-2 text-right" dir="rtl">رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ</p>
              <p className="text-sm text-brand-tertiary/80 leading-relaxed italic">
                "Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire."
              </p>
              <p className="text-xs text-brand-tertiary/60 mt-2">Surah Al-Baqarah 2:201</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Courses Enrolled', value: 2 },
                { label: 'Events Attended', value: 5 },
                { label: 'Volunteer Hours', value: 8 },
                { label: 'Donations Made', value: 3 },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 text-center">
                  <p className="font-serif text-3xl font-bold text-brand-primary">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Upcoming Payment */}
              <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
                <h3 className="font-serif text-base font-bold text-brand-primary mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Upcoming Payment
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700">Quran Memorisation course</p>
                  <p className="text-lg font-bold text-brand-secondary mt-1">₹500</p>
                  <p className="text-xs text-gray-500 mt-0.5">Due on Sep 1, 2025</p>
                  <button onClick={() => setActiveTab('payments')} className="mt-2 text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">
                    View Payments →
                  </button>
                </div>
              </div>

              {/* Upcoming Event */}
              <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
                <h3 className="font-serif text-base font-bold text-brand-primary mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upcoming Event
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700">Sisters' Halaqah Circle</p>
                  <p className="text-xs text-gray-500 mt-1">Monthly — Next session Aug 20</p>
                  <button onClick={() => setActiveTab('events')} className="mt-2 text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">
                    View Events →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">My Profile</h1>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center font-serif font-bold text-2xl text-white">
                  {MEMBER.initials}
                </div>
                <div>
                  <p className="font-serif text-xl font-bold text-brand-primary">{MEMBER.name}</p>
                  <p className="text-sm text-gray-500">{MEMBER.id}</p>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">Active Member</span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-700 mb-4">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'name' },
                  { label: 'Email Address', key: 'email', type: 'email' },
                  { label: 'Phone Number', key: 'phone', type: 'tel' },
                  { label: 'Residential Area', key: 'area' },
                  { label: 'Occupation', key: 'occupation' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      value={profileForm[field.key]}
                      onChange={e => setProfileForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Member Since</label>
                  <input type="text" value={MEMBER.joined} readOnly
                    className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
                </div>
              </div>

              {profileSaved && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg">
                  Profile saved successfully!
                </div>
              )}

              <button
                onClick={() => { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2500) }}
                className="mt-5 px-6 py-2.5 bg-brand-primary text-white rounded-xl font-semibold text-sm hover:bg-brand-dark transition-colors shadow-soft"
              >
                Save Changes
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Change Password</h3>
              <div className="space-y-3">
                {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <input type="password" placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors" />
                  </div>
                ))}
              </div>
              <button className="mt-4 px-6 py-2.5 bg-gray-800 text-white rounded-xl font-semibold text-sm hover:bg-gray-900 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* MY COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-5">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">My Courses</h1>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-neutral border-b border-gray-100">
                    <tr>
                      {['Course Name', 'Status', 'Next Session', 'Payment', 'Action'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myCourses.map((course, i) => (
                      <tr key={i} className="hover:bg-brand-neutral/50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-800">{course.name}</td>
                        <td className="px-5 py-4"><StatusBadge status={course.status} /></td>
                        <td className="px-5 py-4 text-gray-600">{course.next}</td>
                        <td className="px-5 py-4"><StatusBadge status={course.payment} /></td>
                        <td className="px-5 py-4">
                          {course.canDownload ? (
                            <button className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Certificate
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">In Progress</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MY EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-5">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">My Events</h1>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-neutral border-b border-gray-100">
                    <tr>
                      {['Event Name', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myEvents.map((ev, i) => (
                      <tr key={i} className="hover:bg-brand-neutral/50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-800">{ev.name}</td>
                        <td className="px-5 py-4 text-gray-600">{ev.date}</td>
                        <td className="px-5 py-4"><StatusBadge status={ev.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MY DONATIONS */}
        {activeTab === 'donations' && (
          <div className="space-y-5">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">My Donations</h1>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-neutral border-b border-gray-100">
                    <tr>
                      {['Date', 'Fund Type', 'Amount', 'Receipt'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myDonations.map((d, i) => (
                      <tr key={i} className="hover:bg-brand-neutral/50 transition-colors">
                        <td className="px-5 py-4 text-gray-600">{d.date}</td>
                        <td className="px-5 py-4 font-semibold text-gray-800">{d.fund}</td>
                        <td className="px-5 py-4 font-bold text-brand-secondary">{d.amount}</td>
                        <td className="px-5 py-4">
                          <button className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {d.receipt}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MY PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-5">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">My Payments</h1>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-800">Total Outstanding</p>
                <p className="text-xs text-amber-600">1 payment pending</p>
              </div>
              <p className="font-serif text-2xl font-bold text-amber-700">₹500</p>
            </div>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-neutral border-b border-gray-100">
                    <tr>
                      {['Course', 'Plan', 'Amount', 'Due Date', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myPayments.map((p, i) => (
                      <tr key={i} className="hover:bg-brand-neutral/50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-800">{p.course}</td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{p.plan}</td>
                        <td className="px-5 py-4 font-bold text-gray-800">{p.amount}</td>
                        <td className="px-5 py-4 text-gray-600">{p.dueDate}</td>
                        <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                        <td className="px-5 py-4">
                          {p.status === 'Pending' ? (
                            <button className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MY CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-5">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">My Certificates</h1>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-brand-primary">Seerah: Life of the Prophet ﷺ</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Completed June 2024 · Instructor: Ustadha Mariam</p>
                  <span className="inline-block mt-2 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">Completed</span>
                  <div className="mt-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors shadow-soft">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-neutral rounded-2xl border border-brand-tertiary/30 p-6 text-center">
              <p className="text-sm text-gray-500">Complete more courses to earn additional certificates.</p>
              <button onClick={() => setActiveTab('courses')} className="mt-3 text-sm font-semibold text-brand-primary hover:text-brand-dark transition-colors">
                View My Courses →
              </button>
            </div>
          </div>
        )}

        {/* VOLUNTEER HISTORY */}
        {activeTab === 'volunteer' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold text-brand-primary">Volunteer History</h1>
              <div className="bg-brand-primary/10 rounded-xl px-4 py-2 text-center">
                <p className="font-bold text-brand-primary text-xl">8</p>
                <p className="text-xs text-gray-500">Total Hours</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-brand-neutral border-b border-gray-100">
                    <tr>
                      {['Date', 'Initiative / Activity', 'Hours'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {volunteerHistory.map((v, i) => (
                      <tr key={i} className="hover:bg-brand-neutral/50 transition-colors">
                        <td className="px-5 py-4 text-gray-600">{v.date}</td>
                        <td className="px-5 py-4 font-semibold text-gray-800">{v.initiative}</td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-brand-primary">{v.hours}</span>
                          <span className="text-gray-400 text-xs ml-1">hrs</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>{/* end body row */}
    </div>
  )
}
