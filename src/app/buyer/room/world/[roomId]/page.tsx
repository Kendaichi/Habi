import { notFound } from 'next/navigation'
import { RoomWorldClient } from '@/components/buyer/RoomWorldClient'
import { getRoomWorldPayload } from '@/lib/room-service'

export default async function RoomWorldPage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params
  const payload = await getRoomWorldPayload(roomId)

  if (!payload) {
    notFound()
  }

  // Proxy the GLB through our server to avoid R2 CORS restrictions
  const proxiedPayload =
    payload.worldAssetUrl && /^https?:\/\//.test(payload.worldAssetUrl)
    ? {
        ...payload,
        worldAssetUrl: `/api/room/glb?url=${encodeURIComponent(payload.worldAssetUrl)}`,
      }
    : payload

  return <RoomWorldClient payload={proxiedPayload} />
}
