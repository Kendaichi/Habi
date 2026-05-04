import { Package, Clock } from "lucide-react"

type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"

interface OrderCardProps {
  id: string
  productName: string
  status: OrderStatus
  price: number
  createdAt: Date | string
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "text-mustard",
  CONFIRMED: "text-forest",
  SHIPPED: "text-blue-500",
  DELIVERED: "text-forest",
  CANCELLED: "text-destructive",
}

export function OrderCard({ productName, status, price, createdAt }: OrderCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
      <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
        <Package className="w-5 h-5 text-forest" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-charcoal truncate text-sm">{productName}</p>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />
          {new Date(createdAt).toLocaleDateString("en-PH", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-charcoal text-sm">₱{price.toLocaleString()}</p>
        <p className={`text-[11px] font-semibold ${statusStyles[status]}`}>{status}</p>
      </div>
    </div>
  )
}
