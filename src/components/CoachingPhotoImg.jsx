import React, { useEffect, useState } from 'react'
import { COACHING_BUCKETS, getCoachingPhotoUrl } from '../supabaseClient'

/**
 * Affiche une image coaching/galerie (URL complète ou path seul).
 * Si seul le path est stocké, essaie chaque bucket jusqu’à ce que l’image charge.
 */
export default function CoachingPhotoImg({ src, alt = '', className, style }) {
  const [idx, setIdx] = useState(0)
  const v = (src || '').trim()

  useEffect(() => {
    setIdx(0)
  }, [v])

  if (!v) return null

  const isDirect =
    /^https?:\/\//i.test(v) || v.startsWith('data:') || v.startsWith('blob:')
  const bucket = COACHING_BUCKETS[idx]
  const url = isDirect ? v : bucket ? getCoachingPhotoUrl(v, bucket) : ''

  if (!isDirect && !url) return null

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (!isDirect && idx < COACHING_BUCKETS.length - 1) setIdx((i) => i + 1)
      }}
    />
  )
}
