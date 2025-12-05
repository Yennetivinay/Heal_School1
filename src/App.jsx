import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { pageVariants, pageTransition } from './utils/animations'

// Navbar loads immediately for instant display (critical for navigation)
import AppleNavbar from './components/layout/Navbar.jsx'
// Footer can be lazy loaded
const Footer = lazy(() => import('./components/layout/Footer.jsx'))
// ScrollToTop should load immediately to prevent scroll issues
import ScrollToTop from './components/layout/ScrollToTop.jsx'

// Lazy load pages for code splitting with optimized loading
const AboutPage = lazy(() => import('./Pages/AboutPage'))
const LandingPage = lazy(() => import('./Pages/LandingPage'))
const AwardsPage = lazy(() => import('./Pages/AwardsPage'))
const GalleryPage = lazy(() => import('./Pages/GalleryPage'))

// Minimal loading fallback - empty to avoid showing loading text
const LoadingFallback = () => null

const App = () => {
  const location = useLocation();
  
  // Disable browser scroll restoration on mount
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Preload pages immediately for faster navigation
  React.useEffect(() => {
    // Start preloading immediately after initial render
    const preloadPages = () => {
      // Preload all pages in parallel for instant navigation
      const preloadPromises = [
        import('./Pages/AboutPage'),
        import('./Pages/LandingPage'),
        import('./Pages/AwardsPage'),
        import('./Pages/GalleryPage'),
      ];
      
      // Preload without blocking - use Promise.allSettled to not fail if one fails
      Promise.allSettled(preloadPromises).catch(() => {
        // Silently handle any preload failures
      });
    };

    // Start preloading immediately
    preloadPages();
    
    // Also preload on next frame to ensure it doesn't block initial render
    requestAnimationFrame(() => {
      preloadPages();
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground border-border outline-ring/50 bg-gradient-to-b from-neutral-50 to-white overflow-x-hidden">
      <ScrollToTop />
      <AppleNavbar/>
      <Suspense fallback={
        <div className="min-h-screen w-full bg-gradient-to-b from-neutral-50 to-white"></div>
      }>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen w-full"
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
