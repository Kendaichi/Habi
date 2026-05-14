import { BuyerCartClient } from '@/components/buyer/BuyerCartClient'
import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'

export default function BuyerCartPage() {
  return (
    <BuyerScreenShell title="Shopping Cart" eyebrow="Circular order">
      <div className="mb-6">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">Cart</p>
        <h1 className="font-heading mt-2 text-4xl font-semibold text-charcoal sm:text-5xl">Shopping Cart</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Manage your Habi pieces and see the circular impact of this order.
        </p>
      </div>
      <BuyerCartClient />
    </BuyerScreenShell>
  )
}
