'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Droplets, Sun, Shirt, Leaf, CheckCircle } from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'
import type { LucideIcon } from 'lucide-react'

interface CareOption {
  id: string
  icon: LucideIcon
  label: string
}

const careOptions: CareOption[] = [
  { id: 'dry', icon: Shirt, label: 'Wipe with dry cloth' },
  { id: 'sun', icon: Sun, label: 'Avoid direct sunlight' },
  { id: 'water', icon: Droplets, label: 'Do not submerge' },
]

const traceabilityDetails = [
  ['Harvest Date', 'October 2023'],
  ['Processing', 'Sun-dried, Hand-stripped'],
  ['Dye Type', 'Organic Indigo'],
]

export default function NewListingDetailsPage() {
  const [story, setStory] = useState('')
  const [dims, setDims] = useState({ l: '', w: '', h: '' })
  const [care, setCare] = useState<string[]>([])
  const [careNote, setCareNote] = useState('')

  const toggleCare = (id: string) =>
    setCare((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="px-5 pt-6 pb-32">
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-stone text-xs font-medium tracking-widest uppercase">
              Step 4 of 5
            </span>
            <span className="text-forest text-xs font-semibold">80% Complete</span>
          </div>
          <div className="bg-border h-1.5 overflow-hidden rounded-full">
            <div className="bg-forest h-full w-4/5 rounded-full transition-all duration-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Form */}
          <div className="space-y-8 lg:col-span-7">
            <div>
              <h1 className="font-heading text-charcoal text-2xl font-bold">Product Details</h1>
              <p className="text-stone mt-1 text-sm">
                Describe the soul of your creation and help buyers care for it.
              </p>
            </div>

            {/* Product Story */}
            <section className="space-y-3">
              <label className="text-charcoal block text-sm font-bold">Product Story</label>
              <p className="text-stone text-xs leading-relaxed">
                Describe the inspiration behind the design and the hands that brought it to life.
              </p>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Once upon a time in a small village..."
                className="bg-card border-border focus:border-forest placeholder:text-stone min-h-40 w-full resize-none rounded-2xl border-b-2 p-4 text-sm transition-colors outline-none"
              />
            </section>

            {/* Dimensions */}
            <section className="space-y-3">
              <label className="text-charcoal block text-sm font-bold">Dimensions</label>
              <div className="grid grid-cols-3 gap-4">
                {(
                  [
                    { key: 'l', label: 'LENGTH (CM)' },
                    { key: 'w', label: 'WIDTH (CM)' },
                    { key: 'h', label: 'HEIGHT (CM)' },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="space-y-1.5">
                    <span className="text-stone text-[10px] font-bold tracking-widest uppercase">
                      {label}
                    </span>
                    <input
                      type="number"
                      value={dims[key]}
                      onChange={(e) => setDims((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder="00"
                      className="bg-muted border-border focus:border-forest text-charcoal w-full rounded-t-xl border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors outline-none"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Care & Longevity */}
            <section className="space-y-3">
              <label className="text-charcoal block text-sm font-bold">Care &amp; Longevity</label>
              <div className="flex flex-wrap gap-2">
                {careOptions.map(({ id, icon: Icon, label }) => {
                  const active = care.includes(id)
                  return (
                    <button
                      key={id}
                      onClick={() => toggleCare(id)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                        active
                          ? 'border-forest bg-forest/10 text-forest'
                          : 'border-border text-stone hover:border-forest/40'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  )
                })}
              </div>
              <textarea
                value={careNote}
                onChange={(e) => setCareNote(e.target.value)}
                placeholder="Add specific instructions for keeping this piece beautiful..."
                className="bg-muted border-border focus:border-forest placeholder:text-stone min-h-20 w-full resize-none rounded-t-xl border-b-2 px-3 py-2.5 text-sm transition-colors outline-none"
              />
            </section>

            {/* Navigation */}
            <div className="border-border flex items-center justify-between border-t pt-6">
              <Link
                href="/artisan/list/new/type"
                className="text-stone hover:text-charcoal flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <Link
                href="/artisan/list/new/review"
                className="bg-forest text-cream flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95"
              >
                Continue to Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:col-span-5">
            {/* Traceability Summary */}
            <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-5 shadow-sm">
              <div className="absolute top-3 right-3 opacity-5">
                <Leaf className="text-forest h-16 w-16" />
              </div>
              <h3 className="font-heading text-charcoal mb-4 text-sm font-bold">
                Traceability Summary
              </h3>
              <div className="flex gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-[#C8A882] to-[#9C7A5A]" />
                <div>
                  <span className="text-terracotta text-[10px] font-bold tracking-widest uppercase">
                    Selected Material
                  </span>
                  <p className="font-heading text-charcoal text-base font-bold">
                    Premium Grade Abaca
                  </p>
                  <p className="text-stone text-xs">Harvested in Albay, Bicol</p>
                </div>
              </div>
              <div className="bg-muted mt-4 space-y-2.5 rounded-xl p-3">
                {traceabilityDetails.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-stone text-xs">{k}</span>
                    <span className="text-charcoal text-xs font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <div className="text-forest mt-3 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Traceability Score: 98%</span>
              </div>
            </div>

            {/* Artisan Tip */}
            <div className="bg-mustard/10 border-mustard/20 rounded-2xl border p-5">
              <p className="text-charcoal text-sm font-semibold">Artisan Tip</p>
              <p className="text-stone mt-2 text-xs leading-relaxed">
                Pieces with detailed dimensions and clear care instructions have a{' '}
                <span className="text-charcoal font-bold">40% higher</span> chance of being
                collected. Be precise about the width—it helps collectors visualize how it fits in
                their sanctuary.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
