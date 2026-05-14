import { notFound } from 'next/navigation'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { ImageDesignJob } from '@/api/room/image-design'
import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { RoomImageResultClient } from '@/components/buyer/RoomImageResultClient'

export default async function RoomImageResultPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; sourceUrl?: string; generatedUrl?: string; isMock?: string; listingId?: string }>
}) {
  await requireRole(Role.BUYER)
  const { mode, sourceUrl, generatedUrl, isMock, listingId } = await searchParams

  if (!mode || !sourceUrl || !generatedUrl) notFound()

  const job: ImageDesignJob = {
    jobId: '',
    mode: mode as ImageDesignJob['mode'],
    sourceImageUrl: sourceUrl,
    generatedImageUrl: generatedUrl,
    isMock: isMock === 'true',
    listingId,
  }

  let listing = undefined
  if (job.mode === 'preview' && listingId) {
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
      <RoomImageResultClient job={job} listing={listing} />
      <BuyerBottomNav />
    </>
  )
}
