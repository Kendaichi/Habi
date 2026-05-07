import { NextResponse } from 'next/server'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const buyer = await requireRole(Role.BUYER)
  const body = (await request.json().catch(() => ({}))) as {
    description?: string
    budget?: number
    materials?: string[]
    photoName?: string | null
  }

  const artisan = await prisma.user.findFirst({
    where: { role: Role.ARTISAN },
    orderBy: { createdAt: 'asc' },
  })

  if (!artisan) {
    return NextResponse.json({ error: 'No artisan is available for requests yet.' }, { status: 400 })
  }

  const requestText = [
    body.description?.trim() || 'Custom Habi buyer request',
    body.materials?.length ? `Materials: ${body.materials.join(', ')}` : null,
    body.photoName ? `Room photo: ${body.photoName}` : null,
  ]
    .filter(Boolean)
    .join('\n\n')

  const customRequest = await prisma.customRequest.create({
    data: {
      buyerId: buyer.id,
      artisanId: artisan.id,
      description: requestText,
      budget: body.budget,
    },
  })

  return NextResponse.json({ id: customRequest.id })
}
