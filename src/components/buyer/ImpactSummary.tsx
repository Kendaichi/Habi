import { Leaf, Recycle, Users } from 'lucide-react'

type ImpactSummaryProps = {
  impactKg: number
  laborWeeks?: number
  compact?: boolean
}

export function ImpactSummary({ impactKg, laborWeeks = 2, compact = false }: ImpactSummaryProps) {
  return (
    <section className="rounded-lg border border-forest/15 bg-forest p-5 text-cream shadow-[0_18px_44px_rgba(27,94,63,0.18)]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/12">
          <Leaf className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/70">
            Circular impact
          </p>
          <h2 className="font-heading mt-1 text-3xl font-semibold">
            {impactKg.toLocaleString('en-PH')}kg diverted
          </h2>
          {!compact ? (
            <p className="mt-2 text-sm leading-relaxed text-cream/80">
              This selection keeps verified waste materials in the loop and supports local
              craft work across Mindanao.
            </p>
          ) : null}
        </div>
      </div>
      {!compact ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/10 p-3">
            <Recycle className="h-4 w-4" />
            <p className="mt-2 text-sm font-semibold">Verified loop</p>
          </div>
          <div className="rounded-lg bg-white/10 p-3">
            <Users className="h-4 w-4" />
            <p className="mt-2 text-sm font-semibold">{laborWeeks} weeks fair-wage labor</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
