import React, { useState, useEffect } from 'react'
import { getData, setData } from '../store'
import { getAvis, addAvis, updateAvis, deleteAvis } from '../supabaseClient'
import './Admin.css'

// ── HASH PASSWORD (simple, pour démo – utiliser bcrypt en production) ──
function hashPassword(pwd) {
  return btoa(pwd) // Base64 simple pour démo
}

function verifyPassword(pwd, hash) {
  return btoa(pwd) === hash
}

export default function Admin() {
  const [view, setView] = useState('login') // login | changePassword | dashboard
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [changePasswordData, setChangePasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [changePasswordError, setChangePasswordError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')

  // ── DATA DASHBOARD ──
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(false)
  const [newAvis, setNewAvis] = useState({ nom: '', ville: '', note: 5, texte: '', visible: true })
  const [editingId, setEditingId] = useState(null)

  // Initialiser l'admin au chargement
  useEffect(() => {
    const adminStorage = localStorage.getItem('wc_admin')
    if (adminStorage) {
      const admin = JSON.parse(adminStorage)
      if (admin.authenticated) {
        if (!admin.passwordChanged) {
          setIsAdmin(true)
          setAdminEmail(admin.email)
          setView('changePassword')
        } else {
          loadDashboard(admin.email)
        }
      }
    }
  }, [])

  // Charger le dashboard
  const loadDashboard = async (email) => {
    setIsAdmin(true)
    setAdminEmail(email)
    setLoading(true)
    const avisData = await getAvis()
    setAvis(avisData || [])
    setLoading(false)
    setView('dashboard')
  }

  // ── LOGIN ──
  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')

    // Credentials par défaut (à changer après première connexion)
    const DEFAULT_EMAIL = 'welfare.coach72@gmail.com'
    const DEFAULT_PASSWORD = 'admin123'

    if (loginData.email !== DEFAULT_EMAIL || loginData.password !== DEFAULT_PASSWORD) {
      setLoginError('Email ou mot de passe incorrect.')
      return
    }

    // Stocker les infos admin
    localStorage.setItem('wc_admin', JSON.stringify({
      authenticated: true,
      email: loginData.email,
      passwordChanged: false,
      passwordHash: hashPassword(DEFAULT_PASSWORD)
    }))

    setIsAdmin(true)
    setAdminEmail(loginData.email)
    setView('changePassword')
    setLoginData({ email: '', password: '' })
  }

  // ── CHANGE PASSWORD ──
  const handleChangePassword = (e) => {
    e.preventDefault()
    setChangePasswordError('')

    if (!changePasswordData.oldPassword || !changePasswordData.newPassword) {
      setChangePasswordError('Tous les champs sont requis.')
      return
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setChangePasswordError('Les mots de passe ne correspondent pas.')
      return
    }

    if (changePasswordData.newPassword.length < 6) {
      setChangePasswordError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    // Vérifier l'ancien mot de passe
    const adminStorage = JSON.parse(localStorage.getItem('wc_admin'))
    if (!verifyPassword(changePasswordData.oldPassword, adminStorage.passwordHash)) {
      setChangePasswordError('L\'ancien mot de passe est incorrect.')
      return
    }

    // Mettre à jour
    adminStorage.passwordHash = hashPassword(changePasswordData.newPassword)
    adminStorage.passwordChanged = true
    localStorage.setItem('wc_admin', JSON.stringify(adminStorage))

    setChangePasswordError('')
    setChangePasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
    loadDashboard(adminEmail)
  }

  // ── LOGOUT ──
  const handleLogout = () => {
    localStorage.removeItem('wc_admin')
    setIsAdmin(false)
    setAdminEmail('')
    setView('login')
    setLoginData({ email: '', password: '' })
  }

  // ── AVIS MANAGEMENT ──
  const handleAddAvis = async (e) => {
    e.preventDefault()
    if (!newAvis.nom || !newAvis.texte) {
      alert('Nom et texte requis.')
      return
    }
    const avisItem = await addAvis(newAvis)
    if (avisItem) {
      setAvis([avisItem, ...avis])
      setNewAvis({ nom: '', ville: '', note: 5, texte: '', visible: true })
    }
  }

  const handleUpdateAvis = async (id, updates) => {
    await updateAvis(id, updates)
    setAvis(avis.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const handleDeleteAvis = async (id) => {
    if (!confirm('Supprimer cet avis ?')) return
    await deleteAvis(id)
    setAvis(avis.filter(a => a.id !== id))
  }

  // ── RENDER ──
  if (view === 'login') {
    return (
      <div className="admin-container">
        <div className="admin-login">
          <h1>Espace Admin</h1>
          <p>Welfare Coach</p>
          <form onSubmit={handleLogin}>
            {loginError && <div className="admin-error">{loginError}</div>}
            <div className="admin-field">
              <label>Email</label>
              <input type="email" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} required />
            </div>
            <div className="admin-field">
              <label>Mot de passe</label>
              <input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required />
            </div>
            <button type="submit" className="admin-btn">Connexion</button>
          </form>
          <p className="admin-hint">Par défaut : welfare.coach72@gmail.com / admin123</p>
        </div>
      </div>
    )
  }

  if (view === 'changePassword') {
    return (
      <div className="admin-container">
        <div className="admin-changepass">
          <h1>Changez votre mot de passe</h1>
          <p>Première connexion détectée. Vous devez changer votre mot de passe pour des raisons de sécurité.</p>
          <form onSubmit={handleChangePassword}>
            {changePasswordError && <div className="admin-error">{changePasswordError}</div>}
            <div className="admin-field">
              <label>Ancien mot de passe</label>
              <input type="password" value={changePasswordData.oldPassword} onChange={e => setChangePasswordData({...changePasswordData, oldPassword: e.target.value})} required />
            </div>
            <div className="admin-field">
              <label>Nouveau mot de passe</label>
              <input type="password" value={changePasswordData.newPassword} onChange={e => setChangePasswordData({...changePasswordData, newPassword: e.target.value})} required />
            </div>
            <div className="admin-field">
              <label>Confirmer le mot de passe</label>
              <input type="password" value={changePasswordData.confirmPassword} onChange={e => setChangePasswordData({...changePasswordData, confirmPassword: e.target.value})} required />
            </div>
            <button type="submit" className="admin-btn">Confirmer</button>
          </form>
        </div>
      </div>
    )
  }

  if (view === 'dashboard') {
    return (
      <div className="admin-dashboard">
        <div className="admin-header">
          <div>
            <h1>Dashboard Admin</h1>
            <p>Connecté en tant que {adminEmail}</p>
          </div>
          <button onClick={handleLogout} className="admin-btn admin-btn-logout">Déconnexion</button>
        </div>

        <section className="admin-section">
          <h2>Gestion des Avis Clients</h2>
          
          {/* Ajouter un avis */}
          <div className="admin-form">
            <h3>Ajouter un avis</h3>
            <form onSubmit={handleAddAvis}>
              <div className="admin-field">
                <label>Nom du client *</label>
                <input type="text" value={newAvis.nom} onChange={e => setNewAvis({...newAvis, nom: e.target.value})} required />
              </div>
              <div className="admin-field">
                <label>Ville</label>
                <input type="text" value={newAvis.ville} onChange={e => setNewAvis({...newAvis, ville: e.target.value})} />
              </div>
              <div className="admin-field">
                <label>Note (1-5)</label>
                <select value={newAvis.note} onChange={e => setNewAvis({...newAvis, note: parseInt(e.target.value)})}>
                  <option value={1}>1 ⭐</option>
                  <option value={2}>2 ⭐</option>
                  <option value={3}>3 ⭐</option>
                  <option value={4}>4 ⭐</option>
                  <option value={5}>5 ⭐</option>
                </select>
              </div>
              <div className="admin-field">
                <label>Texte de l'avis *</label>
                <textarea rows={4} value={newAvis.texte} onChange={e => setNewAvis({...newAvis, texte: e.target.value})} required />
              </div>
              <div className="admin-field">
                <label>
                  <input type="checkbox" checked={newAvis.visible} onChange={e => setNewAvis({...newAvis, visible: e.target.checked})} />
                  Visible sur le site
                </label>
              </div>
              <button type="submit" className="admin-btn">Ajouter l'avis</button>
            </form>
          </div>

          {/* Liste des avis */}
          <div className="admin-list">
            <h3>Avis actuels ({avis.length})</h3>
            {loading ? (
              <p>Chargement...</p>
            ) : avis.length === 0 ? (
              <p>Aucun avis pour le moment.</p>
            ) : (
              <div className="admin-avis-list">
                {avis.map(a => (
                  <div key={a.id} className="admin-avis-item">
                    <div className="admin-avis-header">
                      <strong>{a.nom}</strong> - {a.ville}
                      <span className="admin-rating">{'⭐'.repeat(a.note)}</span>
                    </div>
                    <p>{a.texte}</p>
                    <div className="admin-avis-actions">
                      <label>
                        <input type="checkbox" checked={a.visible} onChange={e => handleUpdateAvis(a.id, {visible: e.target.checked})} />
                        Visible
                      </label>
                      <button onClick={() => handleDeleteAvis(a.id)} className="admin-btn-danger">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* TODO: Autres sections (infos, tarifs, etc.) */}
        <section className="admin-section">
          <h3>📝 Autres gestions (à venir)</h3>
          <p>Photos avis, Tarifs, Approche, Infos générales...</p>
        </section>
      </div>
    )
  }

  return null
}
