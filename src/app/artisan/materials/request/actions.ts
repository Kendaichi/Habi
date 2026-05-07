'use server'

import { redirect } from 'next/navigation'
import { randomUUID } from 'node:crypto'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function deleteRequest(id: string) {
  await prisma.materialRequest.delete({ where: { id } })
}

export async function updateMaterialRequest(
  id: string,
  {
    materialType,
    quantityKg,
    dateNeeded,
    description,
    photoUrl,
  }: {
    materialType: string
    quantityKg: number
    dateNeeded: string
    description: string
    photoUrl?: string
  },
) {
  await prisma.materialRequest.update({
    where: { id },
    data: {
      materialType,
      quantityKg,
      dateNeeded: new Date(dateNeeded),
      description: description || null,
      photoUrl: photoUrl ?? null,
    },
  })

  redirect('/artisan/materials')
}

export async function submitMaterialRequest({
  materialType,
  quantityKg,
  dateNeeded,
  description,
  photoUrl,
}: {
  materialType: string
  quantityKg: number
  dateNeeded: string
  description: string
  photoUrl?: string
}) {
  await requireRole(Role.ARTISAN)
  await prisma.materialRequest.create({
    data: {
      id: crypto.randomUUID(),
      materialType,
      quantityKg,
      dateNeeded: new Date(dateNeeded),
      description: description || null,
      photoUrl: photoUrl ?? null,
    },
  })

  redirect('/artisan/materials')
}
