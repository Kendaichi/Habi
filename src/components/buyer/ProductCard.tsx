import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  images: string[]
  materialType: string
  price: number
  artisanName: string
}

export function ProductCard({ id, name, images, materialType, price, artisanName }: ProductCardProps) {
  return (
    <Link href={`/buyer/product/${id}`} className="block rounded-2xl overflow-hidden bg-card border border-border hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-muted">
        {images[0] ? (
          <Image src={images[0]} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-stone text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[10px] font-semibold text-stone uppercase tracking-widest">{materialType}</p>
        <h3 className="font-heading font-semibold text-charcoal mt-0.5 text-sm leading-snug">{name}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">by {artisanName}</p>
        <p className="text-forest font-bold mt-2 text-base">₱{price.toLocaleString()}</p>
      </div>
    </Link>
  )
}
