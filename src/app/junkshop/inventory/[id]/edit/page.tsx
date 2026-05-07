import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { Role } from '@/generated/prisma/enums'
import { EditMaterialClient } from './EditMaterialClient'

export default async function EditMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole(Role.JUNKSHOP)
  const { id } = await params

  const material = await prisma.material.findUnique({
    where: { id },
    select: { id: true, type: true, quantityKg: true, pricePerKg: true, available: true },
  })

  if (!material) notFound()

  return <EditMaterialClient material={material} />
}
