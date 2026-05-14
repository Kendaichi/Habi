import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, Star } from 'lucide-react'
import { AcquisitionSelector } from '@/components/buyer/AcquisitionSelector'
import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'
import { ImpactSummary } from '@/components/buyer/ImpactSummary'
import { MaterialStoryTimeline } from '@/components/buyer/MaterialStoryTimeline'
import { prisma } from '@/lib/prisma'
import type { BuyerCartMode } from '@/lib/buyer-cart'

function modeFromListingType(type: string): BuyerCartMode {
  if (type === 'RENT') return 'RENT'
  if (type === 'LEASE') return 'LEASE'
  return 'BUY'
}

function encodeSvg(markup: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(markup.replace(/\n\s*/g, ''))}`
}

function productFallbackImage(name: string, materialType: string) {
  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#fffaf3"/>
          <stop offset="1" stop-color="#eadbc9"/>
        </linearGradient>
      </defs>
      <rect width="720" height="900" fill="url(#bg)"/>
      <circle cx="360" cy="286" r="154" fill="#1b5e3f" opacity=".12"/>
      <rect x="176" y="180" width="368" height="420" rx="48" fill="#ffffff" stroke="#c8553d" stroke-opacity=".24" stroke-width="10"/>
      <path d="M250 310 C310 236 413 236 470 310 L504 574 H216 Z" fill="#c8553d" opacity=".18"/>
      <path d="M278 350 H442 M258 408 H462 M242 468 H478 M230 528 H490" stroke="#1b5e3f" stroke-opacity=".34" stroke-width="16" stroke-linecap="round"/>
      <text x="360" y="690" text-anchor="middle" font-family="Georgia" font-size="46" fill="#2c2c2c">${name}</text>
      <text x="360" y="742" text-anchor="middle" font-family="Arial" font-size="22" letter-spacing="5" fill="#1b5e3f">${materialType.toUpperCase()}</text>
    </svg>
  `)
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      artisan: true,
      listings: true,
      traceability: {
        include: {
          junkShop: true,
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const imageUrl = product.images[0] || productFallbackImage(product.name, product.materialType)
  const listingOptions = product.listings.map((listing) => ({
    listingId: listing.id,
    mode: modeFromListingType(listing.type),
    price: listing.price,
  }))
  const primaryPrice = listingOptions[0]?.price ?? 2800
  const impactKg = Math.max(8, Math.round(primaryPrice / 420))

  return (
    <BuyerScreenShell title="Product" eyebrow="Traceability">
      <Link href="/buyer/home" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-forest">
        <ArrowLeft className="h-4 w-4" />
        Back to Discover
      </Link>

      <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_22px_58px_rgba(44,44,44,0.1)]">
        <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(44,44,44,0.02)_20%,_rgba(44,44,44,0.52)_100%)]" />
          <Link
            href={`/buyer/room/image-design${listingOptions[0]?.listingId ? `?listingId=${listingOptions[0].listingId}` : ''}`}
            className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-forest shadow-lg"
          >
            <Camera className="h-4 w-4" />
            See in My Room
          </Link>
        </div>
        <div className="p-5">
          <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
            {product.materialType}
          </p>
          <h1 className="font-heading mt-2 text-5xl leading-tight font-semibold text-charcoal">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-stone">by {product.artisan.name}</p>
          <p className="mt-4 text-base leading-relaxed text-charcoal">{product.description}</p>
        </div>
      </article>

      <div className="mt-5 space-y-5">
        <AcquisitionSelector
          productId={product.id}
          name={product.name}
          imageUrl={imageUrl}
          artisanName={product.artisan.name}
          materialType={product.materialType}
          options={listingOptions}
          impactKg={impactKg}
        />

        <ImpactSummary impactKg={impactKg} />

        <MaterialStoryTimeline
          materialType={product.materialType}
          artisanName={product.artisan.name}
          wasteSupplierName={product.traceability?.wasteSupplierName}
          junkShopName={product.traceability?.junkShop.name}
        />

        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
            Community Voice
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold text-charcoal">
            Crafted for everyday keeping
          </h2>
          <div className="mt-4 rounded-lg bg-cream p-4">
            <div className="flex gap-1 text-mustard">
              {[1, 2, 3, 4, 5].map((item) => (
                <Star key={item} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-charcoal">
              The craft feels premium, and the material story makes the piece easier to love.
              It looks beautiful in our sala and carries a real Mindanao loop behind it.
            </p>
            <p className="mt-3 text-xs font-semibold text-stone">A buyer from Davao City</p>
          </div>
        </section>
      </div>
    </BuyerScreenShell>
  )
}
