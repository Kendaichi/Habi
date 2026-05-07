import { prisma } from '@/lib/prisma'
import { ListingsClient, type ListingRow } from './ListingsClient'

const ARTISAN_ID = 'user-artisan-sitti'

const MATERIAL_BG: Record<string, string> = {
  Plastic: 'from-[#A0B4C8] to-[#6080A0]',
  Metal: 'from-[#C8A882] to-[#9C7A5A]',
  Bamboo: 'from-[#8FAF8A] to-[#4A7A5A]',
  Textile: 'from-[#BFA9A0] to-[#8A6E65]',
}
const DEFAULT_BG = 'from-[#C0C8D0] to-[#808890]'

export default async function MyListingsPage() {
  const [listings, activeRentals] = await Promise.all([
    prisma.listing.findMany({
      where: { product: { artisanId: ARTISAN_ID } },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.rental.findMany({
      where: { listing: { product: { artisanId: ARTISAN_ID } }, returnedAt: null },
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
      ? Math.max(0, Math.ceil((nearestRental.endDate.getTime() - Date.now()) / 86_400_000))
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
