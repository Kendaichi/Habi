'use client'

import Link from 'next/link'
import { Share2, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

type LastCheckout = {
  impactKg: number
  itemCount: number
  total: number
}

export function CheckoutSuccessClient() {
  const [checkout, setCheckout] = useState<LastCheckout | null>(null)

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem('habi-last-checkout-v1')
        setCheckout(raw ? JSON.parse(raw) : null)
      } catch {
        setCheckout(null)
      }
    })
  }, [])

  const impactKg = checkout?.impactKg || 12

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-forest/15 bg-forest p-7 text-center text-cream shadow-[0_24px_60px_rgba(27,94,63,0.22)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/12">
          <ShieldCheck className="h-9 w-9" />
        </div>
        <h1 className="font-heading mt-5 text-5xl font-semibold">Loop Verified</h1>
        <p className="mt-4 text-base leading-relaxed text-cream/82">
          You just kept {impactKg.toLocaleString('en-PH')}kg of waste out of Davao landfills.
        </p>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">
          Material proof
        </p>
        <h2 className="font-heading mt-2 text-3xl font-semibold text-charcoal">
          Verified source chain
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Habi attached the order to its circular chain so every piece keeps its source,
          sorting hub, and artisan record visible.
        </p>
      </section>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-forest bg-white px-5 py-4 text-base font-semibold text-forest"
      >
        <Share2 className="h-5 w-5" />
        Share Impact
      </button>

      <Link
        href="/buyer/orders"
        className="block w-full rounded-lg bg-terracotta px-5 py-4 text-center text-base font-semibold text-cream"
      >
        View My Journey
      </Link>
    </div>
  )
}
