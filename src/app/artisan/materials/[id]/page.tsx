import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { HubDetailsClient } from './HubDetailsClient'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SHOP_BUCKET = 'shop-images'

function shopImageUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${SHOP_BUCKET}/${path}`
}

export default async function HubDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const shop = await prisma.junkShop.findUnique({
    where: { id },
    include: { materialsList: { where: { available: true } } },
  })

  if (!shop) notFound()

  const heroUrl = shopImageUrl(`seed/${id}-hero.webp`)
  const galleryUrls = [0, 1, 2, 3].map((i) => shopImageUrl(`seed/${id}-g${i}.webp`))

  return (
    <HubDetailsClient
      shop={{
        id: shop.id,
        name: shop.name,
        address: shop.address ?? shop.city,
        isVerified: shop.verifiedAt !== null,
        image: heroUrl,
        galleryImages: galleryUrls,
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
