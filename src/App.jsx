
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AppleNavbar from './components/Navbar.jsx'
import AboutPage from './Pages/AboutPage.jsx'
import LandingPage from './Pages/LandingPage.jsx'

const App = () => {
 
  return (
    <>
    <AppleNavbar/>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/about' element={<AboutPage/>}/>
    </Routes>
    </>
  )
}

export default App;
