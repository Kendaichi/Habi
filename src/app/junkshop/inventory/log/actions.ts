'use server'

import { redirect } from 'next/navigation'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function logMaterial(formData: FormData) {
  const user = await requireRole(Role.JUNKSHOP)
  const type = (formData.get('category') as string | null)?.trim()
  const quantityKg = parseFloat((formData.get('weight') as string) ?? '')
  const pricePerKg = parseFloat((formData.get('pricePerKg') as string) ?? '')

  if (!type || isNaN(quantityKg) || quantityKg <= 0 || isNaN(pricePerKg) || pricePerKg <= 0) return

  const shop =
    (await prisma.junkShop.findFirst({
      where: { name: { contains: user.name, mode: 'insensitive' } },
    })) ?? (await prisma.junkShop.findFirst())

  if (!shop) return

  await prisma.material.create({
    data: { junkShopId: shop.id, type, quantityKg, pricePerKg, available: true },
  })

  redirect('/junkshop/inventory')
}
