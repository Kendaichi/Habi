import { NextResponse } from 'next/server'
import { addMonths } from 'date-fns'
import { ListingType, Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { BuyerCartItem } from '@/lib/buyer-cart'

export async function POST(request: Request) {
  const buyer = await requireRole(Role.BUYER)
  const body = (await request.json().catch(() => ({}))) as {
    items?: BuyerCartItem[]
    startDate?: string
    endDate?: string
  }

  const items = body.items ?? []
  if (items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
  }

  const createdOrderIds: string[] = []
  const createdRentalIds: string[] = []

  for (const item of items) {
    const listing = await prisma.listing.findUnique({
      where: { id: item.listingId },
    })

    if (!listing) continue

    for (let index = 0; index < Math.max(1, item.quantity); index += 1) {
      const order = await prisma.order.create({
        data: {
          buyerId: buyer.id,
          listingId: listing.id,
          status: 'CONFIRMED',
        },
      })
      createdOrderIds.push(order.id)

      if (item.mode === 'RENT' || item.mode === 'LEASE' || listing.type !== ListingType.SALE) {
        const now = new Date()
        const rentalStart = body.startDate ? new Date(body.startDate) : now
        const rentalEnd = body.endDate
          ? new Date(body.endDate)
          : addMonths(rentalStart, item.mode === 'LEASE' ? 12 : 1)
        const rental = await prisma.rental.create({
          data: {
            buyerId: buyer.id,
            listingId: listing.id,
            startDate: rentalStart,
            endDate: rentalEnd,
          },
        })
        createdRentalIds.push(rental.id)
      }
    }
  }

  if (createdOrderIds.length === 0) {
    return NextResponse.json({ error: 'No valid listings were found in this cart.' }, { status: 400 })
  }

  return NextResponse.json({
    orderIds: createdOrderIds,
    rentalIds: createdRentalIds,
  })
}
