'use client'

import { Box, ExternalLink, Maximize2, Minimize2, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { RoomWorldPayload } from '@/types/room'

const ThreeRoomViewer = dynamic(
  () => import('@/components/buyer/ThreeRoomViewer').then((m) => m.ThreeRoomViewer),
  { ssr: false },
)

interface RoomWorldClientProps {
  payload: RoomWorldPayload
}

export function RoomWorldClient({ payload }: RoomWorldClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeListingId, setActiveListingId] = useState<string | null>(
    payload.scene.hotspots[0]?.listingId ?? null,
  )
  const activeHotspot = activeListingId
    ? payload.scene.hotspots.find((h) => h.listingId === activeListingId) ?? null
    : null

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  async function enterFullscreen() {
    if (!containerRef.current) return
    await containerRef.current.requestFullscreen()
    try {
      // lock() is a mobile-browser API not in the base TS lib
      await (screen.orientation as unknown as { lock(o: string): Promise<void> }).lock('landscape')
    } catch {
      // orientation lock not supported on all platforms — silently ignore
    }
  }

  async function exitFullscreen() {
    await document.exitFullscreen()
    try {
      (screen.orientation as unknown as { unlock(): void }).unlock()
    } catch {
      // ignore
    }
  }

  const scene3D = payload.worldAssetUrl ? (
    <ThreeRoomViewer
      worldAssetUrl={payload.worldAssetUrl}
      hotspots={payload.scene.hotspots}
      activeListingId={activeListingId}
      onHotspotClick={setActiveListingId}
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(27,94,63,0.08),_transparent_35%),linear-gradient(180deg,_#faf6f0_0%,_#fffaf7_100%)] px-6 text-center">
      <div className="max-w-xs rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_48px_rgba(44,44,44,0.08)]">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
          Waiting for 3D world
        </p>
        <h2 className="font-heading text-charcoal mt-3 text-2xl font-semibold">
          Your generated room is still syncing
        </h2>
        <p className="text-stone mt-3 text-sm leading-relaxed">
          We only open this scene once 3D AI Studio returns the actual world asset.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f6efe7] pb-10">
      <div className="relative mx-auto max-w-md px-4 pt-6">
        {/* 3D canvas + fullscreen container */}
        <div
          ref={containerRef}
          className={
            isFullscreen
              ? 'fixed inset-0 z-50 bg-black'
              : 'relative h-[74vh] overflow-hidden rounded-[36px] border border-white/70 shadow-[0_30px_70px_rgba(73,50,36,0.18)]'
          }
        >
          {scene3D}

          {/* Header overlay */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-white/65 px-5 py-4 backdrop-blur-md">
            <div>
              <p className="text-stone text-xs font-semibold uppercase tracking-[0.24em]">
                {payload.worldAssetUrl ? 'Reconstructed 3D room · drag to explore' : 'Waiting for reconstructed room'}
              </p>
              <h1 className="text-forest font-heading text-3xl font-semibold">{payload.roomTheme}</h1>
              <p className="text-stone mt-1 text-[11px] font-medium uppercase tracking-[0.18em]">
                {payload.worldKind === 'reconstructed' && payload.worldAssetUrl
                  ? `Room-photo reconstruction · ${payload.worldAssetFormat?.toUpperCase() ?? 'GLB'}`
                  : payload.generationProvider?.startsWith('3d-ai-studio') && payload.worldAssetUrl
                    ? `3D AI Studio world · ${payload.worldAssetFormat?.toUpperCase() ?? 'GLB'}`
                  : payload.worldKind === 'composed' && payload.worldAssetUrl
                    ? `Composed world · ${payload.worldAssetFormat?.toUpperCase() ?? 'GLB'}`
                  : payload.generationProvider?.startsWith('3d-ai-studio')
                    ? 'Helper world shell'
                    : 'Preview room · upload a photo for full reconstruction'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                className="rounded-full border border-white/80 bg-white/75 p-2 text-charcoal"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              {!isFullscreen && (
                <Link
                  href="/buyer/room/result"
                  className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-charcoal"
                >
                  Exit
                </Link>
              )}
            </div>
          </div>

          {/* Active hotspot card — bottom sheet in fullscreen, hidden otherwise (shown below) */}
          {isFullscreen && activeHotspot ? (
            <div className="absolute inset-x-4 bottom-6 z-10 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_22px_50px_rgba(44,44,44,0.18)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
                    Clickable product
                  </p>
                  <h2 className="font-heading text-charcoal mt-1 text-2xl font-semibold leading-tight">
                    {activeHotspot.name}
                  </h2>
                  <p className="text-stone mt-1 text-sm">by {activeHotspot.artisanName}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="text-charcoal text-xl font-semibold">
                    ₱{activeHotspot.price.toLocaleString('en-PH')}
                  </p>
                  <Link
                    href={activeHotspot.route}
                    className="bg-terracotta text-cream inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold"
                  >
                    View
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveListingId(null)}
                    className="rounded-full border border-stone-200 p-2 text-stone"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Product card — normal (non-fullscreen) view */}
        {!isFullscreen && activeHotspot ? (
          <div className="mt-5 rounded-[30px] border border-stone-200 bg-white p-5 shadow-[0_22px_50px_rgba(44,44,44,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
                  Clickable product
                </p>
                <h2 className="font-heading text-charcoal mt-2 text-3xl font-semibold">
                  {activeHotspot.name}
                </h2>
                <p className="text-stone mt-2 text-sm">by {activeHotspot.artisanName}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveListingId(null)}
                className="rounded-full border border-stone-200 p-2 text-stone"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-forest/6 px-4 py-3">
              <Box className="text-forest h-5 w-5" />
              <p className="text-charcoal text-sm leading-relaxed">
                {activeHotspot.reason} and ready as a {activeHotspot.primaryMode.toLowerCase()} piece.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-stone text-xs uppercase tracking-[0.22em]">From</p>
                <p className="text-charcoal text-2xl font-semibold">
                  ₱{activeHotspot.price.toLocaleString('en-PH')}
                </p>
              </div>
              <Link
                href={activeHotspot.route}
                className="bg-terracotta text-cream inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
              >
                View Product
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : null}

        {!isFullscreen && payload.generationWarnings.length > 0 ? (
          <div className="mt-4 rounded-[24px] border border-mustard/30 bg-mustard/10 px-4 py-3">
            <p className="text-charcoal text-sm font-semibold">Generation notes</p>
            <p className="text-stone mt-1 text-sm leading-relaxed">
              {payload.generationWarnings[0]}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
