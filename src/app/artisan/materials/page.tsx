import { prisma } from '@/lib/prisma'
import { MaterialsClient, type HubRow } from './MaterialsClient'

export default async function ArtisanMaterialsPage() {
  const junkShops = await prisma.junkShop.findMany({
    include: {
      materialsList: { where: { available: true } },
    },
    orderBy: { name: 'asc' },
  })

  const hubs: HubRow[] = junkShops.map((shop) => ({
    id: shop.id,
    name: shop.name,
    address: shop.address ?? shop.city,
    verified: shop.verifiedAt !== null,
    materials: shop.materialsList.map((m) => ({
      type: m.type,
      qty: `${m.quantityKg}kg`,
    })),
  }))

  return <MaterialsClient hubs={hubs} />
}
