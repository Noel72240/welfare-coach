import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { getData } from '../store'
import './Navbar.css'

export default function Navbar() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const infos = getData('infos')

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => {
    setOpen(false)
    document.body.style.overflow = ''
    document.body.classList.remove('nav-open')
  }, [location])

  const toggle = () => {
    const n = !open
    setOpen(n)
    document.body.style.overflow = n ? 'hidden' : ''
    document.body.classList.toggle('nav-open', n)
  }
  const isA = (p) => location.pathname === p

  const links = [['/', 'Accueil'],['/coaching-nutrition-lombron', 'Le Coaching'],['/coach-bien-etre-sarthe', 'Mon Approche'],['/tarifs', 'Tarifs'],['/galerie', 'Galerie'],['/contact', 'Contact'],['/avis', 'Avis Clients']]

  return (
    <>
      <nav className={`navbar ${solid ? 'solid' : ''}`}>
        <Link to="/" className="nav-logo">
          <img src={logo} alt="Logo Welfare Coach" />
          <div className="nav-brand-wrap">
            <span className="nav-brand">Welfare <em>Coach</em></span>
            <span className="nav-subtitle">{infos.titre}</span>
          </div>
        </Link>
        <ul>
          {links.map(([p, l]) => (
            <li key={p}><Link to={p} className={isA(p) ? 'active' : ''} aria-current={isA(p) ? 'page' : undefined}>{l}</Link></li>
          ))}
          <li><Link to="/contact" className="nav-cta">Réserver</Link></li>
        </ul>
        <button className={`ham ${open ? 'open' : ''}`} onClick={toggle} aria-label="Menu" aria-expanded={open}>
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mmenu ${open ? 'open' : ''}`}>
        {links.map(([p, l]) => <Link key={p} to={p}>{l}</Link>)}
        <Link to="/contact" className="mmenu-cta">Réserver une séance</Link>
      </div>
    </>
  )
}
