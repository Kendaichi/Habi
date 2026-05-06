import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'
import { CustomRequestForm } from '@/components/buyer/CustomRequestForm'

export default function BuyerRequestPage() {
  return (
    <BuyerScreenShell title="Custom Request" eyebrow="Bespoke">
      <div className="mb-6">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.24em]">
          Custom Request
        </p>
        <h1 className="font-heading mt-2 text-5xl font-semibold leading-tight text-charcoal">
          Build for your space
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Send a room brief, budget, and material preferences so Habi artisans can bid.
        </p>
      </div>
      <CustomRequestForm />
    </BuyerScreenShell>
  )
}
