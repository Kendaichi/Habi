'use server'

import { redirect } from 'next/navigation'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ListingType, ListingStatus } from '@/generated/prisma/client'

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
  const artisan = await requireRole(Role.ARTISAN)
  const product = await prisma.product.create({
    data: {
      name,
      description,
      materialType,
      images: [],
      artisanId: artisan.id,
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
