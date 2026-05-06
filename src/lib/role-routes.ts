import type { UserRole } from '@/context/RoleContext'

export const roleLabels: Record<UserRole, string> = {
  buyer: 'Buyer',
  artisan: 'Artisan',
  supplier: 'Supplier',
  junkshop: 'Junk Shop',
}

export const roleHomeRoutes: Record<UserRole, string> = {
  buyer: '/buyer/home',
  artisan: '/artisan/dashboard',
  supplier: '/supplier/dashboard',
  junkshop: '/junkshop/dashboard',
}

export function isUserRole(value: string | null): value is UserRole {
  return value === 'buyer' || value === 'artisan' || value === 'supplier' || value === 'junkshop'
}

export function getRoleHomeRoute(role: UserRole | null) {
  return role ? roleHomeRoutes[role] : '/onboarding/role-select'
}
