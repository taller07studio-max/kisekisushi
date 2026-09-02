'use client'

import { useEffect, useRef } from 'react'

export default function RevealOnScroll({
  children,
}: {
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const reveals = container.querySelectorAll<HTMLElement>('.reveal')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveals.forEach((el) => el.classList.add('is-visible'))
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref}>{children}</div>
}
