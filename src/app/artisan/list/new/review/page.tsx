'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Upload, ArrowLeft, Recycle, Wrench, Building2, CheckCircle } from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'
import { readDraft, clearDraft } from '../draft'
import { publishListing, saveDraftListing } from '../actions'
import type { ListingDraft } from '../draft'
import type { LucideIcon } from 'lucide-react'

interface ChainNode {
  label: string
  name: string
  desc: string
  icon: LucideIcon
  date: string
  verified?: boolean
  current?: boolean
}

const chain: ChainNode[] = [
  {
    label: 'Initial Source',
    name: 'Quezon City Community Center',
    desc: 'Post-consumer plastic waste collection from local residential recycling program.',
    icon: Recycle,
    date: 'Feb 12, 2024',
    verified: true,
  },
  {
    label: 'Processing',
    name: 'GreenEarth Materials Hub',
    desc: 'Sorted, cleaned, and shredded into weaving-ready strips.',
    icon: Wrench,
    date: 'Feb 18, 2024',
  },
  {
    label: 'Final Weaver (You)',
    name: 'Laya Weaver Collective',
    desc: 'Hand-weaving the processed strips with natural rattan to create the final form.',
    icon: Building2,
    date: 'Current',
    current: true,
  },
]

const TYPE_LABEL: Record<string, string> = {
  SALE: 'Direct Sale',
  RENT: 'Short-term Rent',
  LEASE: 'Long-term Lease',
}

