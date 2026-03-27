import React from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'
import './MonApproche.css'

export default function MonApproche() {
  const data = getData('approche')
  const infos = getData('infos')
  const publicName = (infos.nom || '').trim().split(/\s+/)[0] || infos.nom

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Mon approche</div></div>
          <h1 className="reveal" ref={useReveal(80)}>{data.titre}</h1>
          <p className="reveal" ref={useReveal(160)} style={{fontSize:'18px',color:'var(--text2)',maxWidth:'680px',marginTop:'20px',fontWeight:300,lineHeight:1.85}}>
            {data.intro}
          </p>
        </div>
      </div>

      {/* PHOTO + INTRO */}
      <section className="sec">
        <div className="wrap">
          <div className="approche-top">
            {data.photo && (
              <div className="approche-photo-wrap reveal-l" ref={useReveal(0)}>
                <img src={data.photo} alt={data.photo_legende} className="approche-photo" />
                <p className="approche-photo-legende">{data.photo_legende}</p>
              </div>
            )}
            <div className={data.photo ? 'approche-intro-text reveal-r' : 'approche-intro-text-full reveal'} ref={useReveal(100)}>
              <h2>Qui suis-je ?</h2>
              <p>Je suis <strong>{publicName}</strong>, {infos.titre} basée à {infos.ville}. Mon parcours m'a conduite à me passionner pour la nutrition et le bien-être, avec une conviction profonde : il est possible de manger sainement tout en prenant du plaisir, sans régime ni privation.</p>
              <p>Mon approche est centrée sur vous — votre mode de vie, vos goûts, vos contraintes. Pas de solution toute faite, mais un accompagnement sur mesure qui respecte qui vous êtes et vous aide à devenir la meilleure version de vous-même.</p>
              <div className="approche-contact-box">
                <a href={`tel:${infos.tel}`} className="approche-contact-item">📞 {infos.tel}</a>
                <a href={`mailto:${infos.email}`} className="approche-contact-item">✉️ {infos.email}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS ÉDITABLES */}
      {data.sections && data.sections.map((s, i) => (
        <section key={s.id} className={`sec ${i % 2 === 1 ? 'sec-alt' : ''}`}>
          <div className="wrap-sm">
            <div className={`reveal${i % 2 === 0 ? '-l' : '-r'}`} ref={useReveal(0)}>
              <div className="eyebrow" style={{marginBottom:'16px'}}>
                {i === 0 ? 'Mon approche' : i === 1 ? 'Pour qui ?' : i === 2 ? 'Déroulement' : i === 3 ? 'Les bénéfices' : 'Formation'}
              </div>
              <h2 style={{marginBottom:'28px'}}>{s.titre}</h2>
              <div className="approche-texte">
                {s.texte.split('\n').map((line, j) => {
                  if (!line.trim()) return null
                  if (line.startsWith('•') || line.match(/^\d+\./)) {
                    return <div key={j} className="approche-list-item">{line}</div>
                  }
                  return <p key={j}>{line}</p>
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="sec sec-alt" style={{textAlign:'center'}}>
        <div className="wrap-sm">
          <div className="eyebrow" style={{justifyContent:'center'}} ref={useReveal(0)}>Prête à commencer ?</div>
          <h2 className="reveal" ref={useReveal(80)}>Un coaching <em>sur mesure</em> vous attend</h2>
          <p className="reveal" ref={useReveal(150)} style={{fontSize:'17px',color:'var(--text2)',lineHeight:'1.9',margin:'20px auto 36px',fontWeight:300}}>
            La première étape est simple : un appel découverte de 30 minutes, offert et sans engagement, pour faire connaissance et définir ensemble vos objectifs.
          </p>
          <div className="reveal" ref={useReveal(220)} style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/contact" className="btn btn-solid">
              <span>Réserver mon appel découverte</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/tarifs" className="btn btn-outline">
              <span>Voir les tarifs</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
