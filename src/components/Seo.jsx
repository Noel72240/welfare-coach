import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://welfarecoach-lombron.fr').replace(/\/+$/, '')

const routeMeta = {
  '/': {
    title: 'Welfare Coach — Coach Nutrition & Bien-être · Lombron, Sarthe',
    description:
      "Johanna, coach en nutrition et bien-être à Lombron (Sarthe). Accompagnement personnalisé pour perdre du poids, retrouver l'énergie et adopter une alimentation durable. Séances en ligne et à domicile.",
  },
  '/le-coaching': {
    title: "Le coaching — Nutrition & bien-être | Welfare Coach",
    description:
      "Découvrez le coaching en nutrition : une approche sans régime, progressive et personnalisée pour changer durablement vos habitudes.",
  },
  '/mon-approche': {
    title: 'Mon approche — Sans régime, sans culpabilité | Welfare Coach',
    description:
      "Une approche bienveillante et concrète pour retrouver une relation apaisée avec l'alimentation et atteindre vos objectifs.",
  },
  '/tarifs': {
    title: 'Tarifs — Prestations & accompagnements | Welfare Coach',
    description:
      "Consultez les tarifs des prestations : bilan nutritionnel, séances de suivi, coaching 3 mois, coaching 6 mois et diagnostic frigo.",
  },
  '/contact': {
    title: 'Contact — Prendre rendez-vous | Welfare Coach',
    description:
      "Contactez Johanna pour une première séance découverte. Réponse rapide par email ou téléphone.",
  },
  '/avis-clients': {
    title: 'Avis clients — Témoignages | Welfare Coach',
    description:
      "Des témoignages authentiques de personnes accompagnées en coaching nutrition & bien-être.",
  },
  '/galerie': {
    title: 'Galerie — Photos | Welfare Coach',
    description:
      "Galerie photos : l’univers du coaching, l’approche et des moments clés de l’accompagnement.",
  },
  '/mentions-legales': {
    title: 'Mentions légales | Welfare Coach',
    description: 'Mentions légales du site Welfare Coach.',
  },
  '/politique-confidentialite': {
    title: 'Politique de confidentialité | Welfare Coach',
    description: 'Politique de confidentialité et gestion des données personnelles.',
  },
  '/admin': {
    title: 'Administration | Welfare Coach',
    description: 'Espace administration.',
    noIndex: true,
  },
}

export default function Seo() {
  const { pathname } = useLocation()
  const meta = routeMeta[pathname] || routeMeta['/']
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Welfare Coach',
    url: SITE_URL,
    areaServed: 'Sarthe, France',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lombron',
      addressRegion: 'Sarthe',
      addressCountry: 'FR',
    },
    sameAs: ['https://www.instagram.com/welfare.coach72'],
  }

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />

      {meta.noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}

