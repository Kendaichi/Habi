import { NextRequest, NextResponse } from 'next/server'
import { createRoomGeneration, getRoomStatus } from '@/lib/room-service'
import type { Handler } from '@/types/server'

export const POST: Handler = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as {
      presetId?: string
      imageUrl?: string
      notes?: string
      simulateFailure?: boolean
      imageInsights?: import('@/types/room').RoomImageInsights
    }

    if (!body.presetId) {
      return NextResponse.json({ error: 'presetId is required' }, { status: 400 })
    }

    const result = await createRoomGeneration({
      presetId: body.presetId as 'sunlit-sala' | 'heritage-den' | 'maker-loft',
      imageUrl: body.imageUrl,
      notes: body.notes,
      simulateFailure: body.simulateFailure,
      imageInsights: body.imageInsights,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('POST /api/room/generate failed', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status =
      message.includes('required for 3D world generation') ||
      message.includes('database is unavailable')
        ? 400
        : 500
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV !== 'production' && error instanceof Error
          ? { detail: error.message }
          : {}),
      },
      { status },
    )
  }
}

export const GET: Handler = async (req: NextRequest) => {
  try {
    const roomId = req.nextUrl.searchParams.get('id')

    if (!roomId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const result = await getRoomStatus(roomId)
    if (!result) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('GET /api/room/generate failed', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV !== 'production' && error instanceof Error
          ? { detail: error.message }
          : {}),
      },
      { status: 500 },
    )
  }
}
