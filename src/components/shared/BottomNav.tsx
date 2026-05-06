"use client"

import { Home, ScanLine, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRole } from "@/context/RoleContext"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  label: string
  icon: LucideIcon
  href: string
}

export function BottomNav() {
  const pathname = usePathname()
  const { role } = useRole()

  const dashboardHref =
    role === "artisan" ? "/artisan/dashboard" : role === "supplier" ? "/supplier/dashboard" : "/buyer/home"

  const items: NavItem[] = [
    { label: "Discover", icon: Home, href: dashboardHref },
    ...(role !== "supplier" ? [{ label: "AI Room", icon: ScanLine, href: "/buyer/room/upload" }] : []),
    { label: "Orders", icon: ShoppingBag, href: "/buyer/orders" },
    { label: "Profile", icon: User, href: "/shared/profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream border-t border-border safe-area-inset-bottom">
      <div className="flex items-stretch h-16 max-w-lg mx-auto px-2">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.label} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1 relative py-2">
              {isActive && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-forest rounded-b-full" />
              )}
              <item.icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-forest" : "text-stone"}`}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-forest" : "text-stone"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
