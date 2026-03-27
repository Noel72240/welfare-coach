import React, { useEffect, useState } from 'react'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'
import { getGalerie, resolveCoachingPhotoSrc } from '../supabaseClient'

function GalerieCard({ it, idx }) {
  const ref = useReveal(idx * 60)
  return (
    <div
      className="reveal"
      ref={ref}
      style={{background:'var(--white)',border:'1px solid var(--c3)',overflow:'hidden'}}
    >
      {it.photo_url && (
        <img
          src={resolveCoachingPhotoSrc(it.photo_url)}
          alt={it.titre || 'Photo'}
          style={{width:'100%',height:'240px',objectFit:'cover',display:'block'}}
          loading="lazy"
        />
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
            Quelques images pour illustrer l’accompagnement, l’approche et l’univers du coaching.
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
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, minmax(0, 1fr))',gap:'18px'}}>
              {items.map((it, idx) => (
                <GalerieCard key={it.id} it={it} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

