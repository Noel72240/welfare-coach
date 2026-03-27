// ─────────────────────────────────────────────────────────────
// STORE : toutes les données éditables depuis l'admin
// Les données sont sauvegardées dans localStorage
// ─────────────────────────────────────────────────────────────

export const DEFAULTS = {
  // ── INFOS GÉNÉRALES ──
  infos: {
    // Nom affiché sur le site (sans nom de famille si souhaité)
    nom: 'Johanna',
    // Nom complet uniquement pour les mentions légales
    nom_legal: 'Johanna HAYER',
    titre: 'Coach en Nutrition & Bien-être',
    ville: 'Lombron, Sarthe',
    tel: '07.83.75.15.33',
    email: 'welfare.coach72@gmail.com',
    instagram: 'https://www.instagram.com/welfare.coach72',
    siret: 'XXX XXX XXX XXXXX',
  },

  // ── TARIFS ──
  tarifs: [
    { id:1, nom:'Bilan nutritionnel (1h à 1h15)', en_ligne:'50', domicile:'60', desc:"Analyse de vos habitudes alimentaires, définition de vos objectifs et mise en place d'un plan d'action personnalisé.", visible:true },
    { id:2, nom:'Séance de coaching individuel (1h)', en_ligne:'45', domicile:'55', desc:'Une séance ciblée sur le thème de votre choix : motivation, perte de poids, gestion du stress, organisation des repas…', visible:true },
    { id:3, nom:'Consultation de suivi (45 min)', en_ligne:'40', domicile:'50', desc:"Suivi rapide et efficace pour ajuster votre programme et rester motivé.", visible:true },
    { id:4, nom:'Coaching "Essentiel" – 3 mois', en_ligne:'300', domicile:'350', desc:'Un accompagnement progressif sur 3 mois pour transformer vos habitudes durablement.', visible:true },
    { id:5, nom:'Coaching "VIP" – 6 mois', en_ligne:'550', domicile:'600', desc:'Un programme complet avec suivi intensif sur 6 mois pour atteindre vos objectifs à long terme.', visible:true },
    { id:6, nom:'Diagnostic frigo et placards (1h30 à 2h) – 90 €', en_ligne:'', domicile:'90', desc:'Je viens chez vous analyser le contenu de votre frigo et placards. Point sur vos courses et proposition d\'alternatives plus saines, adaptées à votre budget. À domicile uniquement.', visible:true },
  ],

  // ── AVIS CLIENTS ──
  avis: [
    { id:1, nom:'Marie L.', ville:'Le Mans', note:5, texte:"En quelques séances, Johanna m'a aidée à retrouver une relation apaisée avec la nourriture. Son approche bienveillante et sans jugement est vraiment efficace !", visible:true },
    { id:2, nom:'Sophie R.', ville:'Connerré', note:5, texte:"J'ai perdu 8 kg en 3 mois sans me priver. Johanna m'a appris à manger mieux, pas moins. Je recommande à 100% !", visible:true },
    { id:3, nom:'Claire M.', ville:'Bonnétable', note:5, texte:"Le diagnostic frigo était une vraie révélation. Des conseils pratiques, adaptés à ma vie de famille. Merci Johanna !", visible:true },
    { id:4, nom:'Aurélie D.', ville:'Sarthe', note:5, texte:"Un suivi personnalisé et motivant. Johanna est à l'écoute, professionnelle et très sympathique. Je continue l'aventure avec elle !", visible:true },
  ],

  // ── GALERIE ──
  galerie: [
    // { id: 1, titre: 'Avant / Après', texte: 'Description…', photo_url: '', visible: true }
  ],

  // ── PAGE MON APPROCHE ──
  approche: {
    titre: 'Mon approche du coaching en nutrition',
    intro: "Le coaching en nutrition ne consiste pas à suivre un régime imposé, mais à apprendre à mieux comprendre votre alimentation et à faire les bons choix au quotidien. Mon rôle est de vous guider pas à pas, en tenant compte de votre mode de vie, de vos goûts et de vos contraintes.",
    photo: '', // base64 ou URL
    photo_legende: 'Johanna — Coach Nutrition & Bien-être à Lombron',
    sections: [
      {
        id:1,
        titre: 'Une approche sans régime ni privation',
        texte: "Avec le coaching nutritionnel, vous devenez acteur de votre santé et retrouvez le plaisir de manger tout en respectant votre corps. Pas de régime strict, pas de listes d'aliments interdits. Je vous accompagne vers une alimentation équilibrée, savoureuse et adaptée à votre réalité quotidienne.\n\nMa philosophie : manger mieux, pas moins. Retrouver le plaisir de cuisiner et de se nourrir sainement, sans frustration ni culpabilité."
      },
      {
        id:2,
        titre: 'Pour qui ?',
        texte: "Mon coaching s'adresse à toutes les personnes qui souhaitent :\n• Perdre du poids durablement, sans privation ni culpabilité\n• Améliorer leurs habitudes alimentaires pour retrouver énergie et vitalité\n• Prévenir certains déséquilibres ou troubles liés à l'alimentation\n• Retrouver confiance en elles grâce à une meilleure relation avec la nourriture\n• Apprendre à composer des repas équilibrés même avec un emploi du temps chargé\n\nQue vous soyez à Lombron, dans la Sarthe (Le Mans, Connerré, Bonnétable, Savigné-l'Évêque…) ou ailleurs, mes accompagnements sont disponibles en présentiel ou à distance."
      },
      {
        id:3,
        titre: "Comment se déroule l'accompagnement ?",
        texte: "1. Un premier échange pour comprendre vos besoins, vos habitudes alimentaires et vos objectifs.\n2. Un plan personnalisé adapté à votre mode de vie (sans régime restrictif).\n3. Des rendez-vous de suivi réguliers pour ajuster votre programme, répondre à vos questions et vous motiver.\n4. Des outils pratiques et concrets : idées de repas, astuces, organisation du quotidien.\n\nChaque accompagnement est unique et évolue selon votre progression."
      },
      {
        id:4,
        titre: 'Les bénéfices du coaching en nutrition',
        texte: "• Retrouver un équilibre alimentaire durable\n• Gagner en énergie et vitalité\n• Améliorer son bien-être général\n• Se sentir libéré(e) des régimes yo-yo\n• Apprendre à écouter son corps et à mieux comprendre ses besoins\n• Cuisiner avec plaisir et simplicité\n• Atteindre et maintenir un poids de forme naturellement"
      },
      {
        id:5,
        titre: 'Mes formations et certifications',
        texte: "Titulaire d'une formation professionnelle en coaching nutritionnel et bien-être, je mets mon expertise au service de vos objectifs de santé. Ma pratique s'appuie sur les dernières données en nutrition, psychologie alimentaire et coaching comportemental.\n\nJe me forme régulièrement pour vous offrir un accompagnement de qualité, basé sur des méthodes éprouvées et bienveillantes."
      }
    ]
  },

  // ── PAGE CONTACT ──
  contact: {
    titre: 'Contactez-moi',
    intro: "Vous avez une question ? Vous souhaitez réserver une séance ou simplement en savoir plus sur mon accompagnement ? N'hésitez pas à me contacter, je vous répondrai dans les plus brefs délais.",
    adresse: 'Lombron, Sarthe (72450)',
    zone: 'Sarthe et alentours : Le Mans, Connerré, Bonnétable, Savigné-l\'Évêque…',
    horaires: 'Lun – Sam : 9h00 – 19h00',
    texte_rdv: "Prête à commencer votre transformation ? Réservez votre premier appel découverte gratuit (30 minutes) pour qu'on fasse connaissance et qu'on définisse ensemble vos objectifs."
  }
}

// ── Fonctions get/set ──
export function getData(key) {
  const def = DEFAULTS[key]
  try {
    const raw = localStorage.getItem('wc_' + key)
    if (raw == null || raw === '') return def
    const parsed = JSON.parse(raw)
    // JSON "null" ou types incorrects → évite les crash (.filter sur null, etc.)
    if (parsed == null) return def
    if (Array.isArray(def)) return Array.isArray(parsed) ? parsed : def
    if (def !== null && typeof def === 'object' && !Array.isArray(def)) {
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return def
      return parsed
    }
    return parsed
  } catch {
    return def
  }
}

export function setData(key, value) {
  localStorage.setItem('wc_' + key, JSON.stringify(value))
}

export function resetData(key) {
  localStorage.removeItem('wc_' + key)
}

/** Fusionne les données « Mon approche » venant de Supabase avec les défauts (sections jamais vides). */
export function mergeApprocheData(remote) {
  const base = DEFAULTS.approche
  if (!remote || typeof remote !== 'object') return { ...base }
  return {
    ...base,
    ...remote,
    sections: Array.isArray(remote.sections) && remote.sections.length > 0 ? remote.sections : base.sections,
  }
}
