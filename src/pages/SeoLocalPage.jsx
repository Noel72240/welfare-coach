import React from 'react'
import { Link } from 'react-router-dom'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'

const PAGES = {
  'coaching-nutrition-lombron': {
    eyebrow: 'Coach nutrition Sarthe',
    title: 'Coaching nutrition à Lombron et en Sarthe',
    intro:
      "Vous cherchez un coach nutrition en Sarthe ? J'accompagne les personnes à Lombron, Le Mans, Connerré et Bonnétable pour retrouver un équilibre alimentaire durable, sans régime strict.",
    sections: [
      {
        h2: 'Un accompagnement personnalisé',
        text:
          "Chaque suivi est adapté à votre rythme, votre quotidien et vos objectifs. L'idée est de construire des habitudes réalistes, progressives et durables.",
      },
      {
        h2: 'Zones d’intervention en Sarthe',
        text:
          "Je propose des séances en présentiel à Lombron et dans les villes voisines (Le Mans, Connerré, Bonnétable), ainsi qu’en consultation en ligne partout en France.",
      },
    ],
  },
  'coach-bien-etre-sarthe': {
    eyebrow: 'Coach bien-être Lombron',
    title: 'Coach bien-être à Lombron (Sarthe)',
    intro:
      "Mon approche de coach bien-être à Lombron repose sur l'écoute, la bienveillance et des actions simples à mettre en place pour retrouver énergie, sérénité et confiance.",
    sections: [
      {
        h2: 'Bien-être et nutrition',
        text:
          "Le bien-être passe aussi par l'alimentation. Ensemble, nous travaillons une relation apaisée à la nourriture, sans culpabilité ni interdits.",
      },
      {
        h2: 'Pour qui ?',
        text:
          "Cet accompagnement s’adresse aux personnes qui veulent se sentir mieux dans leur corps et dans leur quotidien, avec une méthode humaine et sur mesure.",
      },
    ],
  },
  'reequilibrage-alimentaire': {
    eyebrow: 'Rééquilibrage alimentaire Sarthe',
    title: 'Rééquilibrage alimentaire en Sarthe',
    intro:
      "Le rééquilibrage alimentaire en Sarthe permet d’adopter une alimentation saine et équilibrée sans passer par des régimes restrictifs. L'objectif : des résultats durables.",
    sections: [
      {
        h2: 'Manger mieux, pas moins',
        text:
          "Nous mettons en place des repères concrets pour composer vos repas, gérer les fringales et retrouver du plaisir à manger.",
      },
      {
        h2: 'Résultats progressifs',
        text:
          "Le changement se fait étape par étape. Vous avancez avec un plan réaliste, compatible avec votre vie pro et perso.",
      },
    ],
  },
  'perte-de-poids': {
    eyebrow: 'Perte de poids Sarthe',
    title: 'Perte de poids durable en Sarthe',
    intro:
      "Pour une perte de poids en Sarthe, je propose un accompagnement sans privation, axé sur la régularité, l’équilibre alimentaire et le bien-être global.",
    sections: [
      {
        h2: 'Sans régime yo-yo',
        text:
          "L’objectif n’est pas de perdre vite puis reprendre, mais de stabiliser des habitudes solides pour des résultats qui durent.",
      },
      {
        h2: 'Accompagnement local',
        text:
          "Séances possibles à Lombron, Le Mans, Connerré, Bonnétable et alentours, avec un suivi en ligne pour plus de flexibilité.",
      },
    ],
  },
  'consultation-en-ligne': {
    eyebrow: 'Consultation nutrition en ligne',
    title: 'Consultation nutrition en ligne (Sarthe et France)',
    intro:
      "Les consultations en ligne permettent un suivi nutritionnel personnalisé où que vous soyez. Idéal pour garder de la régularité et avancer à votre rythme.",
    sections: [
      {
        h2: 'Simple et flexible',
        text:
          "Vous échangez en visio depuis chez vous, avec des conseils pratiques directement applicables au quotidien.",
      },
      {
        h2: 'Même qualité de suivi',
        text:
          "Le suivi en ligne offre la même qualité d’accompagnement qu’en présentiel, avec un gain de temps et plus de confort.",
      },
    ],
  },
}

export default function SeoLocalPage({ pageKey }) {
  const page = PAGES[pageKey]
  const infos = getData('infos')
  if (!page) return null

  return (
    <>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="reveal" ref={useReveal(0)}><div className="eyebrow">{page.eyebrow}</div></div>
          <h1 className="reveal" ref={useReveal(80)}>{page.title}</h1>
          <p className="reveal" ref={useReveal(160)} style={{fontSize:'17px',color:'var(--text2)',maxWidth:'720px',marginTop:'20px',fontWeight:300,lineHeight:1.85}}>
            {page.intro}
          </p>
        </div>
      </div>

      <section className="sec">
        <div className="wrap-sm">
          {page.sections.map((s, i) => (
            <div key={s.h2} className="reveal" ref={useReveal(i * 80)} style={{marginBottom:'34px'}}>
              <h2 style={{marginBottom:'12px'}}>{s.h2}</h2>
              <p style={{fontSize:'16px',color:'var(--text2)',lineHeight:1.9,fontWeight:300}}>{s.text}</p>
            </div>
          ))}

          <div className="reveal" ref={useReveal(260)} style={{padding:'24px',border:'1px solid var(--c3)',background:'var(--c1)',marginTop:'8px'}}>
            <h2 style={{marginBottom:'10px'}}>Zones locales couvertes</h2>
            <p style={{fontSize:'15px',color:'var(--text2)',lineHeight:1.85,fontWeight:300,margin:0}}>
              Lombron, Sarthe, Le Mans, Connerré, Bonnétable et alentours.
            </p>
          </div>

          <div className="reveal" ref={useReveal(340)} style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'28px'}}>
            <Link to="/contact" className="btn btn-solid"><span>Prendre rendez-vous</span></Link>
            <Link to="/tarifs" className="btn btn-outline"><span>Voir les tarifs</span></Link>
            <Link to="/avis" className="btn btn-outline"><span>Lire les avis</span></Link>
            <a href={`tel:${infos.tel}`} className="btn btn-outline"><span>📞 {infos.tel}</span></a>
          </div>
        </div>
      </section>
    </>
  )
}

