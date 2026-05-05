import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string
  subtext: string
  subtextIcon?: ReactNode
  subtextClassName?: string
}

export function StatCard({ label, value, subtext, subtextIcon, subtextClassName = "text-stone" }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-heading text-2xl font-bold text-charcoal mt-1">{value}</p>
      <div className={`flex items-center gap-1 mt-2 text-xs ${subtextClassName}`}>
        {subtextIcon}
        <span>{subtext}</span>
      </div>
    </div>
  )
}
