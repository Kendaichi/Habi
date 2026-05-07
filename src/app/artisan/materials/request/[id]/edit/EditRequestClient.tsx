'use client'

import { useState, useTransition } from 'react'
import { ArrowLeft, ChevronDown, Upload, Info, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/artisan/BottomNav'
import { supabase } from '@/lib/supabase'
import { updateMaterialRequest } from '../../actions'

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

type RequestData = {
  id: string
  materialType: string
  quantityKg: number
  dateNeeded: string
  description: string | null
  photoUrl: string | null
  status: string
}

export function EditRequestClient({ request }: { request: RequestData }) {
  const [form, setForm] = useState({
    materialType: request.materialType,
    quantity: String(request.quantityKg),
    dateNeeded: request.dateNeeded,
    description: request.description ?? '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUploading(true)

    let photoUrl = request.photoUrl ?? undefined

    if (file) {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
        photoUrl = data.publicUrl
      }
    }

    setUploading(false)
    startTransition(() =>
      updateMaterialRequest(request.id, {
        materialType: form.materialType,
        quantityKg: parseFloat(form.quantity),
        dateNeeded: form.dateNeeded,
        description: form.description,
        photoUrl,
      }),
    )
  }

  return (
    <div className="bg-cream min-h-screen pb-28">
      <header className="border-border bg-cream/90 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-5 backdrop-blur-sm">
        <Link
          href="/artisan/materials"
          className="text-forest hover:bg-forest/10 rounded-full p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-heading text-forest text-base font-bold">Edit Request</span>
        <div className="w-9" />
      </header>

      <div className="px-5 pt-6">
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
              rows={4}
              className="border-border bg-muted text-charcoal focus:border-forest focus:ring-forest/20 w-full resize-none rounded-xl border px-4 py-3.5 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          {/* File upload */}
          <div>
            <label className="text-stone mb-2 block text-xs font-bold tracking-wider uppercase">
              Reference Photo
            </label>
            {request.photoUrl && !file && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={request.photoUrl}
                alt="Current reference"
                className="mb-3 h-28 w-full rounded-2xl object-cover"
              />
            )}
            <label className="border-border bg-muted/50 hover:border-forest/40 hover:bg-muted flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors">
              <Upload className="text-stone h-6 w-6" />
              <p className="text-stone text-xs font-semibold">
                {file?.name ?? (request.photoUrl ? 'Replace photo' : 'Tap to upload')}
              </p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {/* Info */}
          <div className="bg-mustard/10 flex items-start gap-3 rounded-2xl p-4">
            <Info className="text-mustard mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-charcoal text-xs leading-relaxed">
              Changes will be broadcast to all nearby Hubs.
            </p>
          </div>

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
              'Saving…'
            ) : (
              <>
                Save Changes
                <Check className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
