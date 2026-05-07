'use server'

import { redirect } from 'next/navigation'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function updateMaterial(formData: FormData) {
  await requireRole(Role.JUNKSHOP)
  const id = formData.get('id') as string
  const type = (formData.get('category') as string | null)?.trim()
  const quantityKg = parseFloat((formData.get('weight') as string) ?? '')
  const pricePerKg = parseFloat((formData.get('pricePerKg') as string) ?? '')
  const available = formData.get('available') === 'true'

  if (!id || !type || isNaN(quantityKg) || quantityKg <= 0 || isNaN(pricePerKg) || pricePerKg <= 0) return

  await prisma.material.update({
    where: { id },
    data: { type, quantityKg, pricePerKg, available },
  })

  redirect('/junkshop/inventory')
}

export async function deleteMaterial(formData: FormData) {
  await requireRole(Role.JUNKSHOP)
  const id = formData.get('id') as string
  if (!id) return
  await prisma.material.delete({ where: { id } })
  redirect('/junkshop/inventory')
}
