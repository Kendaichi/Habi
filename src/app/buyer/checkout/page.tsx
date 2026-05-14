import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'
import { CheckoutClient } from '@/components/buyer/CheckoutClient'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'

export default async function BuyerCheckoutPage() {
  await requireRole(Role.BUYER)

  return (
    <BuyerScreenShell title="Checkout" eyebrow="Local payment" showBottomNav={false}>
      <div className="mb-6">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">Payment</p>
        <h1 className="font-heading mt-2 text-4xl font-semibold text-charcoal sm:text-5xl">Checkout & Payment</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Choose a local payment method and a delivery option that keeps the loop lower-carbon.
        </p>
      </div>
      <CheckoutClient />
    </BuyerScreenShell>
  )
}
