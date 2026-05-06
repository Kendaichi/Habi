import { NextRequest, NextResponse } from 'next/server'
import { GET as getRoomStatus, POST as generateRoom } from '@/api/room/generate'
import { GET as getRoomWorld } from '@/api/room/world'
import type { Route } from '@/types/server'

const routes: Record<string, Route> = {
  'POST /api/room/generate': { method: 'POST', handler: generateRoom },
  'GET /api/room/generate': { method: 'GET', handler: getRoomStatus },
  'GET /api/room/world': { method: 'GET', handler: getRoomWorld },
}

export async function dispatch(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url)
  const key = `${req.method} ${url.pathname}`
  const route = routes[key]

  if (!route) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return route.handler(req)
}
