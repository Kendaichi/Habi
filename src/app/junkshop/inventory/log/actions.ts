'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

const JUNKSHOP_ID = 'junkshop-manila-plastic-hub'

export async function logMaterial(formData: FormData) {
  const type = (formData.get('category') as string | null)?.trim()
  const quantityKg = parseFloat((formData.get('weight') as string) ?? '')
  const pricePerKg = parseFloat((formData.get('pricePerKg') as string) ?? '')

  if (!type || isNaN(quantityKg) || quantityKg <= 0 || isNaN(pricePerKg) || pricePerKg <= 0) return

  await prisma.material.create({
    data: { junkShopId: JUNKSHOP_ID, type, quantityKg, pricePerKg, available: true },
  })

  redirect('/junkshop/inventory')
}
