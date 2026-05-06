'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LocateFixed, Share2, ShoppingBag, Sparkles, ZoomIn } from 'lucide-react'
import { BuyRentLeaseToggle, type ToggleValue } from '@/components/shared/BuyRentLeaseToggle'
import { addItem, type BuyerCartMode } from '@/lib/buyer-cart'
import type { RoomVisualizerPayload } from '@/types/room'

interface RoomVisualizerClientProps {
  payload: RoomVisualizerPayload
}

export function RoomVisualizerClient({ payload }: RoomVisualizerClientProps) {
  const [mode, setMode] = useState<ToggleValue>(payload.primaryMode.toLowerCase() as ToggleValue)
  const [added, setAdded] = useState(false)

  const cartMode = mode.toUpperCase() as BuyerCartMode

  function handleAdd() {
    addItem({
      listingId: payload.listingId,
      productId: payload.productId,
      name: payload.productName,
      imageUrl: payload.generatedImageUrl,
      artisanName: payload.artisanName,
      mode: cartMode,
      price: payload.price,
      quantity: 1,
      impactKg: 12,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="min-h-screen bg-[#efe3d4] pb-8 lg:overflow-hidden">
      <div
        className="relative min-h-screen bg-cover bg-center lg:bg-fixed"
        style={{ backgroundImage: `url(${payload.generatedImageUrl})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,246,240,0.92)_0%,rgba(250,246,240,0.18)_26%,rgba(250,246,240,0.82)_100%)]" />

        <button
          type="button"
          className="absolute top-[34%] left-[23%] z-10 h-6 w-6 animate-pulse rounded-full border-2 border-white bg-terracotta shadow-[0_0_0_10px_rgba(200,85,61,0.18)]"
          aria-label="Hotspot: material source"
        />
        <button
          type="button"
          className="absolute top-[52%] right-[28%] z-10 h-6 w-6 animate-pulse rounded-full border-2 border-white bg-forest shadow-[0_0_0_10px_rgba(27,94,63,0.18)]"
          aria-label="Hotspot: product specs"
        />

        <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 pt-5 lg:max-w-6xl lg:grid-cols-[1fr_420px] lg:gap-6 lg:pb-6">
          <div className="flex items-center justify-between">
            <Link href="/buyer/room/result" className="text-forest inline-flex items-center gap-2">
              <ArrowLeft className="h-6 w-6" />
              <span className="font-heading text-2xl font-semibold">Visualizer</span>
            </Link>
            <Link
              href="/buyer/room/upload"
              className="rounded-full border border-white/70 bg-white/55 px-4 py-2 text-sm font-semibold text-charcoal backdrop-blur-md"
            >
              Change Room
            </Link>
          </div>

          <div className="mt-18 flex-1 rounded-lg border border-white/70 bg-white/82 p-6 shadow-[0_28px_70px_rgba(44,44,44,0.14)] backdrop-blur-md lg:ml-auto lg:w-[420px]">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="text-stone">Lighting</span>
              <span className="text-stone/50">•</span>
              <span className="text-terracotta">In Stock</span>
            </div>

            <h1 className="font-heading text-charcoal mt-8 text-5xl leading-tight font-semibold">
              {payload.productName}
            </h1>
            <p className="mt-3 text-2xl text-stone">
              by <span className="text-forest font-semibold">{payload.artisanName}</span>
            </p>
            <p className="text-stone mt-3 text-lg">{payload.roomTheme}</p>
            {payload.worldAssetUrl ? (
              <p className="text-forest mt-2 text-sm font-semibold uppercase tracking-[0.18em]">
                World shell ready as {payload.worldAssetFormat?.toUpperCase() ?? '3D asset'}
              </p>
            ) : null}

            <div className="mt-8">
              <BuyRentLeaseToggle value={mode} onChange={setMode} />
            </div>

            <div className="mt-8">
              <p className="text-charcoal text-6xl font-semibold">
                ₱{payload.price.toLocaleString('en-PH')}
              </p>
              <p className="text-forest mt-2 text-lg font-semibold">
                Best for a {payload.roomTheme.toLowerCase()} room
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone shadow-md">
                  <ZoomIn className="h-7 w-7" />
                </button>
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone shadow-md">
                  <LocateFixed className="h-7 w-7" />
                </button>
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone shadow-md">
                  <Share2 className="h-7 w-7" />
                </button>
              </div>

              {payload.traceability ? (
                <div className="rounded-lg border border-forest/12 bg-forest/6 p-4">
                  <p className="text-forest text-sm font-semibold">Threaded Story</p>
                  <p className="text-charcoal mt-1 text-xl">See Traceability Map</p>
                  <p className="text-stone mt-2 text-sm">
                    From {payload.traceability.wasteSupplierName} through {payload.traceability.junkShopName}.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-7 rounded-lg bg-white/80 p-5">
              <div className="flex flex-wrap gap-2">
                {payload.reasonTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-mustard/12 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-charcoal uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-charcoal mt-4 text-lg leading-relaxed">{payload.description}</p>
              <p className="text-stone mt-4 text-base leading-relaxed">{payload.summary}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-white/80 bg-white/88 p-5 shadow-[0_20px_50px_rgba(44,44,44,0.12)] backdrop-blur-md lg:ml-auto lg:w-[420px]">
            <button
              type="button"
              onClick={handleAdd}
              className="bg-terracotta text-cream flex w-full items-center justify-center gap-3 rounded-lg px-5 py-5 text-xl font-semibold"
            >
              {added ? <Sparkles className="h-6 w-6" /> : <ShoppingBag className="h-6 w-6" />}
              {added ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
