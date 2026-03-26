import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('wc_cookies')) setHidden(true)
  }, [])

  const accept = () => { localStorage.setItem('wc_cookies', '1'); setHidden(true) }
  const reject = () => { localStorage.setItem('wc_cookies', '0'); setHidden(true) }

  return (
    <div className={`cookie-banner ${hidden ? 'hidden' : ''}`} role="dialog" aria-label="Gestion des cookies">
      <p>
        Ce site utilise des cookies fonctionnels pour améliorer votre expérience.{' '}
        <Link to="/politique-confidentialite">En savoir plus</Link>.
      </p>
      <div className="cookie-btns">
        <button className="cbtn cbtn-acc" onClick={accept}>Accepter</button>
        <button className="cbtn cbtn-ref" onClick={reject}>Refuser</button>
      </div>
    </div>
  )
}
