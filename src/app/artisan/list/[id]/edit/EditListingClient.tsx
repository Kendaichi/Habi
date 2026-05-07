'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Camera,
  Image as ImageIcon,
  Loader2,
  Leaf,
  Trees,
  Recycle,
  Layers,
  X,
  ShoppingBag,
  CalendarDays,
  History,
  Archive,
  Trash2,
} from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'
import { supabase } from '@/lib/supabase'
import { updateListing, archiveListing, deleteListing } from './actions'
import type { ListingType } from '@/generated/prisma/client'
import type { LucideIcon } from 'lucide-react'

const BUCKET = 'product-images'

interface Material {
  id: string
  name: string
  desc: string
  icon: LucideIcon
  tags: string[]
  bg: string
}

const materials: Material[] = [
  {
    id: 'abaca',
    name: 'Abaca',
    desc: 'Extracted from the leaf-stalks of the Manila hemp plant. Renowned for exceptional strength.',
    icon: Leaf,
    tags: ['Durable', 'Sustainable'],
    bg: 'from-[#C8A882] to-[#9C7A5A]',
  },
  {
    id: 'rattan',
    name: 'Rattan',
    desc: 'Sustainably harvested climbing palms. Provides flexible yet sturdy structure for home items.',
    icon: Trees,
    tags: ['Flexible', 'Artisanal'],
    bg: 'from-[#8FAF8A] to-[#4A7A5A]',
  },
  {
    id: 'recycled-plastic',
    name: 'Recycled Plastic',
    desc: 'Post-consumer waste processed into durable weaving strands. Water-resistant and vibrant.',
    icon: Recycle,
    tags: ['Waterproof', 'Circular'],
    bg: 'from-[#7BAFC7] to-[#4A7A9B]',
  },
  {
    id: 'cotton-inabel',
    name: 'Cotton Inabel',
    desc: 'Traditional hand-woven textile from the Ilocos region. Rich in history and pattern.',
    icon: Layers,
    tags: ['Heritage', 'Premium'],
    bg: 'from-[#BFA9A0] to-[#8A6E65]',
  },
]

const MATERIAL_NAME_TO_ID: Record<string, string> = {
  Abaca: 'abaca',
  Rattan: 'rattan',
  'Recycled Plastic': 'recycled-plastic',
  'Cotton Inabel': 'cotton-inabel',
}

const listingTypeOptions = [
  {
    id: 'sale',
    dbType: 'SALE' as ListingType,
    icon: ShoppingBag,
    activeIconBg: 'bg-forest',
    activeIconText: 'text-cream',
    title: 'Direct Sale',
    desc: 'Transfer ownership permanently. Ideal for unique, high-demand artisanal pieces.',
  },
  {
    id: 'rent',
    dbType: 'RENT' as ListingType,
    icon: CalendarDays,
    activeIconBg: 'bg-terracotta',
    activeIconText: 'text-cream',
    title: 'Short-term Rent',
    desc: 'Earn recurring income and manage returns. Perfect for circular consumption of occasion wear or decor.',
  },
  {
    id: 'lease',
    dbType: 'LEASE' as ListingType,
    icon: History,
    activeIconBg: 'bg-mustard',
    activeIconText: 'text-charcoal',
    title: 'Long-term Lease',
    desc: 'Fixed monthly income with tiered maintenance. Best for furniture or high-value equipment.',
  },
]

interface Props {
  listingId: string
  name: string
  description: string
  materialType: string
  images: string[]
  listings: { id: string; type: ListingType; price: number }[]
}

