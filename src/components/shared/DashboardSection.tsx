import type { ReactNode } from "react"

interface DashboardSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function DashboardSection({ title, children, className }: DashboardSectionProps) {
  return (
    <section className={className}>
      <h2 className="font-heading text-base font-bold text-charcoal mb-3">{title}</h2>
      {children}
    </section>
  )
}
