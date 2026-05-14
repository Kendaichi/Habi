'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function acceptQuote(id: string) {
  await requireRole(Role.JUNKSHOP)
  await prisma.quoteRequest.update({ where: { id }, data: { status: 'ACCEPTED' } })
  revalidatePath('/junkshop/quotes')
}

export async function rejectQuote(id: string) {
  await requireRole(Role.JUNKSHOP)
  await prisma.quoteRequest.update({ where: { id }, data: { status: 'REJECTED' } })
  revalidatePath('/junkshop/quotes')
}
