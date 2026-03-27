import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY?.trim()

/** Si false, le site public peut quand même s’afficher (données locales / fallbacks). */
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null

const parseCsv = (v) =>
  String(v || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

// ---- AVIS ----
export const getAvis = async () => {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('avis')  // ✅ nom correct
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const addAvis = async (avis) => {
  if (!supabase) throw new Error('Supabase non configuré.')
  const { data, error } = await supabase
    .from('avis')
    .insert([avis])
  if (error) throw error
  return data
}

export const deleteAvis = async (id) => {
  if (!supabase) throw new Error('Supabase non configuré.')
  const { error } = await supabase
    .from('avis')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ---- ADMIN ----
export const getAdmin = async (email) => {
  if (!supabase) throw new Error('Supabase non configuré.')
  const { data, error } = await supabase
    .from('utilisateurs_administrateur')  // ✅ nom corrigé
    .select('*')
    .eq('email', email)
    .single()
  if (error) throw error
  return data
}

export const updateAdminPassword = async (email, newHash) => {
  if (!supabase) throw new Error('Supabase non configuré.')
  const { error } = await supabase
    .from('utilisateurs_administrateur')  // ✅ nom corrigé
    .update({ password_hash: newHash, password_changed: true })
    .eq('email', email)
  if (error) throw error
}

// ---- PHOTOS ----
// Ordre important : le 1er bucket est utilisé pour les chemins seuls (sans URL complète).
// En prod le bucket Supabase est souvent « avis - photos » (avec espaces), pas « avis-photos ».
const DEFAULT_AVIS_BUCKETS = ['avis - photos', 'avis-photos']
export const AVIS_BUCKETS = parseCsv(import.meta.env.VITE_AVIS_BUCKETS)
  .concat(DEFAULT_AVIS_BUCKETS)
  .filter((v, i, arr) => arr.indexOf(v) === i)

export const uploadPhoto = async (file, path, { upsert = true } = {}) => {
  if (!supabase) throw new Error('Supabase non configuré.')
  let lastErr = null
  for (const bucket of AVIS_BUCKETS) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert })
    if (!error) return { ...data, bucket, path }
    lastErr = error
  }
  throw lastErr || new Error('Upload photo: aucun bucket valide.')
}

