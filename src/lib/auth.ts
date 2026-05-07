import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Role } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/env'
import { getRoleHomeRoute, type AppRole } from '@/lib/role-routes'

type ClaimsResult = {
  data?: { claims?: { sub?: string; email?: string } | null }
  error?: unknown
}

export async function getCurrentAuthUser(): Promise<User | null> {
  if (!hasSupabaseBrowserEnv()) return null

  const supabase = await createSupabaseServerClient()
  const claimsResult = (await supabase.auth.getClaims().catch(() => null)) as ClaimsResult | null

  if (claimsResult?.data?.claims?.sub) {
    const { data, error } = await supabase.auth.getUser()
    if (!error) return data.user
  }

  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

export async function getCurrentUserProfile() {
  const authUser = await getCurrentAuthUser()
  if (!authUser) return null

  return prisma.user.findUnique({
    where: { authId: authUser.id },
  })
}

export async function requireUserProfile() {
  const profile = await getCurrentUserProfile()
  if (!profile) redirect('/onboarding/signin')
  return profile
}

export async function requireRole(roles: Role | Role[]) {
  if (!hasSupabaseBrowserEnv()) {
    const firstRole = Array.isArray(roles) ? roles[0] : roles
    const prototypeProfile = await getPrototypeProfile(firstRole)
    if (prototypeProfile) return prototypeProfile
    redirect('/onboarding/role-select')
  }

  const profile = await requireUserProfile()
  const allowed = Array.isArray(roles) ? roles : [roles]

  if (!allowed.includes(profile.role)) {
    redirect(getRoleHomeRoute(profile.role.toLowerCase() as AppRole))
  }

  return profile
}

async function getPrototypeProfile(role: Role) {
  const seededId =
    role === Role.BUYER
      ? 'user-buyer-juan'
      : role === Role.ARTISAN
        ? 'user-artisan-sitti'
        : role === Role.JUNKSHOP
          ? 'user-junkshop-demo'
        : null

  if (seededId) {
    const seeded = await prisma.user.findUnique({ where: { id: seededId } })
    if (seeded) return seeded

    if (role === Role.JUNKSHOP) {
      return prisma.user.upsert({
        where: { id: seededId },
        update: {},
        create: {
          id: seededId,
          email: 'junkshop.demo@habi.ph',
          name: 'Junk Shop Demo',
          role: Role.JUNKSHOP,
        },
      })
    }
  }

  return prisma.user.findFirst({ where: { role } })
}
