import { NextResponse } from 'next/server'
import { Role } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import type { Handler } from '@/types/server'

export const GET: Handler = async () => {
  try {
    const artisans = await prisma.user.findMany({
      where: { role: Role.ARTISAN },
      include: {
        products: { select: { materialType: true }, distinct: ['materialType'] },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(artisans)
  } catch (error) {
    console.error('GET /api/network failed', error)
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
