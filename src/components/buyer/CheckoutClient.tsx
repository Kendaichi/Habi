'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutOptionCard } from '@/components/buyer/CheckoutOptionCard'
import { ImpactSummary } from '@/components/buyer/ImpactSummary'
import { clearCart, getCartItems, getCartTotals, type BuyerCartItem } from '@/lib/buyer-cart'

const payments = [
  { label: 'GCash', description: 'Mobile wallet checkout for fast local payment.' },
  { label: 'Maya', description: 'Pay with Maya wallet or linked card.' },
  { label: 'Bank Transfer', description: 'Reserve the order and receive transfer instructions.' },
]

const delivery = [
  { label: 'Eco-Delivery', description: 'Grouped low-carbon delivery, 3-5 days, carbon offset noted.' },
  { label: 'Standard Courier', description: 'Standard partner courier, 2-4 days across Mindanao.' },
]

export function CheckoutClient() {
  const router = useRouter()
  const [items, setItems] = useState<BuyerCartItem[]>([])
  const [payment, setPayment] = useState(payments[0].label)
  const [deliveryMethod, setDeliveryMethod] = useState(delivery[0].label)

  useEffect(() => {
    queueMicrotask(() => setItems(getCartItems()))
  }, [])

  const totals = getCartTotals(items)
  const shipping = items.length > 0 ? 180 : 0
  const total = totals.subtotal + shipping

  async function handleCheckout() {
    const response = await fetch('/api/buyer/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })

    if (!response.ok) return

    window.localStorage.setItem(
      'habi-last-checkout-v1',
      JSON.stringify({
        payment,
        deliveryMethod,
        subtotal: totals.subtotal,
        shipping,
        total,
        impactKg: totals.impactKg,
        itemCount: totals.itemCount,
      }),
    )
    clearCart()
    router.push('/buyer/checkout/success')
  }

  return (
    <div className="space-y-5">
      <ImpactSummary impactKg={totals.impactKg || 12} compact />

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-3xl font-semibold text-charcoal">Payment</h2>
        <div className="mt-4 space-y-2">
          {payments.map((option) => (
            <CheckoutOptionCard
              key={option.label}
              label={option.label}
              description={option.description}
              selected={payment === option.label}
              onSelect={() => setPayment(option.label)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-3xl font-semibold text-charcoal">Eco-Delivery</h2>
        <div className="mt-4 space-y-2">
          {delivery.map((option) => (
            <CheckoutOptionCard
              key={option.label}
              label={option.label}
              description={option.description}
              selected={deliveryMethod === option.label}
              onSelect={() => setDeliveryMethod(option.label)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-3xl font-semibold text-charcoal">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone">Subtotal</span>
            <span className="font-semibold text-charcoal">PHP {totals.subtotal.toLocaleString('en-PH')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone">Delivery</span>
            <span className="font-semibold text-charcoal">PHP {shipping.toLocaleString('en-PH')}</span>
          </div>
          <div className="border-t border-stone-200 pt-3">
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-charcoal">Total</span>
              <span className="font-bold text-charcoal">PHP {total.toLocaleString('en-PH')}</span>
            </div>
          </div>
        </div>
      </section>

      <p className="rounded-lg bg-forest/8 px-4 py-3 text-sm leading-relaxed text-forest">
        38 buyers in Davao and nearby regions diverted verified material through Habi this month.
      </p>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full rounded-lg bg-terracotta px-5 py-4 text-base font-semibold text-cream shadow-[0_16px_36px_rgba(200,85,61,0.22)] disabled:opacity-50"
      >
        Complete Payment
      </button>
    </div>
  )
}
