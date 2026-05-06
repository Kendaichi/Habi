'use client'

export type BuyerCartMode = 'BUY' | 'RENT' | 'LEASE'

export type BuyerCartItem = {
  listingId: string
  productId: string
  name: string
  imageUrl: string
  artisanName: string
  mode: BuyerCartMode
  price: number
  quantity: number
  impactKg: number
}

export type BuyerCartTotals = {
  subtotal: number
  itemCount: number
  impactKg: number
}

const CART_KEY = 'habi-buyer-cart-v1'

function readStorage(): BuyerCartItem[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStorage(items: BuyerCartItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent('habi-cart-change', { detail: items }))
}

function itemKey(item: Pick<BuyerCartItem, 'listingId' | 'mode'>) {
  return `${item.listingId}:${item.mode}`
}

export function getCartItems(): BuyerCartItem[] {
  return readStorage()
}

export function addItem(item: BuyerCartItem): BuyerCartItem[] {
  const items = readStorage()
  const key = itemKey(item)
  const next = items.some((current) => itemKey(current) === key)
    ? items.map((current) =>
        itemKey(current) === key
          ? { ...current, quantity: current.quantity + Math.max(1, item.quantity) }
          : current,
      )
    : [...items, { ...item, quantity: Math.max(1, item.quantity) }]

  writeStorage(next)
  return next
}

export function removeItem(listingId: string, mode: BuyerCartMode): BuyerCartItem[] {
  const next = readStorage().filter((item) => item.listingId !== listingId || item.mode !== mode)
  writeStorage(next)
  return next
}

export function updateQuantity(
  listingId: string,
  mode: BuyerCartMode,
  quantity: number,
): BuyerCartItem[] {
  const safeQuantity = Math.max(1, Math.round(quantity))
  const next = readStorage().map((item) =>
    item.listingId === listingId && item.mode === mode
      ? { ...item, quantity: safeQuantity }
      : item,
  )
  writeStorage(next)
  return next
}

export function clearCart(): BuyerCartItem[] {
  writeStorage([])
  return []
}

export function getCartTotals(items = readStorage()): BuyerCartTotals {
  return items.reduce(
    (totals, item) => ({
      subtotal: totals.subtotal + item.price * item.quantity,
      itemCount: totals.itemCount + item.quantity,
      impactKg: totals.impactKg + item.impactKg * item.quantity,
    }),
    { subtotal: 0, itemCount: 0, impactKg: 0 },
  )
}

export function formatMode(mode: BuyerCartMode) {
  if (mode === 'RENT') return 'Monthly Flex'
  if (mode === 'LEASE') return 'Long-term Plan'
  return 'Buy Permanently'
}
