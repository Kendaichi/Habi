import Link from 'next/link'
import { ArrowRight, MoveUpRight, Sparkles } from 'lucide-react'
import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { getLatestCompletedRoomResult } from '@/lib/room-service'

export default async function RoomResultPage() {
  const result = await getLatestCompletedRoomResult()

  if (!result) {
    return (
      <div className="min-h-screen bg-cream px-6 py-10">
        <div className="mx-auto max-w-md rounded-[34px] border border-stone-200 bg-white p-6 shadow-sm">
          <h1 className="font-heading text-charcoal text-4xl font-semibold">Your room is waiting</h1>
          <p className="text-stone mt-3 text-base leading-relaxed">
            Start with a fresh room photo and we&apos;ll build an artisan-ready world for you.
          </p>
          <Link
            href="/buyer/room/upload"
            className="bg-terracotta text-cream mt-6 inline-flex rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            Capture a room
          </Link>
        </div>
        <BuyerBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#faf6f0_0%,_#fff9f3_42%,_#f6efe6_100%)] px-5 pt-6 pb-32">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">AI Room</p>
            <h1 className="font-heading text-charcoal mt-2 text-5xl leading-tight font-semibold">
              Curated for {result.roomTheme}
            </h1>
          </div>
          <Link
            href="/buyer/room/upload"
            className="rounded-full border border-stone-200 bg-white/75 px-4 py-2 text-sm font-semibold text-charcoal"
          >
            Change Room
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_28px_64px_rgba(44,44,44,0.1)]">
          <div
            className="h-80 bg-cover bg-center"
            style={{ backgroundImage: `url(${result.generatedImageUrl})` }}
          />
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-stone text-xs font-semibold uppercase tracking-[0.22em]">
                  {result.generationProvider?.startsWith('3d-ai-studio') && result.worldAssetUrl
                    ? '3D AI Studio world'
                    : result.worldKind === 'composed'
                      ? 'Generated room world'
                      : 'Generated room world'}
                </p>
                <h2 className="font-heading text-charcoal mt-2 text-3xl font-semibold">
                  {result.scene.title}
                </h2>
              </div>
              <Sparkles className="text-terracotta h-6 w-6 shrink-0" />
            </div>
            <p className="text-stone text-base leading-relaxed">{result.insight}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-charcoal/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal">
                {result.generationProvider?.startsWith('3d-ai-studio') && result.worldAssetUrl
                  ? '3D AI Studio World'
                  : result.worldKind === 'composed'
                    ? 'Composed World'
                    : 'Generated World'}
              </span>
              {result.worldAssetUrl ? (
                <span className="rounded-full bg-terracotta/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                  {result.worldAssetFormat?.toUpperCase() ?? 'WORLD'} ready
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {result.roomAnalysis.styleCues
                .concat(result.recommendations.flatMap((item) => item.reasonTags))
                .slice(0, 5)
                .map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-full bg-forest/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest"
                >
                  {tag}
                </span>
                ))}
            </div>
            {result.generationWarnings.length > 0 ? (
              <div className="rounded-2xl border border-mustard/30 bg-mustard/10 px-4 py-3">
                <p className="text-charcoal text-sm font-semibold">Generation notes</p>
                <p className="text-stone mt-1 text-sm leading-relaxed">
                  {result.generationWarnings[0]}
                </p>
              </div>
            ) : null}
            <Link
              href={`/buyer/room/world/${result.roomId}`}
              className="bg-terracotta text-cream inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              Enter generated world
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {result.recommendations.map((recommendation) => (
            <Link
              key={recommendation.listingId}
              href={`/buyer/room/visualizer/${recommendation.listingId}`}
              className="block overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-[0_18px_48px_rgba(44,44,44,0.08)]"
            >
              <div className="grid grid-cols-[112px_1fr] gap-4 p-4">
                <div
                  className="rounded-[24px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${recommendation.imageUrl})` }}
                />
                <div className="min-w-0">
                  <p className="text-forest text-[11px] font-semibold uppercase tracking-[0.22em]">
                    {recommendation.materialType}
                  </p>
                  <h3 className="font-heading text-charcoal mt-2 text-3xl leading-tight font-semibold">
                    {recommendation.productName}
                  </h3>
                  <p className="text-stone mt-2 text-sm">by {recommendation.artisanName}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recommendation.reasonTags.map((tag, index) => (
                      <span
                        key={`${recommendation.listingId}-${tag}-${index}`}
                        className="rounded-full bg-mustard/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-charcoal text-2xl font-semibold">
                      ₱{recommendation.price.toLocaleString('en-PH')}
                    </p>
                    <span className="text-terracotta inline-flex items-center gap-1 text-sm font-semibold">
                      View in room
                      <MoveUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  )
}
