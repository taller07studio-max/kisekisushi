'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ShrimpMark, WhatsAppIcon } from '@/components/icons'
import { orderLink } from '@/lib/menu'
import { cn } from '@/lib/utils'

const links = [
  { href: '#destacados', label: 'Destacados' },
  { href: '#menu', label: 'Menú' },
  { href: '#casa', label: 'La casa' },
  { href: '#contacto', label: 'Contacto' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'transition-all duration-500 ease-out',
          scrolled
            ? 'border-b border-border/60 bg-background/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8"
        >
          <a
            href="#top"
            className={cn(
              'flex items-center gap-2.5 transition-colors duration-500',
              scrolled ? 'text-foreground' : 'text-primary-foreground',
            )}
          >
            <ShrimpMark className="size-7 shrink-0 md:size-8" />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[17px] font-semibold tracking-tight md:text-lg">
                El Imposible
              </span>
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.22em] opacity-70">
                Mariscos
              </span>
            </span>
          </a>

          <ul
            className={cn(
              'hidden items-center gap-8 text-sm font-medium transition-colors duration-500 md:flex',
              scrolled ? 'text-foreground/70' : 'text-primary-foreground/80',
            )}
          >
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    'transition-colors duration-200',
                    scrolled
                      ? 'hover:text-accent'
                      : 'hover:text-primary-foreground',
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={orderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] md:inline-flex',
                scrolled
                  ? 'bg-primary text-primary-foreground hover:bg-accent'
                  : 'bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <WhatsAppIcon className="size-4" />
              Pedir ahora
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={open}
              className={cn(
                'inline-flex size-10 items-center justify-center rounded-full border transition-colors duration-500 md:hidden',
                scrolled
                  ? 'border-border bg-card text-foreground'
                  : 'border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md',
              )}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className={cn(
            'absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-400',
            open ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className={cn(
            'absolute inset-x-3 top-3 rounded-[28px] bg-background p-6 shadow-2xl transition-all duration-400 ease-out',
            open
              ? 'translate-y-0 opacity-100'
              : '-translate-y-6 scale-95 opacity-0',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-foreground">
              <ShrimpMark className="size-7" />
              <span className="font-serif text-lg font-semibold">
                El Imposible
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-muted"
            >
              <X className="size-5" />
            </button>
          </div>

          <ul className="mt-7 flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3.5 font-serif text-2xl font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={orderLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-accent-foreground shadow-lg transition-transform active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-4" />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
