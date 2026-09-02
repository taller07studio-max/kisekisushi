import type { Branch, Product } from './business'
import { getActiveItems, formatMXN } from './format'
import type { CartItem } from '@/store/cartStore'

/**
 * Sanitiza el teléfono y construye la URL wa.me.
 * Regla México: si quedan exactamente 10 dígitos se antepone "52".
 */
export function formatWhatsAppUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '')
  const normalized = digits.length === 10 ? `52${digits}` : digits
  const base = `https://wa.me/${normalized}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

function hasValidPhone(phone: string | null | undefined): boolean {
  return (phone?.replace(/\D/g, '') ?? '').length > 0
}

export type WhatsAppResolution =
  | { type: 'direct'; url: string }
  | { type: 'selector'; branches: Branch[] }
  | { type: 'none' }

/**
 * Algoritmo de resolución en cascada:
 * 1. business.whatsapp válido → directo
 * 2. 1 sucursal con WhatsApp → directo
 * 3. 2+ sucursales con WhatsApp → selector
 * 4. Sin ningún número → none
 */
export function resolveWhatsApp(
  businessWhatsapp: string | null | undefined,
  branches: Branch[],
  message: string
): WhatsAppResolution {
  if (hasValidPhone(businessWhatsapp)) {
    return { type: 'direct', url: formatWhatsAppUrl(businessWhatsapp!, message) }
  }

  const validBranches = branches.filter((b) => hasValidPhone(b.whatsapp))

  if (validBranches.length === 0) return { type: 'none' }
  if (validBranches.length === 1) {
    return { type: 'direct', url: formatWhatsAppUrl(validBranches[0].whatsapp!, message) }
  }
  return { type: 'selector', branches: validBranches }
}

/**
 * Cruza los IDs del carrito con los productos frescos del servidor para calcular
 * precios y nombres reales, luego construye un mensaje de pedido y retorna la URL wa.me.
 *
 * Los items cuyo productId ya no exista en el catálogo se ignoran silenciosamente
 * (productos eliminados por el restaurante entre sesiones).
 */
export function generateWhatsAppOrderUrl(
  cartItems: CartItem[],
  products: Product[],
  branchPhone: string,
  businessName: string,
  branchName: string,
): string {
  const productMap = new Map(products.map((p) => [p.id, p]))

  let grandTotal = 0
  const lines: string[] = []

  for (const item of cartItems) {
    const product = productMap.get(item.productId)
    if (!product) continue // producto eliminado — ignorar silenciosamente

    const activeOptions = getActiveItems(product.options)
    const activeExtras = getActiveItems(product.extras)

    const selectedOption = item.selectedOptionId
      ? (activeOptions.find((o) => o.id === item.selectedOptionId) ?? null)
      : null
    const selectedExtras = activeExtras.filter((e) => item.selectedExtraIds.includes(e.id))

    const unitPrice = selectedOption?.price ?? product.price ?? 0
    const extrasSum = selectedExtras.reduce((acc, e) => acc + e.price, 0)
    const lineTotal = (unitPrice + extrasSum) * item.quantity
    grandTotal += lineTotal

    let line = `${item.quantity}x *${product.name}*`
    if (selectedOption) line += ` (${selectedOption.name})`
    for (const extra of selectedExtras) {
      line += `\n   + ${extra.name}`
    }
    lines.push(line)
  }

  const message = [
    `Hola, me gustaría hacer el siguiente pedido en *${businessName}* (Sucursal ${branchName}):`,
    '',
    lines.join('\n\n'),
    '',
    `Total: ${formatMXN(grandTotal)}`,
  ].join('\n')

  return formatWhatsAppUrl(branchPhone, message)
}
