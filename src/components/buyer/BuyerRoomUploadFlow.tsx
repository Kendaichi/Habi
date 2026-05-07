'use client'

import { Camera, ChevronLeft, ImagePlus, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { ROOM_PRESETS } from '@/lib/room-presets'
import { supabase } from '@/lib/supabase'
import type { RoomImageInsights, RoomPresetId } from '@/types/room'

const ROOM_SCAN_BUCKET = 'room-scans'

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function toHex(value: [number, number, number]) {
  return `#${value.map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('')}`
}

async function analyzeImage(file: File): Promise<RoomImageInsights> {
  const bitmap = await createImageBitmap(file)
  const sampleWidth = 48
  const sampleHeight = Math.max(32, Math.round((bitmap.height / bitmap.width) * sampleWidth))
  const canvas = document.createElement('canvas')
  canvas.width = sampleWidth
  canvas.height = sampleHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return {
      width: bitmap.width,
      height: bitmap.height,
      orientation: bitmap.width === bitmap.height ? 'square' : bitmap.width > bitmap.height ? 'landscape' : 'portrait',
      averageBrightness: 0.6,
      contrast: 0.3,
      warmth: 0.5,
      dominantColors: ['#e9ddd0', '#d7c0ab', '#6e5848'],
      focusZones: { left: 0.33, center: 0.34, right: 0.33, top: 0.4, bottom: 0.6 },
    }
  }

  ctx.drawImage(bitmap, 0, 0, sampleWidth, sampleHeight)
  const { data } = ctx.getImageData(0, 0, sampleWidth, sampleHeight)

  let totalBrightness = 0
  let totalWarmth = 0
  let totalContrastBase = 0
  let left = 0
  let center = 0
  let right = 0
  let top = 0
  let bottom = 0
  const buckets = new Map<string, { count: number; color: [number, number, number] }>()

  for (let index = 0; index < data.length; index += 4) {
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const pixel = index / 4
    const x = pixel % sampleWidth
    const y = Math.floor(pixel / sampleWidth)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    const warmth = clamp((r - b + 255) / 510, 0, 1)

    totalBrightness += brightness
    totalWarmth += warmth
    totalContrastBase += brightness * brightness

    if (x < sampleWidth / 3) left += brightness
    else if (x < (sampleWidth * 2) / 3) center += brightness
    else right += brightness

    if (y < sampleHeight / 2) top += brightness
    else bottom += brightness

    const qr = Math.round(r / 32) * 32
    const qg = Math.round(g / 32) * 32
    const qb = Math.round(b / 32) * 32
    const key = `${qr}-${qg}-${qb}`
    const current = buckets.get(key)
    if (current) {
      current.count += 1
    } else {
      buckets.set(key, { count: 1, color: [qr, qg, qb] })
    }
  }

  const pixelCount = data.length / 4
  const averageBrightness = totalBrightness / pixelCount
  const variance = totalContrastBase / pixelCount - averageBrightness * averageBrightness
  const dominantColors = Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((entry) => toHex(entry.color))

  while (dominantColors.length < 3) dominantColors.push(dominantColors[dominantColors.length - 1] ?? '#d8c4b0')

  return {
    width: bitmap.width,
    height: bitmap.height,
    orientation: bitmap.width === bitmap.height ? 'square' : bitmap.width > bitmap.height ? 'landscape' : 'portrait',
    averageBrightness: Number(averageBrightness.toFixed(3)),
    contrast: Number(clamp(Math.sqrt(Math.max(variance, 0)) * 1.9, 0, 1).toFixed(3)),
    warmth: Number((totalWarmth / pixelCount).toFixed(3)),
    dominantColors: dominantColors as [string, string, string],
    focusZones: {
      left: Number((left / totalBrightness).toFixed(3)),
      center: Number((center / totalBrightness).toFixed(3)),
      right: Number((right / totalBrightness).toFixed(3)),
      top: Number((top / totalBrightness).toFixed(3)),
      bottom: Number((bottom / totalBrightness).toFixed(3)),
    },
  }
}

