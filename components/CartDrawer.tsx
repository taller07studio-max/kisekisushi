'use client'

import { useState } from 'react'
import type { Branch, Product } from '@/lib/business'
import { formatMXN, getActiveItems } from '@/lib/format'
import { useCart } from '@/hooks/useCart'
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp'

interface CartDrawerProps {
  products: Product[]
  branches: Branch[]
  businessName: string
  isOpen: boolean
  onClose: () => void
}

// ── Resolved line: IDs del store → datos reales del catálogo ─────────────────

type ResolvedLine = {
  cartIndex: number
  product: Product
  optionName: string | null
  extrasNames: string[]
  unitPrice: number
  lineTotal: number
  quantity: number
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.552 4.114 1.522 5.844L.044 23.604a.5.5 0 0 0 .612.612l5.76-1.478A11.948 11.948 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 0 1-5.003-1.364l-.36-.214-3.72.954.97-3.64-.236-.376A9.818 9.818 0 1 1 12 21.818z" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

export default function CartDrawer({
  products,
  branches,
  businessName,
  isOpen,
  onClose,
}: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCart()

  // Filtrar sucursales con número válido — fuera del early return (antes de useState)
  const validBranches = branches.filter(
    (b) => b.whatsapp && b.whatsapp.trim() !== '',
  )

  // useState DEBE estar antes del early return para respetar Rules of Hooks.
  // El estado persiste entre aperturas del drawer (UX deseado: se recuerda la elección).
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    validBranches[0]?.id ?? null,
  )

  if (!isOpen) return null

  // ── Derivados (calculados solo cuando el drawer está visible) ─────────────

  const productMap = new Map(products.map((p) => [p.id, p]))

  const resolvedLines: ResolvedLine[] = items.flatMap((item, index) => {
    const product = productMap.get(item.productId)
    if (!product) return []

    const activeOptions = getActiveItems(product.options)
    const activeExtras = getActiveItems(product.extras)

    const selectedOption = item.selectedOptionId
      ? (activeOptions.find((o) => o.id === item.selectedOptionId) ?? null)
      : null
    const selectedExtras = activeExtras.filter((e) => item.selectedExtraIds.includes(e.id))

    const optionPrice = selectedOption?.price ?? product.price ?? 0
    const extrasSum = selectedExtras.reduce((acc, e) => acc + e.price, 0)
    const unitPrice = optionPrice + extrasSum
    const lineTotal = unitPrice * item.quantity

    return [{
      cartIndex: index,
      product,
      optionName: selectedOption?.name ?? null,
      extrasNames: selectedExtras.map((e) => e.name),
      unitPrice,
      lineTotal,
      quantity: item.quantity,
    }]
  })

  const grandTotal = resolvedLines.reduce((acc, l) => acc + l.lineTotal, 0)
  const selectedBranch = validBranches.find((b) => b.id === selectedBranchId) ?? null
  const canSend = selectedBranch !== null && resolvedLines.length > 0

  function handleSendOrder() {
    if (!canSend || !selectedBranch?.whatsapp) return
    const url = generateWhatsAppOrderUrl(
      items,
      products,
      selectedBranch.whatsapp,
      businessName,
      selectedBranch.name,
    )
    window.open(url, '_blank', 'noopener,noreferrer')
    clearCart()
    onClose()
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'oklch(0.10 0.02 255 / 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 1001,
        }}
      />

      {/* Drawer */}
      <div
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '90dvh',
          background: 'var(--background)',
          borderRadius: '32px 32px 0 0',
          zIndex: 1002,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'cartSlideUp 0.36s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 1.75rem 1.125rem',
          flexShrink: 0,
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.75rem',
              fontWeight: 400,
              color: 'var(--foreground)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              Tu pedido
            </h2>
            {resolvedLines.length > 0 && (
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.75rem',
                fontWeight: 300,
                color: 'var(--muted-foreground)',
                marginTop: '0.25rem',
                letterSpacing: '0.01em',
              }}>
                {resolvedLines.reduce((acc, l) => acc + l.quantity, 0)} productos
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="cart-close-btn"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '2.25rem',
              height: '2.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--muted-foreground)',
              transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
              flexShrink: 0,
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Items (scrollable) ── */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 1.75rem' }}>
          {resolvedLines.length === 0 ? (
            <div style={{ padding: '3.5rem 0', textAlign: 'center' }}>
              <p style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.375rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--muted-foreground)',
                letterSpacing: '-0.01em',
              }}>
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            resolvedLines.map((line) => (
              <article
                key={line.cartIndex}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.875rem',
                  padding: '1.125rem 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {/* Miniatura */}
                {line.product.image_url && (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: 'inset 0 0 0 1px var(--border)',
                  }}>
                    <img
                      src={line.product.image_url}
                      alt={line.product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}

                {/* Info del producto */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: 'var(--foreground)',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    marginBottom: '0.2rem',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}>
                    {line.product.name}
                  </p>

                  {line.optionName && (
                    <p style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.78rem',
                      fontWeight: 300,
                      color: 'var(--muted-foreground)',
                      lineHeight: 1.4,
                    }}>
                      {line.optionName}
                    </p>
                  )}

                  {line.extrasNames.map((name) => (
                    <p key={name} style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.75rem',
                      fontWeight: 300,
                      color: 'var(--muted-foreground)',
                      lineHeight: 1.4,
                    }}>
                      + {name}
                    </p>
                  ))}

                  {/* Controles de línea */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    marginTop: '0.75rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border)',
                      borderRadius: '9999px',
                    }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.cartIndex, line.quantity - 1)}
                        aria-label="Reducir cantidad"
                        style={{
                          width: '1.875rem',
                          height: '1.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--foreground)',
                          fontSize: '1rem',
                          lineHeight: 1,
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        minWidth: '1.375rem',
                        textAlign: 'center',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--foreground)',
                        userSelect: 'none',
                      }}>
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.cartIndex, line.quantity + 1)}
                        aria-label="Aumentar cantidad"
                        style={{
                          width: '1.875rem',
                          height: '1.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--foreground)',
                          fontSize: '1rem',
                          lineHeight: 1,
                        }}
                      >
                        +
                      </button>
                    </div>

                    <span style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.0625rem',
                      fontWeight: 500,
                      color: 'var(--wood)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1,
                    }}>
                      {formatMXN(line.lineTotal)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(line.cartIndex)}
                      aria-label={`Eliminar ${line.product.name}`}
                      className="cart-remove-btn"
                      style={{
                        marginLeft: 'auto',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--muted-foreground)',
                        padding: '0.3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'color 0.2s ease, background-color 0.2s ease',
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* ── Footer: total + selector de sucursal + CTA ── */}
        <div style={{
          flexShrink: 0,
          padding: '1.125rem 1.75rem 1.5rem',
          borderTop: '1px solid var(--border)',
          background: 'var(--background)',
        }}>
          {/* Fila total */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
              opacity: 0.7,
            }}>
              Total
            </span>
            <span style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '2.125rem',
              fontWeight: 500,
              color: 'var(--foreground)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              {formatMXN(grandTotal)}
            </span>
          </div>

          {/* ── Caso A: sin sucursales válidas ── */}
          {validBranches.length === 0 && (
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.78rem',
              fontWeight: 300,
              color: 'var(--muted-foreground)',
              textAlign: 'center',
              marginBottom: '0.875rem',
              lineHeight: 1.5,
            }}>
              Actualmente no hay sucursales disponibles para pedir.
            </p>
          )}

          {/* ── Caso C: múltiples sucursales → selector radio ── */}
          {validBranches.length > 1 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                marginBottom: '0.625rem',
                opacity: 0.7,
              }}>
                Elige una sucursal
              </p>
              <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column' }}>
                {validBranches.map((branch, i) => {
                  const isSelected = branch.id === selectedBranchId
                  return (
                    <label
                      key={branch.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 0',
                        borderTop: i === 0 ? '1px solid var(--border)' : undefined,
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="cart-branch"
                        value={branch.id}
                        checked={isSelected}
                        onChange={() => setSelectedBranchId(branch.id)}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                      />
                      {/* Indicador visual */}
                      <div
                        aria-hidden="true"
                        style={{
                          width: '1rem',
                          height: '1rem',
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
                          <div style={{
                            width: '0.3125rem',
                            height: '0.3125rem',
                            borderRadius: '50%',
                            background: 'var(--background)',
                          }} />
                        )}
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.875rem',
                        fontWeight: isSelected ? 400 : 300,
                        color: isSelected ? 'var(--foreground)' : 'var(--muted-foreground)',
                        lineHeight: 1.4,
                        transition: 'color 0.15s ease',
                      }}>
                        {branch.name}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Botón WhatsApp ── */}
          <button
            type="button"
            onClick={handleSendOrder}
            disabled={!canSend}
            className="cart-send-btn"
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: canSend ? '#25D366' : 'var(--border)',
              color: canSend ? '#fff' : 'var(--muted-foreground)',
              border: 'none',
              borderRadius: '9999px',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.9375rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.625rem',
              transition: 'opacity 0.2s ease',
              marginTop: validBranches.length > 1 ? 0 : undefined,
            }}
          >
            <WhatsAppIcon />
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cartSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes cartSlideRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .cart-close-btn:hover {
          background-color: var(--muted) !important;
          border-color: var(--foreground) !important;
          color: var(--foreground) !important;
        }
        .cart-remove-btn:hover {
          color: var(--foreground) !important;
          background-color: var(--muted) !important;
        }
        .cart-send-btn:hover:not(:disabled) { opacity: 0.88; }
        @media (min-width: 768px) {
          .cart-drawer {
            top: 0 !important;
            bottom: 0 !important;
            left: auto !important;
            right: 0 !important;
            width: min(420px, 92vw) !important;
            max-height: none !important;
            border-radius: 0 !important;
            box-shadow: -8px 0 40px rgba(10, 10, 40, 0.12) !important;
            animation: cartSlideRight 0.36s cubic-bezier(0.22, 1, 0.36, 1) both !important;
          }
        }
      `}</style>
    </>
  )
}
