'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Camera, Image as ImageIcon, Sun, ZoomIn, Layers, Info, ArrowRight, Loader2 } from 'lucide-react'
import { TopNav } from '@/components/artisan/TopNav'
import { BottomNav } from '@/components/artisan/BottomNav'
import { supabase } from '@/lib/supabase'
import { saveDraft } from './draft'

const BUCKET = 'product-images'

const tips = [
  {
    icon: Sun,
    title: 'Natural Lighting',
    desc: 'Soft, indirect sunlight near a window brings out the true texture of woven fabrics.',
  },
  {
    icon: ZoomIn,
    title: 'Show the Details',
    desc: 'Take close-up shots of the weave patterns or stitching to highlight quality.',
  },
  {
    icon: Layers,
    title: 'Clean Backgrounds',
    desc: 'Use a neutral surface like wood or plain linen to let your work shine.',
  },
]

export default function NewListingStep1Page() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const remaining = 6 - files.length
    const newFiles = Array.from(fileList).slice(0, remaining)
    setFiles((prev) => [...prev, ...newFiles].slice(0, 6))
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))].slice(0, 6))
  }

  const handleNext = async () => {
    if (files.length === 0) {
      saveDraft({ images: [] })
      router.push('/artisan/list/new/materials')
      return
    }

    setUploading(true)
    const urls: string[] = []

    try {
      for (const file of files) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `pending/${crypto.randomUUID()}.${ext}`
        const { error } = await supabase.storage.from(BUCKET).upload(path, file)
        if (error) {
          console.error('Upload error:', error)
          continue
        }
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
        urls.push(data.publicUrl)
      }

      saveDraft({ images: urls })
      router.push('/artisan/list/new/materials')
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-cream min-h-screen">
      <TopNav />

      <div className="space-y-6 px-5 pt-6 pb-32">
        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-stone text-xs font-medium uppercase tracking-widest">
              Step 1 of 5
            </span>
            <span className="text-forest text-xs font-semibold">20% Complete</span>
          </div>
          <div className="bg-border h-1.5 overflow-hidden rounded-full">
            <div className="bg-forest h-full w-1/5 rounded-full transition-all duration-700" />
          </div>
        </div>

        <div>
          <h1 className="font-heading text-charcoal text-2xl font-bold">Capture your craft</h1>
          <p className="text-stone mt-1 text-sm">Upload high-quality photos to showcase your artisanal work.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Upload Zone */}
          <div className="lg:col-span-7">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleFiles(e.dataTransfer.files)
              }}
              className="border-border bg-muted group relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all hover:bg-stone/10"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="p-6 text-center">
                <div className="bg-forest/10 group-hover:bg-forest/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                  <Camera className="text-forest h-7 w-7" />
                </div>
                <p className="font-heading text-charcoal text-lg font-semibold">
                  Upload product photos
                </p>
                <p className="text-stone mt-1 text-sm">Drag and drop or click to browse</p>
                <span className="border-border mt-5 inline-block rounded-full border bg-white px-5 py-2 text-sm font-semibold text-forest shadow-sm">
                  Select Files
                </span>
              </div>
              <div className="absolute right-4 bottom-4">
                <span className="bg-cream/80 text-stone rounded-full px-3 py-1 text-xs backdrop-blur-sm">
                  Add up to 6 photos
                </span>
              </div>
            </div>

            {/* Preview slots */}
            <div className="mt-4 grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                className="border-border bg-muted flex aspect-square items-center justify-center overflow-hidden rounded-xl border"
              >
                {previews[i] ? (
                  <Image
                    src={previews[i]}
                    alt={`Photo ${i + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="text-stone/40 h-5 w-5" />
                )}
              </div>
            ))}
            </div>
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-4 lg:col-span-5">
            <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
              <h2 className="font-heading text-charcoal mb-4 text-base font-bold">
                Tips for Artisan Photos
              </h2>
              <ul className="space-y-4">
                {tips.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-3">
                    <div className="bg-forest/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                      <Icon className="text-forest h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-charcoal text-sm font-semibold">{title}</p>
                      <p className="text-stone mt-0.5 text-xs leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-forest/5 border-forest/20 flex items-start gap-3 rounded-2xl border p-4">
              <Info className="text-forest mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-stone text-xs leading-relaxed">
                Photos must be JPG or PNG and under 5MB. You can always edit or replace these later.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button className="text-stone text-sm font-medium transition-colors hover:text-charcoal">
            Save for Later
          </button>
          <button
            onClick={handleNext}
            disabled={uploading}
            className="bg-forest text-cream flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
