
import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppleNavbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Lazy load pages for code splitting
const AboutPage = lazy(() => import('./Pages/AboutPage.jsx'))
const LandingPage = lazy(() => import('./Pages/LandingPage.jsx'))

const App = () => {
 
  return (
    <div className="min-h-screen bg-background text-foreground border-border outline-ring/50 bg-gradient-to-b from-neutral-50 to-white">
      <AppleNavbar/>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/about' element={<AboutPage/>}/>
        </Routes>
      </Suspense>
      <Footer/>
    </div>
  )
}

export default App;
