'use client'

import { createContext, useContext, useEffect, useTransition, useState } from 'react'
import {
  getCartItems,
  addCartItem,
  removeCartItem as removeCartItemAction,
  clearCartItems,
  checkoutCart,
} from '@/app/artisan/materials/cart/actions'

export type CartItem = {
  materialId: string
  type: string
  quantityKg: number
  pricePerKg: number
  hubId: string
  hubName: string
}

type CartContextType = {
  items: CartItem[]
  isLoading: boolean
  addItem: (item: CartItem) => void
  removeItem: (materialId: string) => void
  clearCart: () => void
  isInCart: (materialId: string) => boolean
  checkout: (notes?: string) => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const LS_KEY = 'habi-quote-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [, startTransition] = useTransition()

  useEffect(() => {
    getCartItems()
      .then(setItems)
      .catch(() => {
        try {
          const stored = localStorage.getItem(LS_KEY)
          if (stored) setItems(JSON.parse(stored))
        } catch {}
      })
      .finally(() => setIsLoading(false))
  }, [])

  function addItem(item: CartItem) {
    setItems((prev) =>
      prev.some((i) => i.materialId === item.materialId) ? prev : [...prev, item],
    )
    startTransition(() => {
      addCartItem(item).catch(console.error)
    })
  }

  function removeItem(materialId: string) {
    setItems((prev) => prev.filter((i) => i.materialId !== materialId))
    startTransition(() => {
      removeCartItemAction(materialId).catch(console.error)
    })
  }

  function clearCart() {
    setItems([])
    startTransition(() => {
      clearCartItems().catch(console.error)
    })
  }

  function isInCart(materialId: string) {
    return items.some((i) => i.materialId === materialId)
  }

  async function checkout(notes?: string) {
    await checkoutCart(notes)
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{ items, isLoading, addItem, removeItem, clearCart, isInCart, checkout }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
