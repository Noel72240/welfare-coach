import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { getData } from '../store'
import { useReveal, useCountUp, useTilt } from '../hooks/useReveal'
import './Home.css'

function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); let W, H, pts = [], raf
    const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight }
    resize(); window.addEventListener('resize', resize, { passive: true })
    for (let i = 0; i < 40; i++) pts.push({ x: Math.random()*1400, y: Math.random()*900, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, r: Math.random()*2+.8, col: Math.random()>.5 ? 'rgba(158,115,72,' : 'rgba(95,126,88,' })
    const draw = () => {
      ctx.clearRect(0,0,W,H)
      pts.forEach(p => { p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.col+'0.4)'; ctx.fill() })
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(158,115,72,${.1*(1-d/120)})`;ctx.lineWidth=.6;ctx.stroke()}}
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="hero-particles" aria-hidden="true" />
}

function StatCell({ count, suffix, label }) {
  const numRef = typeof count === 'number' ? useCountUp(count, suffix) : null
  const tiltRef = useTilt()
  return (
    <div className="stat-cell" ref={tiltRef}>
      <div className="stat-n"><span ref={numRef}>{count}{suffix}</span></div>
      <div className="stat-l">{label}</div>
    </div>
  )
}

export default function Home() {
  const infos = getData('infos')
  const publicName = (infos.nom || '').trim().split(/\s+/)[0] || infos.nom
  const avis = getData('avis').filter(a => a.visible).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <Particles />
        <div className="orb orb1" aria-hidden="true" />
        <div className="orb orb2" aria-hidden="true" />

        <div className="hero-badge"><span className="bdot" />Coach Nutrition &amp; Bien-être · Lombron, Sarthe</div>

        <div className="hero-logo-zone" aria-hidden="true">
          <div className="lrw">
            <div className="lr1" /><div className="lr2" /><div className="lr3" />
            <img src={logo} alt="Welfare Coach" />
          </div>
        </div>

        <h1 className="hero-hl reveal" ref={useReveal(100)}>
          Et si tout <em>changeait</em><br />en <span className="out">30 minutes</span> ?
        </h1>
        <p className="hero-sub1 reveal" ref={useReveal(220)}>
          Ce que vous portez depuis des années peut se transformer bien plus vite que vous ne le croyez.
        </p>
        <p className="hero-q reveal" ref={useReveal(330)}>
          Stress, poids, énergie, relation à la nourriture…<br />
          <em>Et si c'était enfin le bon moment pour tout changer ?</em>
        </p>

        <div className="hero-tags reveal" ref={useReveal(420)}>
          {[['🥗','Nutrition & alimentation'],['💪','Perte de poids durable'],['✨','Bien-être & énergie'],['🧘','Gestion du stress'],['🎯','Résultats concrets'],['📍','Lombron · Sarthe']].map(([ico,l]) => (
            <span key={l} className="hero-tag"><span>{ico}</span><span>{l}</span></span>
          ))}
        </div>

        <div className="hero-cta reveal" ref={useReveal(510)}>
          <Link to="/contact" className="btn-hero">
            <span>Séance découverte offerte</span>
            <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link to="/le-coaching" className="btn-ghost2">
            <span>Découvrir le coaching</span>
            <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="hero-proof reveal" ref={useReveal(600)}>
          <div className="pc"><div className="pstars">★★★★★</div><div className="pc-l">Avis clients 5 étoiles</div></div>
          <div className="pc"><div className="pc-n"><span ref={useCountUp(100, '%')}>100%</span></div><div className="pc-l">Sans régime restrictif</div></div>
          <div className="pc"><div className="pc-n"><span ref={useCountUp(5, ' ans')}>5 ans</span></div><div className="pc-l">D'expérience</div></div>
          <div className="pc"><div className="pc-n">0€</div><div className="pc-l">1ère séance offerte</div></div>
        </div>

        <div className="sh" aria-hidden="true"><span>Découvrir</span><div className="sh-line" /></div>
      </section>

      {/* MARQUEE */}
      <div className="mqsec" aria-hidden="true">
        <div className="mqt">
          {['Coaching nutrition','Perte de poids','Bien-être alimentaire','Lombron · Sarthe','Sans régime','Bilan nutritionnel','Énergie & vitalité','Séance offerte','Le Mans · Connerré','Coaching nutrition','Perte de poids','Bien-être alimentaire','Lombron · Sarthe','Sans régime','Bilan nutritionnel','Énergie & vitalité','Séance offerte','Le Mans · Connerré'].map((t,i) => (
            <span key={i} className="mqi">{t}<span className="mqd">◆</span></span>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <section className="sec">
        <div className="wrap">
          <div className="intro-grid">
            <div className="reveal-l" ref={useReveal(0)}>
              <div className="eyebrow">Bienvenue</div>
              <h2>Je suis <em>{publicName}</em>,<br />{infos.titre}</h2>
              <p style={{fontSize:'17px',color:'var(--text2)',lineHeight:'1.9',marginTop:'20px',marginBottom:'24px',fontWeight:300}}>
                J'accompagne les personnes qui souhaitent retrouver un équilibre alimentaire, améliorer leur santé et atteindre leurs objectifs de bien-être grâce à une alimentation adaptée et durable.
              </p>
              <p style={{fontSize:'16px',color:'var(--text2)',lineHeight:'1.9',marginBottom:'32px',fontWeight:300}}>
                Mon rôle est de vous guider pas à pas, que vous cherchiez à perdre du poids sans frustration, adopter une alimentation plus saine et équilibrée, retrouver de l'énergie au quotidien, ou simplement mieux comprendre les bases de la nutrition.
              </p>
              <p style={{fontSize:'16px',color:'var(--text2)',lineHeight:'1.9',marginBottom:'36px',fontWeight:300}}>
                Installée à <strong>Lombron</strong>, j'accompagne les habitants de la Sarthe et des alentours (Le Mans, Connerré, Bonnétable, Savigné-l'Évêque…), en présentiel ou à distance selon vos préférences.
              </p>
              <Link to="/le-coaching" className="btn btn-solid">
                <span>En savoir plus</span>
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="intro-engagements reveal-r" ref={useReveal(120)}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'26px',fontWeight:400,marginBottom:'24px',color:'var(--text)'}}>Mes engagements</h3>
              {[
                ['✅','Un suivi bienveillant et à l\'écoute'],
                ['✅','Des conseils personnalisés, adaptés à votre mode de vie'],
                ['✅','Un accompagnement progressif pour des résultats durables'],
                ['✅','Pas de régime strict, pas de culpabilité'],
                ['✅','Le plaisir de manger retrouvé'],
              ].map(([ico, txt]) => (
                <div key={txt} className="engagement-item">
                  <span className="eng-ico">{ico}</span>
                  <span>{txt}</span>
                </div>
              ))}
              <div className="intro-cta-box">
                <p>Prête à commencer votre transformation ?</p>
                <Link to="/contact" className="btn btn-solid" style={{width:'100%',justifyContent:'center'}}>
                  <span>Réserver votre appel découverte</span>
                  <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-row">
        <StatCell count={5} suffix=" ans" label="D'expérience en coaching" />
        <StatCell count="Sarthe" suffix="" label="À domicile & en ligne" />
        <StatCell count={100} suffix="%" label="Sans régime restrictif" />
        <StatCell count={30} suffix=" min" label="1ère séance offerte" />
      </div>

      {/* SERVICES APERÇU */}
      <section className="sec sec-alt">
        <div className="wrap">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Mes prestations</div></div>
          <h2 className="reveal" ref={useReveal(80)}>Ce que je <em>propose</em></h2>
          <p className="reveal" ref={useReveal(140)} style={{fontSize:'16px',color:'var(--text2)',maxWidth:'640px',marginBottom:'52px',fontWeight:300,lineHeight:1.85}}>
            Chaque accompagnement est personnalisé selon vos besoins, votre mode de vie et vos objectifs. En ligne ou à domicile dans la Sarthe.
          </p>
          <div className="services-grid">
            {[
              {ico:'🥗',titre:'Bilan nutritionnel',desc:'Analyse de vos habitudes, définition de vos objectifs et plan d\'action personnalisé. En ligne à partir de 50€.',lien:'/tarifs'},
              {ico:'🎯',titre:'Coaching individuel',desc:'Séances de suivi personnalisées pour vous accompagner vers vos objectifs, à votre rythme. À partir de 45€.',lien:'/tarifs'},
              {ico:'🚀',titre:'Coaching Essentiel 3 mois',desc:'Un accompagnement complet sur 3 mois pour transformer durablement vos habitudes alimentaires. À partir de 300€.',lien:'/tarifs'},
              {ico:'👑',titre:'Coaching VIP 6 mois',desc:'Le programme intensif sur 6 mois pour des résultats profonds et durables. À partir de 550€.',lien:'/tarifs'},
              {ico:'🏠',titre:'Diagnostic frigo & placards',desc:'Je viens chez vous analyser votre cuisine et vous propose des alternatives saines et adaptées. 90€.',lien:'/tarifs'},
              {ico:'📅',titre:'Consultation de suivi',desc:'Des rendez-vous réguliers pour ajuster votre programme et rester motivé. À partir de 40€.',lien:'/tarifs'},
            ].map(({ico,titre,desc,lien}, i) => (
              <Link key={titre} to={lien} className="service-card reveal" ref={useReveal(i*60)} style={{textDecoration:'none'}}>
                <span className="sc-ico">{ico}</span>
                <h3 className="sc-titre">{titre}</h3>
                <p className="sc-desc">{desc}</p>
                <span className="sc-link">Voir les tarifs →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AVIS */}
      {avis.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Témoignages</div></div>
            <h2 className="reveal" ref={useReveal(80)}>Ce que disent mes <em>clients</em></h2>
            <div className="avis-grid">
              {avis.map((a, i) => (
                <div key={a.id} className="avis-card reveal" ref={useReveal(i*80)}>
                  <div className="avis-stars">{'★'.repeat(a.note)}</div>
                  <p className="avis-texte">"{a.texte}"</p>
                  <div className="avis-author">— {a.nom}, {a.ville}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center',marginTop:'40px'}}>
              <Link to="/avis-clients" className="btn btn-outline">
                <span>Voir tous les avis</span>
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="sec sec-alt" style={{textAlign:'center'}}>
        <div className="wrap-sm">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow" style={{justifyContent:'center'}}>Première étape</div></div>
          <h2 className="reveal" ref={useReveal(80)}>Prête à retrouver votre <em>équilibre</em> ?</h2>
          <p className="reveal" ref={useReveal(150)} style={{fontSize:'17px',color:'var(--text2)',lineHeight:'1.9',margin:'20px auto 40px',fontWeight:300,maxWidth:'580px'}}>
            Contactez-moi dès aujourd'hui pour réserver votre première séance et découvrir comment un <strong>coaching nutritionnel personnalisé</strong> peut transformer votre quotidien. Première séance de 30 minutes offerte !
          </p>
          <div className="reveal" ref={useReveal(220)} style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/contact" className="btn btn-solid">
              <span>Réserver ma séance offerte</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href={`tel:${getData('infos').tel}`} className="btn btn-outline">
              <span>📞 {getData('infos').tel}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
