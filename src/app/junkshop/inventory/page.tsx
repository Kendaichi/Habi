'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { TopNav } from '@/components/junkshop/TopNav'
import { BottomNav } from '@/components/junkshop/BottomNav'
import Link from 'next/link'

const CATEGORIES = ['All', 'Plastic', 'Metal', 'Agri-waste', 'Textile'] as const
type Category = (typeof CATEGORIES)[number]

const INVENTORY_ITEMS = [
  {
    id: 1,
    name: 'HDPE Flakes',
    batch: 'Batch #4492-B • Cleaned',
    category: 'Plastic' as Category,
    weight: '450kg',
    price: '₱42/kg',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwM5JBR24VqWqCyl1sDlhb85JOmDKVYN4FxCqyNPBe7CuMY1sbvUPlRxDJ-UeSpZLWJz6z5jMz6Z2MICesR-TSl7dpFyEWQdasyaBVJfWmJNzhG0U5TRqg9LJJmZNUVVKh7OsttIiNWzCZyTNbLFuj5OuFYKny0I0BsLhuKOShQVRnNH3FP5ZdtWd27M5XdlDQSUvYjg41g0yCYEmqzPeSPGhcUaVW9tPj5RTba2x4Fmr7RWs4-JzMfk9DRAWQeVwGNmxOg31GgVlN',
  },
  {
    id: 2,
    name: 'Abaca Fiber Waste',
    batch: 'Batch #1209-A • Raw',
    category: 'Textile' as Category,
    weight: '1,200kg',
    price: '₱85/kg',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC64qAzLzehgfrvGi3mqa7oWPPoSLHHF3sJQUkTba-OVs-8RSet6APTOUBo4B5e0F9dyWiTYcWNFRMU5v4duMzRrLwqELUsk_h2JSw20Ilw_pNHbzjxTlMRo-RSS2gQjoKYMNbQPe9cXMWtRY9s69JmN_IVCnWzjvpzkJrCG3G9Ec2mmb3HeyZ8BG_L2SSwx8X2JjPS4WaKWT0sUgG7tFi1Y8AWMdpzlFQU90_3rKsKaKDsMsBdc4NmBpC5I3dUyN8sapktWWh_QHY5',
  },
  {
    id: 3,
    name: 'Aluminum Scraps',
    batch: 'Batch #8821-M • Grade B',
    category: 'Metal' as Category,
    weight: '820kg',
    price: '₱68/kg',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCTLeXR4VbeqvjTD_KHpBS2ZESyizHmBO1YXj8gCGc2b2RHKQPSEJlJ93JjHZkwOfirHgc0NuYoq8J71ubIlfplpMI4uyf3pPtn_w7fehDJbIlVs4LbwytxBjnefnNf3FfXGDayZ06lZAfw1UeX413Z3Hi7CqpYN1IHDfI0lFwRzkgTd9Evnwow3oxzCxOOpCjyGh-vQETWAaBuLFtzc3xZ2e34CAUPOWDJurzRpS8xWmarZ-XAKxR6U_I-j1xxKgHayc72nm1cjzhO',
  },
  {
    id: 4,
    name: 'Coconut Husk Pith',
    batch: 'Batch #3301-C • Dried',
    category: 'Agri-waste' as Category,
    weight: '2,100kg',
    price: '₱18/kg',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC54kPBprgO1CBWbbfwrGIAReIZbBRP87b8S9kM4sXaHJOkE9gqdkWeCOMlFx43S1JGt6Gw5gf74__zzsrRj_LzCCKaMlyCh2agACm616R8GaCoa3lGAX66OMjVXMPuFL-6EZnFZU0aqD8TV28-grHzU6Y9RjxBLszHa5mXqHVtyd57QQr11oVSW0HMayskOaKbz9VGeZNa1q9Kd3SivS7_m5ql6BPKSGUWJKRAD_Yxsb0l6ekRMvw7Y2npuYmq7wi3GCs8_dZMjmy8',
  },
]

export default function InventoryListPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filtered = INVENTORY_ITEMS.filter((item) => {
    const matchesCategory = activeFilter === 'All' || item.category === activeFilter
    const matchesSearch =
      search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.batch.toLowerCase().includes(search.toLowerCase())
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
              placeholder="Search batches or materials..."
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
                <div className="relative h-48 overflow-hidden">
                  <img
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.image}
                  />
                  <span className="text-forest absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider shadow-sm backdrop-blur-sm">
                    {item.category.toUpperCase()}
                  </span>
                </div>
                <div className="flex grow flex-col p-5">
                  <h3 className="text-charcoal mb-1 font-['Noto_Serif'] text-xl font-semibold">
                    {item.name}
                  </h3>
                  <p className="text-stone mb-4 text-sm">{item.batch}</p>
                  <div className="mt-auto flex items-end justify-between border-t border-stone-100 pt-4">
                    <div>
                      <p className="mb-0.5 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                        Available Weight
                      </p>
                      <p className="text-forest font-['Space_Grotesk'] text-xl font-semibold">
                        {item.weight}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="mb-0.5 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                        Price
                      </p>
                      <p className="text-terracotta font-['Space_Grotesk'] text-xl font-semibold">
                        {item.price}
                      </p>
                    </div>
                  </div>
                  <button className="bg-terracotta mt-5 w-full rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95">
                    Update Stock
                  </button>
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
