'use client'

import { useRef, useState } from 'react'
import { Check, ImagePlus } from 'lucide-react'

const materials = ['Reclaimed Plastic', 'Bamboo', 'Scrap Metal', 'Abaca Fiber']

export function CustomRequestForm() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [budget, setBudget] = useState(12000)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Bamboo'])
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function toggleMaterial(material: string) {
    setSelectedMaterials((current) =>
      current.includes(material)
        ? current.filter((item) => item !== material)
        : [...current, material],
    )
  }

  if (submitted) {
    return (
      <section className="rounded-lg border border-forest/15 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-cream">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="font-heading mt-5 text-4xl font-semibold text-charcoal">Request Sent</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          Your room brief is ready for artisan bids. This prototype keeps the request local for v1.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-lg bg-terracotta px-5 py-3 text-sm font-semibold text-cream"
        >
          Edit Request
        </button>
      </section>
    )
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-forest text-xs font-semibold uppercase tracking-[0.22em]">Process</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-charcoal">
          {['Submit', 'Bids', 'Build'].map((step, index) => (
            <div key={step} className="rounded-lg bg-cream px-2 py-3">
              <span className="text-terracotta">0{index + 1}</span>
              <p className="mt-1">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="font-heading text-2xl font-semibold text-charcoal">Room Reference</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 flex w-full items-center gap-3 rounded-lg border-2 border-dashed border-forest/25 bg-cream p-4 text-left"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-forest text-cream">
            <ImagePlus className="h-6 w-6" />
          </span>
          <span>
            <span className="block font-semibold text-charcoal">
              {photoName ?? 'Upload a room photo'}
            </span>
            <span className="text-sm text-stone">Give artisans scale, color, and lighting cues.</span>
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? null)}
        />
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <label className="font-heading text-2xl font-semibold text-charcoal" htmlFor="budget">
          Budget Range
        </label>
        <p className="mt-2 text-3xl font-bold text-forest">PHP {budget.toLocaleString('en-PH')}</p>
        <input
          id="budget"
          type="range"
          min="3000"
          max="50000"
          step="1000"
          value={budget}
          onChange={(event) => setBudget(Number(event.target.value))}
          className="mt-4 w-full accent-terracotta"
        />
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="font-heading text-2xl font-semibold text-charcoal">Material Preferences</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {materials.map((material) => {
            const selected = selectedMaterials.includes(material)
            return (
              <button
                key={material}
                type="button"
                onClick={() => toggleMaterial(material)}
                className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                  selected
                    ? 'border-forest bg-forest text-cream'
                    : 'border-stone-200 bg-cream text-charcoal'
                }`}
              >
                {material}
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <label className="font-heading text-2xl font-semibold text-charcoal" htmlFor="notes">
          Design Notes
        </label>
        <textarea
          id="notes"
          rows={5}
          className="mt-4 w-full rounded-lg border border-stone-200 bg-cream px-4 py-3 text-sm text-charcoal outline-none focus:border-forest"
          placeholder="Describe the piece, room dimensions, style, and any materials you want to avoid."
        />
      </section>

      <button
        type="submit"
        className="w-full rounded-lg bg-terracotta px-5 py-4 text-base font-semibold text-cream shadow-[0_16px_36px_rgba(200,85,61,0.22)]"
      >
        Submit Custom Request
      </button>
    </form>
  )
}
