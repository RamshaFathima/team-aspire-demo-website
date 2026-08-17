import { useState } from 'react'
import { Link } from 'react-router-dom'

const navTabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'members', label: 'Members' },
  { key: 'courses', label: 'Courses' },
  { key: 'events', label: 'Events' },
  { key: 'donations', label: 'Donations' },
  { key: 'payments', label: 'Payments' },
  { key: 'communication', label: 'Communication' },
  { key: 'analytics', label: 'Analytics' },
]

const recentApplications = [
  { name: 'Aisha Begum', date: 'Aug 15, 2025', status: 'Pending' },
  { name: 'Mariam Khan', date: 'Aug 14, 2025', status: 'Pending' },
  { name: 'Zainab Siddiqui', date: 'Aug 13, 2025', status: 'Approved' },
  { name: 'Fatima Noor', date: 'Aug 12, 2025', status: 'Pending' },
  { name: 'Ruqayyah Rashid', date: 'Aug 10, 2025', status: 'Rejected' },
]

const recentDonations = [
  { donor: 'Fatima Al-Rashid', date: 'Aug 15, 2025', amount: '₹1,000', fund: 'General Fund', receipt: '#RCT-0089' },
  { donor: 'Aisha Mohammed', date: 'Aug 14, 2025', amount: '₹2,500', fund: 'Zakat', receipt: '#RCT-0088' },
  { donor: 'Mariam Ibrahim', date: 'Aug 13, 2025', amount: '₹500', fund: 'Orphan Sponsorship', receipt: '#RCT-0087' },
  { donor: 'Khadijah Ahmed', date: 'Aug 12, 2025', amount: '₹5,000', fund: 'Sadaqah Jariyah', receipt: '#RCT-0086' },
  { donor: 'Zainab Ali', date: 'Aug 11, 2025', amount: '₹1,000', fund: 'General Fund', receipt: '#RCT-0085' },
]

const allMembers = [
  { id: 'ASP-2025-0001', name: 'Fatima Al-Rashid', email: 'fatima@example.com', phone: '+91 98765 43210', joined: 'Feb 2025', status: 'Active' },
  { id: 'ASP-2025-0002', name: 'Aisha Mohammed', email: 'aisha@example.com', phone: '+91 98765 43211', joined: 'Feb 2025', status: 'Active' },
  { id: 'ASP-2025-0015', name: 'Mariam Ibrahim', email: 'mariam@example.com', phone: '+91 98765 43212', joined: 'Mar 2025', status: 'Active' },
  { id: 'ASP-2025-0022', name: 'Khadijah Ahmed', email: 'khadijah@example.com', phone: '+91 98765 43213', joined: 'Mar 2025', status: 'Active' },
  { id: 'ASP-2025-0031', name: 'Zainab Ali', email: 'zainab@example.com', phone: '+91 98765 43214', joined: 'Apr 2025', status: 'Active' },
  { id: 'ASP-2025-0042', name: 'Ruqayyah Rashid', email: 'ruqayyah@example.com', phone: '+91 98765 43215', joined: 'Apr 2025', status: 'Inactive' },
  { id: 'ASP-2025-0058', name: 'Sara Hassan', email: 'sara@example.com', phone: '+91 98765 43216', joined: 'May 2025', status: 'Pending' },
  { id: 'ASP-2025-0071', name: 'Noor Fatima', email: 'noor@example.com', phone: '+91 98765 43217', joined: 'Jun 2025', status: 'Active' },
]

const adminCourses = [
  { name: 'Quran Memorisation — Beginners', instructor: 'Ustadha Fatima', status: 'Ongoing', enrolled: 18, fee: '₹500/mo' },
  { name: 'Seerah: Life of the Prophet', instructor: 'Ustadha Mariam', status: 'Ongoing', enrolled: 24, fee: '₹1,000' },
  { name: 'Introduction to Fiqh', instructor: 'Ustadha Aisha', status: 'Upcoming', enrolled: 11, fee: 'Free' },
]

