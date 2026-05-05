import { Recycle, Users, Truck, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { TopNav } from '@/components/junkshop/TopNav'
import { BottomNav } from '@/components/junkshop/BottomNav'
import { DashboardSection } from '@/components/shared/DashboardSection'

const stats = [
  {
    label: 'Sorted This Month',
    value: '1.2',
    unit: 'tons',
    icon: <Recycle className="text-forest/20 h-10 w-10" />,
    valueClass: 'text-forest',
  },
  {
    label: 'Artisans Served',
    value: '24',
    unit: null,
    icon: <Users className="text-forest/20 h-10 w-10" />,
    valueClass: 'text-forest',
  },
  {
    label: 'Pickup Requests',
    value: '8',
    unit: null,
    icon: <Truck className="text-terracotta/20 h-10 w-10" />,
    valueClass: 'text-terracotta',
  },
]

const inventory = [
  {
    label: 'Plastic',
    sub: 'HDPE & PET Bottles',
    amount: '450',
    borderColor: 'border-terracotta',
    iconBg: 'bg-terracotta/10',
    iconColor: 'text-terracotta',
    emoji: '🧴',
  },
  {
    label: 'Metal',
    sub: 'Aluminum & Scrap Iron',
    amount: '120',
    borderColor: 'border-forest',
    iconBg: 'bg-forest/10',
    iconColor: 'text-forest',
    emoji: '⚙️',
  },
  {
    label: 'Agri-waste',
    sub: 'Coconut Husk & Fiber',
    amount: '800',
    borderColor: 'border-mustard',
    iconBg: 'bg-mustard/10',
    iconColor: 'text-mustard',
    emoji: '🌿',
  },
]

const transactions = [
  {
    initials: 'ML',
    name: 'Maria Lorena',
    desc: 'Purchased 15kg Coconut Husk',
    amount: '₱450.00',
    time: '2 hours ago',
  },
  {
    initials: 'JR',
    name: 'Juan Reyes',
    desc: 'Purchased 20kg HDPE Plastic',
    amount: '₱1,200.00',
    time: 'Yesterday',
  },
  {
    initials: 'AD',
    name: 'Ana Dela Cruz',
    desc: 'Purchased 5kg Aluminum',
    amount: '₱750.00',
    time: 'Oct 24, 2023',
  },
]

export default function JunkshopDashboardPage() {
  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-28">
        {/* Welcome */}
        <section className="mb-8">
          <h1 className="font-heading text-charcoal mb-2 text-3xl font-bold leading-tight md:text-5xl">
            Welcome back,<br />Shop Owner
          </h1>
          <p className="text-stone text-base">Your circular hub is thriving this month.</p>
        </section>

        {/* Primary CTA */}
        <div className="mb-8">
          <Link
            href="/junkshop/log"
            className="bg-terracotta flex w-full items-center justify-center gap-3 rounded-xl px-8 py-4 font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 md:w-auto md:inline-flex"
          >
            <span className="text-lg">+</span>
            Log New Sorted Material
          </Link>
        </div>

        {/* Stats Bento Grid */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border-border flex h-36 flex-col justify-between rounded-2xl border p-4 shadow-sm"
            >
              <span className="text-stone text-[10px] font-bold uppercase tracking-wide">
                {stat.label}
              </span>
              <div className="flex items-end justify-between">
                <span className={`font-heading text-3xl font-bold ${stat.valueClass}`}>
                  {stat.value}
                  {stat.unit && (
                    <span className="text-stone ml-1 text-base font-normal">{stat.unit}</span>
                  )}
                </span>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Banig Divider */}
        <div
          className="mb-8 h-1 w-full rounded-full opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #1b5e3f 0, #1b5e3f 2px, transparent 2px, transparent 4px)',
          }}
        />

        {/* Live Inventory */}
        <DashboardSection title="Live Inventory">
          <div className="mb-2 flex items-center justify-between">
            <span />
            <Link
              href="/junkshop/inventory"
              className="text-forest flex items-center gap-1 text-sm font-medium hover:underline"
            >
              View Detailed <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {inventory.map((item) => (
              <div
                key={item.label}
                className={`bg-card flex items-center justify-between rounded-2xl border-l-4 p-5 shadow-sm ${item.borderColor}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${item.iconBg}`}
                  >
                    {item.emoji}
                  </div>
                  <div>
                    <h4 className="text-charcoal text-base font-bold">{item.label}</h4>
                    <p className="text-stone text-sm">{item.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-charcoal font-heading text-2xl font-bold">
                    {item.amount}
                    <span className="text-stone ml-1 text-sm font-normal">kg</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardSection>

        {/* Recent Transactions */}
        <DashboardSection title="Recent Transactions" className="mt-8">
          <div className="bg-card border-border rounded-3xl border p-6 shadow-sm">
            <div className="space-y-5">
              {transactions.map((tx, i) => (
                <div
                  key={tx.name}
                  className={`flex items-center justify-between pb-5 ${
                    i < transactions.length - 1 ? 'border-b border-stone-100' : 'pb-0'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-stone-600">
                      {tx.initials}
                    </div>
                    <div>
                      <p className="text-charcoal text-sm font-semibold">{tx.name}</p>
                      <p className="text-stone text-xs">{tx.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-forest text-sm font-bold">{tx.amount}</p>
                    <p className="text-stone text-[10px]">{tx.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-stone hover:text-forest mt-4 w-full border-t border-stone-100 pt-4 text-sm font-medium transition-colors">
              See All Activity
            </button>
          </div>
        </DashboardSection>
      </main>

      <BottomNav />
    </div>
  )
}
