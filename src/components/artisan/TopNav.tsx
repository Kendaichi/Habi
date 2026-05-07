'use client'

import { useState } from 'react'
import { Bell, ShoppingCart, X, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface TopNavProps {
  profileImage?: string | null
}

export function TopNav({ profileImage }: TopNavProps) {
  const { items, removeItem, clearCart } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const byHub = items.reduce<Record<string, { hubName: string; items: typeof items }>>((acc, item) => {
    if (!acc[item.hubId]) acc[item.hubId] = { hubName: item.hubName, items: [] }
    acc[item.hubId].items.push(item)
    return acc
  }, {})

  return (
    <>
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
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-stone relative transition-opacity hover:opacity-80"
            aria-label="Quote cart"
          >
            <ShoppingCart className="h-6 w-6" strokeWidth={1.75} />
            {items.length > 0 && (
              <span className="bg-terracotta text-cream absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
                {items.length}
              </span>
            )}
          </button>

          <button className="text-stone transition-opacity hover:opacity-80" aria-label="Notifications">
            <Bell className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b px-5">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-forest h-5 w-5" />
            <span className="font-heading text-forest font-bold">My Quote</span>
            {items.length > 0 && (
              <span className="bg-forest/10 text-forest rounded-full px-2 py-0.5 text-xs font-bold">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-stone hover:text-charcoal rounded-full p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(100%-56px)] flex-col overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <ShoppingCart className="text-stone/40 h-12 w-12" />
              <p className="text-stone text-sm font-semibold">Your quote is empty</p>
              <p className="text-stone/70 text-xs">
                Add materials from any hub to build your quote.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-6">
                {Object.entries(byHub).map(([hubId, group]) => (
                  <div key={hubId}>
                    <p className="text-stone mb-2 text-[10px] font-bold tracking-wider uppercase">
                      {group.hubName}
                    </p>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <div
                          key={item.materialId}
                          className="bg-muted flex items-center justify-between rounded-xl px-3 py-2.5"
                        >
                          <div>
                            <p className="text-charcoal text-sm font-bold">{item.type}</p>
                            <p className="text-stone text-xs">
                              ₱{item.pricePerKg}/kg · {item.quantityKg}kg avail.
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.materialId)}
                            className="text-stone hover:text-red-500 ml-2 shrink-0 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t pt-4">
                <p className="text-stone text-[10px] leading-relaxed">
                  Contact each hub directly to confirm availability and pricing before reserving.
                </p>
                <button
                  onClick={clearCart}
                  className="text-stone hover:text-red-600 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear Quote
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
