import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { pageVariants, pageTransition } from './utils/animations'

// Lazy load all components for faster initial load
const AppleNavbar = lazy(() => import('./components/layout/Navbar.jsx'))
const Footer = lazy(() => import('./components/layout/Footer.jsx'))
const ScrollToTop = lazy(() => import('./components/layout/ScrollToTop.jsx'))

// Lazy load pages for code splitting
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const AwardsPage = lazy(() => import('./pages/AwardsPage.jsx'))
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'))

// Minimal loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white">
    <div className="text-lg text-slate-600">Loading...</div>
  </div>
)

const App = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background text-foreground border-border outline-ring/50 bg-gradient-to-b from-neutral-50 to-white overflow-x-hidden">
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <Suspense fallback={<div className="h-16 bg-white/80 backdrop-blur-sm border-b border-black/10" />}>
        <AppleNavbar/>
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen"
          >
            <Routes location={location}>
              <Route path='/' element={<LandingPage/>}/>
              <Route path='/about' element={<AboutPage/>}/>
              <Route path='/awards' element={<AwardsPage/>}/>
              <Route path='/gallery' element={<GalleryPage/>}/>
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
      <Suspense fallback={null}>
        <Footer/>
      </Suspense>
    </div>
  )
}

export default App;
