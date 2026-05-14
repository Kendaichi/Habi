'use client'

import Link from 'next/link'
import { ArrowRight, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

type BuyerProductSearchItem = {
  listingId: string
  productId: string
  productName: string
  artisanName: string
  materialType: string
  price: number
  imageUrl: string
  reasonTags: string[]
}

type BuyerProductSearchProps = {
  recommendations: BuyerProductSearchItem[]
}

export function BuyerProductSearch({ recommendations }: BuyerProductSearchProps) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const filteredRecommendations = useMemo(() => {
    if (!normalizedQuery) return recommendations

    return recommendations.filter((item) => {
      const searchableText = [
        item.productName,
        item.artisanName,
        item.materialType,
        ...item.reasonTags,
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [normalizedQuery, recommendations])

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">Marketplace</p>
          <h2 className="font-heading text-charcoal mt-2 text-2xl font-semibold sm:text-3xl">Search products</h2>
        </div>
        <p className="text-stone text-sm">{filteredRecommendations.length} shown</p>
      </div>

      <div className="mt-4 flex h-12 items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 shadow-sm">
        <Search className="h-5 w-5 shrink-0 text-forest" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search rattan, lamp, artisan..."
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-stone/70"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone transition hover:bg-stone-100 hover:text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredRecommendations.map((recommendation) => (
          <Link
            key={recommendation.listingId}
            href={`/buyer/product/${recommendation.productId}`}
            className="block overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_44px_rgba(44,44,44,0.08)]"
          >
            <div
              className="h-48 bg-cover bg-center sm:h-52"
              style={{ backgroundImage: `url(${recommendation.imageUrl})` }}
            />
            <div className="p-4 sm:p-5">
              <p className="text-forest text-[11px] font-semibold uppercase tracking-[0.22em]">
                {recommendation.materialType}
              </p>
              <h3 className="font-heading text-charcoal mt-2 text-xl font-semibold sm:text-2xl">
                {recommendation.productName}
              </h3>
              <p className="text-stone mt-2 text-sm">by {recommendation.artisanName}</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-charcoal text-xl font-semibold sm:text-2xl">
                  PHP {recommendation.price.toLocaleString('en-PH')}
                </p>
                <span className="text-terracotta inline-flex items-center gap-1 text-sm font-semibold">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRecommendations.length === 0 ? (
        <div className="mt-5 rounded-lg border border-stone-200 bg-white p-6 text-center shadow-sm">
          <p className="font-heading text-charcoal text-2xl font-semibold">No products found</p>
          <p className="text-stone mt-2 text-sm">
            Try a material, product type, or artisan name from the Habi marketplace.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="bg-forest mt-5 rounded-lg px-5 py-3 text-sm font-semibold text-white"
          >
            Clear search
          </button>
        </div>
      ) : null}
    </section>
  )
}
