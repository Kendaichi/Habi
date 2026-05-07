import { NextResponse } from 'next/server'
import { Role } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { getRoleHomeRoute, isUserRole, type AppRole } from '@/lib/role-routes'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const appRoleToDbRole: Record<AppRole, Role> = {
  buyer: Role.BUYER,
  artisan: Role.ARTISAN,
  supplier: Role.SUPPLIER,
  junkshop: Role.JUNKSHOP,
}

function dbRoleToAppRole(role: Role): AppRole {
  return role.toLowerCase() as AppRole
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    role?: string
    name?: string
  }

  const existingByAuth = await prisma.user.findUnique({
    where: { authId: data.user.id },
  })

  const existingByEmail = existingByAuth
    ? null
    : await prisma.user.findUnique({
        where: { email: data.user.email },
      })

  const bodyRole = body.role ?? null
  const selectedRole = isUserRole(bodyRole) ? appRoleToDbRole[bodyRole] : null
  const role = existingByAuth?.role ?? existingByEmail?.role ?? selectedRole

  if (!role) {
    return NextResponse.json({ error: 'Role is required for first-time profile setup.' }, { status: 400 })
  }

  const name =
    body.name?.trim() ||
    existingByAuth?.name ||
    existingByEmail?.name ||
    data.user.user_metadata?.name ||
    data.user.email.split('@')[0] ||
    'Habi User'

  const profile = existingByAuth
    ? await prisma.user.update({
        where: { id: existingByAuth.id },
        data: { email: data.user.email, name },
      })
    : existingByEmail
      ? await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { authId: data.user.id, name, role },
        })
      : await prisma.user.create({
          data: {
            authId: data.user.id,
            email: data.user.email,
            name,
            role,
          },
        })

  const appRole = dbRoleToAppRole(profile.role)
  return NextResponse.json({
    user: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: appRole,
    },
    redirectTo: getRoleHomeRoute(appRole),
  })
}
