'use client'

import { useState } from 'react'
import { Eye, RefreshCcw, Timer, History, Plus, Pencil, Upload } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'

type Tab = 'all' | 'active' | 'rented' | 'drafts'
type Status = 'available' | 'in_use' | 'draft'

export type ListingRow = {
  id: string
  productName: string
  productDescription: string
  status: Status
  type: 'sale' | 'rent' | 'lease'
  views: number
  rentalCount: number
  daysRemaining: number | null
  imageBg: string
  images: string[]
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

const TAB_FOR_STATUS: Record<Status, Exclude<Tab, 'all'>> = {
  available: 'active',
  in_use: 'rented',
  draft: 'drafts',
}

export function ListingsClient({ listings }: { listings: ListingRow[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const filtered =
    activeTab === 'all' ? listings : listings.filter((l) => TAB_FOR_STATUS[l.status] === activeTab)

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="mx-auto max-w-2xl space-y-6 px-5 pt-6 pb-32 sm:px-6">
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
          {filtered.length === 0 && (
            <p className="text-stone py-12 text-center text-sm">No listings in this category.</p>
          )}
          {filtered.map((listing) => {
            const status = statusConfig[listing.status]
            return (
              <div
                key={listing.id}
                className="bg-card border-border overflow-hidden rounded-2xl border"
              >
                {/* Product image */}
                <div className={`relative h-44 w-full overflow-hidden bg-linear-to-br ${listing.imageBg}`}>
                  {listing.images[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.productName}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3 p-4">
                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                      <span className="bg-stone/10 text-stone inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize">
                        {listing.type}
                      </span>
                    </div>
                    <h2 className="text-charcoal text-base font-bold">{listing.productName}</h2>
                    <p className="text-stone mt-0.5 text-sm">{listing.productDescription}</p>
                  </div>

                  {/* Stats row */}
                  <div className="text-stone flex flex-wrap items-center gap-4 text-sm">
                    {listing.views > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4" />
                        {listing.views.toLocaleString()} Views
                      </span>
                    )}
                    {listing.status === 'in_use' && listing.rentalCount > 0 && (
                      <span className="flex items-center gap-1.5">
                        <RefreshCcw className="h-4 w-4" />
                        {listing.rentalCount} Rental{listing.rentalCount !== 1 ? 's' : ''}
                      </span>
                    )}
                    {listing.daysRemaining !== null && (
                      <span className="flex items-center gap-1.5">
                        <Timer className="h-4 w-4" />
                        Returns in {listing.daysRemaining} day{listing.daysRemaining !== 1 ? 's' : ''}
                      </span>
                    )}
                    {listing.status === 'draft' && (
                      <span className="flex items-center gap-1.5">
                        <History className="h-4 w-4" />
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  {listing.status === 'draft' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button className="bg-charcoal text-cream flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold">
                        <Upload className="h-4 w-4" />
                        Publish
                      </button>
                      <Link
                        href={`/artisan/list/${listing.id}/edit`}
                        className="border-border flex h-10 w-10 items-center justify-center rounded-xl border"
                      >
                        <Pencil className="text-stone h-4 w-4" />
                      </Link>
                      <Link
                        href="/artisan/list/new"
                        className="border-border text-stone flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold"
                      >
                        <Plus className="h-4 w-4" />
                        New Listing
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`/artisan/list/${listing.id}/edit`}
                      className="border-forest/40 text-forest flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Listing
                    </Link>
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
