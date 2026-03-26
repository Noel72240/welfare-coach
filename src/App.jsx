import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Footer, CookieBanner, ProgressBar } from './components/Footer'
import Seo from './components/Seo'
import Home from './pages/Home'
import LeCoaching from './pages/LeCoaching'
import MonApproche from './pages/MonApproche'
import Tarifs from './pages/Tarifs'
import Contact from './pages/Contact'
import AvisClients from './pages/AvisClients'
import Admin from './pages/Admin'
import MentionsLegales from './pages/MentionsLegales'
import Confidentialite from './pages/Confidentialite'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Seo />
      <ProgressBar />
      <a href="#main" className="skip-link">Aller au contenu</a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/le-coaching" element={<LeCoaching />} />
          <Route path="/mon-approche" element={<MonApproche />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/avis-clients" element={<AvisClients />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<Confidentialite />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
