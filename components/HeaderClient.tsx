'use client'

import { useEffect, useState } from 'react'
import type { Category } from '@/lib/business'

type Props = {
  logoUrl: string | null
  businessName: string
  categories: Category[]
}

export default function HeaderClient({ logoUrl, businessName, categories }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [desktopOpenId, setDesktopOpenId] = useState<string | null>(null)
  const [mobileActiveCatId, setMobileActiveCatId] = useState<string | null>(null)
  const [mobileActiveSubId, setMobileActiveSubId] = useState<string | null>(null)

  const activeCategory = categories.find((c) => c.id === mobileActiveCatId) ?? null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!desktopOpenId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDesktopOpenId(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [desktopOpenId])

  const pushCatalogUrl = (catSlug: string, subSlug?: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('cat', catSlug)
    if (subSlug) url.searchParams.set('sub', subSlug)
    else url.searchParams.delete('sub')
    url.searchParams.delete('product')
    window.history.pushState({}, '', url.toString())
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMobileCatClick = (cat: Category) => {
    const hasSubs = (cat.subcategories?.length ?? 0) > 0
    if (mobileActiveCatId === cat.id) {
      setMobileActiveCatId(null)
      setMobileActiveSubId(null)
    } else {
      setMobileActiveCatId(cat.id)
      setMobileActiveSubId(null)
      if (!hasSubs) pushCatalogUrl(cat.slug)
    }
  }

  // Color tokens: solid background when scrolled, transparent on hero
  const solidBg   = 'oklch(0.10 0.020 255 / 0.97)'
  const textColor  = scrolled ? 'oklch(0.88 0.008 80)' : 'rgba(255,255,255,0.85)'
  const borderColor = scrolled ? 'oklch(1 0 0 / 0.08)' : 'rgba(255,255,255,0.12)'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'background-color 0.5s ease, box-shadow 0.5s ease, backdrop-filter 0.5s ease',
        backgroundColor: scrolled ? solidBg : 'transparent',
        borderBottom: scrolled ? '1px solid oklch(1 0 0 / 0.08)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      }}
    >
      {/* ── Row 1: Logo + Desktop Nav ── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Logo + Branding */}
        <a
          href="#inicio"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none',
            flexShrink: 0,
            maxWidth: '220px',
          }}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt=""
              aria-hidden="true"
              style={{
                height: '40px',
                width: '40px',
                objectFit: 'cover',
                borderRadius: '8px',
                flexShrink: 0,
              }}
            />
          )}
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.125rem',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: '#ffffff',
                transition: 'opacity 0.4s ease',
                lineHeight: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {businessName}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.5625rem',
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                marginTop: '0.2rem',
                lineHeight: 1,
              }}
            >
              Mariscos
            </span>
          </span>
        </a>

        {/* Desktop category nav — hidden on mobile */}
        <nav
          className="hdr-desk-nav"
          aria-label="Categorías"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {categories.map((cat) => {
            const hasSubs = (cat.subcategories?.length ?? 0) > 0
            const isOpen = desktopOpenId === cat.id
            return (
              <div
                key={cat.id}
                style={{ position: 'relative' }}
                onMouseEnter={() => hasSubs && setDesktopOpenId(cat.id)}
                onMouseLeave={() => setDesktopOpenId(null)}
              >
                <button
                  type="button"
                  aria-haspopup={hasSubs ? 'listbox' : undefined}
                  aria-expanded={hasSubs ? isOpen : undefined}
                  onClick={() => {
                    setDesktopOpenId(null)
                    pushCatalogUrl(cat.slug)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0.875rem',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    color: textColor,
                    transition: 'color 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--wood)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = textColor
                  }}
                >
                  {cat.name}
                  {hasSubs && (
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="currentColor"
                      aria-hidden="true"
                      style={{
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        opacity: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      <path d="M4 6L0 2h8z" />
                    </svg>
                  )}
                </button>

                {/* Desktop dropdown */}
                {hasSubs && isOpen && (
                  <div
                    role="listbox"
                    aria-label={cat.name}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      minWidth: '200px',
                      background: 'oklch(0.10 0.02 255 / 0.98)',
                      border: '1px solid oklch(1 0 0 / 0.10)',
                      borderRadius: 'calc(var(--radius) * 0.8)',
                      boxShadow: '0 20px 56px rgba(0,0,0,0.4)',
                      padding: '0.375rem',
                      animation: 'hdrDropdown 0.15s ease-out both',
                      zIndex: 50,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        role="option"
                        type="button"
                        aria-selected={false}
                        onClick={() => {
                          setDesktopOpenId(null)
                          pushCatalogUrl(cat.slug, sub.slug)
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.55rem 0.875rem',
                          background: 'none',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-inter)',
                          fontSize: '0.8125rem',
                          color: 'oklch(0.88 0.008 80)',
                          transition: 'background-color 0.12s ease, color 0.12s ease',
                          whiteSpace: 'nowrap',
                          letterSpacing: '0.02em',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLButtonElement
                          el.style.backgroundColor = 'oklch(1 0 0 / 0.06)'
                          el.style.color = '#ffffff'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLButtonElement
                          el.style.backgroundColor = 'transparent'
                          el.style.color = 'oklch(0.88 0.008 80)'
                        }}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* ── Row 2: Mobile category pills (horizontal scroll) ── */}
      <div
        className="hdr-mob-cats no-scrollbar"
        role="navigation"
        aria-label="Filtrar por categoría"
        style={{ borderTop: `1px solid ${borderColor}`, transition: 'border-color 0.5s ease' }}
      >
        {categories.map((cat) => {
          const isActive = mobileActiveCatId === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleMobileCatClick(cat)}
              style={{
                flexShrink: 0,
                padding: '0.5rem 1rem',
                background: isActive ? 'var(--wood)' : 'transparent',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.72rem',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: isActive ? '#fff' : textColor,
                transition: 'background-color 0.2s ease, color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* ── Row 3: Mobile subcategory accordion ── */}
      {mobileActiveCatId && (activeCategory?.subcategories?.length ?? 0) > 0 && (
        <div
          className="hdr-mob-subs no-scrollbar"
          style={{
            borderTop: `1px solid ${borderColor}`,
            transition: 'border-color 0.5s ease',
            animation: 'hdrSubRow 0.18s ease-out both',
          }}
        >
          {activeCategory!.subcategories.map((sub) => {
            const isActive = mobileActiveSubId === sub.id
            return (
              <button
                key={sub.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setMobileActiveSubId(sub.id)
                  pushCatalogUrl(activeCategory!.slug, sub.slug)
                }}
                style={{
                  flexShrink: 0,
                  padding: '0.375rem 0.75rem',
                  background: isActive ? 'oklch(0.53 0.19 30 / 0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'oklch(0.53 0.19 30 / 0.5)' : borderColor}`,
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.04em',
                  color: isActive ? 'var(--wood)' : textColor,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {sub.name}
              </button>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes hdrDropdown {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes hdrSubRow {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hdr-mob-cats,
        .hdr-mob-subs {
          display: none;
          flex-direction: row;
          align-items: center;
          overflow-x: auto;
          padding: 0.5rem 1rem;
          gap: 0.375rem;
        }
        @media (max-width: 767px) {
          .hdr-desk-nav { display: none !important; }
          .hdr-mob-cats { display: flex; }
          .hdr-mob-subs { display: flex; }
        }
      `}</style>
    </header>
  )
}
