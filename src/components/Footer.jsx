// Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { getData } from '../store'
import './Footer.css'

export function Footer() {
  const infos = getData('infos')
  const publicName = (infos.nom || '').trim().split(/\s+/)[0] || infos.nom
  return (
    <footer>
      <div className="ft-inner">
        <div className="ft-top">
          <div className="ft-brand-col">
            <div className="ft-brand">
              <img src={logo} alt="Logo Welfare Coach" />
              <div>
                <div className="ft-name">Welfare <em>Coach</em></div>
                <div className="ft-role">{infos.titre}</div>
              </div>
            </div>
            <p className="ft-desc">Coach en nutrition et bien-être à Lombron dans la Sarthe. Accompagnement personnalisé pour retrouver équilibre alimentaire, énergie et bien-être.</p>
            {infos.instagram && <a href={infos.instagram} target="_blank" rel="noopener noreferrer" className="ft-insta">📸 Instagram</a>}
          </div>
          <div className="ft-col">
            <h5>Navigation</h5>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/coaching-nutrition-lombron">Le Coaching</Link></li>
              <li><Link to="/coach-bien-etre-sarthe">Mon Approche</Link></li>
              <li><Link to="/tarifs">Tarifs</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/avis">Avis Clients</Link></li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>Services</h5>
            <ul>
              <li><Link to="/tarifs">Bilan nutritionnel</Link></li>
              <li><Link to="/tarifs">Coaching individuel</Link></li>
              <li><Link to="/tarifs">Coaching Essentiel 3 mois</Link></li>
              <li><Link to="/tarifs">Coaching VIP 6 mois</Link></li>
              <li><Link to="/tarifs">Diagnostic frigo</Link></li>
              <li><Link to="/contact">1ère séance offerte</Link></li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>Contact</h5>
            <ul>
              <li><a href={`tel:${infos.tel}`}>{infos.tel}</a></li>
              <li><a href={`mailto:${infos.email}`}>{infos.email}</a></li>
              <li>{infos.ville}</li>
              <li>Sarthe & alentours</li>
              <li>En ligne (toute France)</li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          <p>© 2025 Welfare Coach — {publicName} — Tous droits réservés</p>
          <div className="ft-bot-links">
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/politique-confidentialite">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// CookieBanner.jsx
export function CookieBanner() {
  const [hidden, setHidden] = React.useState(true)
  const [choice, setChoice] = React.useState(null)

  React.useEffect(() => {
    const saved = localStorage.getItem('wc_cookies')
    setChoice(saved)
    setHidden(Boolean(saved))
  }, [])

  const accept = () => {
    localStorage.setItem('wc_cookies', '1')
    setChoice('1')
    setHidden(true)
  }

  const reject = () => {
    localStorage.setItem('wc_cookies', '0')
    setChoice('0')
    setHidden(true)
  }

  const openSettings = () => setHidden(false)

  const choiceLabel =
    choice === '1' ? 'Cookies: acceptés' :
    choice === '0' ? 'Cookies: refusés' :
    'Cookies'

  return (
    <>
      <div className={`cookie-banner ${hidden ? 'hidden' : ''}`} role="dialog" aria-label="Cookies">
        <p>
          Ce site utilise uniquement des cookies fonctionnels. Vous pouvez accepter ou refuser,
          puis modifier votre choix à tout moment via le bouton "Cookies".{' '}
          <Link to="/politique-confidentialite">En savoir plus</Link>.
        </p>
        <div className="cookie-btns">
          <button className="cbtn cbtn-a" onClick={accept}>Accepter</button>
          <button className="cbtn cbtn-r" onClick={reject}>Refuser</button>
        </div>
      </div>

      <button
        className="cookie-settings-btn"
        onClick={openSettings}
        aria-label="Modifier mes préférences cookies"
        type="button"
      >
        {choiceLabel}
      </button>
    </>
  )
}

// ProgressBar.jsx
export function ProgressBar() {
  const [w, setW] = React.useState(0)
  React.useEffect(() => {
    const fn = () => setW(window.scrollY / (document.body.scrollHeight - innerHeight) * 100)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return <div className="progress-bar" style={{ width: `${w}%` }} />
}

export default Footer
