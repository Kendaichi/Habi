'use client'

import { useState } from 'react'

type BeforeAfterSliderProps = {
  beforeImageUrl: string
  afterImageUrl: string
}

export function BeforeAfterSlider({ beforeImageUrl, afterImageUrl }: BeforeAfterSliderProps) {
  const [value, setValue] = useState(58)

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_44px_rgba(44,44,44,0.1)]">
      <div className="relative h-80 bg-stone-100">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${beforeImageUrl})` }}
        />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${value}%` }}
        >
          <div
            className="h-full bg-cover bg-center"
            style={{ width: `${10000 / Math.max(value, 1)}%`, backgroundImage: `url(${afterImageUrl})` }}
          />
        </div>
        <div className="absolute inset-y-0" style={{ left: `${value}%` }}>
          <div className="-ml-px h-full w-0.5 bg-white shadow-lg" />
          <div className="absolute top-1/2 -left-5 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-forest shadow-lg">
            {value}
          </div>
        </div>
        <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest">
          AI Composited
        </div>
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-charcoal">
          Original
        </div>
      </div>
      <div className="p-4">
        <input
          aria-label="Before after slider"
          type="range"
          min="8"
          max="92"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="w-full accent-terracotta"
        />
      </div>
    </div>
  )
}
