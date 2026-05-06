import { notFound } from 'next/navigation'
import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { prisma } from '@/lib/prisma'

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

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#faf6f0_0%,_#fffaf6_45%,_#f3ece3_100%)] px-5 pt-7 pb-32">
      <div className="mx-auto max-w-md overflow-hidden rounded-[34px] border border-stone-200 bg-white shadow-[0_24px_60px_rgba(44,44,44,0.08)]">
        <div className="flex h-72 items-end bg-[radial-gradient(circle_at_top,_rgba(27,94,63,0.2),_transparent_42%),linear-gradient(180deg,_#faf4ec_0%,_#eadbc9_100%)] p-6">
          <div>
            <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
              {product.materialType}
            </p>
            <h1 className="font-heading text-charcoal mt-2 text-5xl leading-tight font-semibold">
              {product.name}
            </h1>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="text-stone text-sm">by {product.artisan.name}</p>
            <p className="text-charcoal mt-3 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="rounded-[26px] bg-forest/6 p-4">
            <p className="text-forest text-sm font-semibold">Modes available</p>
            <p className="text-charcoal mt-2 text-base">
              {product.listings.map((listing) => listing.type.toLowerCase()).join(', ')}
            </p>
          </div>

          {product.traceability ? (
            <div className="rounded-[26px] border border-stone-200 p-4">
              <p className="text-charcoal text-base font-semibold">Traceability</p>
              <p className="text-stone mt-2 text-sm leading-relaxed">
                Sourced from {product.traceability.wasteSupplierName} through{' '}
                {product.traceability.junkShop.name}.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  )
}
