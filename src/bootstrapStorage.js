/**
 * À chaque nouveau déploiement (nouveau hash Git sur Vercel), on vide les clés
 * locales `wc_*` pour éviter données corrompues / incompatibles entre navigateurs,
 * profils Chrome, Edge ou mobile (cause fréquente de l’ErrorBoundary).
 * Les sessions Supabase (`sb-*`) ne sont pas touchées.
 */
function runStorageMigration() {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const build = import.meta.env.VITE_BUILD_ID || 'local'
    const prev = localStorage.getItem('wc_last_build')
    if (prev === build) return

    const keys = Object.keys(localStorage)
    for (const k of keys) {
      if (k.startsWith('wc_')) localStorage.removeItem(k)
    }
    localStorage.setItem('wc_last_build', build)
  } catch (e) {
    console.warn('[Welfare Coach] migration stockage ignorée:', e)
  }
}

runStorageMigration()
