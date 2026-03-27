import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Footer, CookieBanner, ProgressBar } from './components/Footer'
import Seo from './components/Seo'
import Home from './pages/Home'
import Tarifs from './pages/Tarifs'
import Contact from './pages/Contact'
import AvisClients from './pages/AvisClients'
import Galerie from './pages/Galerie'
import Admin from './pages/Admin'
import MentionsLegales from './pages/MentionsLegales'
import Confidentialite from './pages/Confidentialite'
import SeoLocalPage from './pages/SeoLocalPage'

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
          <Route path="/coaching-nutrition-lombron" element={<SeoLocalPage pageKey="coaching-nutrition-lombron" />} />
          <Route path="/coach-bien-etre-sarthe" element={<SeoLocalPage pageKey="coach-bien-etre-sarthe" />} />
          <Route path="/reequilibrage-alimentaire" element={<SeoLocalPage pageKey="reequilibrage-alimentaire" />} />
          <Route path="/perte-de-poids" element={<SeoLocalPage pageKey="perte-de-poids" />} />
          <Route path="/consultation-en-ligne" element={<SeoLocalPage pageKey="consultation-en-ligne" />} />
          <Route path="/avis" element={<AvisClients />} />

          {/* Legacy URLs redirected to SEO-friendly routes */}
          <Route path="/le-coaching" element={<Navigate to="/coaching-nutrition-lombron" replace />} />
          <Route path="/mon-approche" element={<Navigate to="/coach-bien-etre-sarthe" replace />} />
          <Route path="/avis-clients" element={<Navigate to="/avis" replace />} />

          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/contact" element={<Contact />} />
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
