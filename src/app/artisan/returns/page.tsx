import { prisma } from '@/lib/prisma'
import { ReturnsClient, type ReturnRow } from './ReturnsClient'
import { RefurbStatus } from '@/generated/prisma/enums'

const ARTISAN_ID = 'user-artisan-sitti'

const MATERIAL_BG: Record<string, string> = {
  Plastic: 'from-[#A0B4C8] to-[#6080A0]',
  Metal: 'from-[#C8A882] to-[#9C7A5A]',
  Bamboo: 'from-[#8FAF8A] to-[#4A7A5A]',
  Textile: 'from-[#BFA9A0] to-[#8A6E65]',
}
const DEFAULT_BG = 'from-[#C0C8D0] to-[#808890]'

type RentalFull = {
  id: string
  endDate: Date
  refurbStatus: string
  listing: { product: { name: string; materialType: string } }
  buyer: { name: string }
}

function getRentalDetail(status: string, endDate: Date): string {
  if (status === RefurbStatus.IN_USE) {
    const days = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / 86_400_000))
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
  const rentals = (await prisma.rental.findMany({
    where: { listing: { product: { artisanId: ARTISAN_ID } } },
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
    detail: getRentalDetail(r.refurbStatus, r.endDate),
    buyerName: r.buyer.name,
    imageBg: MATERIAL_BG[r.listing.product.materialType] ?? DEFAULT_BG,
  }))

  return <ReturnsClient returns={returns} />
}
