import { TrendingUp } from "lucide-react"

interface DemandSignalCardProps {
  keyword: string
  city: string
  count: number
}

export function DemandSignalCard({ keyword, city, count }: DemandSignalCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
      <div className="w-10 h-10 rounded-full bg-mustard/20 flex items-center justify-center shrink-0">
        <TrendingUp className="w-5 h-5 text-mustard" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-charcoal capitalize text-sm truncate">{keyword}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{city}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xl font-bold text-mustard leading-none">{count}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">requests</p>
      </div>
    </div>
  )
}
