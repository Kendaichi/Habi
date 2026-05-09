'use server'

import { redirect } from 'next/navigation'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCurrentJunkShop } from '@/lib/junkshop'

export async function logMaterial(formData: FormData) {
  const user = await requireRole(Role.JUNKSHOP)
  const type = (formData.get('category') as string | null)?.trim()
  const quantityKg = parseFloat((formData.get('weight') as string) ?? '')
  const pricePerKg = parseFloat((formData.get('pricePerKg') as string) ?? '')

  if (!type || isNaN(quantityKg) || quantityKg <= 0 || isNaN(pricePerKg) || pricePerKg <= 0) return

  const shop = await getCurrentJunkShop(user.name)

  if (!shop) return

  await prisma.material.create({
    data: { junkShopId: shop.id, type, quantityKg, pricePerKg, available: true },
  })

  redirect('/junkshop/inventory')
}
