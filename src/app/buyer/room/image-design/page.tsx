import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { RoomImageDesignFlow } from '@/components/buyer/RoomImageDesignFlow'

export default async function RoomImageDesignPage({
  searchParams,
}: {
  searchParams: Promise<{ listingId?: string }>
}) {
  await requireRole(Role.BUYER)
  const { listingId } = await searchParams

  let listing = undefined
  if (listingId) {
    const record = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { product: { include: { artisan: true } } },
    })
    if (record) {
      listing = {
        listingId: record.id,
        productId: record.productId,
        productName: record.product.name,
        materialType: record.product.materialType,
        artisanName: record.product.artisan.name,
        imageUrl: record.product.images[0] ?? '',
        price: record.price,
      }
    }
  }

  return (
    <>
      <RoomImageDesignFlow listing={listing} />
      <BuyerBottomNav />
    </>
  )
}
