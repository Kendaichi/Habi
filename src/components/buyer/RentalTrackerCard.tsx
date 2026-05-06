import { Progress } from '@/components/ui/progress'

type RentalTrackerCardProps = {
  productName: string
  imageUrl: string
  daysLeft: number
  percentElapsed: number
}

export function RentalTrackerCard({
  productName,
  imageUrl,
  daysLeft,
  percentElapsed,
}: RentalTrackerCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-[92px_1fr] gap-4">
        <div
          className="h-28 rounded-lg bg-cream bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div>
          <p className="text-forest text-[11px] font-semibold uppercase tracking-[0.18em]">
            Monthly Flex
          </p>
          <h3 className="font-heading mt-1 text-2xl font-semibold text-charcoal">{productName}</h3>
          <p className="mt-2 text-sm text-stone">{daysLeft} days left</p>
          <Progress value={percentElapsed} className="mt-3 h-2" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {['Extend', 'Return', 'Buy Out'].map((action) => (
          <button
            key={action}
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              action === 'Buy Out' ? 'bg-forest text-cream' : 'border border-stone-200 text-charcoal'
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </article>
  )
}
