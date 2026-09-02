'use client'

import { useEffect, useState } from 'react'
import { type CartItem, useCartStore } from '@/store/cartStore'

interface CartSnapshot {
  items: CartItem[]
  addItem: ReturnType<typeof useCartStore.getState>['addItem']
  removeItem: ReturnType<typeof useCartStore.getState>['removeItem']
  updateQuantity: ReturnType<typeof useCartStore.getState>['updateQuantity']
  clearCart: ReturnType<typeof useCartStore.getState>['clearCart']
}

/**
 * Hook SSR-safe para leer el carrito.
 *
 * Problema: Next.js ejecuta el primer render en el servidor donde localStorage
 * no existe. Si Zustand inyectara el estado persistido en ese render, el HTML
 * del servidor diferiría del HTML hidratado en el cliente → React lanzaría un
 * Hydration Mismatch fatal.
 *
 * Solución: Durante el primer render (servidor y primera pasada del cliente)
 * devolvemos `items: []`. Tras el mount (useEffect), `hydrated` pasa a `true`
 * y el componente re-renderiza con los datos reales de localStorage.
 *
 * Las acciones (addItem, removeItem, etc.) son referencias estables de Zustand
 * y son seguras de exponer desde el inicio — no leen localStorage al definirse.
 *
 * Este hook es la ÚNICA puerta de entrada al carrito para los componentes UI.
 */
export function useCart(): CartSnapshot {
  const [hydrated, setHydrated] = useState(false)

  // Leemos el store completo; las acciones son referencias estables
  const store = useCartStore()

  useEffect(() => {
    setHydrated(true)
  }, [])

  return {
    // items vacío hasta que el cliente haya montado y leído localStorage
    items: hydrated ? store.items : [],
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  }
}
