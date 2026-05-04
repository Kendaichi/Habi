import { Leaf, Store, Hammer } from "lucide-react"

interface TraceabilityCardProps {
  wasteSupplierName: string
  junkShopName: string
  artisanName: string
}

export function TraceabilityCard({ wasteSupplierName, junkShopName, artisanName }: TraceabilityCardProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 overflow-x-auto">
      <Node icon={<Leaf className="w-4 h-4 text-stone" />} label={wasteSupplierName} sublabel="Waste Source" />
      <Connector />
      <Node icon={<Store className="w-4 h-4 text-forest" />} label={junkShopName} sublabel="Junk Shop" />
      <Connector />
      <Node icon={<Hammer className="w-4 h-4 text-terracotta" />} label={artisanName} sublabel="Artisan" />
    </div>
  )
}

function Node({
  icon,
  label,
  sublabel,
}: {
  icon: React.ReactNode
  label: string
  sublabel: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[72px] max-w-[88px]">
      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">{icon}</div>
      <span className="text-[11px] font-semibold text-charcoal text-center leading-tight line-clamp-2">{label}</span>
      <span className="text-[10px] text-muted-foreground">{sublabel}</span>
    </div>
  )
}

function Connector() {
  return (
    <div className="flex-1 flex items-center min-w-[20px]">
      <div className="h-0.5 flex-1 bg-forest/40 rounded-full relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-forest" />
      </div>
    </div>
  )
}
