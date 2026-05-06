import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'
import { CheckoutClient } from '@/components/buyer/CheckoutClient'

export default function BuyerCheckoutPage() {
  return (
    <BuyerScreenShell title="Checkout" eyebrow="Local payment" showBottomNav={false}>
      <div className="mb-6">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">Payment</p>
        <h1 className="font-heading mt-2 text-5xl font-semibold text-charcoal">Checkout & Payment</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Choose a local payment method and a delivery option that keeps the loop lower-carbon.
        </p>
      </div>
      <CheckoutClient />
    </BuyerScreenShell>
  )
}
