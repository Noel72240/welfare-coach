import React, { useEffect, useState, useCallback } from 'react'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'
import CoachingPhotoImg from '../components/CoachingPhotoImg'
import { getGalerie } from '../supabaseClient'

function GalerieCard({ it, idx, onPhotoClick }) {
  const ref = useReveal(idx * 60)
  const raw = it.photo_url
  return (
    <div
      className="reveal"
      ref={ref}
      style={{background:'var(--white)',border:'1px solid var(--c3)',overflow:'hidden'}}
    >
      {raw && (
        <button
          type="button"
          onClick={() => onPhotoClick({ src: raw, titre: it.titre, texte: it.texte })}
          style={{
            display:'block', width:'100%', padding:0, margin:0, border:'none', cursor:'zoom-in',
            background:'var(--c1)', lineHeight:0,
          }}
          aria-label={it.titre ? `Agrandir : ${it.titre}` : 'Agrandir la photo'}
        >
          <CoachingPhotoImg
            src={raw}
            alt={it.titre || 'Photo'}
            style={{width:'100%',height:'240px',objectFit:'cover',display:'block'}}
          />
        </button>
      )}
      <div style={{padding:'18px 18px 20px'}}>
        {it.titre && (
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'18px',fontWeight:500,color:'var(--text)',marginBottom:'8px'}}>
            {it.titre}
          </div>
        )}
        {it.texte && (
          <div style={{fontSize:'14px',color:'var(--text2)',lineHeight:1.85,fontWeight:300}}>
            {it.texte}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Galerie() {
  const [items, setItems] = useState([])
  const [lightbox, setLightbox] = useState(null)

  const closeLb = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeLb() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeLb])

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const supa = await getGalerie()
        if (alive) {
          if (!supa || supa.length === 0) setItems((getData('galerie') || []).filter(i => i?.visible !== false))
          else setItems(supa.filter(i => i?.visible !== false))
        }
      } catch {
        if (alive) setItems((getData('galerie') || []).filter(i => i?.visible !== false))
      }
    }
    load()
    return () => { alive = false }
  }, [])

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Galerie</div></div>
          <h1 className="reveal" ref={useReveal(80)}>Galerie <em>photos</em></h1>
          <p className="reveal" ref={useReveal(160)} style={{fontSize:'18px',color:'var(--text2)',maxWidth:'720px',marginTop:'20px',fontWeight:300,lineHeight:1.85}}>
            Quelques images pour illustrer l’accompagnement, l’approche et l’univers du coaching. Cliquez sur une photo pour l’agrandir.
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="wrap">
          {items.length === 0 ? (
            <div style={{background:'var(--white)',border:'1px solid var(--c3)',padding:'28px'}}>
              <p style={{margin:0,color:'var(--text2)',lineHeight:1.8,fontWeight:300}}>
                La galerie sera bientôt disponible.
              </p>
            </div>
          ) : (
            <div className="galerie-grid">
              {items.map((it, idx) => (
                <GalerieCard key={it.id} it={it} idx={idx} onPhotoClick={setLightbox} />
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo en grand"
          style={{
            position:'fixed', inset:0, zIndex:10050,
            background:'rgba(26,21,16,.88)',
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:'24px', cursor:'zoom-out',
          }}
          onClick={closeLb}
        >
          <button
            type="button"
            onClick={closeLb}
            style={{
              position:'absolute', top:'18px', right:'18px',
              width:'44px', height:'44px', border:'none', borderRadius:'50%',
              background:'rgba(255,255,255,.15)', color:'#fff', fontSize:'22px', cursor:'pointer',
              lineHeight:1,
            }}
            aria-label="Fermer"
          >
            ×
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth:'min(96vw, 1200px)', maxHeight:'90vh', textAlign:'center' }}
          >
            <CoachingPhotoImg
              src={lightbox.src}
              alt={lightbox.titre || ''}
              style={{ maxWidth:'100%', maxHeight:'85vh', objectFit:'contain', borderRadius:'4px', boxShadow:'0 24px 80px rgba(0,0,0,.35)' }}
            />
            {lightbox.titre && (
              <p style={{ marginTop:'16px', color:'#fff', fontSize:'18px', fontFamily:"'Cormorant Garamond',serif" }}>
                {lightbox.titre}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
