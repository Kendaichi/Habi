'use client'

import Link from 'next/link'
import { ShoppingBag, Sparkles } from 'lucide-react'
import { BeforeAfterSlider } from '@/components/buyer/BeforeAfterSlider'
import { addItem } from '@/lib/buyer-cart'
import type { ImageDesignJob } from '@/api/room/image-design'

type ListingInfo = {
  listingId: string
  productId: string
  productName: string
  materialType: string
  artisanName: string
  imageUrl: string
  price: number
}

type Props = {
  job: ImageDesignJob
  listing?: ListingInfo
}

export function RoomImageResultClient({ job, listing }: Props) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#faf6f0_0%,_#fff9f3_42%,_#f6efe6_100%)] px-5 pt-6 pb-32">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">
              {job.mode === 'preview' ? 'Item Preview' : 'Room Redesign'}
            </p>
            <h1 className="font-heading text-charcoal mt-2 text-4xl leading-tight font-semibold">
              {job.mode === 'preview' ? 'Your Room with This Piece' : 'AI-Generated Design'}
            </h1>
          </div>
          <Link
            href={job.mode === 'preview' && listing ? `/buyer/product/${listing.productId}` : '/buyer/home'}
            className="rounded-full border border-stone-200 bg-white/75 px-4 py-2 text-sm font-semibold text-charcoal"
          >
            {job.mode === 'preview' ? 'Back' : 'Explore'}
          </Link>
        </div>

        {job.isMock && (
          <div className="mt-4 rounded-2xl border border-mustard/30 bg-mustard/10 px-4 py-3">
            <p className="text-sm font-semibold text-charcoal">Mock Preview</p>
            <p className="mt-1 text-xs text-stone">
              Real AI-generated images will appear here once the GLM-image2 integration is active.
            </p>
          </div>
        )}

        <div className="mt-6">
          <BeforeAfterSlider
            beforeImageUrl={job.sourceImageUrl}
            afterImageUrl={job.generatedImageUrl}
          />
        </div>

        {job.mode === 'preview' && listing && (
          <div className="mt-6 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className="h-20 w-20 shrink-0 rounded-2xl border border-stone-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${listing.imageUrl})` }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                  Placed item
                </p>
                <h2 className="font-heading mt-1 text-2xl font-semibold leading-tight text-charcoal">
                  {listing.productName}
                </h2>
                <p className="mt-1 text-sm text-stone">by {listing.artisanName}</p>
                <p className="mt-2 text-xl font-bold text-charcoal">
                  ₱{listing.price.toLocaleString('en-PH')}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  addItem({
                    listingId: listing.listingId,
                    productId: listing.productId,
                    name: listing.productName,
                    imageUrl: listing.imageUrl,
                    artisanName: listing.artisanName,
                    mode: 'BUY',
                    price: listing.price,
                    quantity: 1,
                    impactKg: Math.max(8, Math.round(listing.price / 420)),
                  })
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-3 text-sm font-semibold text-cream"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <Link
                href={`/buyer/product/${listing.productId}`}
                className="rounded-lg border border-forest px-4 py-3 text-center text-sm font-semibold text-forest"
              >
                View Product
              </Link>
            </div>
          </div>
        )}

        {job.mode === 'redesign' && (
          <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="text-terracotta mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold text-charcoal">Room Redesign Complete</p>
                <p className="mt-1 text-sm leading-relaxed text-stone">
                  Explore artisan products that match your redesigned space.
                </p>
              </div>
            </div>
            <Link
              href="/buyer/home"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-forest px-5 py-3 text-sm font-semibold text-cream"
            >
              Browse Artisan Products
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/buyer/room/image-design"
            className="text-sm font-semibold text-forest underline underline-offset-4"
          >
            Try a different room or mode
          </Link>
        </div>
      </div>
    </div>
  )
}
