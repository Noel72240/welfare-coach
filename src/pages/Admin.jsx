import React, { useState, useEffect, useRef } from 'react'
import logo from '../assets/logo.png'
import { getData, setData, mergeApprocheData } from '../store'
import CoachingPhotoImg from '../components/CoachingPhotoImg'
import { supabase, supabaseConfigured, uploadPhoto, publicUrlAfterAvisUpload, deleteAvisPhotoByUrl, cleanupOrphanAvisPhotos, uploadCoachingPhoto, getCoachingPhotoUrl, deleteCoachingPhotoByUrl, getAvis, getGalerie, getSiteContent, upsertSiteContent } from '../supabaseClient'
import AvisPhotoImg from '../components/AvisPhotoImg'
import './Admin.css'

/** Si défini (ex. contact@allotech72.fr), seul ce compte Supabase Auth peut accéder à l’admin. */
const ADMIN_EMAIL_ALLOW = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() || ''

function formatSupabaseError(err) {
  if (!err) return 'Erreur inconnue'
  const m = err.message || String(err)
  const d = err.details && String(err.details).trim()
  const h = err.hint && String(err.hint).trim()
  const code = err.code ? ` [${err.code}]` : ''
  return [m, d && `— ${d}`, h && `(${h})`].filter(Boolean).join(' ') + code
}

// ── Toast ──
function Toast({ msg, show }) {
  return <div className={`adm-toast ${show ? 'show' : ''}`}>✓ {msg}</div>
}

// ── Étoiles ──
function Stars({ value, onChange }) {
  return (
    <div style={{display:'flex',gap:'6px',marginTop:'6px'}}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={() => onChange(n)}
          style={{fontSize:'22px',cursor:'pointer',color:n<=value?'var(--warm)':'var(--c3)',transition:'color .15s,transform .15s'}}
          onMouseEnter={e=>e.target.style.transform='scale(1.2)'}
          onMouseLeave={e=>e.target.style.transform=''}
        >★</span>
      ))}
    </div>
  )
}

// ── Toggle ──
function Toggle({ checked, onChange, label }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
      <label style={{position:'relative',width:'42px',height:'22px',cursor:'pointer',flexShrink:0}}>
        <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{opacity:0,width:0,height:0}} />
        <span style={{position:'absolute',inset:0,background:checked?'var(--warm)':'var(--c3)',borderRadius:'22px',transition:'background .3s'}} />
        <span style={{position:'absolute',height:'16px',width:'16px',left:checked?'23px':'3px',bottom:'3px',background:'white',borderRadius:'50%',transition:'left .3s'}} />
      </label>
      <span style={{fontSize:'13px',color:'var(--text2)'}}>{checked ? 'Visible' : 'Masqué'}</span>
    </div>
  )
}

// ── Field ──
function Field({ label, children }) {
  return (
    <div style={{marginBottom:'16px'}}>
      <label style={{display:'block',fontSize:'10.5px',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text3)',marginBottom:'8px',fontWeight:500}}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type='text' }) {
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{width:'100%',padding:'12px 15px',background:'var(--c0)',border:'1px solid var(--c3)',fontFamily:"'DM Sans',sans-serif",fontSize:'14px',fontWeight:300,color:'var(--text)',outline:'none'}}
    onFocus={e=>{e.target.style.borderColor='var(--warm)';e.target.style.background='var(--white)'}}
    onBlur={e=>{e.target.style.borderColor='var(--c3)';e.target.style.background='var(--c0)'}}
  />
}

function Textarea({ value, onChange, placeholder, rows=4 }) {
  return <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{width:'100%',padding:'12px 15px',background:'var(--c0)',border:'1px solid var(--c3)',fontFamily:"'DM Sans',sans-serif",fontSize:'14px',fontWeight:300,color:'var(--text)',outline:'none',resize:'vertical'}}
    onFocus={e=>{e.target.style.borderColor='var(--warm)';e.target.style.background='var(--white)'}}
    onBlur={e=>{e.target.style.borderColor='var(--c3)';e.target.style.background='var(--c0)'}}
  />
}

function Card({ title, children, onDelete }) {
  return (
    <div style={{background:'var(--white)',border:'1px solid var(--c3)',padding:'28px',marginBottom:'16px',transition:'box-shadow .3s'}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 24px rgba(158,115,72,.08)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow=''}
    >
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px',paddingBottom:'14px',borderBottom:'1px solid var(--c3)'}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'18px',fontWeight:400,color:'var(--text)'}}>{title}</span>
        {onDelete && <button onClick={onDelete} title="Supprimer" style={{background:'none',border:'none',cursor:'pointer',color:'var(--text3)',fontSize:'18px',transition:'color .2s'}} onMouseEnter={e=>e.target.style.color='var(--err)'} onMouseLeave={e=>e.target.style.color='var(--text3)'}>🗑</button>}
      </div>
      {children}
    </div>
  )
}

