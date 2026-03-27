import React from 'react'

/**
 * Affiche un message au lieu d’une page blanche si une erreur React remonte
 * (souvent cache navigateur / ancien bundle après déploiement).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '48px 24px',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            background: '#FDFAF5',
            color: '#1A1510',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '16px' }}>
            Le site n’a pas pu s’afficher correctement
          </h1>
          <p style={{ marginBottom: '16px', fontSize: '15px' }}>
            Une erreur technique s’est produite. Cela arrive souvent après une mise à jour du site quand le
            navigateur garde d’anciens fichiers en cache.
          </p>
          <ol style={{ paddingLeft: '20px', marginBottom: '24px', fontSize: '15px' }}>
            <li style={{ marginBottom: '8px' }}>
              Essayez un <strong>rechargement forcé</strong> : <kbd>Ctrl</kbd> + <kbd>F5</kbd> (Windows) ou{' '}
              <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> (Mac).
            </li>
            <li style={{ marginBottom: '8px' }}>
              Ou videz le cache pour ce site : F12 → onglet <strong>Application</strong> → Stockage →
              Supprimer les données du site.
            </li>
            <li>Ouvrez la page en <strong>navigation privée</strong> pour tester.</li>
          </ol>
          <p style={{ fontSize: '13px', color: '#9A8A78' }}>
            Si la navigation privée affiche le site correctement, le souci vient en général du cache de ce
            navigateur — videz-le pour ce domaine.
          </p>
          {this.state.error?.message && (
            <details style={{ marginTop: '20px', fontSize: '13px', color: '#524739' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Détail technique (support)</summary>
              <pre
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#F5EFE4',
                  border: '1px solid #DDD0BB',
                  overflow: 'auto',
                  maxHeight: '160px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '12px',
                }}
              >
                {String(this.state.error.message)}
              </pre>
            </details>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: '24px',
              padding: '14px 28px',
              background: '#9E7348',
              color: '#fff',
              border: 'none',
              fontSize: '13px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Recharger la page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