export default function NewListingReviewPage() {
  const [agreed, setAgreed] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [draft, setDraft] = useState<Partial<ListingDraft>>(() => readDraft())
  const [actionError, setActionError] = useState<string | null>(null)

  const primaryListing = draft.listings?.[0]
  const priceFormatted = primaryListing
    ? `₱${primaryListing.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
    : '—'
  const typeLabel = primaryListing ? (TYPE_LABEL[primaryListing.type] ?? primaryListing.type) : '—'
  const canPublish = agreed && !!draft.name && !!draft.materialType && !!draft.listings?.length

  function handlePublish() {
    if (!canPublish) return
    setActionError(null)
    const data = {
      name: draft.name!,
      description: draft.description ?? '',
      materialType: draft.materialType!,
      images: draft.images ?? [],
      listings: draft.listings!,
    }
    startTransition(async () => {
      try {
        clearDraft()
        await publishListing(data)
      } catch {
        // Restore draft so the user can retry
        setDraft(data)
        setActionError('Failed to publish listing. Please try again.')
      }
    })
  }

  function handleSaveDraft() {
    if (!draft.name || !draft.materialType) return
    setActionError(null)
    const data = {
      name: draft.name!,
      description: draft.description ?? '',
      materialType: draft.materialType!,
      images: draft.images ?? [],
      listings: draft.listings ?? [],
    }
    startTransition(async () => {
      try {
        clearDraft()
        await saveDraftListing(data)
      } catch {
        setDraft(data)
        setActionError('Failed to save draft. Please try again.')
      }
    })
  }

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="mx-auto max-w-2xl px-5 pt-6 pb-32">
        {/* Progress */}
        <div className="mb-6">
          <div className="bg-border h-1.5 overflow-hidden rounded-full">
            <div className="bg-forest h-full w-full rounded-full" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-stone text-xs font-medium tracking-widest uppercase">
              Step 5 of 5
            </span>
            <span className="text-forest text-xs font-semibold">100% Complete</span>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="font-heading text-charcoal text-2xl font-bold">Review Your Thread</h1>
          <p className="text-stone mt-1.5 text-sm">
            Ensure every knot is tight before weaving your listing into the marketplace.
          </p>
        </div>

        <div className="space-y-8">
          {/* Product Preview Card */}
          <section className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative h-48 sm:h-auto">
                <div className="absolute inset-0 bg-linear-to-br from-[#8FAF8A] to-[#4A7A5A]" />
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
              </div>
              <div className="flex flex-col justify-center p-6">
                <span className="bg-mustard/15 text-mustard inline-block w-fit rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                  Ready to Weave
                </span>
                <h3 className="font-heading text-charcoal mt-3 text-lg font-bold">
                  {draft.name || '—'}
                </h3>
                <p className="text-stone mt-1 text-sm">
                  {draft.materialType ? `Materials: ${draft.materialType}` : ''}
                </p>
                <div className="mt-4 space-y-3">
                  <div className="border-border flex items-center justify-between border-b pb-3">
                    <span className="text-stone text-xs font-medium">Listing Type</span>
                    <span className="text-forest text-xs font-semibold">{typeLabel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone text-xs font-medium">Price Point</span>
                    <span className="font-heading text-terracotta text-lg font-bold">
                      {priceFormatted}
                    </span>
                  </div>
                  {draft.listings && draft.listings.length > 1 && (
                    <div className="border-border border-t pt-3">
                      <span className="text-stone text-xs font-medium">Also listed as: </span>
                      <span className="text-forest text-xs font-semibold">
                        {draft.listings
                          .slice(1)
                          .map((l) => TYPE_LABEL[l.type] ?? l.type)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Traceability Chain */}
          <section>
            <h4 className="font-heading text-charcoal mb-4 text-sm font-bold">
              The Threaded Story
            </h4>
            <div className="before:from-forest/10 before:via-forest/40 before:to-forest/10 relative space-y-6 pl-8 before:absolute before:top-2 before:bottom-2 before:left-3 before:w-0.5 before:bg-linear-to-b">
              {chain.map(({ label, name, desc, icon: Icon, date, verified, current }) => (
                <div key={name} className="relative">
                  <div
                    className={`border-cream absolute top-1 -left-8 h-6 w-6 rounded-full border-4 shadow-sm ${
                      current ? 'bg-terracotta animate-pulse' : 'bg-forest'
                    }`}
                  />
                  <div
                    className={`rounded-2xl border p-5 ${
                      current ? 'border-forest/20 bg-forest/5' : 'bg-card border-border shadow-sm'
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase ${
                          current ? 'text-forest' : 'text-terracotta'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-stone text-[10px]">{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${current ? 'text-forest' : 'text-stone'}`}
                      />
                      <p
                        className={`font-heading text-base font-bold ${
                          current ? 'text-forest' : 'text-charcoal'
                        }`}
                      >
                        {name}
                      </p>
                    </div>
                    <p className="text-stone mt-1 text-xs leading-relaxed">{desc}</p>
                    {verified && (
                      <div className="text-forest mt-3 flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Verified Collection Point</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Terms Agreement */}
          <section className="border-forest/20 bg-muted rounded-2xl border-2 border-dashed p-6">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="accent-forest mt-0.5 h-5 w-5 shrink-0 rounded"
              />
              <span className="text-stone text-sm leading-relaxed">
                I certify that the information provided regarding the provenance and composition of
                this item is accurate to the best of my knowledge. I understand that Habi&apos;s
                integrity relies on truthful weaving of our shared stories.
              </span>
            </label>
          </section>
        </div>

        {/* Action Buttons */}
        {actionError && (
          <p className="text-terracotta mt-8 text-center text-sm font-medium">{actionError}</p>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handlePublish}
            disabled={!canPublish || isPending}
            className="bg-forest text-cream flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Upload className="h-4 w-4" />
            {isPending ? 'Publishing…' : 'Publish Listing'}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={!draft.name || !draft.materialType || isPending}
            className="border-forest text-forest hover:bg-forest/5 flex items-center justify-center gap-2 rounded-full border-2 px-8 py-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Save Draft
          </button>
        </div>

        <div className="mt-6">
          <Link
            href="/artisan/list/new/details"
            className="text-stone hover:text-charcoal flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Details
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
