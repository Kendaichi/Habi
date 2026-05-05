'use client'

import { useState } from 'react'
import {
  Search,
  MapPin,
  BadgeCheck,
  MessageSquare,
  ChevronRight,
  SearchX,
  PlusCircle,
  Package,
  Leaf,
  Layers,
  Cog,
} from 'lucide-react'
import Link from 'next/link'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'

const FILTERS = ['All Hubs', 'Plastic', 'Bamboo', 'Wood', 'Metal', 'Textile']

type MaterialType = 'Plastic' | 'Metal' | 'Bamboo' | 'Textile'

const MATERIAL_ICONS: Record<MaterialType, React.ReactNode> = {
  Plastic: <Package className="h-4 w-4" />,
  Metal: <Cog className="h-4 w-4" />,
  Bamboo: <Leaf className="h-4 w-4" />,
  Textile: <Layers className="h-4 w-4" />,
}

const hubs = [
  {
    id: 'koronadal-recyclers',
    name: 'Koronadal Recyclers',
    address: 'Purok 12, Koronadal City',
    distance: '2.4KM',
    verified: true,
    materials: [
      {
        type: 'Plastic' as MaterialType,
        qty: '45kg',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJkqrPFrTVbcbo_JV5lhBYTVPDIqnE3EPsnEApOUDrQc_Za84YqIdCX_KgDnQXvL_7GlsYwDFmOxyvrulDFJ_ih5ZCVoupeWjdz9Vd1x7hSbdlV5n0pgfSOr38iHoRVB1imcVRa1yywBtrkbaIOegcy8A6QOUXm3klMw7OCjPrxYKjCtoqGkSE3prx-K5M529xAzREHKxvRwfB6KbyuDxz_jkUblaaWmziA36fFc3FSHo3htUfSe8EipzcqXBPUhdHv0O9iQ6DyYA',
      },
      {
        type: 'Metal' as MaterialType,
        qty: '12kg',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLFuQnzjG-ev5SuSSL-dm7hne_pmKoRmxudvP_Ws3e1Jyv8r9gYOTCJVjpFGMBH6TnvtyVNle5LPgPbpi8NivB7G2AtAIUPEXcKPYsoUU6RIHeqRSic7WJ08ho6xKa6EBGMnV9uX6HMNx-4US6t6X0clMPox9BBblIrKotysJMgv68HbuGEdj1Yb-MQYCRCu6uOl_YgMsE_KeS6odovvEyYbwq9MrXkYqWGi_j_qHpD-kfJdirynabtZjowQiG5x1YHWNqoDpYius',
      },
    ],
  },
  {
    id: 'south-cotabato-green-hub',
    name: 'South Cotabato Green Hub',
    address: 'GenSan Drive, Surallah',
    distance: '5.1KM',
    verified: true,
    materials: [
      {
        type: 'Bamboo' as MaterialType,
        qty: '120kg',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHrkefzOaCSXcXiFX0uqStMszWe4sqihG8YqiZ_bTl0mQG0IKSzZBGDmaaCg_mOElhXeHLTxWAtq425_mB7nWvQD2nFit0h0ToV7QJWjtkupJ-6ZRZOShYDiW_gtB-0h5wFG3udZBt52B1lW5hXPpQGg4rzQ_190ezUq86qXjKjludk0njJODJD7fuE-KpDpf_9xueLEiaKMnLFNOKHbs5C3GqWZKwNu7sSymR_EPQBZPonPCPgA_EsVdjnGuJGTKPK33mU5ztems',
      },
      {
        type: 'Textile' as MaterialType,
        qty: '28kg',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE4KDRnfXnG_0NfNi4AjQWMBS70KesmCwpneOoYcvKW_2ZUd3FTc9IsxgNCUKBJhAZjm2ZDuMOaAaSuPK6SE4C16QjC1sfnD3VS0hHr_xm_h4TAMnLaeN4_N73Yqua2eb8XGR2Wejwy8iJwCSR17bDtsBvt36EJm3QiHq-1lWDOEk3YUz5nhgHa-U0fpL20i0hXD1ok8Ni4Wrneoa1Cuzu6HGNALzFu6DKkEaJugrps4n8HKrQvRd33-OrPmFjMVtV-xv2YryeJak',
      },
    ],
  },
]

