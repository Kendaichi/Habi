import {
  ArrowLeft,
  Phone,
  Navigation,
  BadgeCheck,
  MapPin,
  Download,
  Package,
  RefreshCw,
  Sparkles,
  Cog,
  Leaf,
  Layers,
} from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BottomNav } from '@/components/artisan/BottomNav'
import { prisma } from '@/lib/prisma'

const MATERIAL_ICON: Record<string, React.ReactNode> = {
  Plastic: <Package className="h-6 w-6" />,
  Metal: <Cog className="h-6 w-6" />,
  Bamboo: <Leaf className="h-6 w-6" />,
  Textile: <Layers className="h-6 w-6" />,
}

const MATERIAL_BG: Record<string, string> = {
  Plastic: 'bg-terracotta/10 text-terracotta',
  Metal: 'bg-stone/10 text-stone',
  Bamboo: 'bg-forest/10 text-forest',
  Textile: 'bg-mustard/10 text-mustard',
}

const processSteps = [
  {
    icon: <RefreshCw className="text-forest h-8 w-8" />,
    title: 'Eco-Shredding',
    desc: 'Precision reduction of materials using low-emission hardware to minimize carbon footprint during processing.',
  },
  {
    icon: <Sparkles className="text-forest h-8 w-8" />,
    title: 'UV Sanitization',
    desc: 'Advanced ultraviolet light treatment ensures all inventory is pathogen-free and ready for artisanal reuse.',
  },
]

const galleryImgs = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOh8id_otJI8rJ_Wz2_MwvrH-x7JXf7Az_IPBJIpFMwUkP_JaMpHEG-CBa7r4gKA0ydqpNVnM27MJlpPO4ImCmBpKCMgKWIOFk12iWllUYBqr_evz6SI24wncCeUdR6Hc44v8VGf4XhUwRCJonlXRN3I_-Z5r4eNcV5hY513_pHC2ck6kaGi5tUDbUeLfBpqWl3Kh1BIk6dInOJNS-Nezl6wQUoh2hThaZpkaVMs3Q3teWonhgjvO-FOHs_2I9yHjkNSV2w0IcB6aI',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn1XXrzurX8XE-4BgEEJsKd_41pc9_PE-ft9FzyZ6ZwdLp4lQ51vT6k8CQU09CFLq2bVehfnE_Qr2bsqwKN9FOZ677w7huMJojv31P_VxfcCSg1y5-lYXklImuWz5qr0WUP2cx_tfpfqlcqW0D_m2Fcs1JOCwSR3JPZcmsCHHAq8OlpgEvhSxOqBxq7vr7vuC7-CBriAJeiPm7BDJT1vUhWDApLWJhzwyNwOTIolEpTX3uU_Un6zbFOvTvwMUH0Gwz-i2VFQFOQoHa',
    span: 'col-span-2',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4EHDl6053Smk5zzAjPoYLhDkI2nY6xilGWOeJkuDTgpPTAEK3xSYaJpXUUsy8u1Hcd9HlhJKPkWCEhO4hjvNODxZWUTDb8AoKuSYFvVjLpl5JPZWyxaz3vJyUMmbIXiDhWOstexOXeefOYn0g1u8rBDCMbF4sem1bqgTWkqcKN1AaQqeHKFgNzP8cDdRBsR0Nw9gmPI5BduNCSFdW5a8g8UzMkj0RJdFadQmR-Kq51gpt8qJKMPok5yKe3bN67w9P7otssy6IMUT6',
    span: '',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoMZinIAibVb4LF2gYau6dMFs983mQ7LKFFYK0dUftiKY1EEAAsMDbwbMmDk3YWzC3g73ONcaSbpv82uvBY7BfXXO-FPyosjf5gu5AhT3xfvwqsdgw2KPHdiF1qWqyQkpBTYKv2I9KE-wWVz-QMyOLB1lXaWtoxozO5lA0a-TYv-wvvgHc95rK7EuK-DIUpB_HxWv8GXyBuc2smP1xkeVPSNXDCAf32kRXKGGLelem_QdHRfBQ_BVVV7qASXqjRKFtLAQZi',
    span: '',
  },
]

