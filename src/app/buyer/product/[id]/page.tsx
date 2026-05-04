export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-cream p-6">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Product Detail</h1>
      <p className="text-stone mt-2 text-sm">Placeholder — product {params.id}</p>
    </div>
  )
}
