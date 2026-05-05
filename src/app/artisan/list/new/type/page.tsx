'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, CalendarDays, History, ArrowLeft, ArrowRight, Leaf } from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'
import type { LucideIcon } from 'lucide-react'

interface ListingType {
  id: string
  icon: LucideIcon
  activeIconBg: string
  activeIconText: string
  title: string
  desc: string
}

const listingTypes: ListingType[] = [
  {
    id: 'sale',
    icon: ShoppingBag,
    activeIconBg: 'bg-forest',
    activeIconText: 'text-cream',
    title: 'Direct Sale',
    desc: 'Transfer ownership permanently. Ideal for unique, high-demand artisanal pieces.',
  },
  {
    id: 'rent',
    icon: CalendarDays,
    activeIconBg: 'bg-terracotta',
    activeIconText: 'text-cream',
    title: 'Short-term Rent',
    desc: 'Earn recurring income and manage returns. Perfect for circular consumption of occasion wear or decor.',
  },
  {
    id: 'lease',
    icon: History,
    activeIconBg: 'bg-mustard',
    activeIconText: 'text-charcoal',
    title: 'Long-term Lease',
    desc: 'Fixed monthly income with tiered maintenance. Best for furniture or high-value equipment.',
  },
]

export default function NewListingTypePage() {
  const [selected, setSelected] = useState<string[]>([])
  const [salePrice, setSalePrice] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [deposit, setDeposit] = useState('')
  const [monthlyFee, setMonthlyFee] = useState('')
  const [leasePeriod, setLeasePeriod] = useState('')

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="mx-auto max-w-2xl space-y-6 px-5 pt-6 pb-32">
        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-stone text-xs font-medium uppercase tracking-widest">
              Step 3 of 5
            </span>
            <span className="text-forest text-xs font-semibold">60% Complete</span>
          </div>
          <div className="bg-border h-1.5 overflow-hidden rounded-full">
            <div className="bg-forest h-full w-3/5 rounded-full transition-all duration-700" />
          </div>
        </div>

        <div>
          <h1 className="font-heading text-charcoal text-2xl font-bold">Listing Type</h1>
          <p className="text-stone mt-1 text-sm">
            Choose how you would like to share your craftsmanship. Select multiple for a circular lifecycle.
          </p>
        </div>

        {/* Type Cards */}
        <div className="space-y-4">
          {listingTypes.map(({ id, icon: Icon, activeIconBg, activeIconText, title, desc }) => {
            const isActive = selected.includes(id)
            return (
              <div
                key={id}
                className={`bg-card overflow-hidden rounded-2xl border-2 shadow-sm transition-all ${
                  isActive ? 'border-forest' : 'border-border'
                }`}
              >
                <button
                  onClick={() => toggle(id)}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? `${activeIconBg} ${activeIconText}`
                        : 'bg-stone/10 text-stone'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-heading text-charcoal text-base font-bold">{title}</p>
                    <p className="text-stone mt-0.5 text-sm">{desc}</p>
                  </div>
                  {isActive && (
                    <span className="text-forest mt-0.5 shrink-0 text-base font-bold">✓</span>
                  )}
                </button>

                {/* Expanded: Direct Sale */}
                {isActive && id === 'sale' && (
                  <div className="border-border border-t px-5 pb-5">
                    <label className="text-forest mb-2 mt-4 block text-[10px] font-bold uppercase tracking-widest">
                      Listing Price (PHP)
                    </label>
                    <div className="border-border flex items-center gap-2 border-b-2 pb-2">
                      <span className="text-stone text-base">₱</span>
                      <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        placeholder="0.00"
                        className="text-charcoal flex-1 bg-transparent text-xl font-bold outline-none"
                      />
                    </div>
                    <p className="text-stone mt-3 text-xs">
                      Habi takes a 5% commission on sales to support the local artisan community fund.
                    </p>
                  </div>
                )}

                {/* Expanded: Short-term Rent */}
                {isActive && id === 'rent' && (
                  <div className="border-border grid grid-cols-2 gap-4 border-t px-5 pb-5">
                    <div className="mt-4">
                      <label className="text-terracotta mb-2 block text-[10px] font-bold uppercase tracking-widest">
                        Daily Rate (PHP)
                      </label>
                      <div className="border-border flex items-center gap-2 border-b-2 pb-2">
                        <span className="text-stone">₱</span>
                        <input
                          type="number"
                          value={dailyRate}
                          onChange={(e) => setDailyRate(e.target.value)}
                          placeholder="0.00"
                          className="text-charcoal flex-1 bg-transparent text-xl font-bold outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-terracotta mb-2 block text-[10px] font-bold uppercase tracking-widest">
                        Security Deposit
                      </label>
                      <div className="border-border flex items-center gap-2 border-b-2 pb-2">
                        <span className="text-stone">₱</span>
                        <input
                          type="number"
                          value={deposit}
                          onChange={(e) => setDeposit(e.target.value)}
                          placeholder="0.00"
                          className="text-charcoal flex-1 bg-transparent text-xl font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded: Long-term Lease */}
                {isActive && id === 'lease' && (
                  <div className="border-border border-t px-5 pb-5">
                    <div className="mt-4">
                      <label className="text-mustard mb-2 block text-[10px] font-bold uppercase tracking-widest">
                        Monthly Fee (PHP)
                      </label>
                      <div className="border-border flex items-center gap-2 border-b-2 pb-2">
                        <span className="text-stone">₱</span>
                        <input
                          type="number"
                          value={monthlyFee}
                          onChange={(e) => setMonthlyFee(e.target.value)}
                          placeholder="0.00"
                          className="text-charcoal flex-1 bg-transparent text-xl font-bold outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      {['6 Months', '12 Months'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setLeasePeriod(p)}
                          className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                            leasePeriod === p
                              ? 'border-mustard bg-mustard/10 text-charcoal'
                              : 'border-border text-stone hover:border-mustard/50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Sustainability Tip */}
        <div className="bg-forest/5 border-forest/20 rounded-2xl border p-5">
          <div className="mb-2 flex items-center gap-2">
            <Leaf className="text-forest h-4 w-4" />
            <p className="text-charcoal text-sm font-semibold">Sustainable Crafting Tip</p>
          </div>
          <p className="text-stone text-xs leading-relaxed">
            Items listed for Rent or Lease extend the product lifecycle by 4x compared to single
            ownership. Habi&apos;s &quot;Ginhawa&quot; insurance covers minor repairs for all rental
            transactions, ensuring your creations are maintained with care.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/artisan/list/new/materials"
            className="text-stone flex items-center gap-2 text-sm font-medium hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Link
            href="/artisan/list/new/details"
            className="bg-forest text-cream flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            Continue to Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
