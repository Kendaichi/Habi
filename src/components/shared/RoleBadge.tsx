import type { UserRole } from "@/context/RoleContext"

interface RoleBadgeProps {
  role: UserRole
}

const styles: Record<UserRole, string> = {
  buyer: "bg-forest/10 text-forest",
  artisan: "bg-terracotta/10 text-terracotta",
  supplier: "bg-mustard/20 text-charcoal",
}

const labels: Record<UserRole, string> = {
  buyer: "Buyer",
  artisan: "Artisan",
  supplier: "Supplier",
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${styles[role]}`}
    >
      {labels[role]}
    </span>
  )
}
