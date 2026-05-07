'use client'

type CheckoutOptionCardProps = {
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}

export function CheckoutOptionCard({
  label,
  description,
  selected,
  onSelect,
}: CheckoutOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-4 text-left transition ${
        selected ? 'border-forest bg-forest text-cream' : 'border-stone-200 bg-white text-charcoal'
      }`}
    >
      <p className="font-semibold">{label}</p>
      <p className={`mt-1 text-sm leading-relaxed ${selected ? 'text-cream/75' : 'text-stone'}`}>
        {description}
      </p>
    </button>
  )
}
