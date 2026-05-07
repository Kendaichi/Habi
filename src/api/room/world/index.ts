import { NextRequest, NextResponse } from 'next/server'
import { getRoomWorldPayload } from '@/lib/room-service'
import type { Handler } from '@/types/server'

export const GET: Handler = async (req: NextRequest) => {
  try {
    const roomId = req.nextUrl.searchParams.get('id')

    if (!roomId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const result = await getRoomWorldPayload(roomId)
    if (!result) {
      return NextResponse.json({ error: 'Room world not found' }, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('GET /api/room/world failed', error)
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
