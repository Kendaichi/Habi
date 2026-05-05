import {
  TrendingUp,
  Users,
  Package,
  MapPin,
  Share2,
  ArrowRight,
  Sun,
  RefreshCw,
  Flame,
  CheckCircle,
  Home,
  Store,
} from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'

const topItems = [
  { rank: 1, name: 'Plastic Brick Panels', searches: '1.8k searches', growth: '+42%' },
  { rank: 2, name: 'Woven Abaca Rugs', searches: '1.5k searches', growth: '+28%' },
  { rank: 3, name: 'Rattan Baskets', searches: '1.2k searches', growth: '+15%' },
  { rank: 4, name: 'Bamboo Planters', searches: '980 searches', growth: '+12%' },
  { rank: 5, name: 'Coco Coir Mats', searches: '850 searches', growth: '+10%' },
  { rank: 6, name: 'Clay Pottery', searches: '720 searches', growth: '+8%' },
  { rank: 7, name: 'Pandán Totes', searches: '650 searches', growth: '+5%' },
  { rank: 8, name: 'Recycled Glassware', searches: '540 searches', growth: '+4%' },
  { rank: 9, name: 'Seashell Decor', searches: '490 searches', growth: '+3%' },
  { rank: 10, name: 'Upcycled Wood Trays', searches: '410 searches', growth: '+2%' },
]

const processSteps = [
  {
    icon: <RefreshCw className="text-forest h-6 w-6" />,
    title: '1. Shred & Clean',
    desc: 'Process raw HDPE plastics into uniform 5mm flakes using the communal shredder.',
  },
  {
    icon: <Flame className="text-forest h-6 w-6" />,
    title: '2. Heat Compress',
    desc: 'Layer flakes in the Mindanao Pattern mold and apply 180°C heat for 20 minutes.',
  },
  {
    icon: <CheckCircle className="text-forest h-6 w-6" />,
    title: '3. Surface Finish',
    desc: 'Sand edges and apply a UV-resistant protective coat for outdoor durability.',
  },
]

