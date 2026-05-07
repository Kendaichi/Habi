import { getCurrentUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Role } from '@/generated/prisma/enums'
import { BottomNav as ArtisanBottomNav } from '@/components/artisan/BottomNav'
import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { BottomNav as JunkshopBottomNav } from '@/components/junkshop/BottomNav'
import {
  BadgeCheck,
  Bell,
  Building2,
  ChevronRight,
  CreditCard,
  Globe,
  Leaf,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getRoleLabel(role: Role) {
  switch (role) {
    case Role.ARTISAN:
      return 'Master Artisan'
    case Role.BUYER:
      return 'Conscious Buyer'
    case Role.JUNKSHOP:
      return 'Junk Shop Partner'
    case Role.SUPPLIER:
      return 'Materials Supplier'
  }
}

function getRoleSpecialties(role: Role): string[] {
  switch (role) {
    case Role.ARTISAN:
      return ['Circular Craft Specialist', 'Eco Materials']
    case Role.BUYER:
      return ['Sustainable Buyer', 'EU-PH Programme Member']
    case Role.JUNKSHOP:
      return ['Materials Hub Partner', 'Circular Economy']
    case Role.SUPPLIER:
      return ['Waste Supplier', 'Circular Economy Partner']
  }
}

const notificationItems = [
  { label: 'Sales & Orders', desc: 'When someone buys your work', active: true },
  { label: 'Community Updates', desc: 'News from the EU-PH Green Economy guild', active: true },
  { label: 'Direct Messages', desc: 'Communication with buyers', active: false },
]

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile()
  if (!profile) redirect('/onboarding/signin')

  const roleLabel = getRoleLabel(profile.role)
  const specialties = getRoleSpecialties(profile.role)
  const initials = getInitials(profile.name)

  const BottomNav =
    profile.role === Role.ARTISAN
      ? ArtisanBottomNav
      : profile.role === Role.BUYER
        ? BuyerBottomNav
        : JunkshopBottomNav

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-cream/90 border-stone/20 sticky top-0 z-50 border-b px-5 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-forest font-['Noto_Serif'] text-xl font-bold italic">Habi</span>
          <span className="text-stone text-xs font-semibold tracking-widest uppercase">
            My Profile
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8 pb-32">
        {/* Hero */}
        <section className="mb-8 flex flex-col items-center gap-5">
          <div className="relative">
            <div className="bg-forest/10 border-forest/20 flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-lg">
              <span className="text-forest font-heading text-3xl font-bold">{initials}</span>
            </div>
            <div className="bg-forest absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full shadow-md">
              <BadgeCheck className="text-cream h-4 w-4" fill="currentColor" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="font-heading text-charcoal text-2xl font-bold">{profile.name}</h1>
            <p className="text-stone mt-1 text-xs font-semibold tracking-widest uppercase">
              {roleLabel}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {specialties.map((s) => (
                <span
                  key={s}
                  className="bg-forest/10 text-forest rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {/* Personal Info */}
          <div className="bg-card border-border rounded-3xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-charcoal text-lg font-bold">Personal Info</h2>
              <button className="text-forest text-xs font-semibold hover:underline">Edit</button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="text-stone mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-stone text-[10px] font-bold tracking-wider uppercase">
                    Full Name
                  </p>
                  <p className="text-charcoal mt-0.5 text-sm">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-stone mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-stone text-[10px] font-bold tracking-wider uppercase">Email</p>
                  <p className="text-charcoal mt-0.5 text-sm">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-stone mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-stone text-[10px] font-bold tracking-wider uppercase">Phone</p>
                  <p className="text-stone/50 mt-0.5 text-sm italic">Not provided</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-stone mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="text-stone text-[10px] font-bold tracking-wider uppercase">
                    Region
                  </p>
                  <p className="text-stone/50 mt-0.5 text-sm italic">Philippines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Settings */}
          <div className="bg-forest relative overflow-hidden rounded-3xl p-6 shadow-lg">
            <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 opacity-10">
              <svg fill="none" height="100%" viewBox="0 0 200 400" width="100%">
                <path
                  d="M0 0L200 200M200 0L0 200M0 200L200 400M200 200L0 400"
                  stroke="white"
                  strokeDasharray="10 10"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2">
                <Leaf className="text-mustard h-5 w-5" fill="currentColor" />
                <h2 className="font-heading text-cream text-lg font-bold">Impact Settings</h2>
              </div>
              <p className="text-cream/70 mb-5 text-sm leading-relaxed">
                Manage how your work contributes to local sustainability and the circular economy.
              </p>
              <div className="space-y-4">
                {[
                  {
                    label: 'Eco-Fiber Traceability',
                    desc: 'Include QR codes for fiber source transparency.',
                  },
                  {
                    label: 'Carbon Neutral Delivery',
                    desc: 'Opt-in to local bicycle-courier delivery networks.',
                  },
                  {
                    label: 'Community Fund Share',
                    desc: 'Allocate 2% of sales to regional weavers guilds.',
                  },
                ].map((item) => (
                  <label key={item.label} className="flex cursor-pointer items-start gap-3">
                    <div className="border-cream/40 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2">
                      <svg className="text-cream h-3 w-3" fill="none" viewBox="0 0 12 12">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-cream text-sm font-semibold">{item.label}</p>
                      <p className="text-cream/60 text-xs">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Payout + Notifications */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-card border-border rounded-3xl border p-6">
              <h2 className="font-heading text-charcoal mb-4 text-lg font-bold">
                Payout Settings
              </h2>
              <div className="space-y-3">
                <div className="bg-muted flex items-center gap-3 rounded-2xl p-4">
                  <div className="bg-forest/10 flex h-10 w-10 items-center justify-center rounded-xl">
                    <Building2 className="text-forest h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-charcoal truncate text-sm font-semibold">Bank Account</p>
                    <p className="text-stone text-xs">**** 8829</p>
                  </div>
                  <ChevronRight className="text-stone h-4 w-4 shrink-0" />
                </div>
                <div className="bg-muted flex items-center gap-3 rounded-2xl p-4">
                  <div className="bg-terracotta/10 flex h-10 w-10 items-center justify-center rounded-xl">
                    <CreditCard className="text-terracotta h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-charcoal truncate text-sm font-semibold">GCash Wallet</p>
                    <p className="text-stone text-xs">0917 ••• ••67</p>
                  </div>
                  <ChevronRight className="text-stone h-4 w-4 shrink-0" />
                </div>
                <button className="border-stone/30 text-stone hover:border-forest hover:text-forest w-full rounded-2xl border-2 border-dashed py-3 text-xs font-semibold transition-colors">
                  + Add Payment Method
                </button>
              </div>
            </div>

            <div className="bg-card border-border rounded-3xl border p-6">
              <div className="mb-4 flex items-center gap-2">
                <Bell className="text-forest h-5 w-5" />
                <h2 className="font-heading text-charcoal text-lg font-bold">Notifications</h2>
              </div>
              <div className="space-y-4">
                {notificationItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-charcoal text-sm font-semibold">{item.label}</p>
                      <p className="text-stone mt-0.5 text-xs leading-tight">{item.desc}</p>
                    </div>
                    <div
                      className={`relative h-5 w-10 shrink-0 rounded-full ${item.active ? 'bg-forest' : 'border-stone/20 border bg-stone/20'}`}
                    >
                      <div
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${item.active ? 'right-0.5' : 'left-0.5'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-card border-border rounded-3xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="text-forest h-5 w-5" />
              <h2 className="font-heading text-charcoal text-lg font-bold">Language</h2>
            </div>
            <div className="flex gap-3">
              <button className="border-forest bg-forest/5 text-forest flex-1 rounded-2xl border-2 py-3 text-sm font-semibold">
                English (US)
              </button>
              <button className="border-border text-stone hover:border-forest hover:text-forest flex-1 rounded-2xl border py-3 text-sm font-semibold transition-colors">
                Filipino
              </button>
            </div>
          </div>
        </div>

        <footer className="border-stone/20 mt-12 border-t pt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003399]">
              <Globe className="text-cream h-4 w-4" />
            </div>
            <div>
              <p className="text-stone text-[10px] font-bold tracking-wider uppercase">
                Proud Partner of
              </p>
              <p className="text-forest text-sm font-semibold">EU-PH Green Economy Programme</p>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Support'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-stone hover:text-forest text-xs font-semibold transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="text-stone mt-6 text-center text-[10px]">
            © 2024 Habi Social Enterprise. All rights reserved.
          </p>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}
