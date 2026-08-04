import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Impact from './components/Impact'
import JoinUs from './components/JoinUs'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Impact />
        <JoinUs />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
