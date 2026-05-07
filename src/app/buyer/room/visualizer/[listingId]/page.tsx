import { notFound } from 'next/navigation'
import { RoomVisualizerClient } from '@/components/buyer/RoomVisualizerClient'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { getVisualizerPayload } from '@/lib/room-service'

export default async function RoomVisualizerPage({
  params,
}: {
  params: Promise<{ listingId: string }>
}) {
  const { listingId } = await params
  const buyer = await requireRole(Role.BUYER)
  const payload = await getVisualizerPayload(listingId, buyer.id)

  if (!payload) {
    notFound()
  }

  return <RoomVisualizerClient payload={payload} />
}
