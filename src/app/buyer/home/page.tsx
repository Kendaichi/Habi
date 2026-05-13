import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'
import { BuyerProductSearch } from '@/components/buyer/BuyerProductSearch'
import { getBuyerHomeRecommendations } from '@/lib/room-service'

export default async function BuyerHomePage() {
  const recommendations = await getBuyerHomeRecommendations()

  return (
    <BuyerScreenShell title="Habi" eyebrow="Buyer">
      <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">Habi</p>
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

      <BuyerProductSearch recommendations={recommendations} />
    </BuyerScreenShell>
  )
}
