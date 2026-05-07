'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCartItems, getCartTotals } from '@/lib/buyer-cart'

export function BuyerCartBadge() {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    function refreshCartCount() {
      setItemCount(getCartTotals(getCartItems()).itemCount)
    }

    queueMicrotask(refreshCartCount)
    window.addEventListener('habi-cart-change', refreshCartCount)
    window.addEventListener('storage', refreshCartCount)

    return () => {
      window.removeEventListener('habi-cart-change', refreshCartCount)
      window.removeEventListener('storage', refreshCartCount)
    }
  }, [])

  return (
    <Link
      href="/buyer/cart"
      aria-label={itemCount > 0 ? `Shopping cart with ${itemCount} items` : 'Shopping cart'}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-forest shadow-sm"
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-cream">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null}
    </Link>
  )
}