export default function ArtisanDemandPage() {
  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-6 px-5 pt-6 pb-28">
        {/* Hero Demand Signal */}
        <section className="bg-forest relative overflow-hidden rounded-3xl p-6">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 rounded-full bg-cream/5 blur-3xl" />
          <div className="relative z-10">
            <div className="bg-terracotta/20 text-terracotta mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              <TrendingUp className="h-3 w-3" />
              Trending Now
            </div>
            <h1 className="font-heading text-cream mb-2 text-3xl font-bold leading-tight">
              High Demand:
              <br />
              Plastic Brick Panels
            </h1>
            <p className="text-cream/70 mb-5 text-sm leading-relaxed">
              Market analysis shows 30+ searches this month specifically from eco-resort developers
              in Siargao and Davao.
            </p>
            <div className="flex gap-3">
              <div className="border-cream/10 flex-1 rounded-xl border bg-white/10 px-4 py-3 backdrop-blur-md">
                <span className="text-cream/60 mb-1 block text-[10px] font-bold uppercase tracking-widest">
                  Growth
                </span>
                <span className="font-heading text-cream text-xl font-bold">+42% MoM</span>
              </div>
              <div className="border-cream/10 flex-1 rounded-xl border bg-white/10 px-4 py-3 backdrop-blur-md">
                <span className="text-cream/60 mb-1 block text-[10px] font-bold uppercase tracking-widest">
                  Volume
                </span>
                <span className="font-heading text-cream text-xl font-bold">High</span>
              </div>
            </div>
          </div>
          <div className="border-cream/10 mt-5 overflow-hidden rounded-2xl border-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdyGKmQ1zr3JbOp8fKPKutGD3OapMpJU06jVi2xVfWDEvSLJL2r_CjmH2k89ORJhATdjlnFTgc9Dd61YVgoHk-zAbT8R-yGQRDmiwqT2VDpmOQ55_rg5vKGbmVEHXBPjLqDzqQaOND8al-NZErP9diE5KPzm850nkOksxTHb9bbdJ189PdY1Zidl-DKBqwgjuTdwBa2ZmU9HxIml1hvPlI4we7CE0sH17velw36z7V1_lUC5CTyfyPnDpehVYZhRg0-apYnj1hZhc"
              alt="Plastic brick panels made from recycled plastic"
              className="aspect-video w-full object-cover"
            />
          </div>
        </section>

        {/* Buyer Persona */}
        <section className="bg-muted border-border rounded-2xl border p-5">
          <div className="mb-3 flex items-center gap-2">
            <Users className="text-forest h-5 w-5" />
            <h3 className="text-charcoal font-semibold">Buyer Persona</h3>
          </div>
          <p className="text-stone mb-4 text-sm">
            Most interested:{' '}
            <span className="text-charcoal font-semibold">Eco-conscious homeowners</span> and{' '}
            <span className="text-charcoal font-semibold">sustainable boutique owners</span>.
          </p>
          <div className="flex gap-3">
            <div className="border-border flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5">
              <Home className="text-charcoal h-3.5 w-3.5" />
              <span className="text-charcoal text-xs font-semibold">Residential</span>
            </div>
            <div className="border-border flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5">
              <Store className="text-charcoal h-3.5 w-3.5" />
              <span className="text-charcoal text-xs font-semibold">Commercial</span>
            </div>
          </div>
        </section>

        {/* Materials Needed */}
        <section className="bg-card border-border rounded-2xl border p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package className="text-terracotta h-5 w-5" />
            <h2 className="text-charcoal text-lg font-semibold">Materials Needed</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="bg-muted rounded-xl p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="text-charcoal text-sm font-semibold">HDPE &amp; LDPE Scraps</h4>
                  <p className="text-stone mt-0.5 text-xs">Target: 12kg per panel</p>
                </div>
                <span className="bg-forest/15 text-forest rounded px-2 py-0.5 text-[10px] font-bold uppercase">
                  Abundant
                </span>
              </div>
              <div className="border-border border-t pt-3">
                <p className="text-stone mb-2 text-[10px] font-bold uppercase tracking-widest">
                  Local Sourcing
                </p>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="text-forest group flex items-center gap-1.5 text-sm hover:underline"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>Eco-Point Junk Shop (2.4km)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                  <a
                    href="#"
                    className="text-forest group flex items-center gap-1.5 text-sm hover:underline"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>Mindanao Recyclers Hub (5.1km)</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="text-charcoal text-sm font-semibold">Binding Resin</h4>
                  <p className="text-stone mt-0.5 text-xs">Target: 2L per batch</p>
                </div>
                <span className="bg-terracotta/15 text-terracotta rounded px-2 py-0.5 text-[10px] font-bold uppercase">
                  Scarce
                </span>
              </div>
              <div className="border-border border-t pt-3">
                <p className="text-stone mb-2 text-[10px] font-bold uppercase tracking-widest">
                  Co-op Sourcing
                </p>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="text-forest group flex items-center gap-1.5 text-sm hover:underline"
                  >
                    <Share2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Artisan Co-op Warehouse</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Price */}
        <section className="bg-muted rounded-2xl p-5">
          <p className="text-terracotta mb-1 text-[10px] font-bold uppercase tracking-widest">
            AI Recommendation
          </p>
          <h2 className="font-heading text-charcoal mb-4 text-xl font-bold">Suggested Price</h2>
          <div className="mb-5">
            <span className="font-heading text-charcoal text-4xl font-bold">₱150 – ₱220</span>
            <span className="text-stone ml-1 font-medium">/pc</span>
            <p className="text-stone mt-1.5 text-sm">
              Based on current material costs and high buyer intent in Northern Mindanao.
            </p>
          </div>
          <div className="border-border mb-4 space-y-2 border-t pt-4">
            <div className="flex justify-between text-xs">
              <span className="text-stone uppercase tracking-wider">Break-even Price</span>
              <span className="text-charcoal font-bold">₱85.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone uppercase tracking-wider">Target Profit (30%)</span>
              <span className="text-forest font-bold">+₱50.00</span>
            </div>
          </div>
          <div className="rounded-xl bg-white/50 p-3 backdrop-blur">
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-charcoal font-medium">Potential Profit</span>
              <span className="text-forest font-bold">~₱85/unit</span>
            </div>
            <div className="bg-stone/20 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-forest h-full w-3/4 rounded-full" />
            </div>
          </div>
        </section>

        {/* Seasonal Insight */}
        <div className="bg-mustard/15 border-mustard/30 flex items-start gap-3 rounded-2xl border p-4">
          <Sun className="text-mustard mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h4 className="text-charcoal text-sm font-semibold">Seasonal Insight</h4>
            <p className="text-charcoal/70 mt-0.5 text-sm">
              Demand for patio and garden panels peaks in March–May (summer season in PH). Start
              production now to fulfill pre-orders.
            </p>
          </div>
        </div>

        {/* Top 10 Most Searched */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-charcoal text-xl font-bold">Top 10 Most Searched</h2>
            <span className="text-stone text-[10px] font-bold uppercase tracking-widest">
              Last 30 Days
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {topItems.map((item) => (
              <div
                key={item.rank}
                className="border-border bg-card rounded-2xl border p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-1.5 flex items-start justify-between">
                  <span className="font-heading text-charcoal/20 text-xl font-bold">
                    #{item.rank}
                  </span>
                  <span className="text-forest flex items-center gap-0.5 text-xs font-bold">
                    <TrendingUp className="h-3 w-3" />
                    {item.growth}
                  </span>
                </div>
                <h4 className="text-charcoal mb-0.5 text-sm font-semibold leading-snug">
                  {item.name}
                </h4>
                <p className="text-stone text-xs">{item.searches}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Outline */}
        <section className="bg-card border-border rounded-2xl border p-5">
          <h3 className="font-heading text-charcoal mb-6 text-lg font-bold">Process Outline</h3>
          <div className="space-y-6">
            {processSteps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="bg-forest/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  {step.icon}
                </div>
                <div>
                  <h4 className="text-charcoal text-sm font-semibold">{step.title}</h4>
                  <p className="text-stone mt-0.5 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Start Production CTA */}
        <button className="group bg-terracotta text-cream w-full rounded-3xl p-1 shadow-lg transition-all duration-300 hover:bg-[#b0462f] active:scale-[0.98]">
          <div className="flex items-center justify-between gap-4 rounded-[1.4rem] border-2 border-dashed border-white/20 px-6 py-5">
            <div className="text-left">
              <h2 className="font-heading text-cream text-xl font-bold">Start Production Now</h2>
              <p className="text-cream/70 mt-0.5 text-sm">
                We&apos;ll pre-fill a listing draft with the specs above.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-cream/80 text-sm font-semibold">Draft #420-B</span>
              <div className="text-terracotta flex h-12 w-12 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
