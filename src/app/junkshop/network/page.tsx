import { MapPin, Heart, Leaf } from 'lucide-react'
import { TopNav } from '@/components/junkshop/TopNav'
import { BottomNav } from '@/components/junkshop/BottomNav'

const artisans = [
  {
    name: 'Maria Santos',
    specialty: 'Master Weaver',
    distance: '2.4km',
    materials: ['Plastic Bottles', 'Natural Rattan'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACqCl-UpMTfUiJ5UeP0zoaZ8eGS5eVY8pib3Ji1N8DsNmXA4q5BhbFveof4O7jJ7kcjx6j6ZgTyKkFO31OoLv4aVWVlYB9kpU-SYNaf3rZOWwYRtIogR708Xsqbfpqu9SC5rG6V50qti43qZXfv0mroUF_S_TnSWmfDI-3wEXE78oZZvxSVS1y5m94UdgDroFSOXdmDI-ahxTQ6Ph0zwhZYmdCV-WjKbg4HeyBP02MShxyZEPYNFN6F9L5NnZooKLo1t4k7uXaJjBX',
  },
  {
    name: 'Juan Dela Cruz',
    specialty: 'Metal Sculptor',
    distance: '0.8km',
    materials: ['Scrap Steel', 'Aluminum Cans'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCdFaAfgGGb9LlgOubuR3cMyGXWeJBdksNTf3fN4jlhzOF58hJm6jyPFGleQ7GgAQriRufdE9PGkwxvfD_ZVVVPJxW6frAxIhovia2PS0w9TTVvLeeEG4-_YoWLpLnYrbAf_0iY-q5ndGADEryvPOl14_2XGYC5VY8pL6cBcNdiZH4X2ddbZVsQ-lvTls_27-kqZoaDqsK08hZi6NBllrTAnvhvzdFvvVHBBq33mi4Ki8bs1a0yKxwCoCTPIWwdhqLIQ9ok0rwx3uLq',
  },
  {
    name: 'Elena Garcia',
    specialty: 'Textile Artist',
    distance: '3.2km',
    materials: ['Denim Scraps', 'Cotton Waste'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDtRkoH2fg_wqkyWKmTAT9iTyP8j3g7wEYLV-AaWVj9lawDxir3QlXudtlFWb96bOM2i5QcOsVlCEPKdSHGIXyVtZP2NWHictagu3plYeztv_liqrzv9QdxhzVI3UZErjoR-OpLtWtesLjRDfy4qbnbnVLT9yo8ygN1RSvfMOpH0gVEsmsZ3d4Ml2dS61huvmRKLVyEpR9DkQqbhXv3kawU13tMK4u2hhGIj2v8qFfD6Sys8Pxy0XrhIHIlR8ed0BM97UFxF3mv9lHV',
  },
]

export default function JunkshopNetworkPage() {
  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <main className="mx-auto max-w-3xl px-4 py-8 pb-28">
        {/* Hero / Map Preview */}
        <section className="mb-12">
          <div className="relative h-62.5 overflow-hidden rounded-3xl shadow-lg md:h-87.5">
            <img
              alt="Artisan map view"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida/ADBb0ugBStm_rJt0KSX4DxrhzNZFJEONJ5uFbkBB-H-L4zsFoYO9x7nM50JCKwz6bvtw1y7qwMPR0ZkI5A01r4yjTjDKcYxX2_hAE-ehjTXzxogZull6S1EFargFVb9qLW_rZWArT4_TXBN-ASTW6A0j__aAed34Q5aJsTZhAntwdHEZoMKIsZhimBfvDVDiMIWX9Gx0K0oH_G5DEOyHo3dqZVGYkQw2ZUnkEuhc7MDoFLBzT2vUtOjspuZ9WIwOmvBGUYbF78l8s4uN8NM"
            />
            <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-8">
              <div>
                <h2 className="mb-2 font-['Noto_Serif'] text-3xl font-bold text-white">
                  Artisans Near You
                </h2>
                <p className="text-white/90">
                  Discover 12 master crafters within 5km of your junk shop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Banig Divider */}
        <div
          className="mb-12 h-2 rounded-full opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #1b5e3f 0, #1b5e3f 2px, transparent 2px, transparent 4px)',
          }}
        />

        {/* Artisan Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artisans.map((artisan) => (
            <div
              key={artisan.name}
              className="flex flex-col rounded-[20px] border border-stone-100 bg-white p-6 shadow-[0px_4px_20px_rgba(44,44,44,0.08)] transition-shadow hover:shadow-[0px_8px_30px_rgba(44,44,44,0.12)]"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl shadow-sm">
                    <img
                      alt={artisan.name}
                      className="h-full w-full object-cover"
                      src={artisan.image}
                    />
                  </div>
                  <div>
                    <h3 className="text-charcoal font-['Noto_Serif'] text-xl font-semibold">
                      {artisan.name}
                    </h3>
                    <p className="text-forest text-sm font-medium">{artisan.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-stone-50 px-3 py-1 text-sm text-stone-600">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{artisan.distance}</span>
                </div>
              </div>

              <div className="mb-6 grow">
                <p className="mb-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                  Top Materials Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {artisan.materials.map((mat) => (
                    <span
                      key={mat}
                      className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-stone-100 pt-4">
                <button className="bg-terracotta flex-1 rounded-xl py-3 font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]">
                  Contact {artisan.name.split(' ')[0]}
                </button>
                <button className="border-forest text-forest hover:bg-forest/5 rounded-xl border-2 p-3 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Stats Bento */}
        <section className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-forest flex flex-col justify-between rounded-[32px] p-8 text-white md:col-span-2">
            <div>
              <h4 className="mb-4 font-['Noto_Serif'] text-xl font-semibold">
                The Circular Advantage
              </h4>
              <p className="max-w-lg opacity-90">
                By connecting directly with artisans, your junk shop becomes a vital hub in the
                creative economy. Turn waste into high-value raw material.
              </p>
            </div>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="font-['Space_Grotesk'] text-3xl font-semibold">420kg</p>
                <p className="text-sm opacity-70">Waste Diverted</p>
              </div>
              <div>
                <p className="font-['Space_Grotesk'] text-3xl font-semibold">15</p>
                <p className="text-sm opacity-70">Active Artisans</p>
              </div>
            </div>
          </div>
          <div className="bg-terracotta/15 flex flex-col items-center justify-center rounded-[32px] p-8 text-center">
            <Leaf className="text-terracotta mb-4 h-12 w-12" fill="currentColor" strokeWidth={1} />
            <p className="text-charcoal mb-2 font-['Noto_Serif'] text-xl font-semibold">
              Sustainability Badge
            </p>
            <p className="text-stone text-sm">You are a Gold Tier Waste Supplier this month.</p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
