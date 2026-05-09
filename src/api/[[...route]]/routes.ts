import { NextRequest, NextResponse } from 'next/server'
import { GET as getRoomStatus, POST as generateRoom } from '@/api/room/generate'
import { GET as getRoomWorld } from '@/api/room/world'
import {
  GET as getListings,
  POST as createListing,
  PATCH as updateListing,
  DELETE as deleteListing,
} from '@/api/listings'
import {
  GET as getMaterials,
  POST as createMaterial,
  PATCH as updateMaterial,
  DELETE as deleteMaterial,
} from '@/api/materials'
import {
  GET as getMaterialRequests,
  POST as createMaterialRequest,
  PATCH as updateMaterialRequest,
  DELETE as deleteMaterialRequest,
} from '@/api/material-requests'
import { GET as getDemand } from '@/api/demand'
import { GET as getNetwork } from '@/api/network'
import type { Route } from '@/types/server'

const routes: Record<string, Route> = {
  'POST /api/room/generate': { method: 'POST', handler: generateRoom },
  'GET /api/room/generate': { method: 'GET', handler: getRoomStatus },
  'GET /api/room/world': { method: 'GET', handler: getRoomWorld },

  'GET /api/listings': { method: 'GET', handler: getListings },
  'POST /api/listings': { method: 'POST', handler: createListing },
  'PATCH /api/listings': { method: 'PATCH', handler: updateListing },
  'DELETE /api/listings': { method: 'DELETE', handler: deleteListing },

  'GET /api/materials': { method: 'GET', handler: getMaterials },
  'POST /api/materials': { method: 'POST', handler: createMaterial },
  'PATCH /api/materials': { method: 'PATCH', handler: updateMaterial },
  'DELETE /api/materials': { method: 'DELETE', handler: deleteMaterial },

  'GET /api/material-requests': { method: 'GET', handler: getMaterialRequests },
  'POST /api/material-requests': { method: 'POST', handler: createMaterialRequest },
  'PATCH /api/material-requests': { method: 'PATCH', handler: updateMaterialRequest },
  'DELETE /api/material-requests': { method: 'DELETE', handler: deleteMaterialRequest },

  'GET /api/demand': { method: 'GET', handler: getDemand },

  'GET /api/network': { method: 'GET', handler: getNetwork },
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
