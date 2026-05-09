import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MATERIAL_BG, DEFAULT_BG } from '@/utils/material-styles'
import { ListingsClient, type ListingRow } from './ListingsClient'

export default async function MyListingsPage() {
  const artisan = await requireRole(Role.ARTISAN)
  const now = new Date().getTime()
  const [listings, activeRentals] = await Promise.all([
    prisma.listing.findMany({
      where: { product: { artisanId: artisan.id } },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.rental.findMany({
      where: { listing: { product: { artisanId: artisan.id } }, returnedAt: null },
      orderBy: { endDate: 'asc' },
    }),
  ])

  const rentalsByListing = new Map<string, typeof activeRentals>()
  for (const r of activeRentals) {
    const arr = rentalsByListing.get(r.listingId) ?? []
    arr.push(r)
    rentalsByListing.set(r.listingId, arr)
  }

  const listingRows: ListingRow[] = listings.map((l) => {
    const listingRentals = rentalsByListing.get(l.id) ?? []
    const nearestRental = listingRentals[0]
    const daysRemaining = nearestRental
      ? Math.max(0, Math.ceil((nearestRental.endDate.getTime() - now) / 86_400_000))
      : null

    return {
      id: l.id,
      productName: l.product.name,
      productDescription: l.product.description,
      status: l.status.toLowerCase() as ListingRow['status'],
      type: l.type.toLowerCase() as ListingRow['type'],
      views: l.views,
      rentalCount: listingRentals.length,
      daysRemaining,
      imageBg: MATERIAL_BG[l.product.materialType] ?? DEFAULT_BG,
      images: l.product.images,
    }
  })

  return <ListingsClient listings={listingRows} />
}
