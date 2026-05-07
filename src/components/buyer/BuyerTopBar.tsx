import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

type BuyerTopBarProps = {
  title?: string
  eyebrow?: string
}

export function BuyerTopBar({ title = 'Habi', eyebrow }: BuyerTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-cream/90 px-5 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4">
        <Link href="/buyer/home" className="flex min-w-0 items-center gap-3">
          <Image
            src="/Habi_Logo.png"
            alt="Habi"
            width={38}
            height={38}
            className="h-9 w-9 rounded-lg object-contain"
            priority
          />
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-forest text-[10px] font-semibold uppercase tracking-[0.2em]">
                {eyebrow}
              </p>
            ) : null}
            <p className="font-heading truncate text-2xl font-semibold text-charcoal">{title}</p>
          </div>
        </Link>
        <Link
          href="/buyer/cart"
          aria-label="Shopping cart"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-forest shadow-sm"
        >
          <ShoppingBag className="h-5 w-5" />
        </Link>
      </div>
    </header>
  )
}
