import { getCurrentUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Role } from '@/generated/prisma/enums'
import { BottomNav as ArtisanBottomNav } from '@/components/artisan/BottomNav'
import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { BottomNav as JunkshopBottomNav } from '@/components/junkshop/BottomNav'
import { Leaf, Recycle, ShoppingBag, Trees } from 'lucide-react'
import { MATERIAL_WEIGHT_KG, DEFAULT_WEIGHT_KG, MATERIAL_STYLE, DEFAULT_STYLE } from '@/utils/material-styles'

const KG_PER_TREE_EQUIVALENT = 50

type MaterialBreakdown = { type: string; kg: number; count: number }

export default async function ImpactPage() {
  const profile = await getCurrentUserProfile()
  if (!profile) redirect('/onboarding/signin')

  let impactKg = 0
  let orderCount = 0
  const materialMap: Record<string, MaterialBreakdown> = {}

  if (profile.role === Role.BUYER) {
    const orders = await prisma.order.findMany({
      where: { buyerId: profile.id },
      include: { listing: { include: { product: true } } },
    })
    orderCount = orders.length
    for (const order of orders) {
      const mt = order.listing.product.materialType
      const w = MATERIAL_WEIGHT_KG[mt] ?? DEFAULT_WEIGHT_KG
      impactKg += w
      if (!materialMap[mt]) materialMap[mt] = { type: mt, kg: 0, count: 0 }
      materialMap[mt].kg += w
      materialMap[mt].count += 1
    }
  } else if (profile.role === Role.ARTISAN) {
    const orders = await prisma.order.findMany({
      where: { listing: { product: { artisanId: profile.id } } },
      include: { listing: { include: { product: true } } },
    })
    orderCount = orders.length
    for (const order of orders) {
      const mt = order.listing.product.materialType
      const w = MATERIAL_WEIGHT_KG[mt] ?? DEFAULT_WEIGHT_KG
      impactKg += w
      if (!materialMap[mt]) materialMap[mt] = { type: mt, kg: 0, count: 0 }
      materialMap[mt].kg += w
      materialMap[mt].count += 1
    }
  } else if (profile.role === Role.JUNKSHOP) {
    const shop = await prisma.junkShop.findFirst({
      include: { materialsList: true },
    })
    if (shop) {
      for (const mat of shop.materialsList) {
        impactKg += mat.quantityKg
        if (!materialMap[mat.type]) materialMap[mat.type] = { type: mat.type, kg: 0, count: 0 }
        materialMap[mat.type].kg += mat.quantityKg
        materialMap[mat.type].count += 1
      }
    }
  }

  const treesEquivalent = Math.round(impactKg / KG_PER_TREE_EQUIVALENT * 10) / 10
  const breakdown = Object.values(materialMap).sort((a, b) => b.kg - a.kg)

  const BottomNav =
    profile.role === Role.ARTISAN
      ? ArtisanBottomNav
      : profile.role === Role.BUYER
        ? BuyerBottomNav
        : JunkshopBottomNav

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-cream/90 border-stone/20 sticky top-0 z-50 border-b px-5 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-forest font-['Noto_Serif'] text-xl font-bold italic">Habi</span>
          <span className="text-stone text-xs font-semibold tracking-widest uppercase">Impact Report</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8 pb-32 space-y-5">
        <div>
          <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">Your Footprint</p>
          <h1 className="font-heading mt-1 text-4xl font-semibold text-charcoal">Environmental Impact</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Every piece you{profile.role === Role.BUYER ? ' purchase' : ' create'} keeps waste out of landfills and supports local craft.
          </p>
        </div>

        {/* Hero stat */}
        <section className="rounded-2xl bg-forest p-6 text-cream shadow-[0_18px_44px_rgba(27,94,63,0.18)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/12">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/70">Total Waste Diverted</p>
              <p className="font-heading mt-1 text-5xl font-semibold">
                {impactKg.toLocaleString('en-PH', { maximumFractionDigits: 1 })}
                <span className="text-2xl ml-1">kg</span>
              </p>
              <p className="mt-2 text-sm text-cream/70">Kept out of landfills through circular trade</p>
            </div>
          </div>
        </section>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10">
              <Trees className="h-5 w-5 text-forest" />
            </div>
            <p className="font-heading mt-3 text-3xl font-semibold text-charcoal">
              {treesEquivalent.toLocaleString('en-PH')}
            </p>
            <p className="mt-1 text-xs font-semibold text-stone">Tree-equivalents saved</p>
            <p className="mt-0.5 text-[10px] text-stone/60">Based on 50 kg CO₂ per tree</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10">
              <ShoppingBag className="h-5 w-5 text-terracotta" />
            </div>
            <p className="font-heading mt-3 text-3xl font-semibold text-charcoal">
              {profile.role === Role.JUNKSHOP
                ? Object.values(materialMap).reduce((s, m) => s + m.count, 0)
                : orderCount}
            </p>
            <p className="mt-1 text-xs font-semibold text-stone">
              {profile.role === Role.BUYER ? 'Products purchased' : profile.role === Role.ARTISAN ? 'Products sold' : 'Material lots'}
            </p>
          </div>
        </div>

        {/* Material breakdown */}
        {breakdown.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Recycle className="h-4 w-4 text-forest" />
              <h2 className="font-heading text-lg font-semibold text-charcoal">Breakdown by Material</h2>
            </div>
            <div className="space-y-2">
              {breakdown.map((item) => {
                const style = MATERIAL_STYLE[item.type] ?? DEFAULT_STYLE
                const pct = impactKg > 0 ? Math.round((item.kg / impactKg) * 100) : 0
                return (
                  <div key={item.type} className={`rounded-2xl border ${style.borderColor} bg-white p-4`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.iconBg}`}>
                          <span className="text-lg">{style.emoji}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{item.type}</p>
                          <p className="text-[10px] text-stone">{style.sub}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-charcoal">
                          {item.kg.toLocaleString('en-PH', { maximumFractionDigits: 1 })} kg
                        </p>
                        <p className="text-[10px] text-stone">{pct}% of total</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full rounded-full bg-forest/60" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {impactKg === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center text-sm text-stone leading-relaxed">
            No impact data yet.{' '}
            {profile.role === Role.BUYER
              ? 'Start purchasing circular products to see your environmental footprint here.'
              : 'Your impact will appear here once products are ordered.'}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
