import { Bell } from 'lucide-react'
import Link from 'next/link'

interface TopNavProps {
  profileImage?: string | null
  shopName?: string
}

export function TopNav({ profileImage }: TopNavProps) {
  return (
    <header className="bg-cream border-stone/20 sticky top-0 z-50 flex w-full items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-3">
        <Link href="/shared/profile" className="border-forest/30 block h-10 w-10 overflow-hidden rounded-full border-2">
          <img
            alt="User Profile"
            src={profileImage ?? '/Habi_Logo.png'}
            fill
            sizes="40px"
            className="object-cover"
          />
        </Link>
        <div className="flex flex-col">
          <span className="text-forest font-['Noto_Serif'] text-lg font-bold">Habi</span>
          {/* Keeping the shop subtitle disabled until we have a stable design for long names.
          <div className="flex items-center gap-1">
            <span className="text-stone text-xs font-medium">{shopName}</span>
            <BadgeCheck className="text-forest h-3.5 w-3.5" fill="currentColor" strokeWidth={1.5} />
          </div> */}
        </div>
      </div>
      <button className="text-stone transition-opacity hover:opacity-80" aria-label="Notifications">
        <Bell className="h-6 w-6" strokeWidth={1.75} />
      </button>
    </header>
  )
}