export function EditListingClient({
  listingId,
  name: initName,
  description: initDesc,
  materialType: initMaterialType,
  images: initImages,
  listings: initListings,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Photos
  const [images, setImages] = useState<string[]>(initImages)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  // Materials
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    initMaterialType
      .split(',')
      .map((s) => MATERIAL_NAME_TO_ID[s.trim()])
      .filter(Boolean),
  )

  // Listing types
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initListings.map((l) => l.type.toLowerCase()),
  )
  const [salePrice, setSalePrice] = useState(
    String(initListings.find((l) => l.type === 'SALE')?.price ?? ''),
  )
  const [dailyRate, setDailyRate] = useState(
    String(initListings.find((l) => l.type === 'RENT')?.price ?? ''),
  )
  const [deposit, setDeposit] = useState('')
  const [monthlyFee, setMonthlyFee] = useState(
    String(initListings.find((l) => l.type === 'LEASE')?.price ?? ''),
  )
  const [leasePeriod, setLeasePeriod] = useState('')

  // Product details
  const [name, setName] = useState(initName)
  const [description, setDescription] = useState(initDesc)

  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const totalImages = images.length + newFiles.length
  const allPreviews = [...images, ...newPreviews]

  function handleAddFiles(fileList: FileList | null) {
    if (!fileList) return
    const remaining = 6 - totalImages
    const added = Array.from(fileList).slice(0, remaining)
    setNewFiles((prev) => [...prev, ...added])
    setNewPreviews((prev) => [...prev, ...added.map((f) => URL.createObjectURL(f))])
  }

  function removeImage(index: number) {
    if (index < images.length) {
      setImages((prev) => prev.filter((_, i) => i !== index))
    } else {
      const newIdx = index - images.length
      setNewFiles((prev) => prev.filter((_, i) => i !== newIdx))
      setNewPreviews((prev) => prev.filter((_, i) => i !== newIdx))
    }
  }

  function toggleMaterial(id: string) {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    )
  }

  function toggleType(id: string) {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    )
  }

  const canSave = name.trim().length > 0 && selectedMaterials.length > 0 && selectedTypes.length > 0

  async function handleSave() {
    if (!canSave) return

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      if (supabase) {
        for (const file of newFiles) {
          const ext = file.name.split('.').pop() ?? 'jpg'
          const path = `pending/${crypto.randomUUID()}.${ext}`
          const { error } = await supabase.storage.from(BUCKET).upload(path, file)
          if (!error) {
            const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
            uploadedUrls.push(data.publicUrl)
          }
        }
      }
    } catch (err) {
      console.error('Upload failed:', err)
      setUploading(false)
      return
    }

    setUploading(false)

    const finalImages = [...images, ...uploadedUrls]
    const materialType = selectedMaterials
      .map((id) => materials.find((m) => m.id === id)?.name ?? id)
      .join(', ')

    const listingsData = selectedTypes.flatMap((t) => {
      if (t === 'sale' && salePrice) return [{ type: 'SALE' as ListingType, price: parseFloat(salePrice) }]
      if (t === 'rent' && dailyRate) return [{ type: 'RENT' as ListingType, price: parseFloat(dailyRate) }]
      if (t === 'lease' && monthlyFee) return [{ type: 'LEASE' as ListingType, price: parseFloat(monthlyFee) }]
      return []
    })

    startTransition(() =>
      updateListing(listingId, { name, description, materialType, images: finalImages, listings: listingsData }),
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-10 px-5 pt-6 pb-32">
        {/* Header */}
        <div>
          <Link
            href="/artisan/list"
            className="text-stone hover:text-charcoal mb-4 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Link>
          <h1 className="font-heading text-charcoal text-2xl font-bold">Edit Listing</h1>
          <p className="text-stone mt-1 text-sm">Update your product details and listing info.</p>
        </div>

        {/* Section 1: Photos */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-charcoal text-lg font-bold">Photos</h2>
            <p className="text-stone mt-0.5 text-sm">Upload high-quality photos to showcase your artisanal work.</p>
          </div>

          {totalImages < 6 && (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleAddFiles(e.dataTransfer.files)
              }}
              className="border-border bg-muted group relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:bg-stone/10"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => handleAddFiles(e.target.files)}
              />
              <div className="p-6 text-center">
                <div className="bg-forest/10 group-hover:bg-forest/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                  <Camera className="text-forest h-7 w-7" />
                </div>
                <p className="font-heading text-charcoal text-lg font-semibold">Add more photos</p>
                <p className="text-stone mt-1 text-sm">Drag and drop or click to browse</p>
                <span className="border-border mt-5 inline-block rounded-full border bg-white px-5 py-2 text-sm font-semibold text-forest shadow-sm">
                  Select Files
                </span>
              </div>
              <div className="absolute right-4 bottom-4">
                <span className="bg-cream/80 text-stone rounded-full px-3 py-1 text-xs backdrop-blur-sm">
                  {totalImages}/6 photos
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-muted relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border"
              >
                {allPreviews[i] ? (
                  <>
                    <Image
                      src={allPreviews[i]}
                      alt={`Photo ${i + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="bg-charcoal/70 hover:bg-charcoal absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="text-stone/40 h-5 w-5" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Materials */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-charcoal text-lg font-bold">Material Selection</h2>
            <p className="text-stone mt-0.5 text-sm">
              Choose the materials used to create your piece. These build your traceability chain.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {materials.map(({ id, name: mName, desc, icon: Icon, tags, bg }) => {
              const isSelected = selectedMaterials.includes(id)
              return (
                <button
                  key={id}
                  onClick={() => toggleMaterial(id)}
                  className={`bg-card overflow-hidden rounded-2xl border text-left shadow-sm transition-all hover:shadow-md ${
                    isSelected ? 'border-forest ring-forest/20 ring-1' : 'border-border'
                  }`}
                >
                  <div className={`relative h-28 w-full bg-linear-to-br ${bg}`}>
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                      }}
                    />
                    <div
                      className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        isSelected ? 'bg-forest text-cream' : 'text-forest bg-white/80'
                      }`}
                    >
                      {isSelected ? '✓' : '+'}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-1 flex items-start justify-between">
                      <h3 className="font-heading text-charcoal text-base font-bold">{mName}</h3>
                      <Icon className="text-forest h-4 w-4 shrink-0" />
                    </div>
                    <p className="text-stone text-xs leading-relaxed">{desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-forest/10 text-forest rounded px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {selectedMaterials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {materials
                .filter((m) => selectedMaterials.includes(m.id))
                .map((m) => (
                  <div
                    key={m.id}
                    className="bg-forest text-cream flex items-center gap-1.5 rounded-full py-1 pr-1.5 pl-3 text-xs font-semibold"
                  >
                    {m.name}
                    <button
                      onClick={() => toggleMaterial(m.id)}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Section 3: Listing Type */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-charcoal text-lg font-bold">Listing Type</h2>
            <p className="text-stone mt-0.5 text-sm">
              Choose how you would like to share your craftsmanship. Select multiple for a circular lifecycle.
            </p>
          </div>

          <div className="space-y-4">
            {listingTypeOptions.map(({ id, icon: Icon, activeIconBg, activeIconText, title, desc }) => {
              const isActive = selectedTypes.includes(id)
              return (
                <div
                  key={id}
                  className={`bg-card overflow-hidden rounded-2xl border-2 shadow-sm transition-all ${
                    isActive ? 'border-forest' : 'border-border'
                  }`}
                >
                  <button
                    onClick={() => toggleType(id)}
                    className="flex w-full items-start gap-4 p-5 text-left"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isActive ? `${activeIconBg} ${activeIconText}` : 'bg-stone/10 text-stone'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading text-charcoal text-base font-bold">{title}</p>
                      <p className="text-stone mt-0.5 text-sm">{desc}</p>
                    </div>
                    {isActive && (
                      <span className="text-forest mt-0.5 shrink-0 text-base font-bold">✓</span>
                    )}
                  </button>

                  {isActive && id === 'sale' && (
                    <div className="border-border border-t px-5 pb-5">
                      <label className="text-forest mb-2 mt-4 block text-[10px] font-bold uppercase tracking-widest">
                        Listing Price (PHP)
                      </label>
                      <div className="border-border flex items-center gap-2 border-b-2 pb-2">
                        <span className="text-stone text-base">₱</span>
                        <input
                          type="number"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          placeholder="0.00"
                          className="text-charcoal flex-1 bg-transparent text-xl font-bold outline-none"
                        />
                      </div>
                      <p className="text-stone mt-3 text-xs">
                        Habi takes a 5% commission on sales to support the local artisan community fund.
                      </p>
                    </div>
                  )}

                  {isActive && id === 'rent' && (
                    <div className="border-border grid grid-cols-2 gap-4 border-t px-5 pb-5">
                      <div className="mt-4">
                        <label className="text-terracotta mb-2 block text-[10px] font-bold uppercase tracking-widest">
                          Daily Rate (PHP)
                        </label>
                        <div className="border-border flex items-center gap-2 border-b-2 pb-2">
                          <span className="text-stone">₱</span>
                          <input
                            type="number"
                            value={dailyRate}
                            onChange={(e) => setDailyRate(e.target.value)}
                            placeholder="0.00"
                            className="text-charcoal flex-1 bg-transparent text-xl font-bold outline-none"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-terracotta mb-2 block text-[10px] font-bold uppercase tracking-widest">
                          Security Deposit
                        </label>
                        <div className="border-border flex items-center gap-2 border-b-2 pb-2">
                          <span className="text-stone">₱</span>
                          <input
                            type="number"
                            value={deposit}
                            onChange={(e) => setDeposit(e.target.value)}
                            placeholder="0.00"
                            className="text-charcoal flex-1 bg-transparent text-xl font-bold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {isActive && id === 'lease' && (
                    <div className="border-border border-t px-5 pb-5">
                      <div className="mt-4">
                        <label className="text-mustard mb-2 block text-[10px] font-bold uppercase tracking-widest">
                          Monthly Fee (PHP)
                        </label>
                        <div className="border-border flex items-center gap-2 border-b-2 pb-2">
                          <span className="text-stone">₱</span>
                          <input
                            type="number"
                            value={monthlyFee}
                            onChange={(e) => setMonthlyFee(e.target.value)}
                            placeholder="0.00"
                            className="text-charcoal flex-1 bg-transparent text-xl font-bold outline-none"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        {['6 Months', '12 Months'].map((p) => (
                          <button
                            key={p}
                            onClick={() => setLeasePeriod(p)}
                            className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                              leasePeriod === p
                                ? 'border-mustard bg-mustard/10 text-charcoal'
                                : 'border-border text-stone hover:border-mustard/50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Section 4: Product Details */}
        <section className="space-y-6">
          <div>
            <h2 className="font-heading text-charcoal text-lg font-bold">Product Details</h2>
            <p className="text-stone mt-0.5 text-sm">Describe the soul of your creation.</p>
          </div>

          <div className="space-y-2">
            <label className="text-charcoal block text-sm font-bold">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Upcycled Rattan Storage Bin"
              className="bg-card border-border focus:border-forest placeholder:text-stone w-full rounded-2xl border-b-2 p-4 text-sm transition-colors outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-charcoal block text-sm font-bold">Product Story</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Once upon a time in a small village..."
              className="bg-card border-border focus:border-forest placeholder:text-stone min-h-40 w-full resize-none rounded-2xl border-b-2 p-4 text-sm transition-colors outline-none"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="border-border flex items-center justify-between border-t pt-6">
          <Link
            href="/artisan/list"
            className="text-stone hover:text-charcoal text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={!canSave || isPending || uploading}
            className="bg-forest text-cream flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            {uploading || isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Danger Zone */}
        <section className="border-border space-y-4 rounded-2xl border border-dashed p-5">
          <div>
            <h2 className="text-charcoal text-sm font-bold">Danger Zone</h2>
            <p className="text-stone mt-0.5 text-xs leading-relaxed">
              These actions are permanent. Archive moves the listing back to draft; delete removes it entirely.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => startTransition(() => archiveListing(listingId))}
              disabled={isPending}
              className="border-border text-stone hover:border-mustard hover:text-mustard flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
            >
              <Archive className="h-4 w-4" />
              Move to Draft
            </button>

            {confirmDelete ? (
              <div className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => {
                    setDeleteError(null)
                    startTransition(async () => {
                      try {
                        await deleteListing(listingId)
                      } catch (err) {
                        setDeleteError(err instanceof Error ? err.message : 'Delete failed.')
                        setConfirmDelete(false)
                      }
                    })
                  }}
                  disabled={isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={isPending}
                  className="border-border text-stone flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-colors hover:text-charcoal disabled:opacity-40"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setDeleteError(null); setConfirmDelete(true) }}
                className="text-red-600 border-red-200 hover:bg-red-50 flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Listing
              </button>
            )}
          </div>

          {deleteError && (
            <p className="text-xs font-medium text-red-600">{deleteError}</p>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
