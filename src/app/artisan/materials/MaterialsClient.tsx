'use client'

import { useState } from 'react'
import {
  Search,
  MapPin,
  BadgeCheck,
  MessageSquare,
  ChevronRight,
  SearchX,
  PlusCircle,
  Package,
  Leaf,
  Layers,
  Cog,
} from 'lucide-react'
import Link from 'next/link'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'

const FILTERS = ['All Hubs', 'Plastic', 'Bamboo', 'Wood', 'Metal', 'Textile']

type MaterialType = string

const MATERIAL_ICONS: Record<string, React.ReactNode> = {
  Plastic: <Package className="h-4 w-4" />,
  Metal: <Cog className="h-4 w-4" />,
  Bamboo: <Leaf className="h-4 w-4" />,
  Textile: <Layers className="h-4 w-4" />,
}

const MATERIAL_ICON_COLOR: Record<string, string> = {
  Plastic: 'text-terracotta',
  Metal: 'text-stone',
  Bamboo: 'text-forest',
  Textile: 'text-mustard',
}

const MATERIAL_BG: Record<string, string> = {
  Plastic: 'bg-terracotta/10',
  Metal: 'bg-stone/10',
  Bamboo: 'bg-forest/10',
  Textile: 'bg-mustard/10',
}

export type HubRow = {
  id: string
  name: string
  address: string
  verified: boolean
  materials: { type: MaterialType; qty: string }[]
}

export function MaterialsClient({ hubs }: { hubs: HubRow[] }) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Hubs')

  const filtered = hubs.filter((hub) => {
    const q = search.toLowerCase()
    const matchesSearch =
      q === '' ||
      hub.name.toLowerCase().includes(q) ||
      hub.address.toLowerCase().includes(q) ||
      hub.materials.some((m) => m.type.toLowerCase().includes(q))

    const matchesFilter =
      activeFilter === 'All Hubs' || hub.materials.some((m) => m.type === activeFilter)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-6 px-5 pt-6 pb-28">
        {/* Search hero */}
        <section className="bg-forest rounded-3xl p-6">
          <h2 className="font-heading text-cream mb-5 text-2xl font-bold">Find Local Materials</h2>
          <div className="relative">
            <Search className="text-forest absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city or material (e.g., Plastic, Koronadal)"
              className="text-charcoal placeholder-stone w-full rounded-2xl bg-white py-4 pr-5 pl-12 shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
            />
          </div>
        </section>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-xl px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all active:scale-95 ${
                activeFilter === f
                  ? 'bg-forest text-cream shadow-md'
                  : 'border-border text-forest hover:bg-forest/5 border bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Hub cards */}
        <section className="space-y-5">
          {filtered.length === 0 && (
            <p className="text-stone py-12 text-center text-sm">No hubs match your search.</p>
          )}
          {filtered.map((hub) => (
            <div
              key={hub.id}
              className="border-border flex flex-col gap-5 rounded-3xl border bg-white p-5 shadow-sm transition-all hover:shadow-xl"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-heading text-forest text-xl font-bold">{hub.name}</h3>
                      {hub.verified && <BadgeCheck className="text-terracotta h-4 w-4" />}
                    </div>
                    <div className="text-stone flex items-center gap-1.5 text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{hub.address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {hub.materials.map((mat) => (
                    <div
                      key={mat.type}
                      className="bg-muted flex items-center justify-between rounded-2xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${MATERIAL_BG[mat.type] ?? 'bg-stone/10'}`}
                        >
                          <span className={MATERIAL_ICON_COLOR[mat.type] ?? 'text-stone'}>
                            {MATERIAL_ICONS[mat.type] ?? <Package className="h-4 w-4" />}
                          </span>
                        </div>
                        <div>
                          <p className="text-stone mb-1 text-[10px] font-bold tracking-wider uppercase">
                            {mat.type}
                          </p>
                          <div
                            className={`flex items-center gap-1.5 ${MATERIAL_ICON_COLOR[mat.type] ?? 'text-stone'}`}
                          >
                            {MATERIAL_ICONS[mat.type] ?? <Package className="h-4 w-4" />}
                            <span className="font-heading text-charcoal text-lg font-bold">
                              {mat.qty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/artisan/materials/${hub.id}`}
                        className="text-forest hover:bg-forest/10 rounded-full p-2"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <button className="bg-forest text-cream hover:bg-forest/90 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold shadow-lg transition-all">
                <MessageSquare className="h-5 w-5" />
                Contact Hub
              </button>
            </div>
          ))}
        </section>

        {/* Can't find CTA */}
        <section className="text-center">
          <div className="border-terracotta/30 bg-terracotta/5 rounded-3xl border-2 border-dashed p-8">
            <SearchX className="text-terracotta mx-auto mb-3 h-10 w-10" />
            <h3 className="font-heading text-forest mb-2 text-xl font-bold">
              Can&apos;t find what you need?
            </h3>
            <p className="text-stone mb-6 text-sm leading-relaxed">
              Let local hubs know what materials you&apos;re looking for. We&apos;ll notify you when
              they become available.
            </p>
            <Link
              href="/artisan/materials/request"
              className="bg-terracotta text-cream hover:bg-terracotta/90 inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold shadow-lg transition-all"
            >
              <PlusCircle className="h-5 w-5" />
              Request Material
            </Link>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
