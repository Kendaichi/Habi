import Link from 'next/link'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { TopNav } from '@/components/junkshop/TopNav'
import { BottomNav } from '@/components/junkshop/BottomNav'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getCurrentJunkShop } from '@/lib/junkshop'
import { MATERIAL_STYLE, DEFAULT_STYLE } from '@/utils/material-styles'
import { acceptQuote, rejectQuote } from './actions'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  SENT: 'Sent',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-mustard/15 text-mustard',
  SENT: 'bg-sky-100 text-sky-700',
  ACCEPTED: 'bg-forest/10 text-forest',
  REJECTED: 'bg-terracotta/10 text-terracotta',
}

export default async function JunkshopQuotesPage() {
  const user = await requireRole(Role.JUNKSHOP)
  const shop = await getCurrentJunkShop(user.name)

  const quotes = shop
    ? await prisma.quoteRequest.findMany({
        where: { items: { some: { hubId: shop.id } } },
        include: {
          artisan: true,
          items: { where: { hubId: shop.id } },
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-28">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/junkshop/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-stone-600" />
          </Link>
          <div>
            <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">
              Incoming
            </p>
            <h1 className="font-heading text-2xl font-semibold text-charcoal">Quote Requests</h1>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-stone-300 mb-3" />
            <p className="text-sm text-stone">No quote requests yet.</p>
            <p className="text-xs text-stone/60 mt-1">
              Artisans will appear here when they request materials from your shop.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => {
              const totalKg = quote.items.reduce((s, i) => s + i.quantityKg, 0)
              const totalPrice = quote.items.reduce(
                (s, i) => s + i.quantityKg * i.pricePerKg,
                0,
              )
              const isPending = quote.status === 'PENDING' || quote.status === 'SENT'
              const acceptBound = acceptQuote.bind(null, quote.id)
              const rejectBound = rejectQuote.bind(null, quote.id)

              return (
                <div
                  key={quote.id}
                  className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10 text-sm font-bold text-forest">
                        {quote.artisan.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{quote.artisan.name}</p>
                        <p className="text-xs text-stone">
                          {new Date(quote.createdAt).toLocaleDateString('en-PH', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS_STYLE[quote.status] ?? 'bg-stone-100 text-stone'}`}
                    >
                      {STATUS_LABEL[quote.status] ?? quote.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {quote.items.map((item) => {
                      const style = MATERIAL_STYLE[item.type] ?? DEFAULT_STYLE
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-base">{style.emoji}</span>
                            <div>
                              <p className="text-sm font-semibold text-charcoal">{item.type}</p>
                              <p className="text-[10px] text-stone">{style.sub}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-charcoal">
                              {item.quantityKg} kg
                            </p>
                            <p className="text-[10px] text-stone">
                              ₱{item.pricePerKg.toFixed(2)}/kg
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Totals */}
                  <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                    <p className="text-xs text-stone">
                      {quote.items.length} material{quote.items.length !== 1 ? 's' : ''} ·{' '}
                      {totalKg} kg total
                    </p>
                    <p className="text-sm font-semibold text-charcoal">
                      ₱{totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  {/* Notes */}
                  {quote.notes && (
                    <p className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone italic">
                      &ldquo;{quote.notes}&rdquo;
                    </p>
                  )}

                  {/* Actions */}
                  {isPending && (
                    <div className="flex gap-3 pt-1">
                      <form action={acceptBound} className="flex-1">
                        <button
                          type="submit"
                          className="w-full rounded-xl bg-forest py-2.5 text-sm font-semibold text-cream transition-opacity hover:opacity-90"
                        >
                          Accept
                        </button>
                      </form>
                      <form action={rejectBound} className="flex-1">
                        <button
                          type="submit"
                          className="w-full rounded-xl border border-terracotta py-2.5 text-sm font-semibold text-terracotta transition-opacity hover:bg-terracotta/5"
                        >
                          Reject
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
