import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useReveal } from '../hooks/useReveal'
import './Rdv.css'

export default function Rdv() {
  const [form, setForm] = useState({ prenom:'', nom:'', email:'', tel:'', service:'', mode:'', dispo:'', msg:'', rgpd:false })
  const [errors, setErrors] = useState([])
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const r1 = useReveal(0), r2 = useReveal(120)
  const r3 = useReveal(0), r4 = useReveal(100)

  const validate = () => {
    const errs = []
    if (!form.prenom.trim()) errs.push('Le prénom est requis.')
    if (!form.nom.trim()) errs.push('Le nom est requis.')
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.push('Un email valide est requis.')
    if (!form.service) errs.push('Veuillez sélectionner un service.')
    if (!form.rgpd) errs.push('Vous devez accepter la politique de confidentialité.')
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true); window.scrollTo({top:0,behavior:'smooth'}) }, 1200)
  }

  return (
    <>
      {/* HERO */}
      <div className="rdv-hero">
        <div className="rdv-hi">
          <div className="reveal-left" ref={r1}>
            <div className="eyebrow">Rendez-vous</div>
            <h1>Première<br/>consultation<br/><em>offerte</em></h1>
            <p style={{fontSize:'16px',color:'var(--text2)',lineHeight:'1.85',maxWidth:'420px',marginTop:'22px',fontWeight:300}}>
              30 minutes d'échange, sans engagement, pour explorer ensemble ce qui est possible pour vous.
            </p>
          </div>
          <div className="rdv-logo-wrap reveal-right" ref={r2}>
            <div className="rdv-ring rdv-ring1" />
            <div className="rdv-ring rdv-ring2" />
            <img src={logo} alt="Welfare Coach" />
          </div>
        </div>
      </div>

      {/* OFFER BAR */}
      <div className="offer-bar" role="status">
        <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        <span>Consultation découverte offerte — <em>30 min · Sans engagement · Téléphone ou visio</em></span>
      </div>

      {/* MAIN */}
      <div className="rdv-main">
        {/* LEFT */}
        <div className="reveal-left" ref={r3}>
          <div className="process-h">Comment ça se passe ?</div>
          <p className="process-sub">Je vous réponds dans les 24 heures ouvrées pour convenir d'un créneau.</p>
          <div className="steps" role="list">
            {[['01','Votre demande','Remplissez le formulaire avec vos disponibilités et ce qui vous amène.'],['02','Appel découverte (offert)','30 minutes pour se connaître et valider si l\'approche vous correspond.'],['03','Programme sur mesure','Définition de vos objectifs et construction de votre parcours personnalisé.'],['04','Transformation durable','Séances régulières, suivi continu et résultats concrets dès les premières semaines.']].map(([n,t,d]) => (
              <div key={n} className="step" role="listitem">
                <div className="stn">{n}</div>
                <div><div className="stt">{t}</div><div className="std">{d}</div></div>
              </div>
            ))}
          </div>
          <div className="cbox">
            <h4>Contact direct</h4>
            {[{ico:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,lbl:'Adresse',val:'Lombron, Sarthe (72450)',href:null},{ico:<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,lbl:'Téléphone',val:'+33 (0)6 XX XX XX XX',href:'tel:+33600000000'},{ico:<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,lbl:'Email',val:'contact@welfarecoach.fr',href:'mailto:contact@welfarecoach.fr'}].map(({ico,lbl,val,href}) => (
              <div key={lbl} className="cr">
                <div className="ci"><svg viewBox="0 0 24 24">{ico}</svg></div>
                <div><div className="cl">{lbl}</div><div className="cv">{href ? <a href={href}>{val}</a> : val}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div className="reveal-right" ref={r4} style={{transitionDelay:'100ms'}}>
          <div className="form-box">
            {sent ? (
              <div className="form-ok">
                <img src={logo} alt="Welfare Coach" className="ok-logo" />
                <h4>Demande bien reçue</h4>
                <p>Merci pour votre message. Je vous recontacte dans les 24 heures ouvrées.</p>
                <Link to="/" className="back-link">
                  <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Retour à l'accueil
                </Link>
              </div>
            ) : (
              <>
                <div className="form-hd">
                  <h3>Votre demande</h3>
                  <p>Champs * obligatoires · Réponse sous 24h ouvrées</p>
                </div>
                {errors.length > 0 && (
                  <div className="ferr" role="alert">{errors.join(' ')}</div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="fld-row">
                    <div className="fld"><label htmlFor="prenom">Prénom *</label><input type="text" id="prenom" placeholder="Marie" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} required autoComplete="given-name" /></div>
                    <div className="fld"><label htmlFor="nom">Nom *</label><input type="text" id="nom" placeholder="Dupont" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} required autoComplete="family-name" /></div>
                  </div>
                  <div className="fld"><label htmlFor="email">Email *</label><input type="email" id="email" placeholder="marie@exemple.fr" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required autoComplete="email" /></div>
                  <div className="fld"><label htmlFor="tel">Téléphone</label><input type="tel" id="tel" placeholder="+33 6 XX XX XX XX" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} autoComplete="tel" /></div>
                  <div className="fld">
                    <label htmlFor="service">Service *</label>
                    <select id="service" value={form.service} onChange={e=>setForm({...form,service:e.target.value})} required>
                      <option value="">Sélectionner…</option>
                      <option value="decouverte">Consultation découverte (offerte — 30 min)</option>
                      <option value="individuel">Coaching individuel</option>
                      <option value="atelier">Atelier / formation collective</option>
                      <option value="entreprise">Formation intra-entreprise</option>
                    </select>
                  </div>
                  <div className="fld">
                    <label>Modalité</label>
                    <div className="rgrp" role="radiogroup">
                      {[['presentiel','📍 Présentiel'],['visio','💻 Visio'],['indifferent','Indifférent']].map(([v,l]) => (
                        <label key={v} className={`ropt ${form.mode===v?'checked':''}`}>
                          <input type="radio" name="mode" value={v} checked={form.mode===v} onChange={e=>setForm({...form,mode:e.target.value})} />
                          {l}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="fld"><label htmlFor="dispo">Disponibilités</label><input type="text" id="dispo" placeholder="Ex : lundi matin, jeudi après-midi…" value={form.dispo} onChange={e=>setForm({...form,dispo:e.target.value})} /></div>
                  <div className="fld">
                    <label htmlFor="msg">Message</label>
                    <textarea id="msg" maxLength={600} placeholder="Partagez ce qui vous amène — en toute confidentialité…" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} />
                    <span className="cc">{form.msg.length}/600</span>
                  </div>
                  <div className="gdpr">
                    <input type="checkbox" id="rgpd" checked={form.rgpd} onChange={e=>setForm({...form,rgpd:e.target.checked})} required />
                    <label htmlFor="rgpd">J'accepte que mes données soient utilisées pour traiter ma demande, conformément à la <Link to="/politique-confidentialite">politique de confidentialité</Link>. *</label>
                  </div>
                  <button type="submit" className="sub-btn" disabled={loading}>
                    <span>{loading ? 'Envoi en cours…' : 'Envoyer ma demande'}</span>
                    {!loading && <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                  </button>
                </form>
                <p className="fnote">🔒 Données sécurisées · Jamais revendues · Droit de suppression sur demande</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
