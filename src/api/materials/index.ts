import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCurrentJunkShop } from '@/lib/junkshop'
import type { Handler } from '@/types/server'

const errBody = (error: unknown) =>
  process.env.NODE_ENV !== 'production' && error instanceof Error
    ? { error: 'Internal server error', detail: error.message }
    : { error: 'Internal server error' }

export const GET: Handler = async () => {
  try {
    const user = await requireRole(Role.JUNKSHOP)
    const shop = await getCurrentJunkShop(user.name)
    const materials = await prisma.material.findMany({
      where: shop ? { junkShopId: shop.id } : { id: '__missing__' },
      orderBy: { quantityKg: 'desc' },
    })
    return NextResponse.json(materials)
  } catch (error) {
    console.error('GET /api/materials failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const POST: Handler = async (req: NextRequest) => {
  try {
    const user = await requireRole(Role.JUNKSHOP)
    const body = (await req.json()) as {
      type: string
      quantityKg: number
      pricePerKg: number
    }

    if (!body.type || body.quantityKg <= 0 || body.pricePerKg <= 0) {
      return NextResponse.json({ error: 'type, quantityKg, and pricePerKg are required' }, { status: 400 })
    }

    const shop = await getCurrentJunkShop(user.name)
    if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 })

    const material = await prisma.material.create({
      data: { junkShopId: shop.id, type: body.type, quantityKg: body.quantityKg, pricePerKg: body.pricePerKg, available: true },
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('POST /api/materials failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const PATCH: Handler = async (req: NextRequest) => {
  try {
    await requireRole(Role.JUNKSHOP)
    const body = (await req.json()) as {
      id: string
      type?: string
      quantityKg?: number
      pricePerKg?: number
      available?: boolean
    }

    if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const material = await prisma.material.update({
      where: { id: body.id },
      data: {
        ...(body.type !== undefined && { type: body.type }),
        ...(body.quantityKg !== undefined && { quantityKg: body.quantityKg }),
        ...(body.pricePerKg !== undefined && { pricePerKg: body.pricePerKg }),
        ...(body.available !== undefined && { available: body.available }),
      },
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('PATCH /api/materials failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const DELETE: Handler = async (req: NextRequest) => {
  try {
    await requireRole(Role.JUNKSHOP)
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await prisma.material.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/materials failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}
