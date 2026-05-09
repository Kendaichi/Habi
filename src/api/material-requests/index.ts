import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Handler } from '@/types/server'

const errBody = (error: unknown) =>
  process.env.NODE_ENV !== 'production' && error instanceof Error
    ? { error: 'Internal server error', detail: error.message }
    : { error: 'Internal server error' }

export const GET: Handler = async () => {
  try {
    await requireRole(Role.ARTISAN)
    const requests = await prisma.materialRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(requests)
  } catch (error) {
    console.error('GET /api/material-requests failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const POST: Handler = async (req: NextRequest) => {
  try {
    await requireRole(Role.ARTISAN)
    const body = (await req.json()) as {
      materialType: string
      quantityKg: number
      dateNeeded: string
      description?: string
      photoUrl?: string
    }

    if (!body.materialType || !body.quantityKg || !body.dateNeeded) {
      return NextResponse.json({ error: 'materialType, quantityKg, and dateNeeded are required' }, { status: 400 })
    }

    const request = await prisma.materialRequest.create({
      data: {
        id: crypto.randomUUID(),
        materialType: body.materialType,
        quantityKg: body.quantityKg,
        dateNeeded: new Date(body.dateNeeded),
        description: body.description ?? null,
        photoUrl: body.photoUrl ?? null,
      },
    })

    return NextResponse.json(request, { status: 201 })
  } catch (error) {
    console.error('POST /api/material-requests failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const PATCH: Handler = async (req: NextRequest) => {
  try {
    await requireRole(Role.ARTISAN)
    const body = (await req.json()) as {
      id: string
      materialType?: string
      quantityKg?: number
      dateNeeded?: string
      description?: string
      photoUrl?: string
    }

    if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const request = await prisma.materialRequest.update({
      where: { id: body.id },
      data: {
        ...(body.materialType !== undefined && { materialType: body.materialType }),
        ...(body.quantityKg !== undefined && { quantityKg: body.quantityKg }),
        ...(body.dateNeeded !== undefined && { dateNeeded: new Date(body.dateNeeded) }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl ?? null }),
      },
    })

    return NextResponse.json(request)
  } catch (error) {
    console.error('PATCH /api/material-requests failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const DELETE: Handler = async (req: NextRequest) => {
  try {
    await requireRole(Role.ARTISAN)
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await prisma.materialRequest.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/material-requests failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}
