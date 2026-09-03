'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import type { Branch, Product, Category } from '@/lib/business'
import { formatMXN, getActiveItems } from '@/lib/format'
import { useCart } from '@/hooks/useCart'
import ProductSheet from './ProductSheet'
import CartDrawer from './CartDrawer'

type Props = {
  products: Product[]
  categories: Category[]
  hasCart?: boolean
  branches?: Branch[]
  businessName?: string
}

export default function CatalogClient({
  products,
  categories,
  hasCart = false,
  branches = [],
  businessName = '',
}: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items: cartItems } = useCart()

  const catSlug = searchParams.get('cat')
  const subSlug = searchParams.get('sub')

  const activeCategory = catSlug
    ? (categories.find((c) => c.slug === catSlug) ?? null)
    : null
  const selectedCategoryId = activeCategory?.id ?? null
  const activeSubcategories = activeCategory?.subcategories ?? []
  const activeSubcategory =
    subSlug && activeCategory
      ? (activeSubcategories.find((s) => s.slug === subSlug) ?? null)
      : null
  const selectedSubcategoryId = activeSubcategory?.id ?? null

  const productId = searchParams.get('product')
  const selectedProduct = productId
    ? (products.find((p) => p.id === productId) ?? null)
    : null

  const filteredProducts = products.filter((product) => {
    if (!selectedCategoryId) return true
    const matchesCategory = product.categoryAssignments.some(
      (a) => a.categoryId === selectedCategoryId
    )
    if (!matchesCategory) return false
    if (!selectedSubcategoryId) return true
    return product.categoryAssignments.some(
      (a) => a.categoryId === selectedCategoryId && a.subcategoryId === selectedSubcategoryId
    )
  })

  function selectCategory(slug: string) {
    router.push(`?cat=${slug}`, { scroll: false })
  }

  function selectSubcategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sub', slug)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  function clearFilter() {
    router.push(pathname, { scroll: false })
  }

  function clearSubcategory() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('sub')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  function handleOpenProduct(product: Product) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('product', product.id)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  function handleCloseProduct() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('product')
    const query = params.toString()
    router.push(query ? `?${query}` : pathname, { scroll: false })
  }

  // ── Pill styles ──────────────────────────────────────────
  const pillBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.4375rem 1rem',
    borderRadius: '3px',
    border: '1px solid rgba(201,146,42,0.20)',
    background: 'transparent',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.6875rem',
    fontWeight: 400,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    color: 'rgba(244,240,232,0.5)',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    whiteSpace: 'nowrap',
  }

  const pillActiveAll: React.CSSProperties = {
    ...pillBase,
    background: '#c9922a',
    border: '1px solid #c9922a',
    color: '#0b0a08',
  }

  const pillActiveCat: React.CSSProperties = {
    ...pillBase,
    background: '#c9922a',
    border: '1px solid #c9922a',
    color: '#0b0a08',
  }

  const tabBase: React.CSSProperties = {
    padding: '0.3125rem 0.875rem',
    borderRadius: '3px',
    border: 'none',
    background: 'transparent',
    fontFamily: 'var(--font-inter)',
    fontSize: '0.6875rem',
    fontWeight: 400,
    letterSpacing: '0.06em',
    color: 'rgba(244,240,232,0.4)',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  }

  const tabActive: React.CSSProperties = {
    ...tabBase,
    background: 'rgba(201,146,42,0.08)',
    color: '#c9922a',
    fontWeight: 500,
  }

  const cardRadius = '6px'

  return (
    <>
      {/* ── Category pills ── */}
      {categories.length > 0 && (
        <div
          className="pills-row no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            marginBottom: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          <button type="button" style={selectedCategoryId === null ? pillActiveAll : pillBase} onClick={clearFilter}>
            Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              style={selectedCategoryId === cat.id ? pillActiveCat : pillBase}
              onClick={() => selectCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Subcategory tabs ── */}
      {selectedCategoryId && activeSubcategories.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            flexWrap: 'wrap',
            marginTop: '-1.5rem',
            marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <button type="button" style={selectedSubcategoryId === null ? tabActive : tabBase} onClick={clearSubcategory}>
            Todo en {activeCategory?.name}
          </button>
          {activeSubcategories.map((sub) => (
            <button
              key={sub.id}
              type="button"
              style={selectedSubcategoryId === sub.id ? tabActive : tabBase}
              onClick={() => selectSubcategory(sub.slug)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.75rem',
              color: 'rgba(244,240,232,0.35)',
              fontWeight: 300,
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
            }}
          >
            Sin platillos en esta categoría todavía.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3rem, 6vw, 4.5rem)' }}>
          {categories.map((cat) => {
            const catProducts = filteredProducts.filter((p) =>
              p.categoryAssignments.some((a) => a.categoryId === cat.id)
            )
            if (catProducts.length === 0) return null

            return (
              <section key={cat.id} aria-labelledby={`cat-heading-${cat.id}`}>
                {/* ── Category heading ── */}
                <div style={{ marginBottom: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
                  <h2
                    id={`cat-heading-${cat.id}`}
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: 'clamp(1.75rem, 3vw, 2.375rem)',
                      fontWeight: 400,
                      color: '#f4f0e8',
                      lineHeight: 1.1,
                      letterSpacing: '-0.01em',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {cat.name}
                  </h2>
                  <div
                    aria-hidden="true"
                    style={{ height: '1px', backgroundColor: 'rgba(201,146,42,0.22)' }}
                  />
                </div>

                {/* ── Products grid ── */}
                <div className="catalog-grid">
                  {catProducts.map((product, index) => {
                    const nextProduct = catProducts[index + 1]
                    const nextHasImage = !nextProduct || Boolean(nextProduct.image_url)

                    const activeOptions = getActiveItems(product.options)
                    const hasOptions = activeOptions.length > 0

                    return product.image_url ? (
                      /* ── Variante con imagen ── */
                      <article
                        key={product.id}
                        className="product-card"
                        onClick={() => handleOpenProduct(product)}
                        style={{
                          backgroundColor: 'transparent',
                          overflow: 'visible',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          minWidth: 0,
                          width: '100%',
                        }}
                      >
                        {/* Image wrapper */}
                        <div
                          className="product-img-wrap"
                          style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: cardRadius,
                            overflow: 'hidden',
                            boxShadow: 'inset 0 0 0 1px rgba(201,146,42,0.18)',
                          }}
                        >
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 480px) calc(100vw - 3rem), (max-width: 900px) calc(50vw - 2rem), calc(33vw - 2rem)"
                            className="product-img"
                            style={{ objectFit: 'cover' }}
                            loading="lazy"
                          />

                          <div className="product-action-btn" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </div>
                        </div>

                        {/* Info below image */}
                        <div
                          style={{
                            padding: '1rem 0.25rem 0.5rem',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                            <div style={{ minWidth: 0 }}>
                              <h3 style={{
                                fontFamily: 'var(--font-cormorant)',
                                fontSize: '1.25rem',
                                fontWeight: 500,
                                color: '#f4f0e8',
                                lineHeight: 1.2,
                                letterSpacing: '-0.01em',
                                marginBottom: '0.375rem',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                whiteSpace: 'normal',
                              }}>
                                {product.name}
                              </h3>
                              {product.description && (
                                <p style={{
                                  fontFamily: 'var(--font-inter)',
                                  fontSize: '0.8125rem',
                                  fontWeight: 300,
                                  lineHeight: 1.65,
                                  color: 'rgba(244,240,232,0.42)',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}>
                                  {product.description}
                                </p>
                              )}
                            </div>
                            {/* Precio base — solo cuando no hay opciones */}
                            {!hasOptions && product.price !== null && (
                              <span style={{
                                fontFamily: 'var(--font-cormorant)',
                                fontSize: '1.25rem',
                                fontWeight: 500,
                                color: '#c9922a',
                                letterSpacing: '-0.01em',
                                flexShrink: 0,
                                lineHeight: 1.2,
                              }}>
                                {formatMXN(product.price)}
                              </span>
                            )}
                          </div>

                          {/* Lista de opciones */}
                          {hasOptions && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              {activeOptions.map((opt) => (
                                <div
                                  key={opt.id}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  <span style={{
                                    fontFamily: 'var(--font-inter)',
                                    fontSize: '0.75rem',
                                    fontWeight: 300,
                                    color: 'rgba(244,240,232,0.42)',
                                    lineHeight: 1.4,
                                    wordBreak: 'break-word',
                                  }}>
                                    {opt.name}
                                  </span>
                                  <span style={{
                                    fontFamily: 'var(--font-cormorant)',
                                    fontSize: '0.9375rem',
                                    fontWeight: 500,
                                    color: '#c9922a',
                                    letterSpacing: '-0.01em',
                                    flexShrink: 0,
                                  }}>
                                    {formatMXN(opt.price)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    ) : (
                      /* ── Variante sin imagen — entrada editorial de menú ── */
                      <article
                        key={product.id}
                        className="product-entry"
                        onClick={() => handleOpenProduct(product)}
                        style={{
                          gridColumn: '1 / -1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '2rem',
                          padding: '1.375rem 0',
                          borderTop: '1px solid rgba(201,146,42,0.16)',
                          borderBottom: nextHasImage ? '1px solid rgba(201,146,42,0.16)' : undefined,
                        }}
                      >
                        {/* Izquierda: nombre + descripción */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3
                            className="product-entry-name"
                            style={{
                              fontFamily: 'var(--font-cormorant)',
                              fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                              fontWeight: 400,
                              color: '#f4f0e8',
                              lineHeight: 1.2,
                              letterSpacing: '-0.015em',
                              marginBottom: product.description ? '0.3rem' : 0,
                              transition: 'color 0.2s ease',
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                            }}
                          >
                            {product.name}
                          </h3>

                          {product.description && (
                            <p style={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: '0.8rem',
                              fontWeight: 300,
                              lineHeight: 1.5,
                              color: 'rgba(244,240,232,0.38)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {product.description}
                            </p>
                          )}
                        </div>

                        {/* Derecha: precio o lista de opciones */}
                        {hasOptions ? (
                          <div style={{
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.2rem',
                            alignItems: 'flex-end',
                          }}>
                            {activeOptions.map((opt) => (
                              <div
                                key={opt.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  gap: '0.625rem',
                                }}
                              >
                                <span style={{
                                  fontFamily: 'var(--font-inter)',
                                  fontSize: '0.75rem',
                                  fontWeight: 300,
                                  color: 'rgba(244,240,232,0.38)',
                                  lineHeight: 1.4,
                                }}>
                                  {opt.name}
                                </span>
                                <span style={{
                                  fontFamily: 'var(--font-cormorant)',
                                  fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                                  fontWeight: 500,
                                  color: '#c9922a',
                                  letterSpacing: '-0.01em',
                                }}>
                                  {formatMXN(opt.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : product.price !== null ? (
                          <span style={{
                            fontFamily: 'var(--font-cormorant)',
                            fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)',
                            fontWeight: 500,
                            color: '#c9922a',
                            letterSpacing: '-0.01em',
                            flexShrink: 0,
                            lineHeight: 1.2,
                          }}>
                            {formatMXN(product.price)}
                          </span>
                        ) : null}
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <ProductSheet product={selectedProduct} onClose={handleCloseProduct} hasCart={hasCart} />

      {/* ── FAB del carrito ── */}
      {hasCart && (() => {
        const productMap = new Map(products.map((p) => [p.id, p]))
        let fabQty = 0
        let fabPrice = 0
        for (const item of cartItems) {
          const product = productMap.get(item.productId)
          if (!product) continue
          fabQty += item.quantity
          const activeOptions = getActiveItems(product.options)
          const selectedOption = item.selectedOptionId
            ? (activeOptions.find((o) => o.id === item.selectedOptionId) ?? null)
            : null
          const activeExtras = getActiveItems(product.extras)
          const extrasSum = activeExtras
            .filter((e) => item.selectedExtraIds.includes(e.id))
            .reduce((acc, e) => acc + e.price, 0)
          fabPrice += ((selectedOption?.price ?? product.price ?? 0) + extrasSum) * item.quantity
        }
        if (fabQty === 0) return null
        return (
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Ver carrito, ${fabQty} ${fabQty === 1 ? 'producto' : 'productos'}`}
            className="cart-fab"
            style={{
              position: 'fixed',
              bottom: '1.75rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 999,
              background: '#c9922a',
              color: '#0b0a08',
              border: 'none',
              borderRadius: '4px',
              padding: '0.875rem 1.5rem',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              boxShadow: '0 8px 32px rgba(201,146,42,0.30)',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Ver carrito</span>
            <span style={{
              background: 'rgba(0,0,0,0.18)',
              color: '#0b0a08',
              borderRadius: '3px',
              padding: '0.125rem 0.4375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              lineHeight: 1.5,
            }}>
              {fabQty}
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.125rem',
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}>
              {formatMXN(fabPrice)}
            </span>
          </button>
        )
      })()}

      {/* ── Cart Drawer ── */}
      {hasCart && (
        <CartDrawer
          products={products}
          branches={branches}
          businessName={businessName}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}

      <style>{`
        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.5rem 1.25rem;
        }
        @media (max-width: 900px) {
          .catalog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 480px) {
          .catalog-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 2rem 0 !important; }
        }
        .product-entry:hover .product-entry-name {
          color: #c9922a !important;
        }
        .cart-fab:hover { opacity: 0.90; }
        @media (min-width: 768px) {
          .cart-fab {
            left: auto !important;
            right: 2rem !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  )
}
