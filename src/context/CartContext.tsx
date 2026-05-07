'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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
  addItem: (item: CartItem) => void
  removeItem: (materialId: string) => void
  clearCart: () => void
  isInCart: (materialId: string) => boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('habi-quote-cart')
    if (!stored) return []
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('habi-quote-cart', JSON.stringify(items))
  }, [items])

  function addItem(item: CartItem) {
    setItems((prev) => (prev.some((i) => i.materialId === item.materialId) ? prev : [...prev, item]))
  }

  function removeItem(materialId: string) {
    setItems((prev) => prev.filter((i) => i.materialId !== materialId))
  }

  function clearCart() {
    setItems([])
  }

  function isInCart(materialId: string) {
    return items.some((i) => i.materialId === materialId)
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
