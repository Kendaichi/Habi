import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { HubDetailsClient } from './HubDetailsClient'

export default async function HubDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const shop = await prisma.junkShop.findUnique({
    where: { id },
    include: { materialsList: { where: { available: true } } },
  })

  if (!shop) notFound()

  return (
    <HubDetailsClient
      shop={{
        id: shop.id,
        name: shop.name,
        address: shop.address ?? shop.city,
        isVerified: shop.verifiedAt !== null,
        materials: shop.materialsList.map((m) => ({
          id: m.id,
          type: m.type,
          quantityKg: m.quantityKg,
          pricePerKg: m.pricePerKg,
        })),
      }}
    />
  )
}
