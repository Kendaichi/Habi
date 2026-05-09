'use server'

import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { CartItem } from '@/context/CartContext'

export async function getCartItems(): Promise<CartItem[]> {
  const artisan = await requireRole(Role.ARTISAN)
  const rows = await prisma.quoteCartItem.findMany({
    where: { artisanId: artisan.id },
    orderBy: { createdAt: 'asc' },
  })
  return rows.map((r) => ({
    materialId: r.materialId,
    type: r.type,
    quantityKg: r.quantityKg,
    pricePerKg: r.pricePerKg,
    hubId: r.hubId,
    hubName: r.hubName,
  }))
}

export async function addCartItem(item: CartItem): Promise<void> {
  const artisan = await requireRole(Role.ARTISAN)
  await prisma.quoteCartItem.upsert({
    where: { artisanId_materialId: { artisanId: artisan.id, materialId: item.materialId } },
    update: {},
    create: {
      artisanId: artisan.id,
      materialId: item.materialId,
      type: item.type,
      quantityKg: item.quantityKg,
      pricePerKg: item.pricePerKg,
      hubId: item.hubId,
      hubName: item.hubName,
    },
  })
}

export async function removeCartItem(materialId: string): Promise<void> {
  const artisan = await requireRole(Role.ARTISAN)
  await prisma.quoteCartItem.deleteMany({
    where: { artisanId: artisan.id, materialId },
  })
}

export async function clearCartItems(): Promise<void> {
  const artisan = await requireRole(Role.ARTISAN)
  await prisma.quoteCartItem.deleteMany({ where: { artisanId: artisan.id } })
}

export async function checkoutCart(notes?: string): Promise<void> {
  const artisan = await requireRole(Role.ARTISAN)

  const cartItems = await prisma.quoteCartItem.findMany({
    where: { artisanId: artisan.id },
  })

  if (cartItems.length === 0) throw new Error('Cart is empty')

  await prisma.$transaction([
    prisma.quoteRequest.create({
      data: {
        artisanId: artisan.id,
        notes: notes || null,
        items: {
          create: cartItems.map((item) => ({
            materialId: item.materialId,
            type: item.type,
            quantityKg: item.quantityKg,
            pricePerKg: item.pricePerKg,
            hubId: item.hubId,
            hubName: item.hubName,
          })),
        },
      },
    }),
    prisma.quoteCartItem.deleteMany({ where: { artisanId: artisan.id } }),
  ])
}
