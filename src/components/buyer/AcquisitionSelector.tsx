'use client'

import { useMemo, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { addItem, type BuyerCartItem, type BuyerCartMode, formatMode } from '@/lib/buyer-cart'

type ListingOption = {
  listingId: string
  mode: BuyerCartMode
  price: number
}

type AcquisitionSelectorProps = {
  productId: string
  name: string
  imageUrl: string
  artisanName: string
  materialType: string
  options: ListingOption[]
  impactKg: number
}

const modeNotes: Record<BuyerCartMode, string> = {
  BUY: 'Own the piece permanently and keep its verified material story.',
  RENT: 'Flexible monthly styling for seasonal rooms and evolving spaces.',
  LEASE: 'A longer plan for statement pieces with predictable payments.',
}

function fallbackOptions(options: ListingOption[]): ListingOption[] {
  if (options.length > 0) return options
  return [{ listingId: 'prototype-listing', mode: 'BUY', price: 2800 }]
}

export function AcquisitionSelector({
  productId,
  name,
  imageUrl,
  artisanName,
  materialType,
  options,
  impactKg,
}: AcquisitionSelectorProps) {
  const safeOptions = useMemo(() => fallbackOptions(options), [options])
  const [selectedMode, setSelectedMode] = useState<BuyerCartMode>(safeOptions[0].mode)
  const [added, setAdded] = useState(false)
  const active = safeOptions.find((option) => option.mode === selectedMode) ?? safeOptions[0]

  function handleAdd() {
    const item: BuyerCartItem = {
      listingId: active.listingId,
      productId,
      name,
      imageUrl,
      artisanName,
      mode: active.mode,
      price: active.price,
      quantity: 1,
      impactKg,
    }
    addItem(item)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
        Acquisition
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {safeOptions.map((option) => {
          const activeOption = option.mode === selectedMode
          return (
            <button
              key={`${option.listingId}-${option.mode}`}
              type="button"
              onClick={() => setSelectedMode(option.mode)}
              className={`min-h-16 rounded-lg border px-2 py-2 text-center text-xs font-semibold transition ${
                activeOption
                  ? 'border-forest bg-forest text-cream'
                  : 'border-stone-200 bg-cream text-charcoal'
              }`}
            >
              {option.mode === 'BUY' ? 'Buy' : option.mode === 'RENT' ? 'Rent' : 'Lease'}
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-lg bg-cream p-4">
        <p className="font-heading text-2xl font-semibold text-charcoal">{formatMode(active.mode)}</p>
        <p className="mt-1 text-sm leading-relaxed text-stone">{modeNotes[active.mode]}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone">
              {active.mode === 'BUY' ? 'Total' : 'Starts at'}
            </p>
            <p className="text-3xl font-bold text-charcoal">
              PHP {active.price.toLocaleString('en-PH')}
            </p>
          </div>
          <p className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
            {materialType}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-terracotta px-5 py-4 text-base font-semibold text-cream shadow-[0_14px_34px_rgba(200,85,61,0.22)]"
      >
        <ShoppingBag className="h-5 w-5" />
        {added ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </section>
  )
}
