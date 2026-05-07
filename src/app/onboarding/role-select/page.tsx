'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useRole, type UserRole } from '@/context/RoleContext'

const roles: Array<{
  id: UserRole
  title: string
  description: string
  iconBg: string
  iconColor: string
  imageSrc: string
  imageAlt: string
  icon: ReactNode
}> = [
  {
    id: 'buyer',
    title: "I'm a Buyer",
    description:
      'Discover and buy, rent, or lease unique handcrafted items while supporting local circular economies.',
    iconBg: 'bg-terracotta/10',
    iconColor: 'text-terracotta',
    imageSrc: '/buyer.jpg',
    imageAlt: 'Buyer browsing Habi circular marketplace products',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
        <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'artisan',
    title: "I'm an Artisan",
    description:
      'Sell your creations and find sustainable, upcycled materials sourced directly from junk shop networks near you.',
    iconBg: 'bg-forest/10',
    iconColor: 'text-forest',
    imageSrc: '/artisan.jpg',
    imageAlt: 'Artisan crafting upcycled home decor',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'junkshop',
    title: 'I run a Junk Shop',
    description:
      'Connect your sorted waste materials with creative artisans looking for high-quality recycled inputs for their work.',
    iconBg: 'bg-forest/10',
    iconColor: 'text-forest',
    imageSrc: '/junkshop.jpg',
    imageAlt: 'Junk shop sorting reusable materials',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export default function RoleSelectPage() {
  const router = useRouter()
  const { setRole } = useRole()

  function continueAs(role: UserRole) {
    setRole(role)
    router.push(`/onboarding/signup?role=${role}`)
  }

  return (
    <div className="bg-cream flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Image src="/Habi_Logo.png" alt="Habi" width={28} height={28} className="rounded-lg" />
          <span className="font-heading text-forest text-lg font-bold">Elevated Craft</span>
        </div>
        <Link
          href="/onboarding/signin"
          className="text-stone hover:text-charcoal flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase"
        >
          <span aria-hidden="true">x</span> Exit
        </Link>
      </header>

      <div className="px-6 pt-4 pb-6">
        <h1 className="font-heading text-charcoal text-4xl leading-tight font-bold">
          How will you join the loop?
        </h1>
        <p className="text-stone mt-3 text-sm leading-relaxed">
          Choose your role in our circular ecosystem. Habi will tailor your account and first
          dashboard around this role.
        </p>
      </div>

      <div className="flex flex-col gap-0 px-4 pb-6">
        {roles.map((role) => (
          <div key={role.id} className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
            <div
              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${role.iconBg} ${role.iconColor}`}
            >
              {role.icon}
            </div>

            <h2 className="font-heading text-charcoal text-2xl font-bold">{role.title}</h2>
            <p className="text-stone mt-1 mb-4 text-sm leading-relaxed">{role.description}</p>
            <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-stone-100">
              <Image
                src={role.imageSrc}
                alt={role.imageAlt}
                fill
                sizes="(max-width: 640px) calc(100vw - 72px), 420px"
                className="object-cover"
              />
            </div>

            <Button
              type="button"
              onClick={() => continueAs(role.id)}
              className="bg-terracotta hover:bg-terracotta/90 w-full font-semibold tracking-widest text-white uppercase"
            >
              Continue
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-auto px-6 pb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-1.5">
          <span className="bg-terracotta h-2 w-4 rounded-full" />
          <span className="bg-stone/30 h-2 w-2 rounded-full" />
          <span className="bg-stone/30 h-2 w-2 rounded-full" />
          <span className="bg-stone/30 h-2 w-2 rounded-full" />
        </div>
        <p className="text-stone mb-4 text-xs tracking-widest uppercase">
          Step 2 of 4: Role Identity
        </p>

        <p className="text-stone mb-4 text-sm">
          Already have an account?{' '}
          <Link href="/onboarding/signin" className="text-forest font-semibold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}
