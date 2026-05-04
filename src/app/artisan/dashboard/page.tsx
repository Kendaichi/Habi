import {
  TrendingUp,
  RefreshCcw,
  BadgeCheck,
  Leaf,
  Plus,
  ClipboardList,
  Undo2,
  ChevronRight,
  LayoutGrid,
  Recycle,
  Wrench,
  Building2,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardSection } from '@/components/shared/DashboardSection'
import { StatCard } from '@/components/artisan/StatCard'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'

const traceabilitySteps = [
  {
    icon: <Recycle className="text-forest h-4 w-4" />,
    iconBg: 'bg-forest/10',
    title: 'Waste Source: Manila Plastic Hub',
    sub: 'Supplied 25kg HDPE Flakes',
  },
  {
    icon: <Wrench className="text-terracotta h-4 w-4" />,
    iconBg: 'bg-terracotta/10',
    title: "Processing: Sitti's Workshop",
    sub: 'Compression Molding: 12 Panels',
  },
  {
    icon: <Building2 className="text-stone h-4 w-4" />,
    iconBg: 'bg-stone/10',
    title: 'End Use: Arc Construction',
    sub: 'Leased for Pavilion Project',
  },
]

export default function ArtisanDashboardPage() {
  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-6 px-5">
        {/* Greeting */}
        <div>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-heading text-charcoal text-4xl leading-tight font-bold">
              Kumusta,
              <br />
              Sitti!
            </h1>
            <div className="border-forest mb-1 flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5">
              <BadgeCheck className="text-forest h-3.5 w-3.5" />
              <span className="text-forest text-xs font-semibold whitespace-nowrap">
                Verified Artisan
              </span>
            </div>
          </div>
          <p className="text-stone mt-3 text-sm leading-relaxed">
            Your circular workshop is thriving today. Check your impact and latest demand signals
            below.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Active Listings"
            value="14"
            subtext="+2 this week"
            subtextIcon={<TrendingUp className="h-3 w-3" />}
            subtextClassName="text-forest"
          />
          <StatCard
            label="Items Rented"
            value="8"
            subtext="1 pending return"
            subtextIcon={<RefreshCcw className="h-3 w-3" />}
            subtextClassName="text-terracotta"
          />
          <StatCard
            label="Earnings this Month"
            value="₱24,500"
            subtext="Ready for payout"
            subtextIcon={<BadgeCheck className="h-3 w-3" />}
            subtextClassName="text-forest"
          />
          <StatCard
            label="Impact Diverted"
            value="84kg"
            subtext="Equiv. to 12 trees"
            subtextIcon={<Leaf className="h-3 w-3" />}
            subtextClassName="text-forest"
          />
        </div>

        {/* Demand Signals */}
        <div className="bg-mustard/15 border-mustard/40 relative overflow-hidden rounded-2xl border p-5">
          <span className="text-mustard/10 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[110px] leading-none font-bold select-none">
            Ω
          </span>
          <div className="mb-3 flex items-center gap-2">
            <div className="bg-charcoal flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <LayoutGrid className="text-cream h-4 w-4" />
            </div>
            <span className="font-heading text-charcoal font-bold">Demand Signals</span>
          </div>
          <p className="text-charcoal mb-4 text-sm leading-relaxed">
            <span className="bg-charcoal text-cream mr-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold">
              12 buyers
            </span>
            near you searched for{' '}
            <span className="decoration-charcoal font-medium underline">plastic brick panels</span>{' '}
            in the last 48 hours.
          </p>
          <Link
            href="/artisan/demand"
            className="bg-charcoal text-cream flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold"
          >
            View Demand Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Recent Traceability Flow */}
        <DashboardSection title="Recent Traceability Flow">
          <div className="bg-card border-border rounded-2xl border p-4">
            <div className="relative">
              <div className="border-stone/20 absolute top-4 bottom-4 left-4 border-l-2 border-dashed" />
              <div className="space-y-5">
                {traceabilitySteps.map((step) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <div
                      className={`relative z-10 h-8 w-8 rounded-full ${step.iconBg} flex shrink-0 items-center justify-center`}
                    >
                      {step.icon}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-charcoal text-sm leading-snug font-semibold">
                        {step.title}
                      </p>
                      <p className="text-stone mt-0.5 text-xs">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardSection>

        {/* Quick Actions */}
        <DashboardSection title="Quick Actions">
          <div className="space-y-3">
            <Link
              href="/artisan/list"
              className="bg-terracotta flex items-center gap-3 rounded-2xl px-4 py-4"
            >
              <div className="bg-cream/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Plus className="text-cream h-4 w-4" />
              </div>
              <span className="text-cream flex-1 text-sm font-semibold">List New Item</span>
              <ChevronRight className="text-cream/70 h-4 w-4" />
            </Link>
            <Link
              href="/artisan/materials"
              className="bg-card border-border flex items-center gap-3 rounded-2xl border px-4 py-4"
            >
              <div className="bg-forest/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <ClipboardList className="text-forest h-4 w-4" />
              </div>
              <span className="text-charcoal flex-1 text-sm font-semibold">Find Materials</span>
              <ChevronRight className="text-stone h-4 w-4" />
            </Link>
            <Link
              href="/artisan/returns"
              className="bg-card border-border flex items-center gap-3 rounded-2xl border px-4 py-4"
            >
              <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                <Undo2 className="text-stone h-4 w-4" />
              </div>
              <span className="text-charcoal flex-1 text-sm font-semibold">Manage Returns</span>
              <ChevronRight className="text-stone h-4 w-4" />
            </Link>
          </div>
        </DashboardSection>

        {/* My Sustainable Space */}
        <div className="bg-charcoal relative h-40 overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 60% 40%, #1B5E3F 0%, #0f3322 50%, #1a1a0e 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 70% 30%, #2d7a52 0%, transparent 50%), radial-gradient(circle at 30% 70%, #4a6741 0%, transparent 40%)',
            }}
          />
          <div className="from-charcoal/60 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-cream font-heading text-lg font-bold">My Sustainable Space</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
