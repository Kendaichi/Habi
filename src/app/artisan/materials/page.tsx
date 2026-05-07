import { prisma } from '@/lib/prisma'
import { MaterialsClient, type HubRow, type RequestRow } from './MaterialsClient'

export default async function ArtisanMaterialsPage() {
  const [junkShops, materialRequests] = await Promise.all([
    prisma.junkShop.findMany({
      include: { materialsList: { where: { available: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.materialRequest.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

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

  const requests: RequestRow[] = materialRequests.map((r) => ({
    id: r.id,
    materialType: r.materialType,
    quantityKg: r.quantityKg,
    dateNeeded: r.dateNeeded.toISOString().split('T')[0],
    description: r.description,
    photoUrl: r.photoUrl,
    status: r.status,
  }))

  return <MaterialsClient hubs={hubs} requests={requests} />
}
