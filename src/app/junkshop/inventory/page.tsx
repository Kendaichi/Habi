import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { InventoryClient, type MaterialRow } from './InventoryClient'

export default async function InventoryListPage() {
  const user = await requireRole(Role.JUNKSHOP)
  const shop =
    (await prisma.junkShop.findFirst({
      where: { name: { contains: user.name, mode: 'insensitive' } },
    })) ?? (await prisma.junkShop.findFirst())

  const materials = await prisma.material.findMany({
    where: shop ? { junkShopId: shop.id } : { id: '__missing__' },
    orderBy: { quantityKg: 'desc' },
  })

  const rows: MaterialRow[] = materials.map((m) => ({
    id: m.id,
    type: m.type,
    quantityKg: m.quantityKg,
    pricePerKg: m.pricePerKg,
    available: m.available,
  }))

  return <InventoryClient materials={rows} />
}
