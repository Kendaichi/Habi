'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ListingType, ListingStatus } from '@/generated/prisma/client'

export async function updateListing(
  listingId: string,
  data: {
    name: string
    description: string
    materialType: string
    images: string[]
    listings: { type: ListingType; price: number }[]
  },
) {
  const existing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { productId: true },
  })
  if (!existing) return

  const productId = existing.productId

  const currentListings = await prisma.listing.findMany({
    where: { productId },
    select: { id: true, type: true },
  })

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      description: data.description,
      materialType: data.materialType,
      images: data.images,
    },
  })

  for (const l of data.listings) {
    const match = currentListings.find((c) => c.type === l.type)
    if (match) {
      await prisma.listing.update({
        where: { id: match.id },
        data: { price: l.price, status: ListingStatus.AVAILABLE },
      })
    } else {
      await prisma.listing.create({
        data: { productId, type: l.type, price: l.price, status: ListingStatus.AVAILABLE },
      })
    }
  }

  const selectedTypes = new Set(data.listings.map((l) => l.type))
  const toDraft = currentListings.filter((c) => !selectedTypes.has(c.type)).map((c) => c.id)
  if (toDraft.length > 0) {
    await prisma.listing.updateMany({
      where: { id: { in: toDraft } },
      data: { status: ListingStatus.DRAFT },
    })
  }

  redirect('/artisan/list')
}

export async function archiveListing(listingId: string) {
  const existing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { productId: true },
  })
  if (!existing) return

  await prisma.listing.updateMany({
    where: { productId: existing.productId },
    data: { status: ListingStatus.DRAFT },
  })

  redirect('/artisan/list')
}

export async function deleteListing(listingId: string) {
  const existing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { productId: true },
  })
  if (!existing) return

  const productId = existing.productId

  const siblingIds = (
    await prisma.listing.findMany({ where: { productId }, select: { id: true } })
  ).map((l) => l.id)

  await prisma.rental.deleteMany({ where: { listingId: { in: siblingIds } } })
  await prisma.order.deleteMany({ where: { listingId: { in: siblingIds } } })
  await prisma.listing.deleteMany({ where: { productId } })
  await prisma.traceabilityChain.deleteMany({ where: { productId } })
  await prisma.product.delete({ where: { id: productId } })

  redirect('/artisan/list')
}