/** URL publique correcte après upload (utilise le bucket réellement utilisé). */
export const publicUrlAfterAvisUpload = ({ bucket, path }) => {
  if (!supabase) return ''
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const getPhotoUrl = (path) => {
  if (!supabase) return ''
  const bucket = AVIS_BUCKETS[0]
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const resolveAvisPhotoSrc = (photoUrlOrPath) => {
  if (!photoUrlOrPath || typeof photoUrlOrPath !== 'string') return ''
  const v = photoUrlOrPath.trim()
  if (!v) return ''
  if (/^https?:\/\//i.test(v) || v.startsWith('data:') || v.startsWith('blob:')) return v
  return getPhotoUrl(v)
}

/** Parse une URL publique Storage avis → { bucket, path } (quel que soit le nom du bucket). */
export const parseAvisStoragePublicUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  for (const bucket of AVIS_BUCKETS) {
    const marker = `/object/public/${encodeURIComponent(bucket)}/`
    const idx = url.indexOf(marker)
    if (idx !== -1) {
      const path = url.slice(idx + marker.length).split('?')[0] || null
      if (path) return { bucket, path }
    }
  }
  return null
}

export const deleteAvisPhotoByUrl = async (publicUrl) => {
  if (!supabase) return { skipped: true, reason: 'no_supabase' }
  if (!publicUrl || typeof publicUrl !== 'string') return { skipped: true, reason: 'empty' }
  const v = publicUrl.trim()

  // si on reçoit directement un path (nouveau format), on supprime sur tous les buckets possibles
  if (!/^https?:\/\//i.test(v)) {
    let lastErr = null
    for (const bucket of AVIS_BUCKETS) {
      const { data, error } = await supabase.storage.from(bucket).remove([v])
      if (!error) return { skipped: false, data, path: v, bucket }
      lastErr = error
    }
    throw lastErr || new Error('Suppression photo: aucun bucket valide.')
  }

  const parsed = parseAvisStoragePublicUrl(v)
  if (!parsed) return { skipped: true, reason: 'unparseable_url' }
  const { data, error } = await supabase.storage.from(parsed.bucket).remove([parsed.path])
  if (error) throw error
  return { skipped: false, data, path: parsed.path, bucket: parsed.bucket }
}

export const cleanupOrphanAvisPhotos = async (keptPublicUrls) => {
  if (!supabase) return { deleted: 0 }
  const keep = new Set(
    (keptPublicUrls || [])
      .map((u) => {
        if (typeof u !== 'string' || !u.trim()) return null
        if (/^https?:\/\//i.test(u)) {
          const p = parseAvisStoragePublicUrl(u)
          return p?.path || null
        }
        return u.trim()
      })
      .filter(Boolean)
  )

  let deleted = 0
  for (const bucket of AVIS_BUCKETS) {
    const { data: files, error: listError } = await supabase.storage.from(bucket).list('', {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' },
    })
    if (listError) continue // non bloquant: certains buckets peuvent ne pas exister

    const toDelete = (files || [])
      .map((f) => f?.name)
      .filter((name) => name && !keep.has(name))

    if (toDelete.length === 0) continue
    const { error: delError } = await supabase.storage.from(bucket).remove(toDelete)
    if (!delError) deleted += toDelete.length
  }
  return { deleted }
}

// ---- COACHING / APPROCHE PHOTOS ----
// Inclut « coaching - photos » et « coching - photos » : noms distincts côté Supabase.
const DEFAULT_COACHING_BUCKETS = ['coching - photos', 'coaching - photos', 'coaching-photos']
export const COACHING_BUCKETS = parseCsv(import.meta.env.VITE_COACHING_BUCKETS)
  .concat(DEFAULT_COACHING_BUCKETS)
  .filter((v, i, arr) => arr.indexOf(v) === i)

const COACHING_BUCKET = COACHING_BUCKETS[0]

const parseCoachingStoragePublicUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  for (const bucket of COACHING_BUCKETS) {
    const marker = `/object/public/${encodeURIComponent(bucket)}/`
    const idx = url.indexOf(marker)
    if (idx !== -1) {
      const path = url.slice(idx + marker.length).split('?')[0] || null
      if (path) return { bucket, path }
    }
  }
  return null
}

export const uploadCoachingPhoto = async (file, path) => {
  if (!supabase) throw new Error('Supabase non configuré.')
  let lastErr = null
  for (const bucket of COACHING_BUCKETS) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (!error) return { ...data, bucket, path }
    lastErr = error
  }
  throw lastErr || new Error('Upload photo coaching: aucun bucket valide.')
}

export const getCoachingPhotoUrl = (path, bucket = COACHING_BUCKET) => {
  if (!supabase) return ''
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const resolveCoachingPhotoSrc = (photoUrlOrPath) => {
  if (!photoUrlOrPath || typeof photoUrlOrPath !== 'string') return ''
  const v = photoUrlOrPath.trim()
  if (!v) return ''
  if (/^https?:\/\//i.test(v) || v.startsWith('data:') || v.startsWith('blob:')) return v
  if (!supabase) return ''
  const { data } = supabase.storage.from(COACHING_BUCKET).getPublicUrl(v)
  return data.publicUrl
}

export const deleteCoachingPhotoByUrl = async (publicUrl) => {
  if (!supabase) return { skipped: true, reason: 'no_supabase' }
  const parsed = parseCoachingStoragePublicUrl(publicUrl)
  if (!parsed) return { skipped: true, reason: 'unparseable_url' }
  const { data, error } = await supabase.storage.from(parsed.bucket).remove([parsed.path])
  if (error) throw error
  return { skipped: false, data, path: parsed.path, bucket: parsed.bucket }
}

// ---- GALERIE (DB) ----
export const getGalerie = async () => {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('galerie')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const upsertGalerie = async (items) => {
  if (!supabase) throw new Error('Supabase non configuré.')
  const rows = (items || []).map(({ id, ...rest }) => ({
    id,
    ...rest,
  }))
  const { error } = await supabase.from('galerie').upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

export const deleteGalerieRow = async (id) => {
  const { error } = await supabase.from('galerie').delete().eq('id', id)
  if (error) throw error
}

// ---- CONTENU PAGES (JSON) : ex. page « Mon approche » ----
export const getSiteContent = async (id) => {
  if (!supabase) return null
  const { data, error } = await supabase.from('site_content').select('payload').eq('id', id).maybeSingle()
  if (error) throw error
  return data?.payload ?? null
}

export const upsertSiteContent = async (id, payload) => {
  if (!supabase) throw new Error('Supabase non configuré.')
  const { error } = await supabase
    .from('site_content')
    .upsert({ id, payload, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) throw error
}