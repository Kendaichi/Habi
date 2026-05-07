import { redirect } from 'next/navigation'
import { getCurrentUserProfile } from '@/lib/auth'
import { getRoleHomeRoute, type AppRole } from '@/lib/role-routes'

export default async function RootPage() {
  const profile = await getCurrentUserProfile()

  if (!profile) {
    redirect('/onboarding/role-select')
  }

  redirect(getRoleHomeRoute(profile.role.toLowerCase() as AppRole))
}
