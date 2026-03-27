import React from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'

export default function CoachNutritionSarthe() {
  const infos = getData('infos')

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Coach nutrition Sarthe</div></div>
          <h1 className="reveal" ref={useReveal(80)}>Coach nutrition en Sarthe : accompagnement personnalisé à Lombron</h1>
          <p className="reveal" ref={useReveal(160)} style={{fontSize:'17px',color:'var(--text2)',maxWidth:'760px',marginTop:'20px',fontWeight:300,lineHeight:1.9}}>
            Si vous cherchez un coach nutrition en Sarthe, vous avez besoin d’un accompagnement réaliste, humain et adapté à votre quotidien.
            Mon objectif est de vous aider à retrouver un équilibre alimentaire durable, sans régime strict ni culpabilité.
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="wrap-sm">
          <h2 className="reveal" ref={useReveal(0)} style={{marginBottom:'14px'}}>Un coach bien-être en Sarthe pour des résultats durables</h2>
          <p className="reveal" ref={useReveal(60)} style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300,marginBottom:'16px'}}>
            Le rôle d’un coach bien-être en Sarthe ne se limite pas à fournir des conseils théoriques. L’enjeu est de vous proposer une méthode
            claire, praticable, et surtout compatible avec votre rythme de vie. Beaucoup de personnes ont déjà essayé des approches trop strictes,
            trop rapides ou trop culpabilisantes. Elles obtiennent parfois des résultats à court terme, puis reviennent à leurs anciennes habitudes.
            Mon accompagnement est construit pour sortir de ce cycle.
          </p>
          <p className="reveal" ref={useReveal(120)} style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300,marginBottom:'16px'}}>
            Nous avançons étape par étape : compréhension de vos habitudes, identification des freins, organisation des repas, gestion des envies,
            et mise en place de routines simples. Cette progression permet de consolider les changements dans le temps. Je vous accompagne à Lombron,
            Le Mans, Connerré, Bonnétable et dans le reste de la Sarthe, en présentiel ou à distance selon vos préférences.
          </p>

          <h2 className="reveal" ref={useReveal(180)} style={{margin:'28px 0 14px'}}>Perte de poids en Sarthe : sans privation, sans effet yo-yo</h2>
          <p className="reveal" ref={useReveal(240)} style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300,marginBottom:'16px'}}>
            La perte de poids en Sarthe est une demande fréquente, mais elle doit être abordée avec méthode. Ici, nous cherchons une perte de poids
            progressive et stable, pas une solution express. L’objectif est de réduire les comportements alimentaires qui fatiguent votre organisme,
            tout en conservant du plaisir à manger. Vous apprenez à composer vos repas avec souplesse, à ajuster les portions intelligemment et à
            retrouver des repères fiables pour votre énergie quotidienne.
          </p>
          <p className="reveal" ref={useReveal(300)} style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300,marginBottom:'16px'}}>
            Cette approche est particulièrement utile si vous avez déjà testé plusieurs régimes sans parvenir à maintenir les résultats. Le but n’est
            pas de vous imposer des interdits, mais de construire une relation plus sereine avec l’alimentation. Avec un suivi régulier, vous gagnez
            en confiance et vous développez des habitudes que vous pouvez conserver sur le long terme.
          </p>

          <h2 className="reveal" ref={useReveal(360)} style={{margin:'28px 0 14px'}}>Rééquilibrage alimentaire en Sarthe : une méthode concrète</h2>
          <p className="reveal" ref={useReveal(420)} style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300,marginBottom:'16px'}}>
            Le rééquilibrage alimentaire en Sarthe repose sur des bases simples : mieux choisir, mieux répartir, mieux anticiper. Ensemble, nous
            travaillons sur vos courses, vos repas types, vos horaires, votre organisation de semaine et vos contraintes personnelles. Vous repartez
            avec des outils concrets : idées de repas, repères de composition, astuces de préparation et stratégies pour les périodes plus chargées.
          </p>
          <p className="reveal" ref={useReveal(480)} style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300,marginBottom:'16px'}}>
            Cette démarche convient aux personnes qui souhaitent améliorer leur bien-être global : énergie, digestion, concentration, qualité de
            sommeil, et relation apaisée à la nourriture. Si vous habitez Lombron, Le Mans, Connerré, Bonnétable ou Savigné-l’Évêque, vous pouvez
            bénéficier d’un accompagnement local et personnalisé.
          </p>

          <h2 className="reveal" ref={useReveal(540)} style={{margin:'28px 0 14px'}}>Pourquoi choisir Welfare Coach à Lombron ?</h2>
          <p className="reveal" ref={useReveal(600)} style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300,marginBottom:'16px'}}>
            En tant que coach nutrition à Lombron, je privilégie une approche humaine, pédagogique et durable. Chaque personne est différente :
            votre accompagnement l’est aussi. Vous êtes guidé avec bienveillance, sans jugement, et avec des objectifs réalistes. Mon engagement est
            de vous aider à retrouver votre équilibre alimentaire et votre bien-être, avec une méthode claire et des résultats mesurables dans le temps.
          </p>
          <p className="reveal" ref={useReveal(660)} style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300}}>
            Vous pouvez démarrer par une première séance découverte pour faire le point sur votre situation et définir un plan adapté. Ensuite,
            nous avançons ensemble à votre rythme, en présentiel en Sarthe ou en consultation en ligne.
          </p>

          <div className="reveal" ref={useReveal(720)} style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'28px'}}>
            <Link to="/contact" className="btn btn-solid"><span>Prendre rendez-vous</span></Link>
            <Link to="/avis" className="btn btn-outline"><span>Lire les avis clients</span></Link>
            <Link to="/" className="btn btn-outline"><span>Retour à l’accueil</span></Link>
            <a href={`tel:${infos.tel}`} className="btn btn-outline"><span>📞 {infos.tel}</span></a>
          </div>
        </div>
      </section>
    </>
  )
}

