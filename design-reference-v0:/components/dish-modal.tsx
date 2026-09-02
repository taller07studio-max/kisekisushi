'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { HeatMeter } from '@/components/dish-card'
import { WhatsAppIcon } from '@/components/icons'
import {
  categories,
  formatPrice,
  whatsappLink,
  type Dish,
} from '@/lib/menu'
import { cn } from '@/lib/utils'

const MAX_QTY = 20

export function DishModal({
  dish,
  onClose,
}: {
  dish: Dish | null
  onClose: () => void
}) {
  const [qty, setQty] = useState(1)
  const [mounted, setMounted] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Reset state each time a new dish opens
  useEffect(() => {
    if (dish) {
      setQty(1)
      const raf = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(raf)
    }
    setMounted(false)
  }, [dish])

  useEffect(() => {
    if (!dish) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [dish, onClose])

  if (!dish) return null

  const category = categories.find((c) => c.id === dish.category)
  const total = dish.price * qty
  const message =
    `¡Hola El Imposible! Quiero pedir:\n\n` +
    `• ${qty} × ${dish.name} — ${formatPrice(total)}\n\n` +
    `¿Me confirman disponibilidad y tiempo, por favor?`

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Cerrar"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-primary/70 backdrop-blur-md transition-opacity duration-400',
          mounted ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        className={cn(
          'relative flex max-h-[94svh] w-full max-w-lg flex-col overflow-hidden rounded-t-[32px] bg-background shadow-2xl transition-all duration-400 ease-out sm:rounded-[32px]',
          mounted
            ? 'translate-y-0 opacity-100 sm:scale-100'
            : 'translate-y-8 opacity-0 sm:translate-y-0 sm:scale-95',
        )}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle del platillo"
          className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-md transition-transform hover:rotate-90 hover:bg-background"
        >
          <X className="size-5" />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          <div className="relative aspect-[4/3] w-full bg-secondary">
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
            />
          </div>

          <div className="px-6 pb-6 pt-1 sm:px-8">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              {category?.label}
              <HeatMeter heat={dish.heat} className="text-muted-foreground" />
            </div>

            <h2
              id="dish-modal-title"
              className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground text-balance"
            >
              {dish.name}
            </h2>

            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground">
              {dish.description}
            </p>

            <h3 className="mt-7 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground">
              Lo que lleva
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dish.ingredients.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-secondary px-3.5 py-2 text-xs font-medium text-secondary-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex items-center gap-1 rounded-full bg-secondary p-1"
              role="group"
              aria-label="Cantidad"
            >
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Quitar uno"
                className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-background disabled:opacity-35"
              >
                <Minus className="size-4" />
              </button>
              <span
                aria-live="polite"
                className="w-8 text-center font-serif text-base font-semibold tabular-nums text-foreground"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                disabled={qty >= MAX_QTY}
                aria-label="Agregar uno"
                className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-background disabled:opacity-35"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Total
              </div>
              <div className="font-serif text-2xl font-semibold leading-none tabular-nums text-foreground">
                {formatPrice(total)}
              </div>
            </div>
          </div>

          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 flex items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-4" />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
