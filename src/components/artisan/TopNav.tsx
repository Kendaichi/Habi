import { Bell, Leaf } from 'lucide-react'

export function TopNav() {
  return (
    <header className="flex items-center border px-5 py-2">
      <div className="bg-forest/15 flex h-9 w-9 items-center justify-center rounded-full">
        <Leaf className="text-forest h-5 w-5" />
      </div>
      <span className="text-charcoal flex-1 text-center text-sm font-semibold tracking-wide">
        Artisan Hub
      </span>
      <button className="flex h-9 w-9 items-center justify-center">
        <Bell className="text-charcoal h-5 w-5" strokeWidth={1.75} />
      </button>
    </header>
  )
}
