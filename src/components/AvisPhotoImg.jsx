import React, { useEffect, useMemo, useState } from 'react'
import { AVIS_BUCKETS, getAvisPhotoUrl, parseAvisStoragePublicUrl } from '../supabaseClient'

/**
 * Photos avis (URL complète ou path seul). Essaie chaque bucket comme CoachingPhotoImg / galerie.
 */
export default function AvisPhotoImg({ src, alt = '', className, style }) {
  const [idx, setIdx] = useState(0)
  const v = (src || '').trim()

  const urls = useMemo(() => {
    if (!v) return []
    const isHttp = /^https?:\/\//i.test(v)
    if (!isHttp) {
      return AVIS_BUCKETS.map((b) => getAvisPhotoUrl(v, b)).filter(Boolean)
    }
    const parsed = parseAvisStoragePublicUrl(v)
    const list = [v]
    if (parsed?.path) {
      const seen = new Set([v])
      for (const b of AVIS_BUCKETS) {
        const u = getAvisPhotoUrl(parsed.path, b)
        if (u && !seen.has(u)) {
          seen.add(u)
          list.push(u)
        }
      }
    }
    return list
  }, [v])

  useEffect(() => {
    setIdx(0)
  }, [v])

  if (!v || urls.length === 0) return null

  const url = urls[Math.min(idx, urls.length - 1)]

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (idx < urls.length - 1) setIdx((i) => i + 1)
      }}
    />
  )
}
