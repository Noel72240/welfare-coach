import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.welfare-coach.fr').replace(/\/+$/, '')

const routeMeta = {
  '/': {
    title: 'Coach en nutrition à Lombron – Welfare Coach',
    description:
      "Welfare Coach à Lombron : coach nutrition Sarthe pour perte de poids durable, rééquilibrage alimentaire et bien-être à Le Mans, Connerré et Bonnétable.",
  },
  '/coach-nutrition-sarthe': {
    title: 'Coach nutrition Sarthe | Perte de poids & rééquilibrage alimentaire',
    description:
      "Coach nutrition Sarthe : accompagnement personnalisé à Lombron, Le Mans, Connerré, Bonnétable pour perte de poids et rééquilibrage alimentaire durable.",
  },
  '/coaching-nutrition-lombron': {
    title: 'Coaching nutrition Lombron (Sarthe) | Welfare Coach',
    description:
      "Coach nutrition à Lombron : accompagnement nutritionnel en Sarthe pour retrouver énergie, équilibre alimentaire et bien-être sans régime strict.",
  },
  '/coach-bien-etre-sarthe': {
    title: 'Coach bien-être Sarthe | Accompagnement à Lombron',
    description:
      "Coach bien-être à Lombron en Sarthe : suivi personnalisé pour améliorer votre alimentation, votre énergie et votre qualité de vie.",
  },
  '/reequilibrage-alimentaire': {
    title: 'Rééquilibrage alimentaire Sarthe | Welfare Coach',
    description:
      "Programme de rééquilibrage alimentaire en Sarthe : habitudes durables, repas équilibrés, accompagnement humain et progressif.",
  },
  '/perte-de-poids': {
    title: 'Perte de poids Sarthe | Méthode durable sans privation',
    description:
      "Perte de poids en Sarthe avec une approche sans régime yo-yo : coaching nutritionnel personnalisé à Lombron et Le Mans.",
  },
  '/consultation-en-ligne': {
    title: 'Consultation nutrition en ligne | Welfare Coach',
    description:
      "Consultation nutrition en ligne avec coach en Sarthe : suivi pratique, flexible et personnalisé, partout en France.",
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
  '/avis': {
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
  const legacyMap = {
    '/le-coaching': '/coaching-nutrition-lombron',
    '/mon-approche': '/coach-bien-etre-sarthe',
    '/avis-clients': '/avis',
  }
  const normalizedPath = legacyMap[pathname] || pathname
  const meta = routeMeta[normalizedPath] || routeMeta['/']
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Welfare Coach',
    url: SITE_URL,
    telephone: '+33783751533',
    email: 'welfare.coach72@gmail.com',
    areaServed: ['Sarthe', 'Le Mans', 'Lombron', 'Connerré', 'Bonnétable'],
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
      <link rel="canonical" href={`${SITE_URL}${normalizedPath === '/' ? '' : normalizedPath}`} />

      {meta.noIndex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}

