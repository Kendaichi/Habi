import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ListingType, ListingStatus } from '@/generated/prisma/client'
import type { Handler } from '@/types/server'

const errBody = (error: unknown) =>
  process.env.NODE_ENV !== 'production' && error instanceof Error
    ? { error: 'Internal server error', detail: error.message }
    : { error: 'Internal server error' }

export const GET: Handler = async () => {
  try {
    const artisan = await requireRole(Role.ARTISAN)
    const listings = await prisma.listing.findMany({
      where: { product: { artisanId: artisan.id } },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(listings)
  } catch (error) {
    console.error('GET /api/listings failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const POST: Handler = async (req: NextRequest) => {
  try {
    const artisan = await requireRole(Role.ARTISAN)
    const body = (await req.json()) as {
      name: string
      description: string
      materialType: string
      images: string[]
      listings: { type: string; price: number }[]
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        materialType: body.materialType,
        images: body.images,
        artisanId: artisan.id,
      },
    })

    if (body.listings.length > 0) {
      await prisma.listing.createMany({
        data: body.listings.map((l) => ({
          productId: product.id,
          type: l.type as ListingType,
          price: l.price,
          status: ListingStatus.AVAILABLE,
        })),
      })
    }

    return NextResponse.json({ productId: product.id }, { status: 201 })
  } catch (error) {
    console.error('POST /api/listings failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const PATCH: Handler = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as {
      id: string
      action?: 'archive'
      name?: string
      description?: string
      materialType?: string
      images?: string[]
      listings?: { type: ListingType; price: number }[]
    }

    if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const existing = await prisma.listing.findUnique({
      where: { id: body.id },
      select: { productId: true },
    })
    if (!existing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

    const productId = existing.productId

    if (body.action === 'archive') {
      await prisma.listing.updateMany({
        where: { productId },
        data: { status: ListingStatus.DRAFT },
      })
      return NextResponse.json({ ok: true })
    }

    if (body.name !== undefined) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          name: body.name,
          description: body.description,
          materialType: body.materialType,
          images: body.images,
        },
      })
    }

    if (body.listings) {
      const currentListings = await prisma.listing.findMany({
        where: { productId },
        select: { id: true, type: true },
      })

      for (const l of body.listings) {
        const match = currentListings.find((c) => c.type === l.type)
        if (match) {
          await prisma.listing.update({
            where: { id: match.id },
            data: { price: l.price, status: ListingStatus.AVAILABLE },
          })
        } else {
          await prisma.listing.create({
            data: { productId, type: l.type, price: l.price, status: ListingStatus.AVAILABLE },
          })
        }
      }

      const selectedTypes = new Set(body.listings.map((l) => l.type))
      const toDraft = currentListings.filter((c) => !selectedTypes.has(c.type)).map((c) => c.id)
      if (toDraft.length > 0) {
        await prisma.listing.updateMany({
          where: { id: { in: toDraft } },
          data: { status: ListingStatus.DRAFT },
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PATCH /api/listings failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}

export const DELETE: Handler = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { productId: true },
    })
    if (!existing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

    const productId = existing.productId
    const siblingIds = (
      await prisma.listing.findMany({ where: { productId }, select: { id: true } })
    ).map((l) => l.id)

    await prisma.rental.deleteMany({ where: { listingId: { in: siblingIds } } })
    await prisma.order.deleteMany({ where: { listingId: { in: siblingIds } } })
    await prisma.listing.deleteMany({ where: { productId } })
    await prisma.traceabilityChain.deleteMany({ where: { productId } })
    await prisma.product.delete({ where: { id: productId } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/listings failed', error)
    return NextResponse.json(errBody(error), { status: 500 })
  }
}
