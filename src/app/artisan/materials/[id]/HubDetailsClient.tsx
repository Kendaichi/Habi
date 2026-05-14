'use client'

import { useState } from 'react'
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
  Check,
} from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/artisan/BottomNav'
import { useCart } from '@/context/CartContext'

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

const GALLERY_SPANS = ['col-span-2 row-span-2', 'col-span-2', '', '']

export type ShopData = {
  id: string
  name: string
  address: string
  isVerified: boolean
  image?: string
  galleryImages: string[]
  materials: {
    id: string
    type: string
    quantityKg: number
    pricePerKg: number
  }[]
}

export function HubDetailsClient({ shop }: { shop: ShopData }) {
  const { addItem, removeItem, isInCart } = useCart()
  const [contactCopied, setContactCopied] = useState(false)

  function handleContact() {
    const text = `${shop.name} — ${shop.address}`
    navigator.clipboard.writeText(text).catch(() => {})
    setContactCopied(true)
    setTimeout(() => setContactCopied(false), 2000)
  }

  function handleDirections() {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(shop.address)}`, '_blank')
  }

  function handleDownload() {
    const rows = [
      'Type,Price per kg (₱),Available (kg)',
      ...shop.materials.map((m) => `${m.type},${m.pricePerKg},${m.quantityKg}`),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${shop.name.replace(/\s+/g, '_')}_price_list.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function toggleQuote(material: ShopData['materials'][0]) {
    if (isInCart(material.id)) {
      removeItem(material.id)
    } else {
      addItem({
        materialId: material.id,
        type: material.type,
        quantityKg: material.quantityKg,
        pricePerKg: material.pricePerKg,
        hubId: shop.id,
        hubName: shop.name,
      })
    }
  }

  return (
    <div className="bg-cream min-h-screen pb-28">
      <header className="border-border bg-cream/90 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-5 backdrop-blur-sm">
        <Link href="/artisan/materials" className="text-forest hover:bg-forest/10 rounded-full p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-heading text-forest text-base font-bold">Hub Details</span>
        <div className="w-9" />
      </header>

      <div className="mx-auto max-w-2xl space-y-10 px-5 pt-6 sm:px-6">
        {/* Hero */}
        <section>
          {shop.image && (
            <div className="aspect-4/3S relative mb-6 overflow-hidden rounded-3xl shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shop.image}
                alt={shop.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/90 p-3 backdrop-blur-md">
                <MapPin className="text-terracotta h-4 w-4 shrink-0" />
                <div>
                  <p className="text-terracotta text-[10px] font-bold tracking-wider uppercase">
                    Location
                  </p>
                  <p className="text-charcoal text-sm font-bold">{shop.address}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center gap-2">
            {shop.isVerified && (
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
            <button
              onClick={handleContact}
              className="bg-forest text-cream hover:bg-forest/90 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              {contactCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Info Copied!
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4" />
                  Contact to Reserve
                </>
              )}
            </button>
            <button
              onClick={handleDirections}
              className="border-border text-charcoal hover:bg-muted flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white py-3 text-sm font-semibold transition-all active:scale-95"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </button>
          </div>

          {!shop.image && (
            <div className="border-border mt-6 flex items-center gap-3 rounded-2xl border bg-white p-4">
              <MapPin className="text-terracotta h-5 w-5 shrink-0" />
              <div>
                <p className="text-terracotta text-[10px] font-bold tracking-wider uppercase">
                  Location
                </p>
                <p className="text-charcoal text-sm font-bold">{shop.address}</p>
              </div>
            </div>
          )}
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
            <button
              onClick={handleDownload}
              className="text-forest flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              Download Price List
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>

          {shop.materials.length === 0 ? (
            <p className="text-stone py-8 text-center text-sm">No materials available right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {shop.materials.map((item) => {
                const colorClass = MATERIAL_BG[item.type] ?? 'bg-stone/10 text-stone'
                const icon = MATERIAL_ICON[item.type] ?? <Package className="h-6 w-6" />
                const inQuote = isInCart(item.id)
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
                      <button
                        onClick={() => toggleQuote(item)}
                        className={`w-full rounded-xl border py-2 text-xs font-bold transition-colors ${
                          inQuote
                            ? 'bg-forest border-forest text-cream'
                            : 'border-forest text-forest hover:bg-forest hover:text-cream'
                        }`}
                      >
                        {inQuote ? 'Added ✓' : 'Add to Quote'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Gallery */}
        {shop.galleryImages.length > 0 && (
          <section className="pb-4">
            <h3 className="font-heading text-forest mb-6 text-center text-xl font-bold">
              Inside the Hub
            </h3>
            <div className="grid auto-rows-[150px] grid-cols-2 gap-3">
              {shop.galleryImages.map((src, i) => (
                <div key={i} className={`overflow-hidden rounded-3xl ${GALLERY_SPANS[i] ?? ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Hub gallery ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
