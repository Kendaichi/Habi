import { notFound } from 'next/navigation'
import { RoomVisualizerClient } from '@/components/buyer/RoomVisualizerClient'
import { getVisualizerPayload } from '@/lib/room-service'

export default async function RoomVisualizerPage({
  params,
}: {
  params: Promise<{ listingId: string }>
}) {
  const { listingId } = await params
  const payload = await getVisualizerPayload(listingId)

  if (!payload) {
    notFound()
  }

  return <RoomVisualizerClient payload={payload} />
}
