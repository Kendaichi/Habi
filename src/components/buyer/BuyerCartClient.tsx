'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { CartItemCard } from '@/components/buyer/CartItemCard'
import { ImpactSummary } from '@/components/buyer/ImpactSummary'
import {
  getCartItems,
  getCartTotals,
  removeItem,
  updateQuantity,
  type BuyerCartItem,
} from '@/lib/buyer-cart'

export function BuyerCartClient() {
  const [items, setItems] = useState<BuyerCartItem[]>([])

  useEffect(() => {
    function handleChange() {
      setItems(getCartItems())
    }

    queueMicrotask(handleChange)
    window.addEventListener('habi-cart-change', handleChange)
    window.addEventListener('storage', handleChange)
    return () => {
      window.removeEventListener('habi-cart-change', handleChange)
      window.removeEventListener('storage', handleChange)
    }
  }, [])

  const totals = getCartTotals(items)

  if (items.length === 0) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-heading mt-5 text-3xl font-semibold text-charcoal sm:text-4xl">Your cart is open</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Add a buyer-ready Habi piece or bring in a room recommendation from AI Room.
        </p>
        <Link
          href="/buyer/home"
          className="mt-6 inline-flex rounded-lg bg-terracotta px-5 py-3 text-sm font-semibold text-cream"
        >
          Discover Pieces
        </Link>
      </section>
    )
  }

  return (
    <div className="space-y-5">
      <ImpactSummary impactKg={totals.impactKg} compact />
      <div className="space-y-3">
        {items.map((item) => (
          <CartItemCard
            key={`${item.listingId}-${item.mode}`}
            item={item}
            onQuantityChange={(quantity) => {
              setItems(updateQuantity(item.listingId, item.mode, quantity))
            }}
            onRemove={() => {
              setItems(removeItem(item.listingId, item.mode))
            }}
          />
        ))}
      </div>
      <section className="sticky bottom-28 rounded-lg border border-stone-200 bg-white p-5 shadow-[0_18px_44px_rgba(44,44,44,0.12)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
              {totals.itemCount} item{totals.itemCount === 1 ? '' : 's'}
            </p>
            <p className="text-2xl font-bold text-charcoal sm:text-3xl">
              PHP {totals.subtotal.toLocaleString('en-PH')}
            </p>
          </div>
          <Link
            href="/buyer/checkout"
            className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-4 text-sm font-semibold text-cream"
          >
            Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
