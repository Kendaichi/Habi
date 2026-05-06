import { prisma } from '@/lib/prisma'
import { InventoryClient, type MaterialRow } from './InventoryClient'

const JUNKSHOP_ID = 'junkshop-manila-plastic-hub'

export default async function InventoryListPage() {
  const materials = await prisma.material.findMany({
    where: { junkShopId: JUNKSHOP_ID },
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
