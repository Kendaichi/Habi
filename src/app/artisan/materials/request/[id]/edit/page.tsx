import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EditRequestClient } from './EditRequestClient'

export default async function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const request = await prisma.materialRequest.findUnique({ where: { id } })
  if (!request) notFound()

  return (
    <EditRequestClient
      request={{
        id: request.id,
        materialType: request.materialType,
        quantityKg: request.quantityKg,
        dateNeeded: request.dateNeeded.toISOString().split('T')[0],
        description: request.description,
        photoUrl: request.photoUrl,
        status: request.status,
      }}
    />
  )
}
