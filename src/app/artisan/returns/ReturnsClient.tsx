'use client'

import { useState } from 'react'
import { Clock, Truck, Wrench, Home, ShieldCheck, Leaf } from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'

type Filter = 'all' | 'in_use' | 'awaiting' | 'refurbishing'
type ReturnStatus = 'in_use' | 'awaiting' | 'refurbishing'

export type ReturnRow = {
  id: string
  productName: string
  status: ReturnStatus
  detail: string
  buyerName: string
  imageBg: string
}

const filters: { label: string; value: Filter }[] = [
  { label: 'All Returns', value: 'all' },
  { label: 'In Use', value: 'in_use' },
  { label: 'Awaiting', value: 'awaiting' },
  { label: 'Refurbishing', value: 'refurbishing' },
]

const statusConfig: Record<
  ReturnStatus,
  { label: string; badge: string; badgeText: string; detailColor: string; icon: React.ReactNode }
> = {
  in_use: {
    label: 'In Use',
    badge: 'bg-forest/10',
    badgeText: 'text-forest',
    detailColor: 'text-forest',
    icon: <Clock className="h-4 w-4" />,
  },
  awaiting: {
    label: 'Awaiting Return',
    badge: 'bg-terracotta/10',
    badgeText: 'text-terracotta',
    detailColor: 'text-terracotta',
    icon: <Truck className="h-4 w-4" />,
  },
  refurbishing: {
    label: 'Refurbishing',
    badge: 'bg-mustard/10',
    badgeText: 'text-mustard',
    detailColor: 'text-mustard',
    icon: <Wrench className="h-4 w-4" />,
  },
}

const lifecycleSteps = [
  {
    icon: <Home className="h-4 w-4" />,
    iconBg: 'bg-forest',
    label: 'Buyer Collection',
    labelColor: 'text-forest',
    desc: 'Scheduled logistics partner picks up from consumer.',
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    iconBg: 'bg-terracotta',
    label: 'Quality Inspection',
    labelColor: 'text-terracotta',
    desc: 'Artisan verifies item condition and circular integrity.',
  },
  {
    icon: <Leaf className="h-4 w-4" />,
    iconBg: 'bg-mustard',
    label: 'Relisting / Sourcing',
    labelColor: 'text-mustard',
    desc: 'Item returns to inventory for the next user cycle.',
  },
]

export function ReturnsClient({ returns }: { returns: ReturnRow[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const filtered =
    activeFilter === 'all' ? returns : returns.filter((r) => r.status === activeFilter)

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="mx-auto max-w-2xl space-y-6 px-5 pt-6 pb-32 sm:px-6">
        <div>
          <h1 className="font-heading text-charcoal text-2xl font-bold">Returns Management</h1>
          <p className="text-stone mt-1.5 text-sm leading-relaxed">
            Track items currently circulating in the community ecosystem.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeFilter === f.value ? 'bg-charcoal text-cream' : 'bg-stone/10 text-stone'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Return Cards */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-stone py-12 text-center text-sm">No items in this category.</p>
          )}
          {filtered.map((item) => {
            const config = statusConfig[item.status]
            const barColor =
              item.status === 'in_use'
                ? 'bg-forest/50'
                : item.status === 'awaiting'
                  ? 'bg-terracotta/50'
                  : 'bg-mustard/50'

            return (
              <div
                key={item.id}
                className="bg-card border-border relative overflow-hidden rounded-2xl border"
              >
                <div className={`absolute top-0 left-0 h-full w-1 ${barColor}`} />

                <div className="space-y-4 p-4 pl-5">
                  {/* Image + badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-linear-to-br ${item.imageBg}`}
                    >
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                          backgroundSize: '12px 12px',
                        }}
                      />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badge} ${config.badgeText}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Title + detail */}
                  <div>
                    <h2 className="text-charcoal text-base font-bold">{item.productName}</h2>
                    <div className={`mt-1 flex items-center gap-1.5 text-sm ${config.detailColor}`}>
                      {config.icon}
                      {item.detail}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-border flex items-center justify-between border-t pt-3">
                    <span className="text-stone text-xs">User: {item.buyerName}</span>
                    {item.status === 'in_use' && (
                      <button className="text-forest text-sm font-semibold">View Details</button>
                    )}
                    {item.status === 'awaiting' && (
                      <button className="bg-terracotta text-cream rounded-xl px-4 py-1.5 text-sm font-semibold active:scale-95">
                        Schedule Pickup
                      </button>
                    )}
                    {item.status === 'refurbishing' && (
                      <button className="border-forest/40 text-forest rounded-xl border px-4 py-1.5 text-sm font-semibold active:scale-95">
                        Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Return Lifecycle */}
        <div className="bg-muted rounded-2xl p-5">
          <h2 className="font-heading text-charcoal mb-5 text-lg font-bold">Return Lifecycle</h2>
          <div className="relative">
            <div className="border-stone/20 absolute top-4 bottom-4 left-4 border-l-2 border-dashed" />
            <div className="space-y-6">
              {lifecycleSteps.map((step) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-cream ${step.iconBg}`}
                  >
                    {step.icon}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-xs font-bold tracking-wide uppercase ${step.labelColor}`}>
                      {step.label}
                    </p>
                    <p className="text-stone mt-0.5 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
