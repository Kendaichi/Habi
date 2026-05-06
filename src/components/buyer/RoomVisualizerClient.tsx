'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LocateFixed, Share2, Sparkles, ZoomIn } from 'lucide-react'
import { BuyRentLeaseToggle, type ToggleValue } from '@/components/shared/BuyRentLeaseToggle'
import type { RoomVisualizerPayload } from '@/types/room'

interface RoomVisualizerClientProps {
  payload: RoomVisualizerPayload
}

export function RoomVisualizerClient({ payload }: RoomVisualizerClientProps) {
  const [mode, setMode] = useState<ToggleValue>(payload.primaryMode.toLowerCase() as ToggleValue)

  return (
    <div className="min-h-screen bg-[#efe3d4] pb-8">
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${payload.generatedImageUrl})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,246,240,0.92)_0%,rgba(250,246,240,0.18)_26%,rgba(250,246,240,0.82)_100%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 pt-5">
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

          <div className="mt-18 flex-1 rounded-[38px] border border-white/70 bg-white/82 p-6 shadow-[0_28px_70px_rgba(44,44,44,0.14)] backdrop-blur-md">
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
                <div className="rounded-[28px] border border-forest/12 bg-forest/6 p-4">
                  <p className="text-forest text-sm font-semibold">Threaded Story</p>
                  <p className="text-charcoal mt-1 text-xl">See Traceability Map</p>
                  <p className="text-stone mt-2 text-sm">
                    From {payload.traceability.wasteSupplierName} through {payload.traceability.junkShopName}.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="mt-7 rounded-[28px] bg-white/80 p-5">
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

          <div className="mt-6 rounded-[34px] border border-white/80 bg-white/88 p-5 shadow-[0_20px_50px_rgba(44,44,44,0.12)] backdrop-blur-md">
            <button className="bg-terracotta text-cream flex w-full items-center justify-center gap-3 rounded-3xl px-5 py-5 text-2xl font-semibold">
              <Sparkles className="h-6 w-6" />
              Add to My Space
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
