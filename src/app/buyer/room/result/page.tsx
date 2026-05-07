import Link from 'next/link'
import { ArrowRight, MoveUpRight, Sparkles } from 'lucide-react'
import { BeforeAfterSlider } from '@/components/buyer/BeforeAfterSlider'
import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { ImpactSummary } from '@/components/buyer/ImpactSummary'
import { RoomResultActions } from '@/components/buyer/RoomResultActions'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { getLatestCompletedRoomResult } from '@/lib/room-service'

export default async function RoomResultPage() {
  const buyer = await requireRole(Role.BUYER)
  const result = await getLatestCompletedRoomResult(buyer.id)
  const featured = result?.recommendations[0]

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

        <div className="mt-6">
          <BeforeAfterSlider
            beforeImageUrl={result.sourceImageUrl}
            afterImageUrl={result.generatedImageUrl}
          />
        </div>

        <div className="mt-5 overflow-hidden rounded-lg border border-white/80 bg-white shadow-[0_28px_64px_rgba(44,44,44,0.1)]">
          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-stone text-xs font-semibold uppercase tracking-[0.22em]">
                  {result.worldKind === 'reconstructed'
                    ? 'Reconstructed from your room photo'
                    : result.generationProvider?.startsWith('3d-ai-studio') && result.worldAssetUrl
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
                  ? result.scene.reconstructionSource === 'provider-candidate'
                    ? 'Validated Provider Mesh'
                    : 'Reconstructed Room'
                  : result.worldKind === 'reconstructed'
                    ? 'Geometry-First Mesh'
                    : result.worldKind === 'composed'
                    ? 'Composed World'
                    : 'Generated World'}
              </span>
              {result.qualityScore != null ? (
                <span className="rounded-full bg-forest/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
                  {Math.round(result.qualityScore * 100)}% structure confidence
                </span>
              ) : null}
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
                  {result.reconstructionWarnings[0] ?? result.generationWarnings[0]}
                </p>
              </div>
            ) : null}
            <Link
              href={`/buyer/room/world/${result.roomId}`}
              className="bg-terracotta text-cream inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold"
            >
              Enter reconstructed world
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {featured ? (
          <div className="mt-6 space-y-4">
            <ImpactSummary impactKg={12} />
            <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
                Best Match
              </p>
              <div className="mt-4 grid grid-cols-[112px_1fr] gap-4">
                <div
                  className="h-36 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${featured.imageUrl})` }}
                />
                <div className="min-w-0">
                  <h2 className="font-heading text-3xl font-semibold leading-tight text-charcoal">
                    {featured.productName}
                  </h2>
                  <p className="mt-1 text-sm text-stone">by {featured.artisanName}</p>
                  <p className="mt-3 text-2xl font-bold text-charcoal">
                    PHP {featured.price.toLocaleString('en-PH')}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-stone">
                Supports 2 weeks of fair-wage labor and fits the room&apos;s detected light,
                materials, and free space.
              </p>
              <div className="mt-4">
                <RoomResultActions recommendation={featured} />
              </div>
            </section>
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          <h2 className="font-heading text-3xl font-semibold text-charcoal">
            Other products that fit this room
          </h2>
          {result.recommendations.map((recommendation) => (
            <Link
              key={recommendation.listingId}
              href={`/buyer/room/visualizer/${recommendation.listingId}`}
              className="block overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_48px_rgba(44,44,44,0.08)]"
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
