import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EditListingClient } from './EditListingClient'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      product: {
        include: { listings: true },
      },
    },
  })

  if (!listing) notFound()

  return (
    <EditListingClient
      listingId={listing.id}
      name={listing.product.name}
      description={listing.product.description}
      materialType={listing.product.materialType}
      images={listing.product.images}
      listings={listing.product.listings.map((l) => ({
        id: l.id,
        type: l.type,
        price: l.price,
      }))}
    />
  )
}
