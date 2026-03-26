# Welfare Coach — Site Web React

Site vitrine professionnel pour **Johanna HAYER**, Coach en Nutrition & Bien-être à Lombron, Sarthe.

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev
# → http://localhost:5173

# 3. Construire pour la mise en ligne
npm run build
# → dossier dist/ à glisser sur Netlify
```

## 📁 Structure
```
src/
├── assets/logo.png          ← Logo (remplacer pour changer)
├── components/
│   ├── Navbar.jsx/.css      ← Navigation
│   └── Footer.jsx           ← Footer + Cookie + ProgressBar
├── hooks/
│   └── useReveal.js         ← Animations scroll, tilt, compteur
├── pages/
│   ├── Home.jsx/.css        ← Page d'accueil
│   ├── LeCoaching.jsx       ← Page Le Coaching
│   ├── MonApproche.jsx/.css ← Page Mon Approche (éditable)
│   ├── Tarifs.jsx/.css      ← Page Tarifs (éditable)
│   ├── Contact.jsx/.css     ← Page Contact (éditable)
│   ├── AvisClients.jsx      ← Page Avis Clients (éditable)
│   ├── Admin.jsx/.css       ← Page Administration
│   └── LegalPages.jsx       ← Mentions légales + RGPD
├── store.js                 ← Toutes les données éditables
├── App.jsx                  ← Routeur
├── main.jsx                 ← Point d'entrée
└── index.css                ← Styles globaux
```

## 🔐 Espace Administration

URL : `/admin`  
Mot de passe par défaut : **welfare2025**

**Ce que vous pouvez modifier depuis l'admin :**
- ✅ Tarifs (prix en ligne, à domicile, description)
- ✅ Avis clients (ajout, modification, suppression, note)
- ✅ Page "Mon Approche" (titre, intro, photo, sections)
- ✅ Page "Contact" (textes, coordonnées, horaires)
- ✅ Infos générales (nom, titre, téléphone, email)
- ✅ Mot de passe admin

## ✏️ Personnaliser le code

### Changer les données par défaut
Ouvrez `src/store.js` et modifiez les valeurs dans `DEFAULTS`.

### Changer le logo  
Remplacez `src/assets/logo.png` par votre logo (même nom).

### Modifier un texte fixe
Ouvrez le fichier JSX correspondant dans `src/pages/` et cherchez le texte avec `Ctrl+F`.

## 🌐 Mise en ligne (Netlify)

1. `npm run build` → génère le dossier `dist/`
2. Allez sur [app.netlify.com](https://app.netlify.com/drop)
3. Glissez le dossier `dist/` dans la zone de déploiement
4. Votre site est en ligne ! 🎉

## 📦 Technologies
- React 18 + React Router v6
- Vite 5
- CSS pur (pas de Tailwind ni Bootstrap)
- localStorage pour les données admin
