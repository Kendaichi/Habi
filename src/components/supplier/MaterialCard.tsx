import { Package2 } from "lucide-react"

interface MaterialCardProps {
  type: string
  quantityKg: number
  pricePerKg: number
  available: boolean
  junkShopName: string
  junkShopCity: string
}

export function MaterialCard({ type, quantityKg, pricePerKg, available, junkShopName, junkShopCity }: MaterialCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border transition-opacity ${
        available ? "border-forest/30 bg-forest/5" : "border-border bg-card opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
          <Package2 className="w-5 h-5 text-forest" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-charcoal text-sm truncate">{type}</p>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                available ? "bg-forest/10 text-forest" : "bg-stone/10 text-stone"
              }`}
            >
              {available ? "Available" : "Out of stock"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {junkShopName} · {junkShopCity}
          </p>
          <div className="flex items-center gap-6 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Qty</p>
              <p className="text-sm font-bold text-charcoal">{quantityKg} kg</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Per kg</p>
              <p className="text-sm font-bold text-terracotta">₱{pricePerKg}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
