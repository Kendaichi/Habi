"use client"

import { LayoutGrid, ClipboardList, PackageSearch, BarChart2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  label: string
  icon: LucideIcon
  href: string
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/artisan/dashboard" },
  { label: "Listing", icon: ClipboardList, href: "/artisan/list" },
  { label: "Sourcing", icon: PackageSearch, href: "/artisan/materials" },
  { label: "Insights", icon: BarChart2, href: "/artisan/demand" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream border-t border-border safe-area-inset-bottom">
      <div className="flex items-stretch h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
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
