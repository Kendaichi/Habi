'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, ChevronDown, Scale, Package, Camera } from 'lucide-react'
import { BottomNav } from '@/components/junkshop/BottomNav'
import { logMaterial } from './actions'

type Grade = 'Premium' | 'Standard' | 'Utility'

const GRADES: Grade[] = ['Premium', 'Standard', 'Utility']

const CATEGORIES = ['Plastic', 'Metal', 'Bamboo', 'Textile', 'Glass']

export default function LogMaterialPage() {
  const router = useRouter()
  const [grade, setGrade] = useState<Grade>('Premium')
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    await logMaterial(formData)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fdf9f3]">
      {/* TopAppBar */}
      <header className="bg-cream sticky top-0 z-50 flex w-full items-center justify-between border-b border-stone-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-stone-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-stone-600" />
          </button>
          <h1 className="text-forest font-['Noto_Serif'] text-lg font-bold">Log Material</h1>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Notifications">
            <Bell className="text-forest h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8 pb-32">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="bg-forest/10 mb-3 inline-block rounded-full px-4 py-1">
            <span className="font-['Inter'] text-[12px] font-bold tracking-widest text-[#00452a] uppercase">
              Inventory Management
            </span>
          </div>
          <h2 className="mb-2 font-['Noto_Serif'] text-[32px] leading-tight font-semibold text-[#1c1c18]">
            Sorted for the Circular Economy
          </h2>
          <p className="mx-auto max-w-md font-['Inter'] text-base text-[#404942]">
            Your contributions help Mindanao&apos;s artisans turn waste into heritage-quality
            crafts.
          </p>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(44,44,44,0.08)] md:p-8">
          {/* Banig accent */}
          <div
            className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full"
            style={{
              backgroundImage: 'radial-gradient(#8B8680 0.5px, transparent 0.5px)',
              backgroundSize: '16px 16px',
              opacity: 0.1,
            }}
          />

          <form className="relative z-10 space-y-8" action={handleSubmit}>
            {/* Category + Weight */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block font-['Inter'] text-[12px] font-bold tracking-widest text-stone-500 uppercase">
                  Material Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    required
                    className="w-full appearance-none rounded-xl border border-stone-200 bg-[#fdf9f3] px-4 py-3 font-['Inter'] text-base text-[#1c1c18] transition-all outline-none focus:border-[#00452a] focus:ring-2 focus:ring-[#00452a]"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-['Inter'] text-[12px] font-bold tracking-widest text-stone-500 uppercase">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="weight"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full rounded-xl border border-stone-200 bg-[#fdf9f3] px-4 py-3 pr-12 font-['Inter'] text-base text-[#1c1c18] transition-all outline-none focus:border-[#00452a] focus:ring-2 focus:ring-[#00452a]"
                  />
                  <Scale className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>
            </div>

            {/* Price per kg */}
            <div className="space-y-2">
              <label className="block font-['Inter'] text-[12px] font-bold tracking-widest text-stone-500 uppercase">
                Price per kg (₱)
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 font-['Inter'] text-stone-400">
                  ₱
                </span>
                <input
                  type="number"
                  name="pricePerKg"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full rounded-xl border border-stone-200 bg-[#fdf9f3] py-3 pr-4 pl-8 font-['Inter'] text-base text-[#1c1c18] transition-all outline-none focus:border-[#00452a] focus:ring-2 focus:ring-[#00452a]"
                />
              </div>
            </div>

            {/* Quality Grade (UI only — not persisted) */}
            <div className="space-y-3">
              <label className="block font-['Inter'] text-[12px] font-bold tracking-widest text-stone-500 uppercase">
                Quality Grade
              </label>
              <div className="flex flex-wrap gap-3">
                {GRADES.map((g) => (
                  <label key={g} className="group relative min-w-25 flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="grade"
                      className="sr-only"
                      value={g}
                      checked={grade === g}
                      onChange={() => setGrade(g)}
                    />
                    <div
                      className={`w-full rounded-xl border py-3 text-center font-['Inter'] text-base shadow-sm transition-all ${
                        grade === g
                          ? 'border-forest bg-forest text-white'
                          : 'group-hover:border-forest/50 border-stone-200 bg-[#f7f3ed] text-[#1c1c18]'
                      }`}
                    >
                      {g}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-[12px] text-stone-400 italic">
                Premium materials are prioritized for Mindanao Artisan Guilds.
              </p>
            </div>

            {/* Photo Upload (UI only) */}
            <div className="space-y-2">
              <label className="block font-['Inter'] text-[12px] font-bold tracking-widest text-stone-500 uppercase">
                Visual Verification
              </label>
              <div className="hover:border-forest/40 hover:bg-forest/5 flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-6 text-center transition-all">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <Camera className="text-forest h-8 w-8" strokeWidth={1.5} />
                </div>
                <h4 className="font-['Inter'] font-semibold text-[#1c1c18]">Upload Material Pile</h4>
                <p className="mt-1 text-sm text-stone-500">
                  Snap a clear photo of the sorted items for quality assurance.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={pending}
                className="bg-terracotta flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-['Inter'] font-semibold text-white shadow-[0_4px_12px_rgba(200,85,61,0.3)] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              >
                <Package className="h-5 w-5" />
                {pending ? 'Saving…' : 'Save & List'}
              </button>
              <p className="mt-4 text-center text-[13px] text-stone-400">
                By listing, you agree to the Habi Circular Stewardship Guidelines.
              </p>
            </div>
          </form>
        </div>

        {/* Traceability Bento */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-stone-200/50 bg-[#ebe8e2] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#00452a]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <h5 className="font-['Inter'] font-bold text-[#00452a]">Trust Score Impact</h5>
              <p className="text-sm text-[#404942]">
                Your sorted listing increases your junk shop&apos;s reliability rating by +5.
              </p>
            </div>
          </div>

          <div className="bg-forest flex items-center gap-4 rounded-2xl p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <svg className="h-6 w-6 text-[#aef1c8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <div>
              <h5 className="font-['Inter'] font-bold text-white">Logistics Priority</h5>
              <p className="text-sm text-white/80">
                Premium grade materials qualify for 24-hour artisan pickup.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
