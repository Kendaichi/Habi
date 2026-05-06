'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatMode, type BuyerCartItem } from '@/lib/buyer-cart'

type CartItemCardProps = {
  item: BuyerCartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  return (
    <article className="grid grid-cols-[96px_1fr] gap-4 rounded-lg border border-stone-200 bg-white p-3 shadow-sm">
      <div
        className="h-28 rounded-lg bg-cream bg-cover bg-center"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-heading text-xl font-semibold text-charcoal">{item.name}</p>
            <p className="mt-1 text-xs text-stone">by {item.artisanName}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove item"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 inline-flex rounded-full bg-forest/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
          {formatMode(item.mode)}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-bold text-charcoal">PHP {item.price.toLocaleString('en-PH')}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