export function BuyerRoomUploadFlow() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const extraInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedPreset, setSelectedPreset] = useState<RoomPresetId>(ROOM_PRESETS[0].id)
  const [notes, setNotes] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sourceViews, setSourceViews] = useState<string[]>([])
  const [imageInsights, setImageInsights] = useState<RoomImageInsights | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const insights = await analyzeImage(file)
    setImageInsights(insights)

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleExtraFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, 3)
    if (files.length === 0) return

    for (const file of files) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSourceViews((current) => [...current, reader.result as string].slice(0, 3))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  async function uploadRoomView(dataUrl: string, index: number): Promise<string> {
    if (!supabase) return dataUrl

    try {
      const blob = await fetch(dataUrl).then((response) => response.blob())
      const extension = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
      const path = `buyer-room/${crypto.randomUUID()}-${index}.${extension}`
      const { error: uploadError } = await supabase.storage
        .from(ROOM_SCAN_BUCKET)
        .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false })

      if (uploadError) return dataUrl

      const { data } = supabase.storage.from(ROOM_SCAN_BUCKET).getPublicUrl(path)
      return data.publicUrl || dataUrl
    } catch {
      return dataUrl
    }
  }

  function handleGenerate() {
    setError(null)
    if (!previewUrl) {
      setError('Upload a primary room photo before generating.')
      return
    }

    startTransition(async () => {
      const uploadedViews = await Promise.all(
        [previewUrl, ...sourceViews].map((view, index) => uploadRoomView(view, index)),
      )
      const [primaryImageUrl, ...additionalViews] = uploadedViews

      const response = await fetch('/api/room/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetId: selectedPreset,
          imageUrl: primaryImageUrl,
          sourceViews: additionalViews,
          notes,
          imageInsights: imageInsights ?? undefined,
        }),
      })

      if (!response.ok) {
        setError('Unable to start the room visualizer right now.')
        return
      }

      const data = (await response.json()) as { roomId: string }
      router.push(`/buyer/room/processing?roomId=${data.roomId}`)
    })
  }

  const selectedRoom = ROOM_PRESETS.find((preset) => preset.id === selectedPreset) ?? ROOM_PRESETS[0]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(229,168,35,0.12),_transparent_36%),linear-gradient(180deg,_#faf6f0_0%,_#fffaf5_52%,_#f8f2ea_100%)] pb-28">
      <header className="border-stone/20 sticky top-0 z-20 flex items-center justify-between border-b bg-white/75 px-5 py-4 backdrop-blur-md">
        <Link href="/buyer/home" className="text-forest inline-flex items-center gap-2 text-sm font-medium">
          <ChevronLeft className="h-5 w-5" />
          Back
        </Link>
        <span className="text-forest font-heading text-2xl font-semibold">Visualizer</span>
        <div className="w-12" />
      </header>

      <div className="mx-auto max-w-md px-5 pt-8">
        <div className="space-y-4 text-center">
          <h1 className="font-heading text-charcoal text-5xl leading-tight font-semibold">
            Visualize Your Future Space
          </h1>
          <p className="text-stone text-lg leading-relaxed">
            Our AI maps your room, lighting, and empty areas to suggest artisan pieces that feel
            made for the space.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-10 flex w-full flex-col items-center justify-center gap-4 rounded-full border-2 border-dashed border-forest/25 bg-white/75 px-8 py-12 text-center shadow-[0_24px_60px_rgba(27,94,63,0.08)]"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest text-cream shadow-lg">
            {previewUrl ? <ImagePlus className="h-9 w-9" /> : <Camera className="h-9 w-9" />}
          </div>
          <div>
            <p className="text-forest text-3xl font-semibold">
              {previewUrl ? 'Room photo ready' : 'Take a photo of your room'}
            </p>
            <p className="text-stone mt-2 text-base">
              {previewUrl ? 'Tap again to replace it from your camera roll.' : 'or tap to upload from gallery'}
            </p>
          </div>
          {previewUrl ? (
            <div
              className="h-28 w-full rounded-[28px] border border-white/70 bg-cover bg-center"
              style={{ backgroundImage: `url(${previewUrl})` }}
            />
          ) : (
            <div className="flex items-center gap-3 rounded-full bg-forest/8 px-4 py-2 text-sm text-forest">
              <Sparkles className="h-4 w-4" />
              Mobile capture works here too.
            </div>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        <input
          ref={extraInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleExtraFiles}
        />

        {previewUrl ? (
          <div className="mt-5 rounded-[24px] border border-forest/15 bg-white/75 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-forest text-xs font-semibold uppercase tracking-[0.2em]">
                  Optional views
                </p>
                <p className="text-stone mt-1 text-sm">
                  Add left, right, or corner angles to improve full-room mesh accuracy.
                </p>
              </div>
              <button
                type="button"
                onClick={() => extraInputRef.current?.click()}
                className="shrink-0 rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest"
              >
                Add
              </button>
            </div>

            {sourceViews.length > 0 ? (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {sourceViews.map((view, index) => (
                  <div
                    key={`${view.slice(0, 24)}-${index}`}
                    className="relative h-20 overflow-hidden rounded-2xl border border-white bg-cover bg-center"
                    style={{ backgroundImage: `url(${view})` }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSourceViews((current) => current.filter((_, viewIndex) => viewIndex !== index))
                      }
                      className="absolute right-1 top-1 rounded-full bg-charcoal/70 px-2 py-0.5 text-[10px] font-bold text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 grid gap-3">
          {ROOM_PRESETS.map((preset) => {
            const selected = preset.id === selectedPreset

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset.id)}
                className={`rounded-[28px] border p-4 text-left transition-all ${
                  selected
                    ? 'border-forest bg-white shadow-[0_18px_44px_rgba(27,94,63,0.14)]'
                    : 'border-stone-200 bg-white/70'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="bg-mustard/15 text-charcoal rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {preset.badge}
                    </span>
                    <h2 className="font-heading text-charcoal mt-3 text-2xl font-semibold">
                      {preset.name}
                    </h2>
                    <p className="text-stone mt-2 text-sm leading-relaxed">{preset.description}</p>
                  </div>
                  <div
                    className="h-16 w-16 shrink-0 rounded-3xl border border-white/70"
                    style={{
                      background: `linear-gradient(145deg, ${preset.wall}, ${preset.floor})`,
                    }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 rounded-[30px] border border-stone-200 bg-white/75 p-5">
          <h3 className="text-forest font-heading text-2xl font-semibold">AI studio note</h3>
          <p className="text-stone mt-2 text-sm leading-relaxed">{selectedRoom.tip}</p>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Optional: tell the AI what you want to emphasize, like more seating, wall art, or a brighter mood."
            className="mt-4 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-charcoal outline-none transition focus:border-forest"
          />
        </div>

        {!previewUrl ? (
          <div className="mt-6 rounded-2xl border border-mustard/30 bg-mustard/10 px-4 py-3 text-center">
            <p className="text-charcoal text-sm font-semibold">
              📷 Upload a room photo to generate a real AI room
            </p>
            <p className="text-stone mt-1 text-xs">
              Without a photo the result is a preset colour preview, not AI-generated.
            </p>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm font-medium text-terracotta">{error}</p> : null}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isPending}
          className="bg-terracotta text-cream mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-lg font-semibold shadow-[0_18px_40px_rgba(200,85,61,0.24)] transition hover:opacity-95 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {previewUrl ? 'Reconstruct Room' : 'Preview Room'}
        </button>
      </div>
    </div>
  )
}
