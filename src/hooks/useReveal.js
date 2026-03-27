import { useEffect, useRef } from 'react'

export function useReveal(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => {
      el.classList.add('in')
    }

    // Accessibilité : pas d’attente sur l’animation
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        show()
        return
      }
    } catch {
      /* ignore */
    }

    el.style.transitionDelay = `${delay}ms`

    // Si IntersectionObserver ne se déclenche pas (navigateur, extension, viewport),
    // le contenu restait en opacity:0 → « page blanche » au milieu du site.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          show()
          io.unobserve(el)
        }
      },
      { threshold: 0.01, rootMargin: '0px' }
    )
    io.observe(el)

    const fallback = window.setTimeout(() => {
      if (!el.classList.contains('in')) show()
    }, 2800)

    return () => {
      clearTimeout(fallback)
      io.disconnect()
    }
  }, [delay])
  return ref
}

export function useTilt() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - .5
      const y = (e.clientY - r.top) / r.height - .5
      el.style.transform = `perspective(900px) rotateY(${x*5}deg) rotateX(${-y*4}deg) translateZ(6px)`
      el.style.boxShadow = `${-x*16}px ${-y*12}px 48px rgba(158,115,72,.12)`
    }
    const leave = () => { el.style.transform = ''; el.style.boxShadow = '' }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [])
  return ref
}

export function useCountUp(target, suffix = '') {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || el._done) return
      el._done = true
      const dur = 1800; let start = null
      const step = (ts) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / dur, 1)
        el.textContent = Math.floor((1 - Math.pow(1 - p, 4)) * target) + suffix
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, suffix])
  return ref
}
