'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('habi_role')
    if (!role) {
      router.replace('/onboarding/role-select')
    } else if (role === 'buyer') {
      router.replace('/buyer/home')
    } else if (role === 'junkshop') {
      router.replace('/junkshop/home')
    } else if (role === 'artisan') {
      router.replace('/artisan/dashboard')
    } else if (role === 'supplier') {
      router.replace('/supplier/dashboard')
    } else {
      router.replace('/onboarding/role-select')
    }
  }, [router])

  return null
}
