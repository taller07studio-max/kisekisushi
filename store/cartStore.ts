import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Almacenamos SOLO referencias e IDs — nunca precios, nombres ni metadata.
// Los precios se resuelven en tiempo de render contra los datos frescos de Supabase.
export interface CartItem {
  productId: string
  selectedOptionId?: string
  selectedExtraIds: string[]
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
}

/**
 * Compara dos arrays de IDs sin importar el orden.
 * Usamos sort antes de comparar para que ["a","b"] === ["b","a"].
 */
function extraIdsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const sa = [...a].sort()
  const sb = [...b].sort()
  return sa.every((v, i) => v === sb[i])
}

/**
 * Dos líneas de carrito son "la misma SKU" si coinciden en
 * productId + selectedOptionId + selectedExtraIds (sin importar orden).
 */
function isSameLineItem(a: CartItem, b: Omit<CartItem, 'quantity'>): boolean {
  return (
    a.productId === b.productId &&
    a.selectedOptionId === b.selectedOptionId &&
    extraIdsEqual(a.selectedExtraIds, b.selectedExtraIds)
  )
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        const quantity = incoming.quantity ?? 1
        const { items } = get()
        const existingIndex = items.findIndex((item) => isSameLineItem(item, incoming))

        if (existingIndex !== -1) {
          // Misma SKU → acumula cantidad
          const updated = items.map((item, i) =>
            i === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
          set({ items: updated })
        } else {
          // Nueva línea
          set({
            items: [
              ...items,
              {
                productId: incoming.productId,
                selectedOptionId: incoming.selectedOptionId,
                selectedExtraIds: incoming.selectedExtraIds,
                quantity,
              },
            ],
          })
        }
      },

      removeItem: (index) => {
        set({ items: get().items.filter((_, i) => i !== index) })
      },

      updateQuantity: (index, quantity) => {
        if (quantity <= 0) {
          // Si la cantidad llega a 0, elimina la línea
          set({ items: get().items.filter((_, i) => i !== index) })
          return
        }
        set({
          items: get().items.map((item, i) =>
            i === index ? { ...item, quantity } : item,
          ),
        })
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'tianquiz-cart',
      // Solo persistimos items — las acciones son funciones y no se serializan
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
