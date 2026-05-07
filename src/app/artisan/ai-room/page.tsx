import {
  Eye,
  Repeat2,
  ShoppingBag,
  Wrench,
  LayoutGrid,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'
import Link from 'next/link'

const usageStats = [
  { icon: Eye, label: 'Visualizations', value: '2,105' },
  { icon: Repeat2, label: 'Lease Cycles', value: '84' },
  { icon: ShoppingBag, label: 'Direct Ownership', value: '156', highlight: true },
]

const placements = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASLkE1ipNW1ROmGtSOnLrvntnhQdd1t8L4-i31ZeEOx-COp76tyJNPOnY7CS22xIlCpW6mhwlMg0N60YvsN5Yf0qSHGhy93Ev5RKFfDmIX5qPMcuPNzoXVA48SPZvuMFjj66r2F4kj_fNWkGXZXlYQxU1W8pRMeF2pE0Ui4WMKpC2gBdjIvwXgpjiOWGmgS5CaQ0ZBHhRcLullLGTQOfDpCYfx46tiBhcKJfUPck6n6qkRlT34501sUjCGVcfGADmgncj1xS_ibBwi',
    name: "T'nalak Wall Hanging",
    location: 'Modern Minimalist Space, Taguig',
    match: '98%',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC09ypFtNLnT87pSjKflW8PA1bpgFl_s-S4zVit2nUJp5JQ8dHbcrjVMJNfbaSptTPyR2IjNHSBnZKwDZokLZEKuFWvwww9YuQFCEfYazE0J7R3y2TazOTbrIPR-s99VRfc22-ufYkdHY3aaWy1YO7EAowmjIebvYyIpugCqbVXaLH8blK9rel_Wv0kuYftVXvCUmr3FAEIkbheFpFtqyLlYzS6x1L349iZG1_ddPkpExTVUPKO6cNbDoJ-XdhnmNcae86qIYdAMPU1',
    name: 'Bio-Resin Lamp',
    location: 'Heritage Warmth, Vigan City',
    match: '92%',
  },
]

const journeySteps = [
  {
    icon: Wrench,
    iconBg: 'bg-forest/10',
    iconColor: 'text-forest',
    label: 'Artisan Workshop',
    sub: 'Created: Jan 12, 2024',
  },
  {
    icon: LayoutGrid,
    iconBg: 'bg-terracotta/10',
    iconColor: 'text-terracotta',
    label: 'Sustainable Space',
    sub: 'In-use: Pasig City',
  },
  {
    icon: RotateCcw,
    iconBg: 'bg-muted',
    iconColor: 'text-stone',
    label: 'Circular Refurb',
    sub: 'Expected: Jan 2025',
  },
]

const styleTrends = [
  { label: 'Modern Minimalist', pct: 48 },
  { label: 'Heritage Warmth', pct: 32 },
  { label: 'Eco-Industrial', pct: 20 },
]

export default function MySustainableSpacePage() {
  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-8 px-5 pt-6 pb-28">
        {/* Hero */}
        <section>
          <p className="text-terracotta mb-1 text-[11px] font-bold tracking-[0.2em] uppercase">
            Crafting Connections
          </p>
          <h1 className="font-heading text-forest text-3xl leading-tight font-bold">
            Your Work in the World
          </h1>
          <p className="text-stone mt-2 text-sm leading-relaxed">
            From the weaving looms of South Cotabato to modern minimalist homes in Manila, see how
            your creations are transforming spaces.
          </p>

          <div className="bg-forest mt-4 flex items-center gap-6 rounded-2xl p-5 shadow-md">
            <div>
              <p className="text-cream/60 text-[10px] font-bold tracking-wider uppercase">
                Total Impressions
              </p>
              <p className="font-heading text-cream text-3xl font-bold">12.4K</p>
            </div>
            <div className="bg-cream/20 h-10 w-px" />
            <div>
              <p className="text-cream/60 text-[10px] font-bold tracking-wider uppercase">
                Active Spaces
              </p>
              <p className="font-heading text-cream text-3xl font-bold">342</p>
            </div>
          </div>
        </section>

        {/* Usage Insights */}
        <section>
          <h2 className="font-heading text-charcoal mb-3 text-lg font-bold">Usage Insights</h2>
          <div className="space-y-3">
            {usageStats.map(({ icon: Icon, label, value, highlight }) => (
              <div
                key={label}
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 ${
                  highlight ? 'bg-forest text-cream' : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 ${highlight ? 'text-cream' : 'text-terracotta'}`}
                    strokeWidth={1.75}
                  />
                  <span
                    className={`text-sm font-semibold ${highlight ? 'text-cream' : 'text-charcoal'}`}
                  >
                    {label}
                  </span>
                </div>
                <span
                  className={`font-heading text-xl font-bold ${highlight ? 'text-cream' : 'text-charcoal'}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Home Placements Gallery */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-charcoal text-lg font-bold">
              Home Placements Gallery
            </h2>
            <button className="text-terracotta flex items-center gap-1 text-xs font-bold tracking-wide uppercase">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {placements.map((p) => (
              <div
                key={p.name}
                className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-stone-200"
              >
                <img
                  src={p.src}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-3 text-white">
                  <p className="text-[10px] font-bold tracking-wide uppercase">{p.name}</p>
                  <p className="text-[10px] italic opacity-75">{p.location}</p>
                </div>
                <div className="text-forest absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold backdrop-blur">
                  MATCH: {p.match}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Circular Journey Map */}
        <section className="border-forest/30 rounded-2xl border-l-4 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-charcoal mb-0.5 text-lg font-bold">
            Circular Journey Map
          </h2>
          <p className="text-stone mb-6 text-xs">
            Tracing Batch #2024-TN: From fibers to furniture to future life.
          </p>

          <div className="relative">
            <div className="border-stone/20 absolute top-8 bottom-8 left-8 border-l-2 border-dashed" />
            <div className="space-y-6">
              {journeySteps.map(({ icon: Icon, iconBg, iconColor, label, sub }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${iconBg} shadow-sm`}
                  >
                    <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-charcoal text-sm font-bold">{label}</p>
                    <p className="text-stone text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Style Trends */}
        <section>
          <h2 className="font-heading text-charcoal mb-1 text-lg font-bold">
            Customer Style Trends
          </h2>
          <p className="text-stone mb-4 text-sm">
            Knowing which aesthetics resonate helps you tailor your upcoming designs.
          </p>
          <div className="space-y-4">
            {styleTrends.map(({ label, pct }) => (
              <div key={label}>
                <div className="mb-1.5 flex items-end justify-between">
                  <span className="text-charcoal text-sm font-bold">{label}</span>
                  <span className="font-heading text-charcoal text-sm font-bold">{pct}%</span>
                </div>
                <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-forest h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Style Recommendation */}
        <section className="bg-muted flex flex-col items-center rounded-3xl p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
            <Sparkles className="text-mustard h-7 w-7" strokeWidth={1.75} />
          </div>
          <h3 className="font-heading text-charcoal mb-2 text-base font-bold">
            Style Recommendation
          </h3>
          <p className="text-stone mb-5 text-sm leading-relaxed italic">
            "Your T'nalak patterns are trending in high-ceiling minimalist lofts. Consider creating
            longer vertical runners for these specific spaces."
          </p>
          <Link
            href="/artisan/demand"
            className="bg-terracotta text-cream rounded-full px-8 py-3 text-xs font-bold tracking-widest uppercase shadow-md transition-transform active:scale-95"
          >
            Explore Trends
          </Link>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
