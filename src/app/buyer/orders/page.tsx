import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { OrderCard } from '@/components/buyer/OrderCard'
import { prisma } from '@/lib/prisma'

const BUYER_ID = 'user-buyer-juan'

export default async function BuyerOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { buyerId: BUYER_ID },
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
    <div className="min-h-screen bg-[linear-gradient(180deg,_#faf6f0_0%,_#fff9f3_42%,_#f4ece3_100%)] px-5 pt-7 pb-32">
      <div className="mx-auto max-w-md">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">My Journey</p>
        <h1 className="font-heading text-charcoal mt-3 text-5xl font-semibold">Orders & Rentals</h1>
        <p className="text-stone mt-4 text-base leading-relaxed">
          Keep track of active purchases while your AI room keeps suggesting the next best fit.
        </p>

        <div className="mt-8 space-y-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              productName={order.listing.product.name}
              status={order.status}
              price={order.listing.price}
              createdAt={order.createdAt}
            />
          ))}
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  )
}
