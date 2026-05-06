'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { TopNav } from '@/components/junkshop/TopNav'
import { BottomNav } from '@/components/junkshop/BottomNav'
import Link from 'next/link'

const CATEGORIES = ['All', 'Plastic', 'Metal', 'Bamboo', 'Textile', 'Glass'] as const
type Category = (typeof CATEGORIES)[number]

const MATERIAL_EMOJI: Record<string, string> = {
  Plastic: '🧴',
  Metal: '⚙️',
  Bamboo: '🌿',
  Textile: '🧵',
  Glass: '🫙',
}

const MATERIAL_COLOR: Record<string, string> = {
  Plastic: 'text-terracotta',
  Metal: 'text-forest',
  Bamboo: 'text-mustard',
  Textile: 'text-stone-500',
  Glass: 'text-sky-500',
}

export type MaterialRow = {
  id: string
  type: string
  quantityKg: number
  pricePerKg: number
  available: boolean
}

export function InventoryClient({ materials }: { materials: MaterialRow[] }) {
  const [activeFilter, setActiveFilter] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filtered = materials.filter((item) => {
    const matchesCategory =
      activeFilter === 'All' || item.type === activeFilter
    const matchesSearch =
      search === '' || item.type.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-28">
        {/* Header & Search */}
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-forest mb-1 font-['Noto_Serif'] text-3xl font-bold">
              Inventory Management
            </h1>
            <p className="text-stone text-sm">Track and manage your circular material stock.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              className="focus:ring-forest/30 focus:border-forest/50 w-full rounded-xl border border-stone-200 bg-white py-3 pr-4 pl-11 text-sm shadow-sm transition-all focus:ring-2 focus:outline-none"
              placeholder="Search materials..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="no-scrollbar mb-8 flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`rounded-full px-5 py-2 font-['Inter'] text-xs font-bold tracking-wider whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? 'bg-forest text-white shadow-md'
                  : 'text-stone border border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filtered.length === 0 ? (
            <p className="text-stone col-span-2 py-12 text-center text-sm">No items found.</p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_4px_20px_rgba(44,44,44,0.08)] transition-all hover:shadow-xl"
              >
                {/* Icon banner instead of image */}
                <div className="flex h-32 items-center justify-center bg-stone-50 text-6xl">
                  {MATERIAL_EMOJI[item.type] ?? '📦'}
                </div>

                <div className="flex grow flex-col p-5">
                  <span className="text-forest mb-1 self-start rounded-full bg-stone-100 px-3 py-0.5 text-[10px] font-bold tracking-wider">
                    {item.type.toUpperCase()}
                  </span>
                  <h3 className="text-charcoal mb-1 font-['Noto_Serif'] text-xl font-semibold">
                    {item.type}
                  </h3>
                  <p className="text-stone mb-4 text-sm">
                    {item.available ? 'Available' : 'Unavailable'} · ID {item.id.slice(-6).toUpperCase()}
                  </p>
                  <div className="mt-auto flex items-end justify-between border-t border-stone-100 pt-4">
                    <div>
                      <p className="mb-0.5 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                        Available Weight
                      </p>
                      <p className={`font-['Space_Grotesk'] text-xl font-semibold ${MATERIAL_COLOR[item.type] ?? 'text-forest'}`}>
                        {item.quantityKg}kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="mb-0.5 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                        Price
                      </p>
                      <p className="text-terracotta font-['Space_Grotesk'] text-xl font-semibold">
                        ₱{item.pricePerKg}/kg
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/junkshop/inventory/log"
                    className="bg-terracotta mt-5 w-full rounded-xl py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                  >
                    Update Stock
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* FAB */}
      <Link
        href="/junkshop/inventory/log"
        className="bg-forest fixed right-6 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-transform hover:opacity-90 active:scale-90"
        aria-label="Add new stock"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </Link>

      <BottomNav />
    </div>
  )
}
