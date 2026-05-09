import { Recycle, Users, Truck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { TopNav } from '@/components/junkshop/TopNav'
import { BottomNav } from '@/components/junkshop/BottomNav'
import { DashboardSection } from '@/components/shared/DashboardSection'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCurrentJunkShop } from '@/lib/junkshop'
import { MATERIAL_STYLE, DEFAULT_STYLE } from '@/utils/material-styles'

export default async function JunkshopDashboardPage() {
  const user = await requireRole(Role.JUNKSHOP)
  const shopMatch = await getCurrentJunkShop(user.name)

  const shop = shopMatch
    ? await prisma.junkShop.findUnique({
        where: { id: shopMatch.id },
        include: {
          materialsList: true,
          traceChains: {
            include: { product: true, artisan: true },
            orderBy: { id: 'desc' },
            take: 3,
          },
        },
      })
    : null

  const totalKg = shop?.materialsList.reduce((s, m) => s + m.quantityKg, 0) ?? 0
  const totalTons = (totalKg / 1000).toFixed(1)
  const artisansServed = new Set(shop?.traceChains.map((c) => c.artisanId)).size
  const pickupRequests = shop?.traceChains.length ?? 0

  const topMaterials = [...(shop?.materialsList ?? [])]
    .sort((a, b) => b.quantityKg - a.quantityKg)
    .slice(0, 3)

  const recentActivity = shop?.traceChains ?? []

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-28">
        {/* Welcome */}
        <section className="mb-8">
          <h1 className="font-heading text-charcoal mb-2 text-3xl font-bold leading-tight md:text-5xl">
            Welcome back,
            <br />
            {shop?.name ?? 'Shop Owner'}
          </h1>
          <p className="text-stone text-base">Your circular hub is thriving this month.</p>
        </section>

        {/* Primary CTA */}
        <div className="mb-8">
          <Link
            href="/junkshop/inventory/log"
            className="bg-terracotta flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 md:inline-flex md:w-auto"
          >
            <span className="text-lg">+</span>
            Log New Sorted Material
          </Link>
        </div>

        {/* Stats Bento Grid */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          <div className="bg-card border-border flex h-36 flex-col justify-between rounded-2xl border p-4 shadow-sm">
            <span className="text-stone text-[10px] font-bold uppercase tracking-wide">
              Sorted This Month
            </span>
            <div className="flex items-end justify-between">
              <span className="font-heading text-forest text-3xl font-bold">
                {totalTons}
                <span className="text-stone ml-1 text-base font-normal">tons</span>
              </span>
              <Recycle className="text-forest/20 h-10 w-10" />
            </div>
          </div>

          <div className="bg-card border-border flex h-36 flex-col justify-between rounded-2xl border p-4 shadow-sm">
            <span className="text-stone text-[10px] font-bold uppercase tracking-wide">
              Artisans Served
            </span>
            <div className="flex items-end justify-between">
              <span className="font-heading text-forest text-3xl font-bold">{artisansServed}</span>
              <Users className="text-forest/20 h-10 w-10" />
            </div>
          </div>

          <div className="bg-card border-border flex h-36 flex-col justify-between rounded-2xl border p-4 shadow-sm">
            <span className="text-stone text-[10px] font-bold uppercase tracking-wide">
              Pickup Requests
            </span>
            <div className="flex items-end justify-between">
              <span className="font-heading text-terracotta text-3xl font-bold">
                {pickupRequests}
              </span>
              <Truck className="text-terracotta/20 h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Banig Divider */}
        <div
          className="mb-8 h-1 w-full rounded-full opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #1b5e3f 0, #1b5e3f 2px, transparent 2px, transparent 4px)',
          }}
        />

        {/* Live Inventory */}
        <DashboardSection title="Live Inventory">
          <div className="mb-2 flex items-center justify-between">
            <span />
            <Link
              href="/junkshop/inventory"
              className="text-forest flex items-center gap-1 text-sm font-medium hover:underline"
            >
              View Detailed <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {topMaterials.length === 0 ? (
              <p className="text-stone py-6 text-center text-sm">No materials logged yet.</p>
            ) : (
              topMaterials.map((mat) => {
                const style = MATERIAL_STYLE[mat.type] ?? DEFAULT_STYLE
                return (
                  <div
                    key={mat.id}
                    className={`bg-card flex items-center justify-between rounded-2xl border-l-4 p-5 shadow-sm ${style.borderColor}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${style.iconBg}`}
                      >
                        {style.emoji}
                      </div>
                      <div>
                        <h4 className="text-charcoal text-base font-bold">{mat.type}</h4>
                        <p className="text-stone text-sm">{style.sub}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-charcoal font-heading text-2xl font-bold">
                        {mat.quantityKg}
                        <span className="text-stone ml-1 text-sm font-normal">kg</span>
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </DashboardSection>

        {/* Recent Activity */}
        <DashboardSection title="Recent Activity" className="mt-8">
          <div className="bg-card border-border rounded-3xl border p-6 shadow-sm">
            {recentActivity.length === 0 ? (
              <p className="text-stone py-4 text-center text-sm">No recent activity.</p>
            ) : (
              <div className="space-y-5">
                {recentActivity.map((chain, i) => (
                  <div
                    key={chain.id}
                    className={`flex items-center justify-between pb-5 ${
                      i < recentActivity.length - 1 ? 'border-b border-stone-100' : 'pb-0'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-stone-600">
                        {chain.artisan.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-charcoal text-sm font-semibold">{chain.artisan.name}</p>
                        <p className="text-stone text-xs">Sourced for {chain.product.name}</p>
                      </div>
                    </div>
                    <p className="text-stone text-[10px]">via traceability</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DashboardSection>
      </main>

      <BottomNav />
    </div>
  )
}
