import { prisma } from '@/lib/prisma'

export async function getCurrentJunkShop(userName: string) {
  return (
    (await prisma.junkShop.findFirst({
      where: { name: { contains: userName, mode: 'insensitive' } },
    })) ?? (await prisma.junkShop.findFirst())
  )
}