export default async function HubDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const shop = await prisma.junkShop.findUnique({
    where: { id },
    include: { materialsList: { where: { available: true } } },
  })

  if (!shop) notFound()

  const isVerified = shop.verifiedAt !== null
  const address = shop.address ?? shop.city

  return (
    <div className="bg-cream min-h-screen pb-28">
      <header className="border-border bg-cream/90 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-5 backdrop-blur-sm">
        <Link href="/artisan/materials" className="text-forest hover:bg-forest/10 rounded-full p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-heading text-forest text-base font-bold">Hub Details</span>
        <div className="w-9" />
      </header>

      <div className="space-y-10 px-5 pt-6">
        {/* Hero */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            {isVerified && (
              <span className="bg-forest/10 text-forest flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
                <BadgeCheck className="h-3 w-3" />
                Verified Hub
              </span>
            )}
          </div>

          <h1 className="font-heading text-forest mb-2 text-3xl leading-tight font-bold">
            {shop.name}
          </h1>

          <div className="flex gap-3">
            <button className="bg-forest text-cream hover:bg-forest/90 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-lg transition-all active:scale-95">
              <Phone className="h-4 w-4" />
              Contact to Reserve
            </button>
            <button className="border-border text-charcoal hover:bg-muted flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white py-3 text-sm font-semibold transition-all active:scale-95">
              <Navigation className="h-4 w-4" />
              Get Directions
            </button>
          </div>

          <div className="border-border mt-6 flex items-center gap-3 rounded-2xl border bg-white p-4">
            <MapPin className="text-terracotta h-5 w-5 shrink-0" />
            <div>
              <p className="text-terracotta text-[10px] font-bold tracking-wider uppercase">
                Location
              </p>
              <p className="text-charcoal text-sm font-bold">{address}</p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-border border-t pt-8">
          <h3 className="font-heading text-forest mb-2 text-xl font-bold">Our Ginhawa Process</h3>
          <p className="text-stone mb-6 text-sm">
            We believe that even discarded items deserve a second life of dignity. Our process is
            designed to ensure maximum purity and safety.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="border-border bg-muted rounded-3xl border p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4">{step.icon}</div>
                <h4 className="font-heading text-charcoal mb-2 text-base font-bold">
                  {step.title}
                </h4>
                <p className="text-stone text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live inventory */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h3 className="font-heading text-forest text-xl font-bold">Live Inventory</h3>
              <p className="text-stone text-xs">Available materials from this hub</p>
            </div>
            <button className="text-forest flex items-center gap-1 text-xs font-semibold hover:underline">
              Download Price List
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>

          {shop.materialsList.length === 0 ? (
            <p className="text-stone py-8 text-center text-sm">No materials available right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {shop.materialsList.map((item) => {
                const colorClass = MATERIAL_BG[item.type] ?? 'bg-stone/10 text-stone'
                const icon = MATERIAL_ICON[item.type] ?? <Package className="h-6 w-6" />
                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className={`flex aspect-square items-center justify-center ${colorClass}`}>
                      {icon}
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-start justify-between gap-1">
                        <h5 className="font-heading text-charcoal text-sm leading-snug font-bold">
                          {item.type}
                        </h5>
                        <span className="text-mustard shrink-0 text-xs font-bold">
                          ₱{item.pricePerKg}/kg
                        </span>
                      </div>
                      <div className="text-stone mb-3 flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-semibold">
                          {item.quantityKg}kg Available
                        </span>
                      </div>
                      <button className="border-forest text-forest hover:bg-forest hover:text-cream w-full rounded-xl border py-2 text-xs font-bold transition-colors">
                        Add to Quote
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Gallery */}
        <section className="pb-4">
          <h3 className="font-heading text-forest mb-6 text-center text-xl font-bold">
            Inside the Hub
          </h3>
          <div className="grid auto-rows-[150px] grid-cols-2 gap-3">
            {galleryImgs.map((img, i) => (
              <div key={i} className={`overflow-hidden rounded-3xl ${img.span}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={`Hub gallery ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
