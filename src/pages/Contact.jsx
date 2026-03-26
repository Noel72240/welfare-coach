import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'
import './Contact.css'

export default function Contact() {
  const infos = getData('infos')
  const contact = getData('contact')

  const [form, setForm] = useState({ prenom:'', nom:'', email:'', tel:'', service:'', msg:'', rgpd:false })
  const [errors, setErrors] = useState([])
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = []
    if (!form.prenom.trim()) e.push('Le prénom est requis.')
    if (!form.nom.trim()) e.push('Le nom est requis.')
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.push('Un email valide est requis.')
    if (!form.msg.trim()) e.push('Le message est requis.')
    if (!form.rgpd) e.push('Vous devez accepter la politique de confidentialité.')
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (errs.length) { setErrors(errs); return }
    setErrors([]); setLoading(true)

    try {
      // Envoyer via Formspree
      const response = await fetch('https://formspree.io/f/xbdpjveg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          tel: form.tel || 'Non fourni',
          service: form.service || 'Non spécifié',
          message: form.msg,
          _replyto: form.email,
          _subject: `Nouveau message de ${form.prenom} ${form.nom}`,
        })
      })

      if (response.ok) {
        setSent(true)
        setForm({ prenom:'', nom:'', email:'', tel:'', service:'', msg:'', rgpd:false })
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300)
      } else {
        setErrors(['Erreur lors de l\'envoi. Veuillez réessayer.'])
      }
    } catch (err) {
      console.error('Formspree error:', err)
      setErrors(['Erreur lors de l\'envoi. Veuillez réessayer.'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Contact</div></div>
          <h1 className="reveal" ref={useReveal(80)}>{contact.titre}</h1>
          <p className="reveal" ref={useReveal(160)} style={{fontSize:'17px',color:'var(--text2)',maxWidth:'600px',marginTop:'20px',fontWeight:300,lineHeight:1.85}}>
            {contact.intro}
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="wrap">
          <div className="contact-grid">
            {/* LEFT */}
            <div className="reveal-l" ref={useReveal(0)}>
              <div className="contact-info-box">
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'24px',fontWeight:400,marginBottom:'24px',color:'var(--text)'}}>Coordonnées</h3>
                {[
                  {ico:'📍', lbl:'Adresse', val:contact.adresse, href:null},
                  {ico:'🗺️', lbl:'Zone d\'intervention', val:contact.zone, href:null},
                  {ico:'📞', lbl:'Téléphone', val:infos.tel, href:`tel:${infos.tel}`},
                  {ico:'✉️', lbl:'Email', val:infos.email, href:`mailto:${infos.email}`},
                  {ico:'🕐', lbl:'Horaires', val:contact.horaires, href:null},
                ].map(({ico,lbl,val,href}) => (
                  <div key={lbl} className="contact-row">
                    <span className="contact-ico">{ico}</span>
                    <div>
                      <div className="contact-lbl">{lbl}</div>
                      {href
                        ? <a href={href} className="contact-val contact-link">{val}</a>
                        : <div className="contact-val">{val}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-rdv-box">
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'22px',fontWeight:400,marginBottom:'14px',color:'var(--text)'}}>Réservez votre séance découverte</h3>
                <p style={{fontSize:'14px',color:'var(--text2)',lineHeight:1.8,marginBottom:'20px',fontWeight:300}}>{contact.texte_rdv}</p>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  <a href={`tel:${infos.tel}`} className="btn btn-solid" style={{fontSize:'12px',padding:'12px 24px'}}>
                    <span>📞 Appeler maintenant</span>
                  </a>
                  <a href={`mailto:${infos.email}`} className="btn btn-outline" style={{fontSize:'12px',padding:'12px 24px'}}>
                    <span>✉️ Envoyer un email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="reveal-r" ref={useReveal(100)} style={{transitionDelay:'100ms'}}>
              <div className="contact-form-box">
                {sent ? (
                  <div style={{textAlign:'center',padding:'60px 24px'}}>
                    <div style={{fontSize:'64px',marginBottom:'20px'}}>🎉</div>
                    <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'28px',fontWeight:400,marginBottom:'14px',color:'var(--text)'}}>Message bien reçu !</h3>
                    <p style={{fontSize:'15px',color:'var(--text2)',lineHeight:1.8,marginBottom:'28px',fontWeight:300}}>
                      Merci pour votre message. Je vous recontacte dans les meilleurs délais, généralement sous 24 à 48h.
                    </p>
                    <Link to="/" className="btn btn-solid"><span>Retour à l'accueil</span></Link>
                  </div>
                ) : (
                  <>
                    <div className="form-hd">
                      <h3>Envoyez-moi un message</h3>
                      <p>* Champs obligatoires · Réponse sous 24 à 48h</p>
                    </div>
                    {errors.length > 0 && (
                      <div className="ferr" role="alert">{errors.join(' ')}</div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="fld-row">
                        <div className="fld"><label htmlFor="prenom">Prénom *</label><input type="text" id="prenom" placeholder="Marie" value={form.prenom} onChange={e=>setForm({...form,prenom:e.target.value})} required autoComplete="given-name"/></div>
                        <div className="fld"><label htmlFor="nom">Nom *</label><input type="text" id="nom" placeholder="Dupont" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} required autoComplete="family-name"/></div>
                      </div>
                      <div className="fld"><label htmlFor="cemail">Email *</label><input type="email" id="cemail" placeholder="marie@exemple.fr" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required autoComplete="email"/></div>
                      <div className="fld"><label htmlFor="ctel">Téléphone</label><input type="tel" id="ctel" placeholder="07 XX XX XX XX" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} autoComplete="tel"/></div>
                      <div className="fld">
                        <label htmlFor="cservice">Prestation souhaitée</label>
                        <select id="cservice" value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                          <option value="">Sélectionner…</option>
                          <option>Appel découverte (offert – 30 min)</option>
                          <option>Bilan nutritionnel</option>
                          <option>Séance de coaching individuel</option>
                          <option>Consultation de suivi</option>
                          <option>Coaching Essentiel 3 mois</option>
                          <option>Coaching VIP 6 mois</option>
                          <option>Diagnostic frigo et placards</option>
                          <option>Autre / question</option>
                        </select>
                      </div>
                      <div className="fld">
                        <label htmlFor="cmsg">Message *</label>
                        <textarea id="cmsg" rows={5} placeholder="Partagez-moi vos objectifs, vos questions ou ce qui vous amène…" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} required/>
                      </div>
                      <div className="gdpr">
                        <input type="checkbox" id="crgpd" checked={form.rgpd} onChange={e=>setForm({...form,rgpd:e.target.checked})} required/>
                        <label htmlFor="crgpd">J'accepte que mes données soient utilisées pour traiter ma demande, conformément à la <Link to="/politique-confidentialite">politique de confidentialité</Link>. *</label>
                      </div>
                      <button type="submit" className="sub-btn" disabled={loading}>
                        <span>{loading ? 'Envoi en cours…' : 'Envoyer mon message'}</span>
                        {!loading && <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                      </button>
                    </form>
                    <p className="fnote">🔒 Données sécurisées · Jamais revendues · Droit de suppression sur demande</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
