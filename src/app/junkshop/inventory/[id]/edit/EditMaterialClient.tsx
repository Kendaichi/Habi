'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, ChevronDown, Scale, Package, Trash2 } from 'lucide-react'
import { BottomNav } from '@/components/junkshop/BottomNav'
import { updateMaterial, deleteMaterial } from './actions'

const CATEGORIES = ['Plastic', 'Metal', 'Bamboo', 'Textile', 'Glass']

type MaterialData = {
  id: string
  type: string
  quantityKg: number
  pricePerKg: number
  available: boolean
}

export function EditMaterialClient({ material }: { material: MaterialData }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [available, setAvailable] = useState(material.available)

  async function handleUpdate(formData: FormData) {
    setPending(true)
    formData.set('available', String(available))
    await updateMaterial(formData)
  }

  async function handleDelete() {
    if (!window.confirm('Delete this material? This cannot be undone.')) return
    setDeleting(true)
    const formData = new FormData()
    formData.set('id', material.id)
    await deleteMaterial(formData)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fdf9f3]">
      <header className="bg-cream sticky top-0 z-50 flex w-full items-center justify-between border-b border-stone-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-stone-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-stone-600" />
          </button>
          <h1 className="text-forest font-['Noto_Serif'] text-lg font-bold">Edit Material</h1>
        </div>
        <button aria-label="Notifications">
          <Bell className="text-forest h-5 w-5" strokeWidth={1.75} />
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8 pb-32">
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(44,44,44,0.08)] md:p-8">
          <div
            className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full"
            style={{
              backgroundImage: 'radial-gradient(#8B8680 0.5px, transparent 0.5px)',
              backgroundSize: '16px 16px',
              opacity: 0.1,
            }}
          />

          <form className="relative z-10 space-y-8" action={handleUpdate}>
            <input type="hidden" name="id" value={material.id} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block font-['Inter'] text-[12px] font-bold tracking-widest text-stone-500 uppercase">
                  Material Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    required
                    defaultValue={material.type}
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
                    defaultValue={material.quantityKg}
                    className="w-full rounded-xl border border-stone-200 bg-[#fdf9f3] px-4 py-3 pr-12 font-['Inter'] text-base text-[#1c1c18] transition-all outline-none focus:border-[#00452a] focus:ring-2 focus:ring-[#00452a]"
                  />
                  <Scale className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
                </div>
              </div>
            </div>

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
                  defaultValue={material.pricePerKg}
                  className="w-full rounded-xl border border-stone-200 bg-[#fdf9f3] py-3 pr-4 pl-8 font-['Inter'] text-base text-[#1c1c18] transition-all outline-none focus:border-[#00452a] focus:ring-2 focus:ring-[#00452a]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block font-['Inter'] text-[12px] font-bold tracking-widest text-stone-500 uppercase">
                Availability
              </label>
              <div className="flex gap-3">
                {([true, false] as const).map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setAvailable(val)}
                    className={`flex-1 rounded-xl border py-3 font-['Inter'] text-base shadow-sm transition-all ${
                      available === val
                        ? 'border-forest bg-forest text-white'
                        : 'border-stone-200 bg-[#f7f3ed] text-[#1c1c18] hover:border-forest/50'
                    }`}
                  >
                    {val ? 'Available' : 'Unavailable'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={pending}
                className="bg-terracotta flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-['Inter'] font-semibold text-white shadow-[0_4px_12px_rgba(200,85,61,0.3)] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              >
                <Package className="h-5 w-5" />
                {pending ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 py-4 font-['Inter'] font-semibold text-red-500 transition-all hover:bg-red-50 active:scale-95 disabled:opacity-60"
          >
            <Trash2 className="h-5 w-5" />
            {deleting ? 'Deleting…' : 'Delete Material'}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
