import type { User } from '@supabase/supabase-js'
import { Role } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { getRoleHomeRoute, isUserRole, type AppRole } from '@/lib/role-routes'

const appRoleToDbRole: Record<AppRole, Role> = {
  buyer: Role.BUYER,
  artisan: Role.ARTISAN,
  supplier: Role.SUPPLIER,
  junkshop: Role.JUNKSHOP,
}

export function dbRoleToAppRole(role: Role): AppRole {
  return role.toLowerCase() as AppRole
}

export function getProfileRedirect(role: Role) {
  return getRoleHomeRoute(dbRoleToAppRole(role))
}

export async function upsertAuthUserProfile(
  authUser: User,
  input: { role?: string | null; name?: string | null } = {},
) {
  if (!authUser.email) {
    throw new Error('Authenticated user is missing an email address.')
  }

  const existingByAuth = await prisma.user.findUnique({
    where: { authId: authUser.id },
  })

  const existingByEmail = existingByAuth
    ? null
    : await prisma.user.findUnique({
        where: { email: authUser.email },
      })

  const metadataRole = authUser.user_metadata?.role
  const requestedRole = input.role ?? (typeof metadataRole === 'string' ? metadataRole : null)
  const selectedRole = isUserRole(requestedRole) ? appRoleToDbRole[requestedRole] : null
  const role = existingByAuth?.role ?? existingByEmail?.role ?? selectedRole

  if (!role) {
    throw new Error('Role is required for first-time profile setup.')
  }

  const metadataName = authUser.user_metadata?.name
  const name =
    input.name?.trim() ||
    (typeof metadataName === 'string' ? metadataName.trim() : '') ||
    existingByAuth?.name ||
    existingByEmail?.name ||
    authUser.email.split('@')[0] ||
    'Habi User'

  if (existingByAuth) {
    return prisma.user.update({
      where: { id: existingByAuth.id },
      data: { email: authUser.email, name },
    })
  }

  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: { authId: authUser.id, name, role },
    })
  }

  return prisma.user.create({
    data: {
      authId: authUser.id,
      email: authUser.email,
      name,
      role,
    },
  })
}
