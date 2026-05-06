import { redirect } from 'next/navigation'
import { RoomProcessingClient } from '@/components/buyer/RoomProcessingClient'

export default async function RoomProcessingPage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string }>
}) {
  const { roomId } = await searchParams

  if (!roomId) {
    redirect('/buyer/room/upload')
  }

  return <RoomProcessingClient roomId={roomId} />
}
