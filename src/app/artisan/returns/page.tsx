import { prisma } from '@/lib/prisma'
import { ReturnsClient, type ReturnRow } from './ReturnsClient'
import { RefurbStatus, Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { MATERIAL_BG, DEFAULT_BG } from '@/utils/material-styles'

type RentalFull = {
  id: string
  endDate: Date
  refurbStatus: string
  listing: { product: { name: string; materialType: string } }
  buyer: { name: string }
}

function getRentalDetail(status: string, endDate: Date, now: number): string {
  if (status === RefurbStatus.IN_USE) {
    const days = Math.max(0, Math.ceil((endDate.getTime() - now) / 86_400_000))
    return `${days} day${days !== 1 ? 's' : ''} remaining`
  }
  if (status === RefurbStatus.AWAITING) return 'Lease period ended'
  return 'Restoring surface finish'
}

function mapRefurbStatus(status: string): ReturnRow['status'] {
  if (status === RefurbStatus.AWAITING) return 'awaiting'
  if (status === RefurbStatus.REFURBISHING) return 'refurbishing'
  return 'in_use'
}

export default async function ArtisanReturnsPage() {
  const artisan = await requireRole(Role.ARTISAN)
  const now = new Date().getTime()
  const rentals = (await prisma.rental.findMany({
    where: { listing: { product: { artisanId: artisan.id } } },
    include: {
      listing: { include: { product: true } },
      buyer: true,
    },
    orderBy: { startDate: 'desc' },
  })) as unknown as RentalFull[]

  const returns: ReturnRow[] = rentals.map((r) => ({
    id: r.id,
    productName: r.listing.product.name,
    status: mapRefurbStatus(r.refurbStatus),
    detail: getRentalDetail(r.refurbStatus, r.endDate, now),
    buyerName: r.buyer.name,
    imageBg: MATERIAL_BG[r.listing.product.materialType] ?? DEFAULT_BG,
  }))

  return <ReturnsClient returns={returns} />
}
