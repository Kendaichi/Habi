'use client'

import { useState, useTransition } from 'react'
import { ArrowLeft, ChevronDown, Upload, Info, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/artisan/BottomNav'
import { uploadFile } from '@/lib/storage'
import { submitMaterialRequest } from './actions'

const BUCKET = 'material-requests'

const MATERIAL_TYPES = [
  { value: 'abaca', label: 'Abaca Fiber' },
  { value: 'bamboo', label: 'Bamboo Strips' },
  { value: 'plastic', label: 'Recycled Plastic' },
  { value: 'rattan', label: 'Rattan Wicker' },
  { value: 'metal', label: 'Scrap Metal' },
  { value: 'textile', label: 'Textile / Fabric' },
  { value: 'dyes', label: 'Natural Dyes & Pigments' },
]

export default function RequestMaterialPage() {
  const [form, setForm] = useState({
    materialType: '',
    quantity: '',
    dateNeeded: '',
    description: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)

    const photoUrl = file ? (await uploadFile(file, BUCKET)) ?? undefined : undefined

    setUploading(false)
    startTransition(() =>
      submitMaterialRequest({
        materialType: form.materialType,
        quantityKg: parseFloat(form.quantity),
        dateNeeded: form.dateNeeded,
        description: form.description,
        photoUrl,
      })
    )
  }

  return (
    <div className="bg-cream min-h-screen pb-28">
      {/* Header */}
      <header className="border-border bg-cream/90 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-5 backdrop-blur-sm">
        <Link href="/artisan/materials" className="text-forest hover:bg-forest/10 rounded-full p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-heading text-forest text-base font-bold">Request Material</span>
        <div className="w-9" />
      </header>

      <div className="mx-auto max-w-2xl px-5 pt-6 sm:px-6">
        {/* Hero text */}
        <section className="mb-8">
          <h1 className="font-heading text-forest mb-2 text-3xl leading-tight font-bold">
            Can&apos;t find a material?
          </h1>
          <p className="text-stone text-sm leading-relaxed">
            Our weaving hubs across the islands are rich with undocumented surplus and rare natural
            fibers. If your specific workshop needs something unique, we&apos;re here to bridge the
            gap.
          </p>
        </section>

        {/* Inspiration image */}
        <div className="relative mb-8 aspect-4/3 overflow-hidden rounded-3xl shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoH4q4QR2wJuDZNIHlBrFtN0MQL_F8FhbfZ3oyMVkNwQDOob9vc-oaDu3Hg8hdrfI85IPEIr8SWBfIlaKBPakmxleGk-OzRGPkuC7T4gHIllEImLLUODU805CJGuO5Avxzdcm7eylnHjths-hjQ_UTmJ1ONHmkj9S9u0mAFimi-rjfUNl7go08lSCGPPV9fD76w5uWZCTBKhYe-NyUvnVoT0cwlbwwvZ2H_SsljOGKtcGexGw4q49KjWHZvbKDobnW9Wkrl7snm6QF"
            alt="Raw material inspiration"
            className="h-full w-full object-cover"
          />
          <div className="from-forest/40 absolute inset-0 bg-linear-to-t to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
              Sourcing Tip
            </span>
            <h3 className="font-heading text-base font-bold">Natural Pigments</h3>
            <p className="text-xs text-white/90">
              Ask for wild indigo or mahogany bark for traditional dyeing.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border-border space-y-6 rounded-3xl border bg-white p-6 shadow-sm"
        >
          {/* Material type */}
          <div>
            <label className="text-stone mb-2 block text-xs font-bold tracking-wider uppercase">
              Material Type
            </label>
            <div className="relative">
              <select
                name="materialType"
                value={form.materialType}
                onChange={handleChange}
                required
                className="border-border bg-muted text-charcoal focus:border-forest focus:ring-forest/20 w-full appearance-none rounded-xl border py-3.5 pr-10 pl-4 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {MATERIAL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="text-stone pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>

          {/* Quantity + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-stone mb-2 block text-xs font-bold tracking-wider uppercase">
                Quantity (kg)
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 5.0"
                step="0.1"
                min="0"
                required
                className="border-border bg-muted text-charcoal focus:border-forest focus:ring-forest/20 w-full rounded-xl border px-4 py-3.5 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-stone mb-2 block text-xs font-bold tracking-wider uppercase">
                Date Needed
              </label>
              <input
                type="date"
                name="dateNeeded"
                value={form.dateNeeded}
                onChange={handleChange}
                required
                className="border-border bg-muted text-charcoal focus:border-forest focus:ring-forest/20 w-full rounded-xl border px-4 py-3.5 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-stone mb-2 block text-xs font-bold tracking-wider uppercase">
              Intended Use
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="How will this material be woven or utilized?"
              rows={4}
              className="border-border bg-muted text-charcoal focus:border-forest focus:ring-forest/20 w-full resize-none rounded-xl border px-4 py-3.5 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          {/* File upload */}
          <div>
            <label className="text-stone mb-2 block text-xs font-bold tracking-wider uppercase">
              Reference Photo
            </label>
            <label className="border-border bg-muted/50 hover:border-forest/40 hover:bg-muted flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors">
              <Upload className="text-stone h-7 w-7" />
              <p className="text-stone text-xs font-semibold">
                {file?.name ?? 'Tap to upload texture reference'}
              </p>
              <p className="text-stone/70 text-[10px]">PNG, JPG up to 10MB</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
            </label>
          </div>

          {/* Info banner */}
          <div className="bg-mustard/10 flex items-start gap-3 rounded-2xl p-4">
            <Info className="text-mustard mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-charcoal text-xs leading-relaxed">
              We&apos;ll broadcast your request to all nearby Hubs and notify you when a match is
              found.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading || isPending}
            className="bg-forest text-cream shadow-forest/20 hover:bg-forest/90 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : isPending ? (
              'Sending…'
            ) : (
              <>
                Broadcast Request
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
