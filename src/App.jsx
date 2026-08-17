import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Projects from './pages/Projects'
import Courses from './pages/Courses'
import Initiatives from './pages/Initiatives'
import Donate from './pages/Donate'
import JoinAspire from './pages/JoinAspire'
import ContactPage from './pages/ContactPage'
import Login from './pages/Login'
import MemberPortal from './pages/MemberPortal'
import AdminPanel from './pages/AdminPanel'

// Routes where the global Footer should not appear (full-screen portal layouts)
const NO_FOOTER_PATHS = ['/member', '/admin']

function Layout() {
  const { pathname } = useLocation()
  const showFooter = !NO_FOOTER_PATHS.includes(pathname)

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/about"       element={<About />} />
          <Route path="/events"      element={<Events />} />
          <Route path="/projects"    element={<Projects />} />
          <Route path="/courses"     element={<Courses />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/donate"      element={<Donate />} />
          <Route path="/join"        element={<JoinAspire />} />
          <Route path="/contact"     element={<ContactPage />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/member"      element={<MemberPortal />} />
          <Route path="/admin"       element={<AdminPanel />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
