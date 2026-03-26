import React from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'

export default function LeCoaching() {
  const infos = getData('infos')
  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Le coaching en nutrition</div></div>
          <h1 className="reveal" ref={useReveal(80)}>Qu'est-ce que le coaching<br /><em>en nutrition ?</em></h1>
          <p className="reveal" ref={useReveal(160)} style={{fontSize:'18px',color:'var(--text2)',maxWidth:'680px',marginTop:'20px',fontWeight:300,lineHeight:1.85}}>
            Le coaching en nutrition ne consiste pas à suivre un régime imposé, mais à apprendre à mieux comprendre votre alimentation et à faire les bons choix au quotidien.
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="wrap-sm">
          <div className="reveal" ref={useReveal(0)}>
            <p style={{fontSize:'17px',color:'var(--text2)',lineHeight:'1.9',marginBottom:'24px',fontWeight:300}}>
              Mon rôle est de vous guider pas à pas, en tenant compte de votre mode de vie, de vos goûts et de vos contraintes. Avec le <strong>coaching nutritionnel</strong>, vous devenez acteur de votre santé et vous retrouvez le plaisir de manger tout en respectant votre corps.
            </p>
            <p style={{fontSize:'17px',color:'var(--text2)',lineHeight:'1.9',marginBottom:'40px',fontWeight:300}}>
              Avec moi, pas de régime strict ni de culpabilité : l'objectif est de retrouver le plaisir de manger tout en prenant soin de votre santé.
            </p>
          </div>

          <h2 className="reveal" ref={useReveal(80)} style={{marginBottom:'32px'}}>Pour <em>qui</em> ?</h2>
          <div className="reveal" ref={useReveal(120)}>
            <p style={{fontSize:'16px',color:'var(--text2)',lineHeight:'1.9',marginBottom:'20px',fontWeight:300}}>
              Le coaching en nutrition s'adresse à toutes les personnes qui souhaitent :
            </p>
            {[
              'Perdre du poids durablement, sans privation ni culpabilité.',
              'Améliorer leurs habitudes alimentaires pour retrouver plus d\'énergie et de vitalité.',
              'Prévenir certains déséquilibres ou troubles liés à l\'alimentation.',
              'Retrouver confiance en elles grâce à une meilleure relation avec la nourriture.',
              'Apprendre à composer des repas équilibrés, même avec un emploi du temps chargé.',
            ].map((item, i) => (
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'12px 0',borderBottom:'1px solid var(--c3)',fontSize:'15px',color:'var(--text2)',lineHeight:1.7,fontWeight:300}}>
                <span style={{color:'var(--warm)',flexShrink:0,marginTop:'2px'}}>◆</span>
                <span>{item}</span>
              </div>
            ))}
            <p style={{fontSize:'16px',color:'var(--text2)',lineHeight:'1.9',marginTop:'24px',fontWeight:300}}>
              Que vous soyez à Lombron, dans la Sarthe (Le Mans, Connerré, Bonnétable, Savigné-l'Évêque…) ou ailleurs, mes accompagnements sont disponibles en présentiel ou à distance.
            </p>
          </div>

          <h2 className="reveal" ref={useReveal(0)} style={{margin:'56px 0 32px'}}>Comment se déroule<br /><em>l'accompagnement ?</em></h2>
          <div className="reveal" ref={useReveal(80)}>
            {[
              ['01','Un premier échange','Pour comprendre vos besoins, vos habitudes alimentaires et vos objectifs.'],
              ['02','Un plan personnalisé','Adapté à votre mode de vie (sans régime restrictif).'],
              ['03','Des rendez-vous de suivi','Pour ajuster votre programme, répondre à vos questions et vous motiver.'],
              ['04','Des outils pratiques','Idées de repas, astuces, organisation du quotidien.'],
            ].map(([n, t, d]) => (
              <div key={n} style={{display:'flex',gap:'20px',padding:'20px 0',borderBottom:'1px solid var(--c3)'}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'36px',fontWeight:300,color:'var(--warm)',lineHeight:1,flexShrink:0,width:'48px'}}>{n}</div>
                <div>
                  <div style={{fontSize:'15px',fontWeight:500,color:'var(--text)',marginBottom:'6px'}}>{t}</div>
                  <div style={{fontSize:'14px',color:'var(--text3)',lineHeight:1.65,fontWeight:300}}>{d}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="reveal" ref={useReveal(0)} style={{margin:'56px 0 32px'}}>Les <em>bénéfices</em></h2>
          <div className="reveal" ref={useReveal(80)} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'48px'}}>
            {['Retrouver un équilibre alimentaire durable','Gagner en énergie et vitalité','Améliorer son bien-être général','Se sentir libéré(e) des régimes yo-yo','Apprendre à écouter son corps','Cuisiner avec plaisir et simplicité','Atteindre et maintenir un poids de forme','Améliorer sa relation à la nourriture'].map((b,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'14px',background:'var(--c1)',border:'1px solid var(--c3)',fontSize:'14px',color:'var(--text2)',fontWeight:300}}>
                <span style={{color:'var(--ok)',flexShrink:0}}>✅</span>{b}
              </div>
            ))}
          </div>

          <div className="reveal" ref={useReveal(0)} style={{textAlign:'center',padding:'48px',background:'var(--c1)',border:'1px solid var(--c3)'}}>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'28px',fontWeight:400,marginBottom:'16px',color:'var(--text)'}}>Réservez votre appel découverte</h3>
            <p style={{fontSize:'16px',color:'var(--text2)',marginBottom:'28px',fontWeight:300}}>30 minutes, offertes et sans engagement, pour commencer votre transformation.</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/contact" className="btn btn-solid"><span>Réserver maintenant</span><svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></Link>
              <a href={`tel:${infos.tel}`} className="btn btn-outline"><span>📞 {infos.tel}</span></a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