const adminEvents = [
  { name: 'Ramadan Iftar Gathering 2025', date: 'March 2025', registrations: 45, status: 'Upcoming' },
  { name: "Sisters' Halaqah Circle", date: 'Monthly', registrations: 30, status: 'Ongoing' },
  { name: 'Islamic Psychology Workshop', date: 'Sep 2025', registrations: 18, status: 'Upcoming' },
  { name: 'Annual Community Dinner', date: 'Dec 2025', registrations: 62, status: 'Upcoming' },
]

const allDonations = [
  { date: 'Aug 15, 2025', donor: 'Fatima Al-Rashid', email: 'fatima@example.com', amount: '₹1,000', fund: 'General Fund', txnId: 'TXN-8821', receipt: '#RCT-0089' },
  { date: 'Aug 14, 2025', donor: 'Aisha Mohammed', email: 'aisha@example.com', amount: '₹2,500', fund: 'Zakat', txnId: 'TXN-8820', receipt: '#RCT-0088' },
  { date: 'Aug 13, 2025', donor: 'Mariam Ibrahim', email: 'mariam@example.com', amount: '₹500', fund: 'Orphan Sponsorship', txnId: 'TXN-8819', receipt: '#RCT-0087' },
  { date: 'Aug 12, 2025', donor: 'Khadijah Ahmed', email: 'khadijah@example.com', amount: '₹5,000', fund: 'Sadaqah Jariyah', txnId: 'TXN-8818', receipt: '#RCT-0086' },
  { date: 'Aug 11, 2025', donor: 'Zainab Ali', email: 'zainab@example.com', amount: '₹1,000', fund: 'General Fund', txnId: 'TXN-8817', receipt: '#RCT-0085' },
]

const recurringPayments = [
  { member: 'Fatima Al-Rashid', course: 'Quran Memorisation', plan: '₹500/month', amount: '₹500', dueDate: 'Sep 1, 2025', status: 'Pending' },
  { member: 'Aisha Mohammed', course: 'Quran Memorisation', plan: '₹500/month', amount: '₹500', dueDate: 'Aug 1, 2025', status: 'Paid' },
  { member: 'Mariam Ibrahim', course: 'Arabic Language Foundation', plan: '₹800/month', amount: '₹800', dueDate: 'Sep 1, 2025', status: 'Pending' },
  { member: 'Noor Fatima', course: 'Arabic Language Foundation', plan: '₹800/month', amount: '₹800', dueDate: 'Jul 1, 2025', status: 'Overdue' },
  { member: 'Sara Hassan', course: 'Quran Memorisation', plan: '₹500/month', amount: '₹500', dueDate: 'Aug 1, 2025', status: 'Paid' },
]

const monthlyDonationData = [
  { month: 'Mar', amount: 18500 },
  { month: 'Apr', amount: 24000 },
  { month: 'May', amount: 19000 },
  { month: 'Jun', amount: 32000 },
  { month: 'Jul', amount: 28000 },
  { month: 'Aug', amount: 42500 },
]

const recentCampaigns = [
  { name: 'Ramadan Appeal 2025', audience: 'All Members', channel: 'WhatsApp', date: 'Mar 1, 2025', sent: 234 },
  { name: 'Eid Mubarak Greeting', audience: 'All Members', channel: 'Email', date: 'Apr 10, 2025', sent: 234 },
  { name: 'Course Registration Reminder', audience: 'Course Students', channel: 'Both', date: 'Jul 15, 2025', sent: 52 },
]