export default function ArtisanMaterialsPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Hubs')

  const filtered = hubs.filter((hub) => {
    const q = search.toLowerCase()
    const matchesSearch =
      q === '' ||
      hub.name.toLowerCase().includes(q) ||
      hub.address.toLowerCase().includes(q) ||
      hub.materials.some((m) => m.type.toLowerCase().includes(q))

    const matchesFilter =
      activeFilter === 'All Hubs' || hub.materials.some((m) => m.type === activeFilter)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-6 px-5 pt-6 pb-28">
        {/* Search hero */}
        <section className="bg-forest rounded-3xl p-6">
          <h2 className="font-heading text-cream mb-5 text-2xl font-bold">Find Local Materials</h2>
          <div className="relative">
            <Search className="text-forest absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city or material (e.g., Plastic, Koronadal)"
              className="text-charcoal placeholder-stone w-full rounded-2xl bg-white py-4 pr-5 pl-12 shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
            />
          </div>
        </section>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-xl px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all active:scale-95 ${
                activeFilter === f
                  ? 'bg-forest text-cream shadow-md'
                  : 'border-border text-forest hover:bg-forest/5 border bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Hub cards */}
        <section className="space-y-5">
          {filtered.length === 0 && (
            <p className="text-stone py-12 text-center text-sm">No hubs match your search.</p>
          )}
          {filtered.map((hub) => (
            <div
              key={hub.id}
              className="border-border flex flex-col gap-5 rounded-3xl border bg-white p-5 shadow-sm transition-all hover:shadow-xl"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-heading text-forest text-xl font-bold">{hub.name}</h3>
                      {hub.verified && <BadgeCheck className="text-terracotta h-4 w-4" />}
                    </div>
                    <div className="text-stone flex items-center gap-1.5 text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{hub.address}</span>
                    </div>
                  </div>
                  <span className="bg-terracotta/10 text-terracotta rounded-full px-3 py-1 text-[10px] font-bold uppercase">
                    {hub.distance}
                  </span>
                </div>

                <div className="space-y-3">
                  {hub.materials.map((mat) => (
                    <div
                      key={mat.type}
                      className="bg-muted flex items-center justify-between rounded-2xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="ring-border h-14 w-14 overflow-hidden rounded-xl ring-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mat.img}
                            alt={mat.type}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-stone mb-1 text-[10px] font-bold tracking-wider uppercase">
                            {mat.type}
                          </p>
                          <div className="text-terracotta flex items-center gap-1.5">
                            {MATERIAL_ICONS[mat.type]}
                            <span className="font-heading text-charcoal text-lg font-bold">
                              {mat.qty}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/artisan/materials/${hub.id}`}
                        className="text-forest hover:bg-forest/10 rounded-full p-2"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <button className="bg-forest text-cream hover:bg-forest/90 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold shadow-lg transition-all">
                <MessageSquare className="h-5 w-5" />
                Contact Hub
              </button>
            </div>
          ))}
        </section>

        {/* Can't find CTA */}
        <section className="text-center">
          <div className="border-terracotta/30 bg-terracotta/5 rounded-3xl border-2 border-dashed p-8">
            <SearchX className="text-terracotta mx-auto mb-3 h-10 w-10" />
            <h3 className="font-heading text-forest mb-2 text-xl font-bold">
              Can&apos;t find what you need?
            </h3>
            <p className="text-stone mb-6 text-sm leading-relaxed">
              Let local hubs know what materials you&apos;re looking for. We&apos;ll notify you when
              they become available.
            </p>
            <Link
              href="/artisan/materials/request"
              className="bg-terracotta text-cream hover:bg-terracotta/90 inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold shadow-lg transition-all"
            >
              <PlusCircle className="h-5 w-5" />
              Request Material
            </Link>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
