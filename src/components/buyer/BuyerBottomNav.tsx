'use client'

import { Compass, ScanSearch, ClipboardList, UserCircle2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  label: string
  icon: LucideIcon
  href: string
}

const navItems: NavItem[] = [
  { label: 'Discover', icon: Compass, href: '/buyer/home' },
  { label: 'AI Room', icon: ScanSearch, href: '/buyer/room/image-design' },
  { label: 'Orders', icon: ClipboardList, href: '/buyer/orders' },
  { label: 'Profile', icon: UserCircle2, href: '/shared/profile' },
]

export function BuyerBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-cream/90 fixed right-0 bottom-0 left-0 z-50 px-4 pb-7 backdrop-blur-md">
      <div className="shadow-charcoal/10 mx-auto flex h-18 max-w-md items-center justify-around rounded-[28px] border border-stone-200 bg-white/95 px-2 shadow-xl sm:max-w-2xl">
        {navItems.map((item) => {
          const isActive =
            item.href === '/buyer/room/image-design'
              ? pathname.startsWith('/buyer/room/')
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-16 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-all ${
                isActive
                  ? 'bg-terracotta text-cream scale-[0.96] shadow-sm'
                  : 'text-stone hover:text-forest'
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.8} />
              <span className="text-[11px] font-medium tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
