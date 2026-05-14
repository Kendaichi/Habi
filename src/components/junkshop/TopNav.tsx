import Image from 'next/image'
import { Bell } from 'lucide-react'
import Link from 'next/link'

interface TopNavProps {
  profileImage?: string | null
  shopName?: string
}

export function TopNav({ profileImage }: TopNavProps) {
  return (
    <header className="bg-cream border-stone/20 sticky top-0 z-50 border-b px-6 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/shared/profile" className="border-forest/30 relative block h-10 w-10 overflow-hidden rounded-full border-2">
            <Image
              alt="User Profile"
              src={profileImage ?? '/Habi_Logo.png'}
              fill
              sizes="40px"
              className="object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <span className="text-forest font-['Noto_Serif'] text-lg font-bold">Habi</span>
          </div>
        </div>
        <button className="text-stone transition-opacity hover:opacity-80" aria-label="Notifications">
          <Bell className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
