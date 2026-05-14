'use client'

import { Camera, ChevronLeft, ImagePlus, Loader2, Search, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { supabase } from '@/lib/supabase'

type ListingInfo = {
  listingId: string
  productId: string
  productName: string
  materialType: string
  artisanName: string
  imageUrl: string
  price: number
}

type DesignMode = 'redesign' | 'preview'

const ROOM_SCAN_BUCKET = 'room-scans'

async function uploadRoomImage(dataUrl: string): Promise<string | null> {
  if (!supabase) return null
  try {
    const blob = await fetch(dataUrl).then((r) => r.blob())
    const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
    const path = `buyer-room/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from(ROOM_SCAN_BUCKET)
      .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false })
    if (error) return null
    const { data } = supabase.storage.from(ROOM_SCAN_BUCKET).getPublicUrl(path)
    return data.publicUrl || null
  } catch {
    return null
  }
}

export function RoomImageDesignFlow({ listing }: { listing?: ListingInfo }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<DesignMode>(listing ? 'preview' : 'redesign')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function handleGenerate() {
    setError(null)
    if (!previewUrl) {
      setError('Upload a photo of your room first.')
      return
    }

    startTransition(async () => {
      const roomImageUrl = await uploadRoomImage(previewUrl)
      if (!roomImageUrl) {
        setError('Failed to upload room photo. Check that the "room-scans" bucket exists in Supabase Storage.')
        return
      }

      const res = await fetch('/api/room/image-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomImageUrl,
          listingId: listing?.listingId,
          listingImageUrl: listing?.imageUrl,
          productName: listing?.productName,
          materialType: listing?.materialType,
          mode,
        }),
      })

      if (!res.ok) {
        setError('Something went wrong. Try again.')
        return
      }

      const data = (await res.json()) as import('@/api/room/image-design').ImageDesignJob
      const params = new URLSearchParams({
        mode: data.mode,
        sourceUrl: data.sourceImageUrl,
        generatedUrl: data.generatedImageUrl,
        isMock: String(data.isMock),
        ...(data.listingId ? { listingId: data.listingId } : {}),
      })
      router.push(`/buyer/room/image-result?${params.toString()}`)
    })
  }

  const canGenerate = !!previewUrl && (mode === 'redesign' || !!listing)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(229,168,35,0.12),_transparent_36%),linear-gradient(180deg,_#faf6f0_0%,_#fffaf5_52%,_#f8f2ea_100%)] pb-28">
      <header className="border-stone/20 sticky top-0 z-20 flex items-center justify-between border-b bg-white/75 px-5 py-4 backdrop-blur-md">
        <Link href="/buyer/home" className="text-forest inline-flex items-center gap-2 text-sm font-medium">
          <ChevronLeft className="h-5 w-5" />
          Back
        </Link>
        <span className="text-forest font-heading text-2xl font-semibold">Image Design</span>
        <div className="w-12" />
      </header>

      <div className="mx-auto max-w-md px-5 pt-8">
        <div className="space-y-3 text-center">
          <h1 className="font-heading text-charcoal text-5xl leading-tight font-semibold">
            Design Your Space
          </h1>
          <p className="text-stone text-lg leading-relaxed">
            Upload a room photo and choose how you&apos;d like to visualize artisan pieces in it.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white/75 p-1.5">
          <button
            type="button"
            onClick={() => setMode('redesign')}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
              mode === 'redesign'
                ? 'bg-forest text-cream shadow-sm'
                : 'text-stone hover:text-charcoal'
            }`}
          >
            <Wand2 className="h-4 w-4" />
            Full Redesign
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
              mode === 'preview'
                ? 'bg-forest text-cream shadow-sm'
                : 'text-stone hover:text-charcoal'
            }`}
          >
            <Search className="h-4 w-4" />
            Preview Item
          </button>
        </div>

        {mode === 'redesign' && (
          <p className="mt-3 text-center text-sm text-stone">
            AI will suggest artisan pieces and generate a redesigned room image.
          </p>
        )}

        {mode === 'preview' && !listing && (
          <div className="mt-4 rounded-2xl border border-mustard/30 bg-mustard/10 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-charcoal">No item selected</p>
            <p className="mt-1 text-xs text-stone">
              Browse a product and tap &ldquo;See in My Room&rdquo; to preview a specific item here.
            </p>
            <Link
              href="/buyer/home"
              className="mt-2 inline-block text-xs font-semibold text-forest underline underline-offset-4"
            >
              Browse products
            </Link>
          </div>
        )}

        {mode === 'preview' && listing && (
          <div className="mt-4 flex items-center gap-4 rounded-[24px] border border-forest/20 bg-white/80 p-3 shadow-sm">
            <div
              className="h-16 w-16 shrink-0 rounded-2xl border border-stone-100 bg-cover bg-center"
              style={{ backgroundImage: `url(${listing.imageUrl})` }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                Placing in room
              </p>
              <p className="font-heading mt-1 text-xl font-semibold leading-tight text-charcoal">
                {listing.productName}
              </p>
              <p className="text-sm text-stone">by {listing.artisanName}</p>
              <p className="mt-1 text-sm font-semibold text-charcoal">
                ₱{listing.price.toLocaleString('en-PH')}
              </p>
            </div>
            <Link
              href="/buyer/home"
              className="shrink-0 rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-charcoal"
            >
              Change
            </Link>
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-6 flex w-full flex-col items-center justify-center gap-4 rounded-full border-2 border-dashed border-forest/25 bg-white/75 px-8 py-10 text-center shadow-[0_24px_60px_rgba(27,94,63,0.08)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-cream shadow-lg">
            {previewUrl ? <ImagePlus className="h-8 w-8" /> : <Camera className="h-8 w-8" />}
          </div>
          <div>
            <p className="text-forest text-2xl font-semibold">
              {previewUrl ? 'Room photo ready' : 'Upload your room photo'}
            </p>
            <p className="mt-1 text-sm text-stone">
              {previewUrl ? 'Tap to replace' : 'From camera or gallery'}
            </p>
          </div>
          {previewUrl && (
            <div
              className="h-24 w-full rounded-[24px] border border-white/70 bg-cover bg-center"
              style={{ backgroundImage: `url(${previewUrl})` }}
            />
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

        {error && <p className="mt-4 text-sm font-medium text-terracotta">{error}</p>}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isPending || !canGenerate}
          className="bg-terracotta text-cream mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-lg font-semibold shadow-[0_18px_40px_rgba(200,85,61,0.24)] transition hover:opacity-95 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {isPending ? 'Generating...' : 'Generate Image Design'}
        </button>
      </div>
    </div>
  )
}
