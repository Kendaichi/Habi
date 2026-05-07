import { NextResponse } from 'next/server'
import { dbRoleToAppRole, getProfileRedirect, upsertAuthUserProfile } from '@/lib/auth-profile'
import { createSupabaseServerClient } from '@/lib/supabase/server'

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

  let profile
  try {
    profile = await upsertAuthUserProfile(data.user, {
      role: body.role,
      name: body.name,
    })
  } catch (caught) {
    return NextResponse.json(
      { error: caught instanceof Error ? caught.message : 'Unable to create your Habi profile.' },
      { status: 400 },
    )
  }

  const appRole = dbRoleToAppRole(profile.role)
  return NextResponse.json({
    user: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: appRole,
    },
    redirectTo: getProfileRedirect(profile.role),
  })
}
