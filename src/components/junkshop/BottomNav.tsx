'use client'

import { Home, Boxes, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  icon: LucideIcon
  href: string
}

const navItems: NavItem[] = [
  { label: 'Home', icon: Home, href: '/junkshop/dashboard' },
  { label: 'Inventory', icon: Boxes, href: '/junkshop/inventory' },
  { label: 'Artisans', icon: Users, href: '/junkshop/network' },
  // { label: 'Profile', icon: UserCircle, href: '/shared/profile' },
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
                  ? 'text-terracotta scale-90 bg-stone-100 px-4 py-2 shadow-sm'
                  : 'hover:text-forest p-2 text-stone-500'
              }`}
            >
              <item.icon
                className="h-5 w-5"
                {...(isActive
                  ? { fill: 'currentColor', stroke: 'currentColor', strokeWidth: 1 }
                  : {})}
              />
              <span className="font-['Noto_Serif'] text-[11px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
