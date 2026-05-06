'use server'

import { redirect } from 'next/navigation'
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
  await prisma.materialRequest.create({
    data: {
      materialType,
      quantityKg,
      dateNeeded: new Date(dateNeeded),
      description: description || null,
    },
  })

  redirect('/artisan/materials')
}
