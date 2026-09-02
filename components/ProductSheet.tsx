'use client'

import { useState } from 'react'
import type { Product, ProductItem } from '@/lib/business'
import { formatMXN, getActiveItems } from '@/lib/format'
import { useCart } from '@/hooks/useCart'

interface ProductSheetProps {
  product: Product | null
  onClose: () => void
  hasCart?: boolean
}

// ── Icons & shared styles ──────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'var(--background)',
  border: 'none',
  borderRadius: '50%',
  width: '2.5rem',
  height: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 1003,
  color: 'var(--foreground)',
  boxShadow: '0 2px 12px rgba(10,10,40,0.12)',
  transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s ease',
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'oklch(0.10 0.02 255 / 0.65)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  zIndex: 1001,
}

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter)',
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--muted-foreground)',
  marginBottom: '0.75rem',
  opacity: 0.7,
}

// ── Read-only sub-components (unchanged when hasCart is false) ─────────────────

function OptionsList({ items, label }: { items: ProductItem[]; label: string }) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={sectionLabelStyle}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '0.625rem 0',
              borderTop: i === 0 ? '1px solid var(--border)' : undefined,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', fontWeight: 300, color: 'var(--foreground)', lineHeight: 1.4 }}>
              {item.name}
            </span>
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--wood)', letterSpacing: '-0.01em', flexShrink: 0 }}>
              {formatMXN(item.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExtrasList({ items }: { items: ProductItem[] }) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={sectionLabelStyle}>Extras</p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '0.625rem 0',
              borderTop: i === 0 ? '1px solid var(--border)' : undefined,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', fontWeight: 300, color: 'var(--foreground)', lineHeight: 1.4 }}>
              {item.name}
            </span>
            <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 500, color: 'var(--wood)', letterSpacing: '-0.01em', flexShrink: 0 }}>
              + {formatMXN(item.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Interactive sub-components (rendered only when hasCart is true) ────────────

function InteractiveOptionsList({
  items,
  selectedId,
  onChange,
}: {
  items: ProductItem[]
  selectedId: string | null
  onChange: (id: string) => void
}) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={sectionLabelStyle}>Opciones</p>
      <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => {
          const isSelected = item.id === selectedId
          return (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '0.625rem 0',
                borderTop: i === 0 ? '1px solid var(--border)' : undefined,
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Visually hidden native input for accessibility */}
                <input
                  type="radio"
                  name="product-option"
                  value={item.id}
                  checked={isSelected}
                  onChange={() => onChange(item.id)}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                />
                {/* Custom radio indicator */}
                <div
                  aria-hidden="true"
                  style={{
                    width: '1.125rem',
                    height: '1.125rem',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--foreground)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--foreground)' : 'transparent',
                    flexShrink: 0,
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <div style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', background: 'var(--background)' }} />
                  )}
                </div>
                <span style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 400 : 300,
                  color: isSelected ? 'var(--foreground)' : 'var(--muted-foreground)',
                  lineHeight: 1.4,
                  transition: 'color 0.15s ease',
                }}>
                  {item.name}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1rem',
                fontWeight: 500,
                color: isSelected ? 'var(--wood)' : 'var(--muted-foreground)',
                letterSpacing: '-0.01em',
                flexShrink: 0,
                transition: 'color 0.15s ease',
              }}>
                {formatMXN(item.price)}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function InteractiveExtrasList({
  items,
  selectedIds,
  onChange,
}: {
  items: ProductItem[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}) {
  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    )
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={sectionLabelStyle}>Extras</p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => {
          const isChecked = selectedIds.includes(item.id)
          return (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '0.625rem 0',
                borderTop: i === 0 ? '1px solid var(--border)' : undefined,
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                />
                {/* Custom checkbox indicator */}
                <div
                  aria-hidden="true"
                  style={{
                    width: '1.125rem',
                    height: '1.125rem',
                    borderRadius: '4px',
                    border: `2px solid ${isChecked ? 'var(--foreground)' : 'var(--border)'}`,
                    background: isChecked ? 'var(--foreground)' : 'transparent',
                    flexShrink: 0,
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isChecked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path d="M1 4L3.5 6.5L9 1" stroke="var(--background)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  fontWeight: isChecked ? 400 : 300,
                  color: isChecked ? 'var(--foreground)' : 'var(--muted-foreground)',
                  lineHeight: 1.4,
                  transition: 'color 0.15s ease',
                }}>
                  {item.name}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.1rem',
                fontWeight: 500,
                color: isChecked ? 'var(--wood)' : 'var(--muted-foreground)',
                letterSpacing: '-0.01em',
                flexShrink: 0,
                transition: 'color 0.15s ease',
              }}>
                + {formatMXN(item.price)}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function QuantityStepper({ quantity, onChange }: { quantity: number; onChange: (q: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
      <p style={{ ...sectionLabelStyle, marginBottom: 0, marginRight: 'auto' }}>Cantidad</p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--border)',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}>
        <button
          type="button"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          aria-label="Reducir cantidad"
          style={{
            width: '2.25rem',
            height: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
            color: quantity <= 1 ? 'var(--border)' : 'var(--foreground)',
            fontSize: '1.25rem',
            fontWeight: 300,
            lineHeight: 1,
            transition: 'color 0.15s ease',
          }}
        >
          −
        </button>
        <span style={{
          minWidth: '2rem',
          textAlign: 'center',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.9rem',
          fontWeight: 500,
          color: 'var(--foreground)',
          userSelect: 'none',
        }}>
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(20, quantity + 1))}
          aria-label="Aumentar cantidad"
          style={{
            width: '2.25rem',
            height: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: quantity >= 20 ? 'not-allowed' : 'pointer',
            color: quantity >= 20 ? 'var(--border)' : 'var(--foreground)',
            fontSize: '1.25rem',
            fontWeight: 300,
            lineHeight: 1,
            transition: 'color 0.15s ease',
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

// ── Inner component — holds all hooks (avoids conditional hook calls) ──────────

function ProductSheetInner({
  product,
  onClose,
  hasCart,
}: {
  product: Product
  onClose: () => void
  hasCart: boolean
}) {
  const hasImage = Boolean(product.image_url)
  const activeOptions = getActiveItems(product.options)
  const activeExtras = getActiveItems(product.extras)
  const hasOptions = activeOptions.length > 0
  const hasExtras = activeExtras.length > 0

  // Hooks are always called, regardless of hasCart — Rules of Hooks.
  const { addItem } = useCart()

  // CRÍTICO: Si hay opciones activas, el estado inicial es el primer ID (menor order).
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    activeOptions[0]?.id ?? null,
  )
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  // Subtotal en tiempo real (usado solo cuando hasCart)
  const selectedOption = activeOptions.find((o) => o.id === selectedOptionId)
  const basePrice = selectedOption?.price ?? product.price ?? 0
  const extrasSum = activeExtras
    .filter((e) => selectedExtraIds.includes(e.id))
    .reduce((acc, e) => acc + e.price, 0)
  const subtotal = (basePrice + extrasSum) * quantity

  function handleAddToCart() {
    addItem({
      productId: product.id,
      selectedOptionId: selectedOptionId ?? undefined,
      selectedExtraIds,
      quantity,
    })
    onClose()
    // Reset para la próxima apertura (key={product.id} reiniciará el estado si
    // cambia el producto, pero reseteamos explícitamente si se cierra sin cambio de producto)
    setSelectedOptionId(activeOptions[0]?.id ?? null)
    setSelectedExtraIds([])
    setQuantity(1)
  }

  // ── Shared content block ──────────────────────────────────────────────────

  function renderContent(paddingStyle: React.CSSProperties) {
    return (
      <div className="sheet-content" style={paddingStyle}>
        <h2 style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          fontWeight: 500,
          color: 'var(--foreground)',
          lineHeight: 1.05,
          letterSpacing: '-0.025em',
          marginBottom: '0.625rem',
        }}>
          {product.name}
        </h2>

        {/* Precio base — solo cuando no hay opciones */}
        {!hasOptions && product.price !== null && (
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.5rem',
            fontWeight: 500,
            color: 'var(--wood)',
            marginBottom: '1.25rem',
            letterSpacing: '-0.01em',
          }}>
            {formatMXN(product.price)}
          </p>
        )}

        {product.description && (
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9375rem',
            fontWeight: 300,
            lineHeight: 1.75,
            color: 'var(--muted-foreground)',
          }}>
            {product.description}
          </p>
        )}

        {/* Opciones */}
        {hasOptions && (
          hasCart
            ? <InteractiveOptionsList items={activeOptions} selectedId={selectedOptionId} onChange={setSelectedOptionId} />
            : <OptionsList items={activeOptions} label="Opciones" />
        )}

        {/* Extras */}
        {hasExtras && (
          hasCart
            ? <InteractiveExtrasList items={activeExtras} selectedIds={selectedExtraIds} onChange={setSelectedExtraIds} />
            : <ExtrasList items={activeExtras} />
        )}

        {/* Cantidad */}
        {hasCart && <QuantityStepper quantity={quantity} onChange={setQuantity} />}

        {/* Botón sticky dentro del contenedor con scroll */}
        {hasCart ? (
          <div style={{
            position: 'sticky',
            bottom: 0,
            background: 'var(--background)',
            paddingTop: '1rem',
            paddingBottom: '0.25rem',
            marginTop: '1.5rem',
          }}>
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '0.9375rem 1.5rem',
                background: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
                borderRadius: '9999px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'opacity 0.2s ease',
              }}
            >
              <span>Agregar {quantity} al carrito</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.125rem',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}>
                {formatMXN(subtotal)}
              </span>
            </button>
          </div>
        ) : (
          <div style={{ height: '1.5rem' }} />
        )}
      </div>
    )
  }

  // ── Variante CON imagen ───────────────────────────────────────────────────

  if (hasImage) {
    return (
      <>
        <div onClick={onClose} aria-hidden="true" style={backdropStyle} />

        <div
          className="product-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '92dvh',
            background: 'var(--background)',
            borderRadius: '32px 32px 0 0',
            overflow: 'hidden',
            zIndex: 1002,
            animation: 'sheetSlideUp 0.36s cubic-bezier(0.22, 1, 0.36, 1) both',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button type="button" onClick={onClose} aria-label="Cerrar" className="sheet-close-btn" style={closeButtonStyle}>
            <CloseIcon />
          </button>

          {/* Área scrollable — flex: 1 en mobile; grid en desktop (via CSS) */}
          <div className="sheet-inner" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
            {/* Imagen */}
            <div
              className="sheet-image"
              style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0 }}
            >
              <img
                src={product.image_url!}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, var(--background) 0%, transparent 40%)',
                }}
              />
            </div>

            {/* Contenido — botón sticky vive aquí */}
            {renderContent({ padding: '0.75rem 1.75rem 1rem' })}
          </div>
        </div>

        <style>{`
          @keyframes sheetSlideUp {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
          @keyframes sheetFadeIn {
            from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          .sheet-close-btn:hover {
            transform: rotate(90deg);
            background-color: var(--muted) !important;
          }
          .add-to-cart-btn:hover { opacity: 0.85 !important; }
          @media (min-width: 768px) {
            .product-sheet {
              top: 50% !important;
              left: 50% !important;
              right: auto !important;
              bottom: auto !important;
              height: auto !important;
              max-height: 88vh !important;
              width: min(880px, 92vw) !important;
              border-radius: 32px !important;
              transform: translate(-50%, -50%);
              animation: sheetFadeIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) both !important;
            }
            .sheet-inner {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              height: auto !important;
              max-height: 88vh !important;
              overflow-y: visible !important;
              flex: none !important;
              min-height: 0 !important;
            }
            .sheet-image {
              aspect-ratio: auto !important;
              height: 100% !important;
              min-height: 480px !important;
            }
            .sheet-content {
              overflow-y: auto !important;
              padding: 2.75rem 2.5rem 1rem !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: flex-start !important;
            }
          }
        `}</style>
      </>
    )
  }

  // ── Variante SIN imagen ───────────────────────────────────────────────────

  return (
    <>
      <div onClick={onClose} aria-hidden="true" style={backdropStyle} />

      <div
        className="product-sheet-text"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--background)',
          borderRadius: '32px 32px 0 0',
          overflow: 'hidden',
          zIndex: 1002,
          animation: 'sheetSlideUpText 0.36s cubic-bezier(0.22, 1, 0.36, 1) both',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85dvh',
        }}
      >
        <button type="button" onClick={onClose} aria-label="Cerrar" className="sheet-close-btn" style={closeButtonStyle}>
          <CloseIcon />
        </button>

        {/* Área scrollable */}
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '3.25rem 1.75rem 1.5rem' }}>
          {/* Accent bar */}
          <div
            aria-hidden="true"
            style={{
              width: '2rem',
              height: '2px',
              backgroundColor: 'var(--wood)',
              marginBottom: '1.75rem',
            }}
          />

          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2.25rem, 7vw, 3.25rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--foreground)',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
          }}>
            {product.name}
          </h2>

          {!hasOptions && product.price !== null && (
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.75rem',
              fontWeight: 500,
              color: 'var(--wood)',
              letterSpacing: '-0.01em',
              marginBottom: product.description ? '1.75rem' : 0,
            }}>
              {formatMXN(product.price)}
            </p>
          )}

          {product.description && (
            <>
              <div aria-hidden="true" style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '1.5rem' }} />
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9375rem',
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'var(--muted-foreground)',
              }}>
                {product.description}
              </p>
            </>
          )}

          {hasOptions && (
            hasCart
              ? <InteractiveOptionsList items={activeOptions} selectedId={selectedOptionId} onChange={setSelectedOptionId} />
              : <OptionsList items={activeOptions} label="Opciones" />
          )}

          {hasExtras && (
            hasCart
              ? <InteractiveExtrasList items={activeExtras} selectedIds={selectedExtraIds} onChange={setSelectedExtraIds} />
              : <ExtrasList items={activeExtras} />
          )}

          {hasCart && <QuantityStepper quantity={quantity} onChange={setQuantity} />}

          {/* Padding inferior cuando no hay botón de carrito */}
          {!hasCart && <div style={{ height: '1.5rem' }} />}
        </div>

        {/* Botón siempre visible en la parte inferior (solo cuando hasCart) */}
        {hasCart && (
          <div style={{
            padding: '0.875rem 1.75rem 1.25rem',
            borderTop: '1px solid var(--border)',
            background: 'var(--background)',
            flexShrink: 0,
          }}>
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '0.9375rem 1.5rem',
                background: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
                borderRadius: '9999px',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'opacity 0.2s ease',
              }}
            >
              <span>Agregar {quantity} al carrito</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.125rem',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}>
                {formatMXN(subtotal)}
              </span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes sheetSlideUpText {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes sheetFadeInText {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .sheet-close-btn:hover {
          transform: rotate(90deg);
          background-color: var(--muted) !important;
        }
        .add-to-cart-btn:hover { opacity: 0.85 !important; }
        @media (min-width: 768px) {
          .product-sheet-text {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            right: auto !important;
            bottom: auto !important;
            max-height: 85vh !important;
            width: min(520px, 92vw) !important;
            border-radius: 32px !important;
            transform: translate(-50%, -50%);
            animation: sheetFadeInText 0.32s cubic-bezier(0.22, 1, 0.36, 1) both !important;
          }
          .product-sheet-text > div:first-of-type {
            padding: 3.5rem 3rem 2rem !important;
          }
        }
      `}</style>
    </>
  )
}

// ── Public export ──────────────────────────────────────────────────────────────
// key={product.id} garantiza que useState se reinicia cuando cambia el producto.

export default function ProductSheet({ product, onClose, hasCart = false }: ProductSheetProps) {
  if (!product) return null
  return <ProductSheetInner key={product.id} product={product} onClose={onClose} hasCart={hasCart} />
}
