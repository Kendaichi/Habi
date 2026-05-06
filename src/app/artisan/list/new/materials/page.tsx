'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Leaf,
  Trees,
  Recycle,
  Layers,
  X,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'
import { saveDraft } from '../draft'
import type { LucideIcon } from 'lucide-react'

interface Material {
  id: string
  name: string
  desc: string
  icon: LucideIcon
  tags: string[]
  bg: string
  category: string
}

const materials: Material[] = [
  {
    id: 'abaca',
    name: 'Abaca',
    desc: 'Extracted from the leaf-stalks of the Manila hemp plant. Renowned for exceptional strength.',
    icon: Leaf,
    tags: ['Durable', 'Sustainable'],
    bg: 'from-[#C8A882] to-[#9C7A5A]',
    category: 'Plant-based',
  },
  {
    id: 'rattan',
    name: 'Rattan',
    desc: 'Sustainably harvested climbing palms. Provides flexible yet sturdy structure for home items.',
    icon: Trees,
    tags: ['Flexible', 'Artisanal'],
    bg: 'from-[#8FAF8A] to-[#4A7A5A]',
    category: 'Plant-based',
  },
  {
    id: 'recycled-plastic',
    name: 'Recycled Plastic',
    desc: 'Post-consumer waste processed into durable weaving strands. Water-resistant and vibrant.',
    icon: Recycle,
    tags: ['Waterproof', 'Circular'],
    bg: 'from-[#7BAFC7] to-[#4A7A9B]',
    category: 'Recycled',
  },
  {
    id: 'cotton-inabel',
    name: 'Cotton Inabel',
    desc: 'Traditional hand-woven textile from the Ilocos region. Rich in history and pattern.',
    icon: Layers,
    tags: ['Heritage', 'Premium'],
    bg: 'from-[#BFA9A0] to-[#8A6E65]',
    category: 'Textiles',
  },
]

const filters = ['All', 'Plant-based', 'Recycled', 'Textiles']

export default function NewListingMaterialsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  function handleContinue() {
    saveDraft({ materialType: selected.map((id) => materials.find((m) => m.id === id)?.name ?? id).join(', ') })
    router.push('/artisan/list/new/type')
  }

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))

  const visible = materials.filter((m) => {
    const matchFilter = filter === 'All' || m.category === filter
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const selectedMaterials = materials.filter((m) => selected.includes(m.id))

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-6 px-5 pt-6 pb-32">
        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-stone text-xs font-medium tracking-widest uppercase">
              Step 2 of 5
            </span>
            <span className="text-forest text-xs font-semibold">40% Complete</span>
          </div>
          <div className="bg-border h-1.5 overflow-hidden rounded-full">
            <div className="bg-forest h-full w-2/5 rounded-full transition-all duration-700" />
          </div>
        </div>

        <div>
          <h1 className="font-heading text-charcoal text-2xl font-bold">Material Selection</h1>
          <p className="text-stone mt-1 text-sm">
            Choose the materials used to create your piece. These build your traceability chain.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Search + Material Cards */}
          <div className="space-y-4 lg:col-span-8">
            {/* Search & Filters */}
            <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
              <div className="border-border flex items-center gap-3 rounded-xl border px-3 py-2.5">
                <Search className="text-stone h-4 w-4 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for materials (e.g. Abaca, Pandan...)"
                  className="text-charcoal placeholder:text-stone flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      filter === f
                        ? 'bg-forest text-cream'
                        : 'bg-stone/10 text-stone hover:bg-stone/20'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Material Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {visible.map(({ id, name, desc, icon: Icon, tags, bg }) => {
                const isSelected = selected.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className={`bg-card overflow-hidden rounded-2xl border text-left shadow-sm transition-all hover:shadow-md ${
                      isSelected ? 'border-forest ring-forest/20 ring-1' : 'border-border'
                    }`}
                  >
                    <div className={`relative h-28 w-full bg-linear-to-br ${bg}`}>
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                          backgroundSize: '18px 18px',
                        }}
                      />
                      <div
                        className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                          isSelected ? 'bg-forest text-cream' : 'text-forest bg-white/80'
                        }`}
                      >
                        {isSelected ? '✓' : '+'}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-start justify-between">
                        <h3 className="font-heading text-charcoal text-base font-bold">{name}</h3>
                        <Icon className="text-forest h-4 w-4 shrink-0" />
                      </div>
                      <p className="text-stone text-xs leading-relaxed">{desc}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-forest/10 text-forest rounded px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Traceability Summary */}
          <div className="lg:col-span-4">
            <div className="bg-card border-border sticky top-24 rounded-2xl border p-5 shadow-sm">
              <h2 className="font-heading text-charcoal mb-4 text-base font-bold">
                Traceability Summary
              </h2>

              <div className="space-y-4">
                {/* Selected Materials */}
                <div>
                  <p className="text-stone mb-2 text-xs font-medium">Selected Materials</p>
                  <div className="flex min-h-8 flex-wrap gap-2">
                    {selectedMaterials.length === 0 ? (
                      <span className="text-stone text-xs italic">None selected yet</span>
                    ) : (
                      selectedMaterials.map((m) => (
                        <div
                          key={m.id}
                          className="bg-forest text-cream flex items-center gap-1.5 rounded-full py-1 pr-1.5 pl-3 text-xs font-semibold"
                        >
                          {m.name}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggle(m.id)
                            }}
                            className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Source Origin */}
                <div className="border-border border-t pt-4">
                  <p className="text-stone mb-2 text-xs font-medium">Source Origin</p>
                  <div className="bg-muted flex items-center gap-2 rounded-xl p-3">
                    <MapPin className="text-terracotta h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-charcoal text-xs font-bold">Pangasinan, Philippines</p>
                      <p className="text-stone text-[10px]">Artisan Community Cooperatives</p>
                    </div>
                  </div>
                </div>

                {/* Eco-Impact */}
                <div className="border-border border-t pt-4">
                  <p className="text-stone mb-2 text-xs font-medium">Eco-Impact</p>
                  <div className="bg-muted flex items-center justify-between rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-forest h-4 w-4" />
                      <span className="text-charcoal text-xs font-medium">
                        Sustainability Score
                      </span>
                    </div>
                    <span className="font-heading text-forest text-lg font-bold">A+</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selected.length === 0}
                className="bg-forest text-cream mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold shadow-sm transition-all hover:opacity-90 disabled:opacity-40"
              >
                Confirm & Continue
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="text-forest mt-3 w-full py-2 text-sm font-medium hover:underline">
                Save as Draft
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/artisan/list/new"
            className="text-stone hover:text-charcoal flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
