import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase env manquantes. Définis VITE_SUPABASE_URL et VITE_SUPABASE_KEY (ex: sur Vercel → Project Settings → Environment Variables).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// ---- AVIS ----
export const getAvis = async () => {
  const { data, error } = await supabase
    .from('avis')  // ✅ nom correct
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const addAvis = async (avis) => {
  const { data, error } = await supabase
    .from('avis')
    .insert([avis])
  if (error) throw error
  return data
}

export const deleteAvis = async (id) => {
  const { error } = await supabase
    .from('avis')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ---- ADMIN ----
export const getAdmin = async (email) => {
  const { data, error } = await supabase
    .from('utilisateurs_administrateur')  // ✅ nom corrigé
    .select('*')
    .eq('email', email)
    .single()
  if (error) throw error
  return data
}

export const updateAdminPassword = async (email, newHash) => {
  const { error } = await supabase
    .from('utilisateurs_administrateur')  // ✅ nom corrigé
    .update({ password_hash: newHash, password_changed: true })
    .eq('email', email)
  if (error) throw error
}

// ---- PHOTOS ----
export const uploadPhoto = async (file, path) => {
  const { data, error } = await supabase
    .storage
    .from('avis - photos')
    .upload(path, file)
  if (error) throw error
  return data
}

export const getPhotoUrl = (path) => {
  const { data } = supabase
    .storage
    .from('avis - photos')
    .getPublicUrl(path)
  return data.publicUrl
}

const AVIS_BUCKET = 'avis - photos'

const extractBucketPathFromPublicUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  const marker = `/object/public/${encodeURIComponent(AVIS_BUCKET)}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  const raw = url.slice(idx + marker.length)
  // URLs can include query params, strip them
  return raw.split('?')[0] || null
}

export const deleteAvisPhotoByUrl = async (publicUrl) => {
  const path = extractBucketPathFromPublicUrl(publicUrl)
  if (!path) return { skipped: true, reason: 'unparseable_url' }
  const { data, error } = await supabase.storage.from(AVIS_BUCKET).remove([path])
  if (error) throw error
  return { skipped: false, data, path }
}

export const cleanupOrphanAvisPhotos = async (keptPublicUrls) => {
  const keep = new Set(
    (keptPublicUrls || [])
      .map(extractBucketPathFromPublicUrl)
      .filter(Boolean)
  )

  // list root files only (current app uploads at bucket root)
  const { data: files, error: listError } = await supabase.storage.from(AVIS_BUCKET).list('', {
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' },
  })
  if (listError) throw listError

  const toDelete = (files || [])
    .map(f => f?.name)
    .filter(name => name && !keep.has(name))

  if (toDelete.length === 0) return { deleted: 0 }
  const { error: delError } = await supabase.storage.from(AVIS_BUCKET).remove(toDelete)
  if (delError) throw delError
  return { deleted: toDelete.length }
}

// ---- COACHING / APPROCHE PHOTOS ----
const COACHING_BUCKET = 'coching - photos'

const extractCoachingBucketPathFromPublicUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  const marker = `/object/public/${encodeURIComponent(COACHING_BUCKET)}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  const raw = url.slice(idx + marker.length)
  return raw.split('?')[0] || null
}

export const uploadCoachingPhoto = async (file, path) => {
  const { data, error } = await supabase.storage.from(COACHING_BUCKET).upload(path, file)
  if (error) throw error
  return data
}

export const getCoachingPhotoUrl = (path) => {
  const { data } = supabase.storage.from(COACHING_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export const deleteCoachingPhotoByUrl = async (publicUrl) => {
  const path = extractCoachingBucketPathFromPublicUrl(publicUrl)
  if (!path) return { skipped: true, reason: 'unparseable_url' }
  const { data, error } = await supabase.storage.from(COACHING_BUCKET).remove([path])
  if (error) throw error
  return { skipped: false, data, path }
}