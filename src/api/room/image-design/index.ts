import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@/generated/prisma/enums'
import { requireRole } from '@/lib/auth'
import type { Handler } from '@/types/server'

export type DesignMode = 'redesign' | 'preview'

export type ImageDesignJob = {
  jobId: string
  mode: DesignMode
  listingId?: string
  sourceImageUrl: string
  generatedImageUrl: string
  listingImageUrl?: string
  isMock: boolean
}

const jobStore = new Map<string, ImageDesignJob>()

export function getImageDesignJob(jobId: string): ImageDesignJob | null {
  return jobStore.get(jobId) ?? null
}

function buildPrompt(
  mode: DesignMode,
  opts: { productName?: string; materialType?: string },
): string {
  if (mode === 'preview') {
    const item = opts.productName ?? 'an artisan piece'
    const material = opts.materialType ? ` made from ${opts.materialType}` : ''
    return (
      `Place the ${item}${material} naturally into this room. ` +
      `Maintain the room's existing layout, lighting, and perspective. ` +
      `Photorealistic, seamless integration, editorial interior design quality.`
    )
  }
  return (
    `Redesign this Filipino sala with artisan-crafted sustainable furniture. ` +
    `Add bamboo accents, woven rattan, upcycled wood pieces, indoor plants. ` +
    `Warm earthy palette, natural light, photorealistic interior design quality.`
  )
}

async function callSiliconflow(opts: {
  prompt: string
  roomImageUrl?: string
  listingImageUrl?: string
  mode: DesignMode
}): Promise<string> {
  const apiKey = process.env.SILICONFLOW_API_KEY
  if (!apiKey) throw new Error('SILICONFLOW_API_KEY is not set')

  // Preview mode: pass room photo + product photo as image inputs (image-to-image)
  // Redesign mode: text-to-image only
  const body: Record<string, unknown> = {
    model: process.env.SILICONFLOW_MODEL ?? 'black-forest-labs/FLUX.1-dev',
    prompt: opts.prompt,
    image_size: '1024x1024',
  }

  if (opts.mode === 'preview' && opts.roomImageUrl) {
    body.image = opts.roomImageUrl
    if (opts.listingImageUrl) body.image2 = opts.listingImageUrl
  }

  const res = await fetch('https://api.siliconflow.cn/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`SiliconFlow API error ${res.status}: ${text}`)
  }

  const data = (await res.json()) as { images: { url: string }[] }
  const url = data.images?.[0]?.url
  if (!url) throw new Error('No image URL in SiliconFlow response')
  return url
}

export const POST: Handler = async (req: NextRequest) => {
  try {
    await requireRole(Role.BUYER)
    const body = (await req.json()) as {
      roomImageUrl?: string
      listingId?: string
      listingImageUrl?: string
      productName?: string
      materialType?: string
      mode?: DesignMode
    }

    if (!body.roomImageUrl) {
      return NextResponse.json({ error: 'roomImageUrl is required' }, { status: 400 })
    }
    if (!body.mode) {
      return NextResponse.json({ error: 'mode is required' }, { status: 400 })
    }

    const jobId = `img-${crypto.randomUUID().slice(0, 8)}`
    const isMock = !process.env.SILICONFLOW_API_KEY

    let generatedImageUrl = body.listingImageUrl ?? body.roomImageUrl

    if (!isMock) {
      const prompt = buildPrompt(body.mode, {
        productName: body.productName,
        materialType: body.materialType,
      })
      generatedImageUrl = await callSiliconflow({
        prompt,
        roomImageUrl: body.roomImageUrl,
        listingImageUrl: body.listingImageUrl,
        mode: body.mode,
      })
    }

    const job: ImageDesignJob = {
      jobId,
      mode: body.mode,
      listingId: body.listingId,
      sourceImageUrl: body.roomImageUrl,
      generatedImageUrl,
      listingImageUrl: body.listingImageUrl,
      isMock,
    }

    jobStore.set(jobId, job)
    return NextResponse.json(job, { status: 200 })
  } catch (error) {
    console.error('POST /api/room/image-design failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const GET: Handler = async (req: NextRequest) => {
  try {
    const jobId = req.nextUrl.searchParams.get('id')
    if (!jobId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    const job = jobStore.get(jobId)
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }
    return NextResponse.json(job, { status: 200 })
  } catch (error) {
    console.error('GET /api/room/image-design failed', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
