'use client'

import { useEffect, useState } from 'react'
import { WhatsAppIcon } from '@/components/icons'
import { orderLink } from '@/lib/menu'
import { cn } from '@/lib/utils'

export function FloatingOrder({ hidden = false }: { hidden?: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const show = visible && !hidden

  return (
    <a
      href={orderLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={cn(
        'fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-lime-fresh px-5 py-4 text-sm font-bold text-primary shadow-2xl shadow-primary/30 transition-all duration-500 ease-out md:hidden',
        show
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-6 scale-90 opacity-0',
      )}
    >
      <WhatsAppIcon className="size-5" />
      Pedir
    </a>
  )
}
