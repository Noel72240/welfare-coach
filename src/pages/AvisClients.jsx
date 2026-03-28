import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../store'
import { getAvis } from '../supabaseClient'
import AvisPhotoImg from '../components/AvisPhotoImg'

// Composant carte individuel avec son propre ref (évite les hooks dans les boucles)
function AvisCard({ a, delay }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    const t = setTimeout(() => {
      el.style.transition = 'opacity .6s ease, transform .6s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div ref={ref}
      style={{background:'var(--white)',border:'1px solid var(--c3)',padding:'36px',transition:'background .35s, box-shadow .35s, transform .35s',cursor:'default'}}
      onMouseEnter={e => { e.currentTarget.style.background='var(--c1)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(158,115,72,.1)' }}
      onMouseLeave={e => { e.currentTarget.style.background='var(--white)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='' }}
    >
      <div style={{color:'var(--warm)',fontSize:'22px',letterSpacing:'3px',marginBottom:'16px'}}>
        {'★'.repeat(a.note || 5)}{'☆'.repeat(5 - (a.note || 5))}
      </div>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'18px',fontStyle:'italic',color:'var(--text2)',lineHeight:1.75,marginBottom:'20px',fontWeight:300}}>
        "{a.texte}"
      </p>
      {a.photo_url && (
        <div style={{marginBottom:'16px',textAlign:'center'}}>
          <AvisPhotoImg src={a.photo_url} alt={a.nom} style={{width:'64px',height:'64px',borderRadius:'50%',objectFit:'cover',border:'2px solid var(--c3)'}} />
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:'12px',paddingTop:'16px',borderTop:'1px solid var(--c3)'}}>
        <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'var(--warm-pale)',border:'1px solid rgba(158,115,72,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cormorant Garamond',serif",fontSize:'16px',fontWeight:500,color:'var(--warm)',flexShrink:0}}>
          {(a.nom || '?').charAt(0)}
        </div>
        <div>
          <div style={{fontSize:'14px',fontWeight:500,color:'var(--text)'}}>{a.nom}</div>
          <div style={{fontSize:'12px',color:'var(--text3)',letterSpacing:'.06em'}}>{a.ville}</div>
        </div>
      </div>
    </div>
  )
}

export default function AvisClients() {
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState(null)
  const infos = getData('infos')

  useEffect(() => {
    const loadAvis = async () => {
      setLoading(true)
      setErreur(null)
      try {
        const supabaseAvis = await getAvis()
        // Toujours priorité à Supabase si la requête réussit (même liste vide) — pas de mélange avec le localStorage d’un seul PC
        setAvis((supabaseAvis || []).filter(a => a.visible !== false))
      } catch (err) {
        console.error('Erreur chargement avis:', err)
        setErreur(err.message)
        const defaultAvis = getData('avis').filter(a => a.visible)
        setAvis(defaultAvis)
      } finally {
        setLoading(false)
      }
    }
    loadAvis()
  }, [])

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="eyebrow">Témoignages</div>
          <h1>Ce que disent mes <em>clients</em></h1>
          <p style={{fontSize:'17px',color:'var(--text2)',maxWidth:'600px',marginTop:'20px',fontWeight:300,lineHeight:1.85}}>
            Des témoignages authentiques de personnes qui ont transformé leur rapport à l'alimentation et retrouvé bien-être et énergie.
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="wrap">
          {loading ? (
            <div style={{textAlign:'center',padding:'60px',color:'var(--text3)'}}>
              <p style={{fontSize:'18px'}}>Chargement des avis…</p>
            </div>
          ) : avis.length === 0 ? (
            <div style={{textAlign:'center',padding:'60px',color:'var(--text3)'}}>
              <p style={{fontSize:'18px'}}>Aucun avis disponible pour le moment.</p>
              <p style={{fontSize:'14px',marginTop:'10px'}}>Les avis peuvent être ajoutés depuis l'espace administration.</p>
              {erreur && <p style={{fontSize:'12px',marginTop:'8px',color:'var(--err)'}}>Détail : {erreur}</p>}
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'24px'}}>
              {avis.map((a, i) => (
                <AvisCard key={a.id} a={a} delay={i * 80} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{textAlign:'center',marginTop:'60px',padding:'48px',background:'var(--c1)',border:'1px solid var(--c3)'}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(28px,3vw,44px)',fontWeight:300,marginBottom:'16px',color:'var(--text)'}}>
              Prête à écrire votre propre <em>histoire</em> ?
            </h2>
            <p style={{fontSize:'16px',color:'var(--text2)',maxWidth:'520px',margin:'0 auto 32px',fontWeight:300,lineHeight:1.85}}>
              Rejoignez les nombreux clients qui ont retrouvé équilibre, énergie et bien-être. La première séance est offerte.
            </p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/contact" className="btn btn-solid"><span>Réserver ma séance découverte</span><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
              <a href={`tel:${infos.tel}`} className="btn btn-outline"><span>📞 {infos.tel}</span></a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}