import Link from 'next/link'
import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'
import { ImpactSummary } from '@/components/buyer/ImpactSummary'
import { OrderCard } from '@/components/buyer/OrderCard'
import { RentalTrackerCard } from '@/components/buyer/RentalTrackerCard'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const rentalImage =
  'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 360 300%22%3E%3Crect width=%22360%22 height=%22300%22 fill=%22%23faf6f0%22/%3E%3Crect x=%2260%22 y=%22102%22 width=%22240%22 height=%22122%22 rx=%2230%22 fill=%22%23c8553d%22 opacity=%22.2%22/%3E%3Cpath d=%22M92 118h176M88 160h184M96 202h168%22 stroke=%22%231b5e3f%22 stroke-width=%2214%22 stroke-linecap=%22round%22 opacity=%22.42%22/%3E%3C/svg%3E'

export default async function BuyerOrdersPage() {
  const buyer = await requireRole(Role.BUYER)
  const orders = await prisma.order.findMany({
    where: { buyerId: buyer.id },
    include: {
      listing: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <BuyerScreenShell title="My Journey" eyebrow="Orders">
      <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">My Journey</p>
      <h1 className="font-heading mt-3 text-5xl font-semibold text-charcoal">Orders & Rentals</h1>
      <p className="mt-4 text-base leading-relaxed text-stone">
        Keep track of active purchases, rental timelines, and the impact tied to every piece.
      </p>

      <div className="mt-6">
        <ImpactSummary impactKg={32} compact />
      </div>

      <section className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-3xl font-semibold text-charcoal">Active Rentals</h2>
          <Link href="/shared/impact" className="text-sm font-semibold text-terracotta">
            Impact report
          </Link>
        </div>
        <RentalTrackerCard
          productName="Solihiya Woven Lounge"
          imageUrl={rentalImage}
          daysLeft={18}
          percentElapsed={42}
        />
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-heading text-3xl font-semibold text-charcoal">Purchases</h2>
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              productName={order.listing.product.name}
              status={order.status}
              price={order.listing.price}
              createdAt={order.createdAt}
            />
          ))
        ) : (
          <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm leading-relaxed text-stone">
            No purchase records yet. Add a product from discovery or AI Room to start your journey.
          </div>
        )}
      </section>
    </BuyerScreenShell>
  )
}
