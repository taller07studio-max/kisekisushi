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

  const solidBg    = 'rgba(11,10,8,0.96)'
  const textIvory  = scrolled ? 'rgba(244,240,232,0.85)' : 'rgba(255,255,255,0.82)'
  const goldColor  = '#c9922a'
  const borderGold = scrolled ? 'rgba(201,146,42,0.18)' : 'rgba(201,146,42,0.10)'

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
        borderBottom: `1px solid ${borderGold}`,
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
      }}
    >
      {/* ── Row 1: Logo + Desktop Nav ── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '60px',
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
                height: '36px',
                width: '36px',
                objectFit: 'cover',
                borderRadius: '4px',
                flexShrink: 0,
              }}
            />
          )}
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1875rem',
                fontWeight: 500,
                letterSpacing: '0.03em',
                color: '#f4f0e8',
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
                fontSize: '0.5rem',
                fontWeight: 400,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(201,146,42,0.65)',
                marginTop: '0.25rem',
                lineHeight: 1,
              }}
            >
              Sushi
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
                    fontSize: '0.6875rem',
                    fontWeight: 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: textIvory,
                    transition: 'color 0.22s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = goldColor
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color = textIvory
                  }}
                >
                  {cat.name}
                  {hasSubs && (
                    <svg
                      width="7"
                      height="7"
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
                      background: 'rgba(11,10,8,0.98)',
                      border: '1px solid rgba(201,146,42,0.22)',
                      borderRadius: '6px',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                      padding: '0.375rem',
                      animation: 'hdrDropdown 0.15s ease-out both',
                      zIndex: 50,
                      backdropFilter: 'blur(16px)',
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
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-inter)',
                          fontSize: '0.75rem',
                          letterSpacing: '0.06em',
                          color: 'rgba(244,240,232,0.7)',
                          transition: 'background-color 0.12s ease, color 0.12s ease',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLButtonElement
                          el.style.backgroundColor = 'rgba(201,146,42,0.08)'
                          el.style.color = '#c9922a'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLButtonElement
                          el.style.backgroundColor = 'transparent'
                          el.style.color = 'rgba(244,240,232,0.7)'
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
        style={{
          borderTop: `1px solid ${borderGold}`,
          transition: 'border-color 0.5s ease',
        }}
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
                padding: '0.4375rem 0.875rem',
                background: isActive ? 'rgba(201,146,42,0.12)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(201,146,42,0.5)' : 'transparent'}`,
                borderRadius: '3px',
                cursor: 'pointer',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: isActive ? '#c9922a' : textIvory,
                transition: 'all 0.18s ease',
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
            borderTop: `1px solid ${borderGold}`,
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
                  padding: '0.3125rem 0.6875rem',
                  background: isActive ? 'rgba(201,146,42,0.08)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(201,146,42,0.4)' : 'rgba(201,146,42,0.12)'}`,
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.06em',
                  color: isActive ? '#c9922a' : 'rgba(244,240,232,0.55)',
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
