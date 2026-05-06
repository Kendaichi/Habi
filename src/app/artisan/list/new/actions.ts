'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ListingType, ListingStatus } from '@/generated/prisma/client'

const ARTISAN_ID = 'user-artisan-sitti'

export async function publishListing({
  name,
  description,
  materialType,
  listings,
}: {
  name: string
  description: string
  materialType: string
  listings: { type: string; price: number }[]
}) {
  const product = await prisma.product.create({
    data: {
      name,
      description,
      materialType,
      images: [],
      artisanId: ARTISAN_ID,
    },
  })

  await prisma.listing.createMany({
    data: listings.map((l) => ({
      productId: product.id,
      type: l.type as ListingType,
      price: l.price,
      status: ListingStatus.AVAILABLE,
    })),
  })

  redirect('/artisan/list')
}
