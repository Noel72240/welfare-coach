import React from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'
import './Tarifs.css'

export default function Tarifs() {
  const tarifs = getData('tarifs').filter(t => t.visible)
  const infos = getData('infos')

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Tarifs</div></div>
          <h1 className="reveal" ref={useReveal(80)}>Mes prestations en coaching<br /><em>nutrition &amp; bien-être</em></h1>
          <p className="reveal" ref={useReveal(160)} style={{fontSize:'17px',color:'var(--text2)',maxWidth:'640px',marginTop:'20px',fontWeight:300,lineHeight:1.85}}>
            Des formules adaptées à vos besoins et à votre budget, disponibles en ligne ou à domicile dans la Sarthe et ses alentours.
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="wrap">
          <div className="tarifs-grid">
            {tarifs.map((t, i) => (
              <div key={t.id} className="tarif-card reveal" ref={useReveal(i * 60)}>
                <div className="tarif-header">
                  <span className="tarif-ico">💠</span>
                  <h3>{t.nom}</h3>
                </div>
                <p className="tarif-desc">{t.desc}</p>
                <div className="tarif-prix-row">
                  {t.en_ligne && (
                    <div className="tarif-prix">
                      <span className="prix-label">En ligne</span>
                      <span className="prix-val">{t.en_ligne} €</span>
                    </div>
                  )}
                  {t.domicile && (
                    <div className="tarif-prix tarif-prix-dom">
                      <span className="prix-label">À domicile</span>
                      <span className="prix-val">{t.domicile}{t.domicile === 'Sur devis' ? '' : ' €'}</span>
                    </div>
                  )}
                </div>
                <Link to="/contact" className="tarif-btn">Réserver cette prestation →</Link>
              </div>
            ))}
          </div>

          {/* INFO BOX */}
          <div className="tarifs-info reveal" ref={useReveal(0)}>
            <div className="tarifs-info-item">
              <span>📞</span>
              <div>
                <strong>Pour réserver ou obtenir plus d'informations</strong>
                <p>N'hésitez pas à me contacter directement.</p>
              </div>
            </div>
            <div className="tarifs-info-links">
              <a href={`tel:${infos.tel}`} className="btn btn-solid"><span>📞 {infos.tel}</span></a>
              <a href={`mailto:${infos.email}`} className="btn btn-outline"><span>✉️ {infos.email}</span></a>
              <Link to="/contact" className="btn btn-outline"><span>Formulaire de contact</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SEO */}
      <section className="sec sec-alt">
        <div className="wrap-sm">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Questions fréquentes</div></div>
          <h2 className="reveal" ref={useReveal(80)} style={{marginBottom:'40px'}}>Tout savoir avant de <em>commencer</em></h2>
          {[
            ['Combien de séances sont nécessaires pour voir des résultats ?','Cela dépend de vos objectifs et de votre implication. En général, les premiers changements positifs se ressentent dès les 2 à 4 premières semaines. Pour des résultats durables, un suivi de 3 à 6 mois est recommandé.'],
            ['Les séances se font-elles en présentiel ou à distance ?','Les deux options sont disponibles ! Je propose des séances en visioconférence (partout en France) et des séances à domicile dans la Sarthe (Lombron, Le Mans, Connerré, Bonnétable, Savigné-l\'Évêque et alentours).'],
            ['Est-ce que je vais devoir suivre un régime strict ?','Absolument pas ! Mon approche est basée sur l\'éducation nutritionnelle, pas sur les régimes. Nous travaillons ensemble pour adapter votre alimentation à votre vie, sans privation ni culpabilité.'],
            ['Comment se passe le premier rendez-vous ?','Le premier échange (30 minutes, offert) est un appel découverte pour faire connaissance, comprendre vos besoins et définir vos objectifs. Aucune pression, pas d\'engagement.'],
            ['Quels modes de paiement acceptez-vous ?','Je vous renseignerai sur les modalités de paiement lors de notre premier échange.'],
          ].map(([q, r], i) => (
            <div key={i} className="faq-item reveal" ref={useReveal(i * 60)}>
              <h3 style={{fontSize:'18px',fontWeight:500,color:'var(--text)',marginBottom:'10px'}}>{q}</h3>
              <p style={{fontSize:'15px',color:'var(--text2)',lineHeight:'1.85',fontWeight:300}}>{r}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
