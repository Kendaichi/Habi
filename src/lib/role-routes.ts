export type AppRole = 'buyer' | 'artisan' | 'supplier' | 'junkshop'

export const roleLabels: Record<AppRole, string> = {
  buyer: 'Buyer',
  artisan: 'Artisan',
  supplier: 'Supplier',
  junkshop: 'Junk Shop',
}

export const roleHomeRoutes: Record<AppRole, string> = {
  buyer: '/buyer/home',
  artisan: '/artisan/dashboard',
  supplier: '/supplier/dashboard',
  junkshop: '/junkshop/dashboard',
}

export function isUserRole(value: string | null): value is AppRole {
  return value === 'buyer' || value === 'artisan' || value === 'supplier' || value === 'junkshop'
}

export function getRoleHomeRoute(role: AppRole | null) {
  return role ? roleHomeRoutes[role] : '/onboarding/role-select'
}
