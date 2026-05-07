import { Package, Recycle, TrendingUp } from 'lucide-react'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function SupplierDashboardPage() {
  const supplier = await requireRole(Role.SUPPLIER)
  const [materials, demandSignals] = await Promise.all([
    prisma.material.findMany({
      include: { junkShop: true },
      orderBy: { quantityKg: 'desc' },
      take: 6,
    }),
    prisma.demandSignal.findMany({
      orderBy: { count: 'desc' },
      take: 3,
    }),
  ])

  const totalKg = materials.reduce((sum, material) => sum + material.quantityKg, 0)
  const availableCount = materials.filter((material) => material.available).length

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="mx-auto max-w-md">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">
          Supplier Dashboard
        </p>
        <h1 className="font-heading mt-3 text-4xl font-bold leading-tight text-charcoal">
          Welcome, {supplier.name.split(' ')[0]}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Track material movement across Habi&apos;s Supabase-backed circular inventory.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-white p-4">
            <Recycle className="h-5 w-5 text-forest" />
            <p className="mt-4 text-3xl font-bold text-charcoal">{totalKg.toLocaleString()}kg</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone">
              Listed materials
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4">
            <Package className="h-5 w-5 text-terracotta" />
            <p className="mt-4 text-3xl font-bold text-charcoal">{availableCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone">
              Available lots
            </p>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-white p-5">
          <h2 className="font-heading text-2xl font-bold text-charcoal">Material Network</h2>
          <div className="mt-4 space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-charcoal">{material.type}</p>
                  <p className="text-xs text-stone">{material.junkShop.name}</p>
                </div>
                <p className="text-sm font-bold text-forest">{material.quantityKg}kg</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-terracotta" />
            <h2 className="font-heading text-2xl font-bold text-charcoal">Demand Signals</h2>
          </div>
          <div className="mt-4 space-y-3">
            {demandSignals.map((signal) => (
              <div key={signal.id} className="rounded-xl bg-cream p-3">
                <p className="font-semibold text-charcoal">{signal.keyword}</p>
                <p className="text-xs text-stone">
                  {signal.count} requests around {signal.city}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
