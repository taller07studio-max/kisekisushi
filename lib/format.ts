import type { ProductItem } from './business'

/** Filtra ítems activos (`active !== false`) y los ordena por `order` ascendente. */
export function getActiveItems(items: ProductItem[] | null | undefined): ProductItem[] {
  if (!items || items.length === 0) return []
  return items
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

/** Precio mínimo entre un arreglo de ítems. Devuelve `null` si el arreglo está vacío. */
export function getMinPrice(items: ProductItem[]): number | null {
  if (items.length === 0) return null
  return Math.min(...items.map((item) => item.price))
}

export function formatMXN(price: number | null): string {
  if (price === null) return 'Consultar precio'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function buildWhatsAppUrl(rawNumber: string, message: string): string {
  const digits = rawNumber.replace(/\D/g, '').startsWith('52')
    ? rawNumber.replace(/\D/g, '')
    : `52${rawNumber.replace(/\D/g, '')}`
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
