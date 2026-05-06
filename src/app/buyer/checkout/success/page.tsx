import { BuyerScreenShell } from '@/components/buyer/BuyerScreenShell'
import { CheckoutSuccessClient } from '@/components/buyer/CheckoutSuccessClient'

export default function BuyerCheckoutSuccessPage() {
  return (
    <BuyerScreenShell title="Success" eyebrow="Impact badge" showBottomNav={false}>
      <CheckoutSuccessClient />
    </BuyerScreenShell>
  )
}
