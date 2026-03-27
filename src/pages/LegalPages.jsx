// MentionsLegales.jsx
import React from 'react'
import { getData } from '../store'
import { useReveal } from '../hooks/useReveal'

export function MentionsLegales() {
  return (
    <div style={{maxWidth:'820px',margin:'0 auto',padding:'140px 6% 100px'}}>
      <div className="reveal" ref={useReveal(0)}><div className="eyebrow">Informations légales</div></div>
      <h1 className="reveal" ref={useReveal(80)}>Mentions <em>légales</em></h1>
      <span style={{fontSize:'12px',color:'var(--text3)',marginBottom:'56px',letterSpacing:'.06em',display:'block',marginTop:'12px'}}>Dernière mise à jour : 2025</span>

      <div className="reveal" ref={useReveal(100)} style={{marginBottom:'28px',display:'flex',justifyContent:'center'}}>
        <img
          src="/allotech72-logo.png"
          alt="Logo Allotech72"
          style={{maxWidth:'220px',width:'100%',height:'auto',borderRadius:'12px',border:'1px solid var(--c3)'}}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
        {[
          ['1. Éditeur du site', `Allotech72\nEntreprise individuelle (micro-entreprise)\nSIRET : 99006097200017\nAdresse : 7 rue de la Rentière, 72450 Lombron, France\nTél : 06 13 89 39 67\nEmail : contact@allotech72.fr`],
          ['2. Directeur de la publication', `Liebault Noel (Allotech72)`],
          ['3. Hébergement', 'Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA'],
          ['4. Propriété intellectuelle', "L'ensemble des contenus (textes, images, logotype) est la propriété exclusive de Welfare Coach. Toute reproduction sans autorisation écrite est interdite."],
          ['5. Responsabilité', "Welfare Coach s'efforce de maintenir des informations exactes. Sa responsabilité ne saurait être engagée en cas d'omission ou d'inexactitude."],
          ['6. Droit applicable', "Site soumis au droit français. Tout litige relève de la compétence des tribunaux français."],
        ].map(([titre, contenu]) => (
          <div key={titre} style={{paddingBottom:'28px',marginBottom:'28px',borderBottom:'1px solid var(--c3)'}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'22px',fontWeight:400,color:'var(--text)',marginBottom:'12px'}}>{titre}</h2>
            {contenu.split('\n').map((l,i) => <p key={i} style={{fontSize:'15px',color:'var(--text2)',lineHeight:'1.9',fontWeight:300,marginBottom:'4px'}}>{l}</p>)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Confidentialite.jsx
export function Confidentialite() {
  return (
    <div style={{maxWidth:'820px',margin:'0 auto',padding:'140px 6% 100px'}}>
      <div className="reveal" ref={useReveal(0)}><div className="eyebrow">RGPD & Confidentialité</div></div>
      <h1 className="reveal" ref={useReveal(80)}>Politique de <em>confidentialité</em></h1>
      <span style={{fontSize:'12px',color:'var(--text3)',marginBottom:'28px',letterSpacing:'.06em',display:'block',marginTop:'12px'}}>2025 — Conforme au RGPD (Règlement UE 2016/679)</span>
      <div style={{background:'var(--c1)',border:'1px solid var(--c3)',padding:'20px 24px',marginBottom:'40px'}}>
        <p style={{fontSize:'15px',color:'var(--text2)',lineHeight:'1.9',fontWeight:300,marginBottom:0}}>La protection de vos données personnelles est une priorité absolue. Ce document vous informe de manière transparente sur la collecte, l'utilisation et la protection de vos données.</p>
      </div>
      {[
        ['1. Responsable du traitement', `Allotech72 (Liebault Noel)\n7 rue de la Rentière, 72450 Lombron, France\ncontact@allotech72.fr`],
        ['2. Données collectées', "Uniquement les données fournies volontairement via le formulaire de contact :\n• Prénom et nom\n• Adresse email\n• Numéro de téléphone (facultatif)\n• Message et disponibilités"],
        ['3. Finalité', "• Répondre à votre demande de rendez-vous\n• Assurer le suivi de la relation client\n• Vous informer des services (avec accord)"],
        ['4. Base légale', "Consentement explicite (case RGPD cochée) et exécution du contrat de prestations de service."],
        ['5. Durée de conservation', "3 ans à compter du dernier contact, puis suppression. Données de facturation conservées 10 ans."],
        ['6. Partage des données', "Vos données ne sont jamais vendues, louées ou cédées à des tiers. Partage limité aux prestataires techniques stricts."],
        ['7. Vos droits (RGPD)', "• Droit d'accès et de rectification\n• Droit à l'effacement (droit à l'oubli)\n• Droit à la limitation du traitement\n• Droit à la portabilité\n• Droit d'opposition\n\nExercez vos droits : contact@allotech72.fr\nRecours possible auprès de la CNIL : www.cnil.fr"],
        ['8. Cookies', "Cookies fonctionnels essentiels uniquement. Aucun cookie publicitaire ou tracking tiers. Refus possible via la bannière.\nAucun cookie de mesure d’audience de type Google Analytics n’est déposé actuellement."],
        ['9. Sécurité', "Mesures techniques et organisationnelles appropriées pour protéger vos données."],
      ].map(([titre, contenu]) => (
        <div key={titre} style={{paddingBottom:'28px',marginBottom:'28px',borderBottom:'1px solid var(--c3)'}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'22px',fontWeight:400,color:'var(--text)',marginBottom:'12px'}}>{titre}</h2>
          {contenu.split('\n').map((l,i) => <p key={i} style={{fontSize:'15px',color:'var(--text2)',lineHeight:'1.9',fontWeight:300,marginBottom:'4px'}}>{l}</p>)}
        </div>
      ))}
    </div>
  )
}

export default MentionsLegales
