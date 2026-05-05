'use client'

import { useState } from 'react'
import { Eye, RefreshCcw, Timer, History, Plus, Pencil, Upload } from 'lucide-react'
import Link from 'next/link'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'

type Tab = 'all' | 'active' | 'rented' | 'drafts'
type Status = 'available' | 'in_use' | 'draft'

interface Listing {
  id: string
  name: string
  description: string
  status: Status
  views: number | null
  rentals: number | null
  returnsIn: string | null
  lastEdited: string | null
  tab: Exclude<Tab, 'all'>
  imageBg: string
}

const tabs: { label: string; value: Tab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Rented', value: 'rented' },
  { label: 'Drafts', value: 'drafts' },
]

const statusConfig: Record<Status, { label: string; bg: string; text: string }> = {
  available: { label: 'Available', bg: 'bg-forest/15', text: 'text-forest' },
  in_use: { label: 'In Use by Buyer', bg: 'bg-mustard/20', text: 'text-mustard' },
  draft: { label: 'Draft', bg: 'bg-stone/15', text: 'text-stone' },
}

const listings: Listing[] = [
  {
    id: '1',
    name: 'Antique Inabel Blanket',
    description: 'Traditional hand-woven cotton textile from Vigan.',
    status: 'available',
    views: 1240,
    rentals: 8,
    returnsIn: null,
    lastEdited: null,
    tab: 'active',
    imageBg: 'from-[#C8A882] to-[#9C7A5A]',
  },
  {
    id: '2',
    name: 'Solihiya Lounge Chair',
    description: 'Ergonomic design meeting traditional weaving.',
    status: 'in_use',
    views: 3480,
    rentals: null,
    returnsIn: '3 days',
    lastEdited: null,
    tab: 'rented',
    imageBg: 'from-[#8FAF8A] to-[#4A7A5A]',
  },
  {
    id: '3',
    name: 'Earthenware Vessel No. 4',
    description: 'Hand-molded volcanic clay vessel from Bicol.',
    status: 'draft',
    views: null,
    rentals: null,
    returnsIn: null,
    lastEdited: '2h ago',
    tab: 'drafts',
    imageBg: 'from-[#BFA9A0] to-[#8A6E65]',
  },
]

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const filtered = activeTab === 'all' ? listings : listings.filter((l) => l.tab === activeTab)

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-6 px-5 pt-6 pb-32">
        {/* Page heading */}
        <div>
          <h1 className="font-heading text-charcoal text-2xl font-bold">My Listings</h1>
          <p className="text-stone mt-1.5 text-sm leading-relaxed">
            Manage your handcrafted creations, track rentals, and update your shop&apos;s inventory
            from your artisan studio.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeTab === tab.value ? 'bg-charcoal text-cream' : 'bg-stone/10 text-stone'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listing cards */}
        <div className="space-y-4">
          {filtered.map((listing) => {
            const status = statusConfig[listing.status]
            return (
              <div
                key={listing.id}
                className="bg-card border-border overflow-hidden rounded-2xl border"
              >
                {/* Image placeholder */}
                <div className={`h-44 w-full bg-linear-to-br ${listing.imageBg} relative`}>
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }}
                  />
                </div>

                {/* Content */}
                <div className="space-y-3 p-4">
                  {/* Status badge + title */}
                  <div>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.bg} ${status.text} mb-2`}
                    >
                      {status.label}
                    </span>
                    <h2 className="text-charcoal text-base font-bold">{listing.name}</h2>
                    <p className="text-stone mt-0.5 text-sm">{listing.description}</p>
                  </div>

                  {/* Stats row */}
                  {(listing.views !== null || listing.lastEdited !== null) && (
                    <div className="text-stone flex items-center gap-4 text-sm">
                      {listing.views !== null && (
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          {listing.views.toLocaleString()} Views
                        </span>
                      )}
                      {listing.rentals !== null && (
                        <span className="flex items-center gap-1.5">
                          <RefreshCcw className="h-4 w-4" />
                          {listing.rentals} Rentals
                        </span>
                      )}
                      {listing.returnsIn !== null && (
                        <span className="flex items-center gap-1.5">
                          <Timer className="h-4 w-4" />
                          Returns in {listing.returnsIn}
                        </span>
                      )}
                      {listing.lastEdited !== null && (
                        <span className="flex items-center gap-1.5">
                          <History className="h-4 w-4" />
                          Last edited {listing.lastEdited}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {listing.status === 'draft' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button className="bg-charcoal text-cream flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold">
                        <Upload className="h-4 w-4" />
                        Publish
                      </button>
                      <button className="border-border flex h-10 w-10 items-center justify-center rounded-xl border">
                        <Pencil className="text-stone h-4 w-4" />
                      </button>
                      <Link
                        href="/artisan/list/sourcing"
                        className="border-border text-stone flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold"
                      >
                        <Plus className="h-4 w-4" />
                        New Listing
                      </Link>
                    </div>
                  ) : (
                    <button className="border-forest/40 text-forest flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold">
                      <Pencil className="h-4 w-4" />
                      Edit Insights
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAB */}
      <Link
        href="/artisan/list/new"
        className="bg-terracotta fixed right-5 bottom-20 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
      >
        <Plus className="text-cream h-6 w-6" />
      </Link>

      <BottomNav />
    </div>
  )
}
