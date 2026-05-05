import { BadgeCheck, Bell } from 'lucide-react'

interface TopNavProps {
  profileImage?: string | null
  shopName?: string
}

export function TopNav({ profileImage, shopName = 'Koronadal Recyclers' }: TopNavProps) {
  return (
    <header className="bg-cream border-stone/20 sticky top-0 z-50 flex w-full items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="border-forest/30 h-10 w-10 overflow-hidden rounded-full border-2">
          <img
            alt="User Profile"
            className="h-full w-full object-cover"
            src={profileImage ?? '/Habi_Logo.png'}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-forest font-['Noto_Serif'] text-lg font-bold">Habi</span>
          <div className="flex items-center gap-1">
            <span className="text-stone text-xs font-medium">{shopName}</span>
            <BadgeCheck className="text-forest h-3.5 w-3.5" fill="currentColor" strokeWidth={1.5} />
          </div>
        </div>
      </div>
      <button className="text-stone transition-opacity hover:opacity-80" aria-label="Notifications">
        <Bell className="h-6 w-6" strokeWidth={1.75} />
      </button>
    </header>
  )
}
