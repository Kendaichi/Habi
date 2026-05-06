'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { addItem } from '@/lib/buyer-cart'
import type { RoomRecommendation } from '@/types/room'

type RoomResultActionsProps = {
  recommendation: RoomRecommendation
}

export function RoomResultActions({ recommendation }: RoomResultActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() =>
          addItem({
            listingId: recommendation.listingId,
            productId: recommendation.productId,
            name: recommendation.productName,
            imageUrl: recommendation.imageUrl,
            artisanName: recommendation.artisanName,
            mode: recommendation.primaryMode,
            price: recommendation.price,
            quantity: 1,
            impactKg: 12,
          })
        }
        className="flex items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-3 text-sm font-semibold text-cream"
      >
        <ShoppingBag className="h-4 w-4" />
        Add to Cart
      </button>
      <Link
        href={`/buyer/room/visualizer/${recommendation.listingId}`}
        className="rounded-lg border border-forest px-4 py-3 text-center text-sm font-semibold text-forest"
      >
        Inspect
      </Link>
    </div>
  )
}
