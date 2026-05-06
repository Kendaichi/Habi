'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRoleHomeRoute, isUserRole } from '@/lib/role-routes'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('habi_role')
    router.replace(isUserRole(role) ? getRoleHomeRoute(role) : '/onboarding/role-select')
  }, [router])

  return null
}
