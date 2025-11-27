
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AppleNavbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AboutPage from './Pages/AboutPage.jsx'
import LandingPage from './Pages/LandingPage.jsx'

const App = () => {
 
  return (
    <div className="min-h-screen bg-background text-foreground border-border outline-ring/50 bg-gradient-to-b from-neutral-50 to-white">
      <AppleNavbar/>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/about' element={<AboutPage/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App;
