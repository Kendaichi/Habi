'use server'

import { redirect } from 'next/navigation'
import { randomUUID } from 'node:crypto'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function submitMaterialRequest({
  materialType,
  quantityKg,
  dateNeeded,
  description,
}: {
  materialType: string
  quantityKg: number
  dateNeeded: string
  description: string
}) {
  await requireRole(Role.ARTISAN)
  await prisma.materialRequest.create({
    data: {
      id: randomUUID(),
      materialType,
      quantityKg,
      dateNeeded: new Date(dateNeeded),
      description: description || null,
    },
  })

  redirect('/artisan/materials')
}
