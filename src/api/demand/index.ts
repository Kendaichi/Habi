import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Handler } from '@/types/server'

export const GET: Handler = async () => {
  try {
    const signals = await prisma.demandSignal.findMany({
      orderBy: { count: 'desc' },
      take: 10,
    })
    return NextResponse.json(signals)
  } catch (error) {
    console.error('GET /api/demand failed', error)
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
