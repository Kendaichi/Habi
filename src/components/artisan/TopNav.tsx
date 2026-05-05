import { Bell, Leaf } from 'lucide-react'

export function TopNav() {
  return (
    <header className="border-stone/20 bg-cream/90 sticky top-0 z-40 flex items-center border-b px-5 py-3 backdrop-blur-sm">
      <div className="bg-forest/15 flex h-9 w-9 items-center justify-center rounded-full">
        <Leaf className="text-forest h-5 w-5" />
      </div>
      <span className="text-charcoal flex-1 px-4 text-left text-sm font-semibold tracking-wide">
        Artisan Hub
      </span>
      <button
        className="hover:bg-stone/10 flex h-11 w-11 items-center justify-center rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="text-charcoal h-5 w-5" strokeWidth={1.75} />
      </button>
    </header>
  )
}