function PanelHeader({ title, sub, onSave, saveLabel='Enregistrer' }) {
  return (
    <div style={{marginBottom:'28px',paddingBottom:'20px',borderBottom:'1px solid var(--c3)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'14px'}}>
      <div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'30px',fontWeight:400,color:'var(--text)'}} dangerouslySetInnerHTML={{__html:title}} />
        {sub && <p style={{fontSize:'13px',color:'var(--text3)',marginTop:'3px'}}>{sub}</p>}
      </div>
      {onSave && <button className="btn-p" onClick={onSave}>{saveLabel}</button>}
    </div>
  )
}

// ══════════════════════════════════════════
function sessionAllowed(session) {
  if (!session?.user?.email) return false
  if (!ADMIN_EMAIL_ALLOW) return true
  return session.user.email.toLowerCase() === ADMIN_EMAIL_ALLOW
}

export default function Admin() {
  const [auth, setAuth] = useState(() => (supabase ? null : false))
  const [loginEmail, setLoginEmail] = useState(() => ADMIN_EMAIL_ALLOW || '')
  const [pwd, setPwd] = useState('')
  const [loginErr, setLoginErr] = useState(false)
  const [loginErrMsg, setLoginErrMsg] = useState('')
  const [loginBusy, setLoginBusy] = useState(false)
  const [panel, setPanel] = useState('tarifs')
  const [toast, setToast] = useState(''); const [toastShow, setToastShow] = useState(false)

  // Data states
  const [infos, setInfos] = useState(getData('infos'))
  const [tarifs, setTarifs] = useState(getData('tarifs'))
  const [avis, setAvis] = useState(getData('avis'))
  const [galerie, setGalerie] = useState(getData('galerie') || [])
  const [approche, setApproche] = useState(getData('approche'))
  const [contact, setContact] = useState(getData('contact'))
  const [mdpOld,setMdpOld]=useState(''); const [mdpNew,setMdpNew]=useState(''); const [mdpCf,setMdpCf]=useState(''); const [mdpMsg,setMdpMsg]=useState(null)
  const [syncingRemote, setSyncingRemote] = useState(false)

  const showToast = (msg) => { setToast(msg); setToastShow(true); setTimeout(()=>setToastShow(false), 3000) }

  // À la connexion : charger avis + galerie depuis Supabase (même liste sur tous les PC)
  useEffect(() => {
    if (auth !== true) return
    let cancelled = false
    setSyncingRemote(true)
    ;(async () => {
      try {
        const [r1, r2, r3] = await Promise.allSettled([getAvis(), getGalerie(), getSiteContent('approche')])
        if (cancelled) return
        if (r1.status === 'fulfilled' && Array.isArray(r1.value)) {
          setAvis(r1.value)
          setData('avis', r1.value)
        } else if (r1.status === 'rejected') console.warn('Admin: avis Supabase', r1.reason)
        if (r2.status === 'fulfilled' && Array.isArray(r2.value)) {
          setGalerie(r2.value)
          setData('galerie', r2.value)
        } else if (r2.status === 'rejected') console.warn('Admin: galerie Supabase', r2.reason)
        if (r3.status === 'fulfilled' && r3.value != null && typeof r3.value === 'object') {
          const merged = mergeApprocheData(r3.value)
          setApproche(merged)
          setData('approche', merged)
        } else if (r3.status === 'rejected') console.warn('Admin: site_content approche', r3.reason)
      } catch (e) {
        console.warn('Admin: chargement distant', e)
      } finally {
        if (!cancelled) setSyncingRemote(false)
      }
    })()
    return () => { cancelled = true }
  }, [auth])

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    const applySession = async (session) => {
      if (!session) {
        if (!cancelled) setAuth(false)
        return
      }
      if (!sessionAllowed(session)) {
        await supabase.auth.signOut()
        if (!cancelled) setAuth(false)
        return
      }
      if (!cancelled) setAuth(true)
    }
    supabase.auth.getSession().then(({ data: { session } }) => applySession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session)
    })
    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const doLogin = async () => {
    if (!supabase) {
      setLoginErr(true)
      setLoginErrMsg('Supabase n’est pas configuré (variables VITE_SUPABASE_URL / VITE_SUPABASE_KEY).')
      return
    }
    const email = loginEmail.trim()
    setLoginErr(false)
    setLoginErrMsg('')
    if (!email || !pwd) {
      setLoginErr(true)
      setLoginErrMsg('Renseignez l’email et le mot de passe.')
      return
    }
    setLoginBusy(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd })
      if (error) throw error
      if (!sessionAllowed({ user: data.user })) {
        await supabase.auth.signOut()
        setLoginErr(true)
        setLoginErrMsg('Ce compte n’est pas autorisé à accéder à l’administration.')
        setPwd('')
        return
      }
      setPwd('')
    } catch (e) {
      setLoginErr(true)
      setLoginErrMsg(e?.message || 'Connexion impossible.')
      setPwd('')
    } finally {
      setLoginBusy(false)
    }
  }
  const doLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    setAuth(false)
  }

  const save = (key, data, label) => { setData(key, data); showToast(`${label} sauvegardé${label.endsWith('s')?'s':''} ✓`) }

  // ── Sauvegarde avis vers Supabase ──
  const saveAvisSupabase = async () => {
    if (!supabase) {
      showToast('Supabase non configuré.')
      return
    }
    try {
      const { error: delError } = await supabase.from('avis').delete().neq('id', 0)
      if (delError) throw delError
      const avisToInsert = avis.map(({ id, ...rest }) => rest)
      const { error: insError } = await supabase.from('avis').insert(avisToInsert)
      if (insError) throw insError

      // Nettoyage des anciennes photos restées dans Storage
      try {
        await cleanupOrphanAvisPhotos(avisToInsert.map(a => a.photo_url).filter(Boolean))
      } catch (e) {
        // non bloquant: les avis doivent être sauvegardés même si le nettoyage échoue
        console.warn('Nettoyage photos avis (Storage) échoué:', e)
      }

      setData('avis', avis)
      showToast('Avis sauvegardés dans Supabase ✓')
    } catch (err) {
      console.error('Supabase erreur:', err)
      showToast(formatSupabaseError(err))
    }
  }

  const saveApprocheSupabase = async () => {
    try {
      await upsertSiteContent('approche', approche)
      setData('approche', approche)
      showToast('Page Mon approche enregistrée dans Supabase ✓')
    } catch (err) {
      console.error(err)
      showToast(formatSupabaseError(err))
    }
  }

  const saveGalerieSupabase = async () => {
    if (!supabase) {
      showToast('Supabase non configuré.')
      return
    }
    try {
      const { error: delError } = await supabase.from('galerie').delete().neq('id', 0)
      if (delError) throw delError

      const rows = galerie.map(({ id, titre, texte, photo_url, visible }) => ({
        id,
        titre,
        texte,
        photo_url,
        visible,
      }))

      if (rows.length > 0) {
        const { error: insError } = await supabase.from('galerie').insert(rows)
        if (insError) throw insError
      }

      setData('galerie', galerie)
      showToast('Galerie sauvegardée dans Supabase ✓')
    } catch (err) {
      console.error('Supabase erreur (galerie):', err)
      showToast(formatSupabaseError(err))
    }
  }

  const saveAll = () => {
    setData('infos', infos)
    setData('tarifs', tarifs)
    setData('galerie', galerie)
    setData('approche', approche)
    setData('contact', contact)
    void saveAvisSupabase()
    void saveGalerieSupabase()
    void saveApprocheSupabase()
  }

  const changePwd = async () => {
    setMdpMsg(null)
    if (!supabase) {
      setMdpMsg({ ok: false, txt: 'Supabase non configuré.' })
      return
    }
    if (mdpNew.length < 6) { setMdpMsg({ ok: false, txt: 'Au moins 6 caractères requis.' }); return }
    if (mdpNew !== mdpCf) { setMdpMsg({ ok: false, txt: 'Les mots de passe ne correspondent pas.' }); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) { setMdpMsg({ ok: false, txt: 'Session invalide.' }); return }
    const { error: signErr } = await supabase.auth.signInWithPassword({ email: user.email, password: mdpOld })
    if (signErr) { setMdpMsg({ ok: false, txt: 'Mot de passe actuel incorrect.' }); return }
    const { error: upErr } = await supabase.auth.updateUser({ password: mdpNew })
    if (upErr) { setMdpMsg({ ok: false, txt: upErr.message || 'Échec de la mise à jour.' }); return }
    setMdpMsg({ ok: true, txt: '✓ Mot de passe changé !' })
    setMdpOld('')
    setMdpNew('')
    setMdpCf('')
  }

  // ── Tarifs helpers ──
  const updTarif = (id,k,v) => setTarifs(ts=>ts.map(t=>t.id===id?{...t,[k]:v}:t))
  const delTarif = id => { if(window.confirm('Supprimer ce service ?')) setTarifs(ts=>ts.filter(t=>t.id!==id)) }
  const addTarif = () => setTarifs(ts=>[...ts,{id:Date.now(),nom:'Nouveau service',en_ligne:'',domicile:'',desc:'Description.',visible:true}])

  // ── Avis helpers ──
  const updAvis = (id,k,v) => setAvis(as=>as.map(a=>a.id===id?{...a,[k]:v}:a))
  const delAvis = id => { if(window.confirm('Supprimer cet avis ?')) setAvis(as=>as.filter(a=>a.id!==id)) }
  const addAvis = () => setAvis(as=>[...as,{id:Date.now(),nom:'Prénom N.',ville:'Ville',note:5,texte:'Témoignage client…',visible:true}])

  // ── Approche sections ──
  const updSection = (id,k,v) => setApproche(a=>({...a,sections:a.sections.map(s=>s.id===id?{...s,[k]:v}:s)}))
  const addSection = () => setApproche(a=>({...a,sections:[...a.sections,{id:Date.now(),titre:'Nouvelle section',texte:'Contenu de la section.'}]}))
  const delSection = id => { if(window.confirm('Supprimer cette section ?')) setApproche(a=>({...a,sections:a.sections.filter(s=>s.id!==id)})) }

  // ── Galerie helpers ──
  const updGal = (id,k,v) => setGalerie(gs=>gs.map(g=>g.id===id?{...g,[k]:v}:g))
  const delGal = id => { if(window.confirm('Supprimer cette photo ?')) setGalerie(gs=>gs.filter(g=>g.id!==id)) }
  const addGal = () => setGalerie(gs=>[...gs,{id:Date.now(),titre:'Titre',texte:'Description…',photo_url:'',visible:true}])

  // ── Photo upload (Mon Approche → Supabase Storage) ──
  const handlePhoto = async (e) => {
    const file = e.target.files[0]; if(!file) return
    try {
      // si une ancienne photo Supabase existe, on la supprime
      if (approche?.photo && typeof approche.photo === 'string' && approche.photo.includes('/object/public/')) {
        try { await deleteCoachingPhotoByUrl(approche.photo) } catch { /* non bloquant */ }
      }
      const path = `coaching-${Date.now()}-${file.name}`
      const up = await uploadCoachingPhoto(file, path)
      const url = getCoachingPhotoUrl(up.path, up.bucket)
      setApproche((a) => ({ ...a, photo: url }))
      showToast('Photo uploadée ✓')
    } catch (err) {
      console.error(err)
      showToast(formatSupabaseError(err))
    }
  }

  // LOGIN / chargement session
  if (auth === null) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#f5f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '14px', color: 'var(--text3)' }}>Chargement…</p>
      </div>
    )
  }
  if (!auth) {
    return (
      <div style={{position:'fixed',inset:0,zIndex:9999,background:'#f5f0ea',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:'var(--white)',border:'1px solid var(--c3)',padding:'52px 48px',width:'420px',maxWidth:'92vw',boxShadow:'0 24px 80px rgba(158,115,72,.12)',textAlign:'center'}}>
          <img src={logo} alt="" style={{width:'80px',height:'80px',objectFit:'contain',margin:'0 auto 24px',display:'block',filter:'drop-shadow(0 8px 20px rgba(158,115,72,.25))'}}/>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'28px',fontWeight:400,marginBottom:'6px',color:'var(--text)'}}>Welfare <em style={{fontStyle:'italic',color:'var(--warm)'}}>Coach</em></div>
          <p style={{fontSize:'13px',color:'var(--text3)',marginBottom:'32px'}}>Espace administration — connexion Supabase</p>
          {!supabaseConfigured && (
            <div style={{background:'var(--err-pale)',border:'1px solid rgba(192,57,43,.2)',color:'var(--err)',padding:'14px 16px',fontSize:'13px',marginBottom:'20px',textAlign:'left',lineHeight:1.6}}>
              <strong>Configuration manquante.</strong> Définissez <code style={{fontSize:'11px'}}>VITE_SUPABASE_URL</code> et <code style={{fontSize:'11px'}}>VITE_SUPABASE_KEY</code> (fichier <code style={{fontSize:'11px'}}>.env</code> en local, ou Vercel → Settings → Environment Variables), puis redéployez.
            </div>
          )}
          {loginErr && loginErrMsg && (
            <div style={{background:'var(--err-pale)',border:'1px solid rgba(192,57,43,.2)',color:'var(--err)',padding:'10px 14px',fontSize:'13px',marginBottom:'16px',textAlign:'left'}}>{loginErrMsg}</div>
          )}
          <div style={{marginBottom:'14px',textAlign:'left'}}>
            <label style={{display:'block',fontSize:'10.5px',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text3)',marginBottom:'8px',fontWeight:500}}>Email</label>
            <input type="email" placeholder="vous@exemple.fr" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} autoComplete="username"
              style={{width:'100%',padding:'14px 18px',background:'var(--c0)',border:'1px solid var(--c3)',fontFamily:"'DM Sans',sans-serif",fontSize:'14px',color:'var(--text)',outline:'none'}}/>
          </div>
          <div style={{marginBottom:'16px',textAlign:'left'}}>
            <label style={{display:'block',fontSize:'10.5px',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text3)',marginBottom:'8px',fontWeight:500}}>Mot de passe</label>
            <input type="password" placeholder="••••••••" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doLogin()} autoComplete="current-password"
              style={{width:'100%',padding:'14px 18px',background:'var(--c0)',border:'1px solid var(--c3)',fontFamily:"'DM Sans',sans-serif",fontSize:'14px',color:'var(--text)',outline:'none'}}/>
          </div>
          <button type="button" disabled={loginBusy} onClick={doLogin} style={{width:'100%',padding:'16px',background:loginBusy?'var(--c3)':'var(--warm)',color:'var(--white)',border:'none',fontFamily:"'DM Sans',sans-serif",fontSize:'12px',letterSpacing:'.14em',textTransform:'uppercase',cursor:loginBusy?'wait':'pointer',transition:'background .3s'}}>{loginBusy ? 'Connexion…' : 'Accéder à l\'administration'}</button>
          <p style={{fontSize:'11px',color:'var(--text3)',marginTop:'18px',lineHeight:1.6}}>
            Compte créé dans le tableau Supabase (Authentication). {ADMIN_EMAIL_ALLOW ? <>Seul <strong>{ADMIN_EMAIL_ALLOW}</strong> est autorisé.</> : <>En production, définissez <code style={{fontSize:'10px'}}>VITE_ADMIN_EMAIL</code> pour limiter l’accès.</>}
          </p>
        </div>
      </div>
    )
  }

  const navItems = [
    ['tarifs','💰','Tarifs'],
    ['avis','⭐','Avis clients'],
    ['approche','📝','Mon approche'],
    ['galerie','🖼️','Galerie'],
    ['contact_page','📍','Page contact'],
    ['infos_gen','⚙️','Infos générales'],
    ['mdp','🔒','Mot de passe'],
    ['aide','❓','Aide'],
  ]

  return (
    <div className="adm-wrap">
      <nav className="adm-nav">
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <img src={logo} alt="" style={{width:'38px',height:'38px',objectFit:'contain'}}/>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'17px',fontWeight:500,color:'var(--text)'}}>Welfare <em style={{fontStyle:'italic',color:'var(--warm)'}}>Coach</em> — Admin</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
          <span style={{background:'var(--warm-pale)',border:'1px solid rgba(158,115,72,.2)',color:'var(--warm)',padding:'5px 14px',fontSize:'11px',letterSpacing:'.1em',textTransform:'uppercase'}}>Administration</span>
          {syncingRemote && <span style={{fontSize:'12px',color:'var(--text3)'}}>Synchronisation Supabase…</span>}
          <button className="btn-sg" onClick={saveAll}>💾 Tout sauvegarder</button>
          <button className="btn-lo" onClick={doLogout}>Déconnexion</button>
        </div>
      </nav>

      <div className="adm-body">
        <aside className="adm-sidebar">
          <div className="sb-lbl">Contenu du site</div>
          {navItems.slice(0,4).map(([id,ico,label])=>(
            <button key={id} className={`sb-btn ${panel===id?'active':''}`} onClick={()=>setPanel(id)}>{ico} {label}</button>
          ))}
          <div className="sb-sep"/>
          <div className="sb-lbl">Paramètres</div>
          {navItems.slice(4).map(([id,ico,label])=>(
            <button key={id} className={`sb-btn ${panel===id?'active':''}`} onClick={()=>setPanel(id)}>{ico} {label}</button>
          ))}
        </aside>

        <main className="adm-content">

          {/* ── TARIFS ── */}
          {panel==='tarifs' && <>
            <PanelHeader title="Mes <em>tarifs</em>" sub="Modifiez vos prix et services" onSave={()=>save('tarifs',tarifs,'Tarifs')} />
            {tarifs.map((t,i) => (
              <Card key={t.id} title={`Service ${i+1}`} onDelete={()=>delTarif(t.id)}>
                <Toggle checked={t.visible} onChange={v=>updTarif(t.id,'visible',v)} />
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px',marginTop:'16px'}}>
                  <Field label="Nom du service"><Input value={t.nom} onChange={v=>updTarif(t.id,'nom',v)} placeholder="Bilan nutritionnel"/></Field>
                  <Field label="Prix en ligne (€)"><Input value={t.en_ligne} onChange={v=>updTarif(t.id,'en_ligne',v)} placeholder="50"/></Field>
                  <Field label="Prix à domicile (€)"><Input value={t.domicile} onChange={v=>updTarif(t.id,'domicile',v)} placeholder="60 ou Sur devis"/></Field>
                </div>
                <Field label="Description"><Textarea value={t.desc} onChange={v=>updTarif(t.id,'desc',v)} rows={3}/></Field>
              </Card>
            ))}
            <button className="btn-add" onClick={addTarif}>+ Ajouter un service</button>
          </>}

          {/* ── AVIS ── */}
          {panel==='avis' && <>
            <PanelHeader title="Avis <em>clients</em>" sub="Gérez les témoignages affichés sur le site" onSave={saveAvisSupabase} saveLabel="Enregistrer dans Supabase" />
            {avis.map((a,i) => (
              <Card key={a.id} title={`Avis ${i+1}`} onDelete={()=>delAvis(a.id)}>
                <Toggle checked={a.visible} onChange={v=>updAvis(a.id,'visible',v)} />
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginTop:'16px'}}>
                  <Field label="Nom du client"><Input value={a.nom} onChange={v=>updAvis(a.id,'nom',v)} placeholder="Prénom N."/></Field>
                  <Field label="Ville"><Input value={a.ville} onChange={v=>updAvis(a.id,'ville',v)} placeholder="Le Mans"/></Field>
                </div>
                <Field label="Note (cliquez sur les étoiles)"><Stars value={a.note} onChange={v=>updAvis(a.id,'note',v)}/></Field>
                <Field label="Témoignage"><Textarea value={a.texte} onChange={v=>updAvis(a.id,'texte',v)} placeholder="Témoignage du client…" rows={4}/></Field>
                <Field label="📷 Photo du client (optionnel)">
                  {a.photo_url && (
                    <div style={{marginBottom:'10px',display:'flex',alignItems:'center',gap:'12px'}}>
                      <AvisPhotoImg src={a.photo_url} alt="" style={{width:'52px',height:'52px',borderRadius:'50%',objectFit:'cover',border:'2px solid var(--c3)'}}/>
                      <button
                        onClick={async () => {
                          try {
                            await deleteAvisPhotoByUrl(a.photo_url)
                          } catch (e) {
                            console.error(e)
                            showToast("Impossible de supprimer la photo sur Supabase")
                            return
                          }
                          updAvis(a.id,'photo_url','')
                          showToast('Photo supprimée ✓')
                        }}
                        style={{background:'none',border:'none',color:'var(--err)',cursor:'pointer',fontSize:'13px'}}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                  <div style={{border:'2px dashed var(--c3)',padding:'16px',textAlign:'center',cursor:'pointer',position:'relative',transition:'all .3s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--warm)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--c3)'}
                  >
                    <input type="file" accept="image/*" style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}}
                      onChange={async (e) => {
                        const file = e.target.files[0]; if(!file) return
                        try {
                          const path = `avis-${Date.now()}-${file.name}`
                          const up = await uploadPhoto(file, path)
                          updAvis(a.id, 'photo_url', publicUrlAfterAvisUpload(up))
                          showToast('Photo uploadée ✓')
                        } catch(err) {
                          console.error(err)
                          showToast(formatSupabaseError(err))
                        }
                      }}
                    />
                    <p style={{fontSize:'13px',color:'var(--text3)',margin:0}}>📸 Cliquez pour uploader une photo<br/><span style={{fontSize:'11px',opacity:.7}}>JPG, PNG — max 5MB</span></p>
                  </div>
                </Field>
              </Card>
            ))}
            <button className="btn-add" onClick={addAvis}>+ Ajouter un avis</button>
          </>}

          {/* ── GALERIE ── */}
          {panel==='galerie' && <>
            <PanelHeader title="Page <em>Galerie</em>" sub="Ajoutez des photos avec une description" onSave={saveGalerieSupabase} saveLabel="Enregistrer dans Supabase" />
            {galerie.map((g,i) => (
              <Card key={g.id} title={`Photo ${i+1}`} onDelete={()=>delGal(g.id)}>
                <Toggle checked={g.visible} onChange={v=>updGal(g.id,'visible',v)} />
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginTop:'16px'}}>
                  <Field label="Titre"><Input value={g.titre} onChange={v=>updGal(g.id,'titre',v)} placeholder="Avant / Après"/></Field>
                  <Field label="Description"><Input value={g.texte} onChange={v=>updGal(g.id,'texte',v)} placeholder="Une courte description…"/></Field>
                </div>
                <Field label="📷 Photo (optionnel)">
                  {g.photo_url && (
                    <div style={{marginBottom:'10px',display:'flex',alignItems:'center',gap:'12px'}}>
                      <CoachingPhotoImg src={g.photo_url} alt="" style={{width:'72px',height:'54px',borderRadius:'10px',objectFit:'cover',border:'2px solid var(--c3)'}}/>
                      <button
                        onClick={async () => {
                          try { await deleteCoachingPhotoByUrl(g.photo_url) } catch (e) { console.error(e) }
                          updGal(g.id,'photo_url','')
                          showToast('Photo supprimée ✓')
                        }}
                        style={{background:'none',border:'none',color:'var(--err)',cursor:'pointer',fontSize:'13px'}}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                  <div style={{border:'2px dashed var(--c3)',padding:'16px',textAlign:'center',cursor:'pointer',position:'relative',transition:'all .3s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--warm)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='var(--c3)'}
                  >
                    <input type="file" accept="image/*" style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}}
                      onChange={async (e) => {
                        const file = e.target.files[0]; if(!file) return
                        try {
                          const path = `galerie-${Date.now()}-${file.name}`
                          const up = await uploadCoachingPhoto(file, path)
                          const url = getCoachingPhotoUrl(up.path, up.bucket)
                          updGal(g.id,'photo_url',url)
                          showToast('Photo uploadée ✓')
                        } catch(err) {
                          console.error(err)
                          showToast(formatSupabaseError(err))
                        }
                      }}
                    />
                    <p style={{fontSize:'13px',color:'var(--text3)',margin:0}}>📸 Cliquez pour uploader une photo<br/><span style={{fontSize:'11px',opacity:.7}}>JPG, PNG — max 5MB</span></p>
                  </div>
                </Field>
              </Card>
            ))}
            <button className="btn-add" onClick={addGal}>+ Ajouter une photo</button>
          </>}

          {/* ── MON APPROCHE ── */}
          {panel==='approche' && <>
            <PanelHeader title="Page <em>Mon Approche</em>" sub="Contenu synchronisé entre PC (Supabase)" onSave={saveApprocheSupabase} saveLabel="Enregistrer dans Supabase" />
            <Card title="Titre & introduction">
              <Field label="Titre de la page"><Input value={approche.titre} onChange={v=>setApproche({...approche,titre:v})}/></Field>
              <Field label="Introduction (sous le titre)"><Textarea value={approche.intro} onChange={v=>setApproche({...approche,intro:v})} rows={4}/></Field>
            </Card>
            <Card title="📷 Photo personnelle">
              {approche.photo && (
                <div style={{marginBottom:'16px',textAlign:'center'}}>
                  <CoachingPhotoImg src={approche.photo} alt="Aperçu" style={{width:'120px',height:'120px',objectFit:'cover',borderRadius:'50%',border:'3px solid var(--c3)'}}/>
                  <button
                    onClick={async () => {
                      try {
                        if (approche?.photo && typeof approche.photo === 'string') {
                          await deleteCoachingPhotoByUrl(approche.photo)
                        }
                      } catch (e) {
                        console.error(e)
                        showToast("Impossible de supprimer la photo sur Supabase")
                        return
                      }
                      setApproche({...approche,photo:''})
                      showToast('Photo supprimée ✓')
                    }}
                    style={{display:'block',margin:'8px auto 0',background:'none',border:'none',color:'var(--err)',cursor:'pointer',fontSize:'13px'}}
                  >
                    Supprimer la photo
                  </button>
                </div>
              )}
              <div style={{border:'2px dashed var(--c3)',padding:'32px',textAlign:'center',cursor:'pointer',position:'relative',transition:'all .3s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='var(--warm)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--c3)'}
              >
                <input type="file" accept="image/*" onChange={handlePhoto} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}}/>
                <p style={{fontSize:'14px',color:'var(--text3)'}}>📸 Cliquez ou glissez une photo ici<br/><span style={{fontSize:'12px',color:'var(--text3)',opacity:.7}}>JPG, PNG — max 5MB</span></p>
              </div>
              <div style={{marginTop:'14px'}}>
                <Field label="Légende de la photo"><Input value={approche.photo_legende} onChange={v=>setApproche({...approche,photo_legende:v})} placeholder="Johanna — Coach Nutrition"/></Field>
              </div>
            </Card>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'28px 0 16px'}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'22px',fontWeight:400,color:'var(--text)'}}>Sections de contenu</h3>
              <button className="btn-add" onClick={addSection}>+ Ajouter une section</button>
            </div>
            {approche.sections && approche.sections.map((s,i) => (
              <Card key={s.id} title={`Section ${i+1}`} onDelete={()=>delSection(s.id)}>
                <Field label="Titre de la section"><Input value={s.titre} onChange={v=>updSection(s.id,'titre',v)}/></Field>
                <Field label="Contenu (utilisez • pour les listes, 1. pour les numérotées)"><Textarea value={s.texte} onChange={v=>updSection(s.id,'texte',v)} rows={8}/></Field>
              </Card>
            ))}
          </>}

          {/* ── CONTACT PAGE ── */}
          {panel==='contact_page' && <>
            <PanelHeader title="Page <em>Contact</em>" sub="Modifiez les textes et coordonnées de la page contact" onSave={()=>{ save('contact',contact,'Page Contact'); save('infos',infos,'Infos') }} />
            <Card title="Textes de la page">
              <Field label="Titre de la page"><Input value={contact.titre} onChange={v=>setContact({...contact,titre:v})}/></Field>
              <Field label="Introduction"><Textarea value={contact.intro} onChange={v=>setContact({...contact,intro:v})} rows={3}/></Field>
              <Field label="Texte séance découverte"><Textarea value={contact.texte_rdv} onChange={v=>setContact({...contact,texte_rdv:v})} rows={3}/></Field>
            </Card>
            <Card title="Coordonnées affichées">
              <Field label="Adresse"><Input value={contact.adresse} onChange={v=>setContact({...contact,adresse:v})}/></Field>
              <Field label="Zone d'intervention"><Input value={contact.zone} onChange={v=>setContact({...contact,zone:v})}/></Field>
              <Field label="Horaires"><Input value={contact.horaires} onChange={v=>setContact({...contact,horaires:v})}/></Field>
              <Field label="Téléphone"><Input value={infos.tel} onChange={v=>setInfos({...infos,tel:v})}/></Field>
              <Field label="Email"><Input value={infos.email} onChange={v=>setInfos({...infos,email:v})} type="email"/></Field>
            </Card>
          </>}

          {/* ── INFOS GÉNÉRALES ── */}
          {panel==='infos_gen' && <>
            <PanelHeader title="Infos <em>générales</em>" sub="Nom, titre, coordonnées affichés partout sur le site" onSave={()=>save('infos',infos,'Infos générales')} />
            <Card title="Identité">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                <Field label="Nom complet"><Input value={infos.nom} onChange={v=>setInfos({...infos,nom:v})}/></Field>
                <Field label="Titre / métier"><Input value={infos.titre} onChange={v=>setInfos({...infos,titre:v})}/></Field>
                <Field label="Ville / localisation"><Input value={infos.ville} onChange={v=>setInfos({...infos,ville:v})}/></Field>
                <Field label="SIRET"><Input value={infos.siret} onChange={v=>setInfos({...infos,siret:v})}/></Field>
              </div>
            </Card>
            <Card title="Coordonnées">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                <Field label="Téléphone"><Input value={infos.tel} onChange={v=>setInfos({...infos,tel:v})}/></Field>
                <Field label="Email"><Input value={infos.email} onChange={v=>setInfos({...infos,email:v})} type="email"/></Field>
                <Field label="Instagram (URL)"><Input value={infos.instagram} onChange={v=>setInfos({...infos,instagram:v})}/></Field>
              </div>
            </Card>
          </>}

          {/* ── MOT DE PASSE ── */}
          {panel==='mdp' && <>
            <PanelHeader title="Mot de <em>passe</em>" sub="Modifiez votre accès à l'administration" />
            <Card title="Changer le mot de passe" style={{maxWidth:'460px'}}>
              {mdpMsg && <div style={{padding:'10px 14px',fontSize:'13px',marginBottom:'14px',background:mdpMsg.ok?'var(--ok-pale)':'var(--err-pale)',border:`1px solid ${mdpMsg.ok?'rgba(39,116,90,.2)':'rgba(192,57,43,.2)'}`,color:mdpMsg.ok?'var(--ok)':'var(--err)'}}>{mdpMsg.txt}</div>}
              <Field label="Mot de passe actuel"><Input type="password" value={mdpOld} onChange={setMdpOld} placeholder="••••••••"/></Field>
              <Field label="Nouveau mot de passe"><Input type="password" value={mdpNew} onChange={setMdpNew} placeholder="••••••••"/></Field>
              <Field label="Confirmer"><Input type="password" value={mdpCf} onChange={setMdpCf} placeholder="••••••••"/></Field>
              <button className="btn-p" onClick={changePwd}>Changer le mot de passe</button>
            </Card>
          </>}

          {/* ── AIDE ── */}
          {panel==='aide' && <>
            <PanelHeader title="<em>Guide</em> d'utilisation" />
            {[
              ['💰 Modifier les tarifs', 'Cliquez sur Tarifs dans le menu. Modifiez le nom, le prix en ligne, le prix à domicile et la description. Activez/désactivez la visibilité. Cliquez Enregistrer.'],
              ['⭐ Gérer les avis clients', 'Cliquez sur Avis clients. Ajoutez un avis avec le bouton +, modifiez nom, ville, note (étoiles) et texte. Masquez un avis sans le supprimer via le toggle.'],
              ['📝 Page Mon Approche', 'Modifiez le titre, l\'intro, ajoutez votre photo (elle s\'affichera en rond), et gérez les sections de texte. Utilisez • pour les listes à puces, 1. pour les listes numérotées.'],
              ['📍 Page Contact', 'Modifiez les textes de présentation, l\'adresse, la zone d\'intervention, les horaires et les coordonnées de contact directement depuis cette section.'],
              ['⚙️ Infos générales', 'Votre nom, titre, téléphone, email et Instagram sont utilisés dans toute la navigation, le footer et les pages de contact. Modifiez-les ici.'],
              ['💾 Sauvegarde', 'Chaque section a son propre bouton Enregistrer. Ou utilisez Tout sauvegarder en haut à droite pour enregistrer toutes les modifications en une fois.'],
              ['🔒 Sécurité', 'L’accès se fait avec un compte Supabase Auth (email / mot de passe). Changez le mot de passe ici ou dans le tableau Supabase. La session est gérée par Supabase (pas le mot de passe personnalisé dans le stockage du site).'],
            ].map(([t,d]) => (
              <Card key={t} title={t}><p style={{fontSize:'14px',color:'var(--text2)',lineHeight:'1.85',fontWeight:300}}>{d}</p></Card>
            ))}
          </>}

        </main>
      </div>
      <Toast msg={toast} show={toastShow} />
    </div>
  )
}