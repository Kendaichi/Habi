'use client'

import { LayoutGrid, ClipboardList, PackageSearch, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  icon: LucideIcon
  href: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutGrid, href: '/artisan/dashboard' },
  { label: 'Listing', icon: ClipboardList, href: '/artisan/list' },
  { label: 'Sourcing', icon: PackageSearch, href: '/artisan/materials' },
  { label: 'Insights', icon: BarChart2, href: '/artisan/demand' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-cream/90 fixed bottom-0 left-0 z-50 flex w-full items-center justify-around px-4 pb-8 backdrop-blur-md">
      <div className="shadow-charcoal/10 fixed right-4 bottom-4 left-4 flex h-16 items-center justify-around rounded-3xl border border-stone-200 bg-white px-2 shadow-xl">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200 ease-out ${
                isActive
                  ? 'text-terracotta scale-90 bg-stone-200 px-4 py-2 shadow-sm'
                  : 'hover:text-forest p-2 text-stone-500'
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
