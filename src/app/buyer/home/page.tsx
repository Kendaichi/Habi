import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'
import { getBuyerHomeRecommendations } from '@/lib/room-service'

export default async function BuyerHomePage() {
  const recommendations = await getBuyerHomeRecommendations()

  return (
    <BuyerScreenShell title="Habi" eyebrow="Buyer">
      <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">Elevated Craft</p>
      <h1 className="font-heading text-charcoal mt-3 text-5xl font-semibold leading-tight">
        Discover your next artisan piece
      </h1>
      <p className="text-stone mt-4 text-base leading-relaxed">
        Explore buyer-ready pieces or step into AI Room to see them styled in your own space.
      </p>

      <Link
        href="/buyer/room/upload"
        className="mt-7 flex items-center justify-between rounded-lg bg-[linear-gradient(135deg,_#1b5e3f_0%,_#0f3e2a_100%)] px-6 py-6 text-cream shadow-[0_24px_60px_rgba(27,94,63,0.24)]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cream/70">AI Room</p>
          <p className="font-heading mt-2 text-3xl font-semibold">Visualize before you buy</p>
        </div>
        <Sparkles className="h-7 w-7 shrink-0" />
      </Link>

      <div className="mt-8 space-y-4">
        {recommendations.slice(0, 3).map((recommendation) => (
          <Link
            key={recommendation.listingId}
            href={`/buyer/product/${recommendation.productId}`}
            className="block overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_44px_rgba(44,44,44,0.08)]"
          >
            <div
              className="h-52 bg-cover bg-center"
              style={{ backgroundImage: `url(${recommendation.imageUrl})` }}
            />
            <div className="p-5">
              <p className="text-forest text-[11px] font-semibold uppercase tracking-[0.22em]">
                {recommendation.materialType}
              </p>
              <h2 className="font-heading text-charcoal mt-2 text-3xl font-semibold">
                {recommendation.productName}
              </h2>
              <p className="text-stone mt-2 text-sm">by {recommendation.artisanName}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-charcoal text-2xl font-semibold">
                  PHP {recommendation.price.toLocaleString('en-PH')}
                </p>
                <span className="text-terracotta inline-flex items-center gap-1 text-sm font-semibold">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </BuyerScreenShell>
  )
}