function StatusBadge({ status }) {
  const colors = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
    Active: 'bg-emerald-100 text-emerald-700',
    Inactive: 'bg-gray-100 text-gray-500',
    Ongoing: 'bg-blue-100 text-blue-700',
    Upcoming: 'bg-purple-100 text-purple-700',
    Paid: 'bg-emerald-100 text-emerald-700',
    Overdue: 'bg-red-100 text-red-700',
  }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [memberSearch, setMemberSearch] = useState('')
  const [memberFilter, setMemberFilter] = useState('All')
  const [donationFilter, setDonationFilter] = useState('All')
  const [paymentFilter, setPaymentFilter] = useState('All')
  const [campaignForm, setCampaignForm] = useState({
    audience: 'All Members', channel: 'WhatsApp', type: 'Announcement', message: ''
  })
  const [campaignSent, setCampaignSent] = useState(false)

  const maxDonation = Math.max(...monthlyDonationData.map(d => d.amount))

  const filteredMembers = allMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase())
    const matchFilter = memberFilter === 'All' || m.status === memberFilter
    return matchSearch && matchFilter
  })

  const filteredDonations = donationFilter === 'All' ? allDonations : allDonations.filter(d => d.fund === donationFilter)
  const filteredPayments = paymentFilter === 'All' ? recurringPayments : recurringPayments.filter(p => p.status === paymentFilter)

  const fundTypes = ['All', ...Array.from(new Set(allDonations.map(d => d.fund)))]

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Sticky wrapper — sticks right below the 64px navbar */}
      <div className="sticky top-16 z-30">
        {/* Top Admin Bar */}
        <div className="bg-brand-dark text-white">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-base">ASPIRE</span>
              <span className="text-white/40 text-sm">·</span>
              <span className="text-white/70 text-sm font-semibold">Admin Panel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70 hidden sm:block">Team Admin</span>
              <Link to="/login" className="text-xs font-semibold px-3 py-1.5 border border-white/30 rounded-lg hover:bg-white/10 transition-colors">
                Sign Out
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {navTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:text-brand-primary hover:border-brand-tertiary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        </div>{/* end tab nav */}
      </div>{/* end sticky top-16 wrapper */}

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Active Members', value: '234', sub: '+8 this month', color: 'text-brand-primary' },
                { label: 'Pending Applications', value: '12', sub: 'Review needed', color: 'text-amber-600', link: true },
                { label: 'Donations This Month', value: '₹42,500', sub: '+18% vs last month', color: 'text-emerald-600' },
                { label: 'Recurring Revenue', value: '₹18,000', sub: 'This month', color: 'text-blue-600' },
                { label: 'Outstanding Dues', value: '₹6,500', sub: '4 overdue', color: 'text-red-600' },
                { label: 'Active Courses', value: '3', sub: '2 ongoing, 1 upcoming', color: 'text-purple-600' },
                { label: 'Upcoming Events', value: '4', sub: 'Next 30 days', color: 'text-indigo-600' },
                { label: 'Active Projects', value: '6', sub: 'Currently running', color: 'text-teal-600' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 font-medium">{kpi.label}</p>
                  <p className={`font-serif text-2xl font-bold mb-1 ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-gray-400">{kpi.sub}</p>
                  {kpi.link && (
                    <button onClick={() => setActiveTab('members')} className="text-xs font-semibold text-brand-primary hover:text-brand-dark mt-1 transition-colors">
                      Review →
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-bold text-brand-primary">Recent Applications</h2>
                  <button onClick={() => setActiveTab('members')} className="text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors">
                    View All →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Name', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentApplications.map((app, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">{app.name}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{app.date}</td>
                          <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">Approve</button>
                              <button className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">Reject</button>
                              <button className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">View</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Donations */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-bold text-brand-primary">Recent Donations</h2>
                  <button onClick={() => setActiveTab('donations')} className="text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors">
                    View All →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Donor', 'Date', 'Amount', 'Fund'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentDonations.map((d, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-gray-800">{d.donor}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{d.date}</td>
                          <td className="px-4 py-3 font-bold text-brand-secondary">{d.amount}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{d.fund}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="font-serif text-2xl font-bold text-brand-primary">Members</h1>
              <button className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>

            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
              />
              <select value={memberFilter} onChange={e => setMemberFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors">
                {['All', 'Active', 'Pending', 'Inactive'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['ID', 'Name', 'Email', 'Phone', 'Joined', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredMembers.map(m => (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.id}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{m.name}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{m.email}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{m.phone}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{m.joined}</td>
                        <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">View</button>
                            <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">Edit</button>
                            <button className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors">Deactivate</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold text-brand-primary">Courses</h1>
              <button className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors">
                + Add Course
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Course Name', 'Instructor', 'Status', 'Enrolled', 'Fee', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {adminCourses.map((c, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-800">{c.name}</td>
                        <td className="px-5 py-4 text-gray-600">{c.instructor}</td>
                        <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-brand-primary">{c.enrolled}</span>
                          <span className="text-gray-400 text-xs ml-1">students</span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-brand-secondary">{c.fee}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">Edit</button>
                            <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">Registrations</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-bold text-brand-primary">Events</h1>
              <button className="px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors">
                + Add Event
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Event Name', 'Date', 'Registrations', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {adminEvents.map((ev, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-800">{ev.name}</td>
                        <td className="px-5 py-4 text-gray-600">{ev.date}</td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-brand-primary">{ev.registrations}</span>
                          <span className="text-gray-400 text-xs ml-1">registered</span>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={ev.status} /></td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">Edit</button>
                            <button className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">View List</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DONATIONS */}
        {activeTab === 'donations' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="font-serif text-2xl font-bold text-brand-primary">Donations</h1>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 text-center">
                <p className="text-xs text-emerald-600 font-semibold">Total Collected</p>
                <p className="font-serif text-xl font-bold text-emerald-700">₹1,24,500</p>
              </div>
            </div>

            <div className="flex gap-3">
              <select value={donationFilter} onChange={e => setDonationFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors">
                {fundTypes.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Date', 'Donor', 'Email', 'Amount', 'Fund Type', 'Txn ID', 'Receipt'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredDonations.map((d, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-500 text-xs">{d.date}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{d.donor}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{d.email}</td>
                        <td className="px-4 py-3 font-bold text-brand-secondary">{d.amount}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{d.fund}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">{d.txnId}</td>
                        <td className="px-4 py-3">
                          <button className="text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors">{d.receipt}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-5">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">Payments</h1>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Recurring Revenue', value: '₹18,000', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                { label: 'Outstanding Dues', value: '₹6,500', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                { label: 'Overdue Payments', value: '₹800', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} border rounded-2xl p-4 text-center`}>
                  <p className="text-xs font-semibold text-gray-600 mb-1">{s.label}</p>
                  <p className={`font-serif text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <span className="text-sm font-semibold text-gray-600 self-center">Filter:</span>
              {['All', 'Pending', 'Overdue', 'Paid'].map(f => (
                <button key={f} onClick={() => setPaymentFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    paymentFilter === f ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-primary'
                  }`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Member', 'Course', 'Plan', 'Amount', 'Due Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPayments.map((p, i) => (
                      <tr key={i} className={`hover:bg-gray-50 transition-colors ${p.status === 'Overdue' ? 'bg-red-50/30' : ''}`}>
                        <td className="px-4 py-3 font-semibold text-gray-800">{p.member}</td>
                        <td className="px-4 py-3 text-gray-600">{p.course}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{p.plan}</td>
                        <td className="px-4 py-3 font-bold text-gray-800">{p.amount}</td>
                        <td className="px-4 py-3 text-gray-600">{p.dueDate}</td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-4 py-3">
                          {(p.status === 'Pending' || p.status === 'Overdue') ? (
                            <button className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                              Mark as Paid
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

        {/* COMMUNICATION */}
        {activeTab === 'communication' && (
          <div className="space-y-6">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">Communication</h1>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Composer */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Compose Campaign</h2>
                {campaignSent ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-800 mb-1">Campaign Sent!</p>
                    <p className="text-sm text-gray-500">Your message has been dispatched to {campaignForm.audience}.</p>
                    <button onClick={() => { setCampaignSent(false); setCampaignForm({ audience: 'All Members', channel: 'WhatsApp', type: 'Announcement', message: '' }) }}
                      className="mt-4 text-sm font-semibold text-brand-primary hover:text-brand-dark transition-colors">
                      New Campaign
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Select Audience</label>
                      <select value={campaignForm.audience} onChange={e => setCampaignForm(p => ({ ...p, audience: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30">
                        {['All Members', 'Donors', 'Course Students', 'Volunteers', 'Custom'].map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Channel</label>
                      <div className="flex gap-2">
                        {['Email', 'WhatsApp', 'Both'].map(ch => (
                          <label key={ch} className={`flex-1 text-center py-2 rounded-lg border-2 cursor-pointer text-sm font-semibold transition-all ${
                            campaignForm.channel === ch ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 text-gray-600'
                          }`}>
                            <input type="radio" value={ch} checked={campaignForm.channel === ch} onChange={() => setCampaignForm(p => ({ ...p, channel: ch }))} className="sr-only" />
                            {ch}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Campaign Type</label>
                      <select value={campaignForm.type} onChange={e => setCampaignForm(p => ({ ...p, type: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30">
                        {['Announcement', 'Event Reminder', 'Payment Reminder', 'Donation Appeal', 'Newsletter', 'Other'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                      <textarea rows={5} value={campaignForm.message} onChange={e => setCampaignForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="Type your message here..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 resize-none" />
                    </div>
                    <button onClick={() => campaignForm.message.trim() && setCampaignSent(true)}
                      className="w-full py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-dark transition-colors">
                      Send Campaign
                    </button>
                  </div>
                )}
              </div>

              {/* Preview + History */}
              <div className="space-y-5">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">Message Preview</h3>
                  <div className="bg-white rounded-xl p-4 border border-gray-100 min-h-24">
                    {campaignForm.message ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{campaignForm.message}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Your message preview will appear here...</p>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2 text-xs text-gray-500 flex-wrap">
                    <span className="bg-gray-100 px-2 py-1 rounded font-medium">To: {campaignForm.audience}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded font-medium">Via: {campaignForm.channel}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded font-medium">Type: {campaignForm.type}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-soft border border-gray-100">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm">Recent Campaigns</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {recentCampaigns.map((c, i) => (
                      <div key={i} className="px-5 py-3">
                        <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>{c.audience}</span>
                          <span>·</span>
                          <span>{c.channel}</span>
                          <span>·</span>
                          <span>{c.sent} recipients</span>
                          <span>·</span>
                          <span>{c.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h1 className="font-serif text-2xl font-bold text-brand-primary">Analytics</h1>

            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Members', value: '234', sub: 'All time' },
                { label: 'Total Donations', value: '₹1,24,500', sub: 'All time' },
                { label: 'Collection Rate', value: '92%', sub: 'Recurring payments' },
                { label: 'Active Courses', value: '3', sub: 'Currently running' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 text-center">
                  <p className="font-serif text-2xl font-bold text-brand-primary">{s.value}</p>
                  <p className="text-xs font-semibold text-gray-600 mt-1">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Monthly Donations Bar Chart */}
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-6">Monthly Donations (Last 6 Months)</h2>
              <div className="flex items-end gap-4 h-40">
                {monthlyDonationData.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">₹{(d.amount / 1000).toFixed(0)}K</span>
                    <div className="w-full rounded-t-lg bg-brand-primary/80 hover:bg-brand-primary transition-colors"
                      style={{ height: `${(d.amount / maxDonation) * 100}px` }} />
                    <span className="text-xs font-semibold text-gray-600">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Membership Growth */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Membership Growth</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Month</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">New Members</th>
                        <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { month: 'Mar 2025', new: 12, total: 180 },
                        { month: 'Apr 2025', new: 18, total: 198 },
                        { month: 'May 2025', new: 10, total: 208 },
                        { month: 'Jun 2025', new: 8, total: 216 },
                        { month: 'Jul 2025', new: 11, total: 227 },
                        { month: 'Aug 2025', new: 7, total: 234 },
                      ].map(r => (
                        <tr key={r.month} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 text-gray-700">{r.month}</td>
                          <td className="py-2.5 text-right font-semibold text-brand-primary">+{r.new}</td>
                          <td className="py-2.5 text-right text-gray-600">{r.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fund Type Breakdown */}
              <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Donation Fund Breakdown</h2>
                <div className="space-y-3">
                  {[
                    { fund: 'General Fund', amount: 48000, color: 'bg-brand-primary' },
                    { fund: 'Zakat', amount: 32000, color: 'bg-brand-secondary' },
                    { fund: 'Sadaqah Jariyah', amount: 25000, color: 'bg-purple-500' },
                    { fund: 'Project Donations', amount: 19500, color: 'bg-emerald-500' },
                  ].map(f => {
                    const pct = Math.round((f.amount / 124500) * 100)
                    return (
                      <div key={f.fund}>
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                          <span>{f.fund}</span>
                          <span>₹{f.amount.toLocaleString('en-IN')} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`${f.color} h-2.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
