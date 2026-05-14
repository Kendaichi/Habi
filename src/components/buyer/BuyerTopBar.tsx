import Image from 'next/image'
import Link from 'next/link'
import { BuyerCartBadge } from '@/components/buyer/BuyerCartBadge'

type BuyerTopBarProps = {
  title?: string
  eyebrow?: string
}

export function BuyerTopBar({ title = 'Habi', eyebrow }: BuyerTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-cream/90 px-5 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between gap-4 sm:max-w-2xl">
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
        <BuyerCartBadge />
      </div>
    </header>
  )
}
