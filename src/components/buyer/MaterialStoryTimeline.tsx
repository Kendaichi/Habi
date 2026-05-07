import { CheckCircle2 } from 'lucide-react'

type MaterialStoryTimelineProps = {
  wasteSupplierName?: string
  junkShopName?: string
  artisanName: string
  materialType: string
}

export function MaterialStoryTimeline({
  wasteSupplierName = 'Verified Mindanao waste source',
  junkShopName = 'Local circular hub',
  artisanName,
  materialType,
}: MaterialStoryTimelineProps) {
  const steps = [
    {
      title: 'Waste Source',
      body: `${wasteSupplierName} released ${materialType.toLowerCase()} back into the loop.`,
    },
    {
      title: 'Junk Shop Hub',
      body: `${junkShopName} sorted, verified, and prepared the material batch.`,
    },
    {
      title: 'Master Artisan',
      body: `${artisanName} transformed the material into a buyer-ready home piece.`,
    },
  ]

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
        The Material Story
      </p>
      <h2 className="font-heading mt-2 text-3xl font-semibold text-charcoal">Digital Loom</h2>
      <div className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <div key={step.title} className="grid grid-cols-[28px_1fr] gap-3">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-6 w-6 text-forest" />
              {index < steps.length - 1 ? <div className="mt-2 h-full w-px bg-forest/20" /> : null}
            </div>
            <div className="pb-3">
              <p className="font-semibold text-charcoal">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-stone">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
