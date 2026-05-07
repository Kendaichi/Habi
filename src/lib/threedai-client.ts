import type { ProviderJobStatus, WorldAssetFormat } from '@/types/room'

const DEFAULT_API_URL = 'https://api.3daistudio.com'

export type ThreeDAIModel = 'tripo' | 'trellis2'

export type SubmitThreeDAIRoomRequest = {
  roomId: string
  imageUrl: string
  sourceViews?: string[]
  roomTheme: string
  presetId: string
  notes?: string
  recommendations?: Array<{
    productId?: string
    productName: string
    materialType: string
    primaryImageUrl?: string | null
    imageUrls?: string[]
    reasonTags: string[]
  }>
}

export type SubmitThreeDAIRoomResponse = {
  externalJobId: string
  status: ProviderJobStatus
  providerName: string
  raw?: unknown
}

export type ThreeDAIJobStatusResponse = {
  status: ProviderJobStatus
  progress?: number | null
  errorMessage?: string | null
  raw?: unknown
}

export type ThreeDAIJobResult = {
  worldAssetUrl: string | null
  worldAssetFormat: WorldAssetFormat | null
  previewImageUrl: string | null
  generatedImageUrl: string | null
  raw?: unknown
}

function getApiUrl(): string {
  return (process.env.THREEDAI_API_BASE_URL?.trim() || DEFAULT_API_URL).replace(/\/$/, '')
}

function getApiKey(): string | null {
  const value = process.env.THREEDAI_API_KEY?.trim()
  return value || null
}

export function hasThreeDAIService(): boolean {
  return Boolean(getApiKey())
}

function requireApiKey(): string {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('THREEDAI_API_KEY is not configured')
  }
  return apiKey
}

function getHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${requireApiKey()}`,
    'Content-Type': 'application/json',
  }
}

export function getThreeDAIModel(): ThreeDAIModel {
  const value = process.env.THREEDAI_MODEL?.trim().toLowerCase()
  return value === 'trellis2' ? 'trellis2' : 'tripo'
}

export function getThreeDAIProviderName(): string {
  return getThreeDAIModel() === 'trellis2' ? '3d-ai-studio-trellis2' : '3d-ai-studio-tripo-3.1'
}

export function normalizeThreeDAIStatus(value: unknown): ProviderJobStatus {
  if (typeof value !== 'string') return 'PROCESSING'

  const normalized = value.toUpperCase()
  if (normalized === 'PENDING' || normalized === 'QUEUED') return 'PENDING'
  if (
    normalized === 'PROCESSING' ||
    normalized === 'RUNNING' ||
    normalized === 'IN_PROGRESS' ||
    normalized === 'STARTED'
  ) {
    return 'PROCESSING'
  }
  if (normalized === 'FINISHED' || normalized === 'SUCCEEDED' || normalized === 'SUCCESS') {
    return 'COMPLETED'
  }
  if (normalized === 'FAILED' || normalized === 'ERROR' || normalized === 'CANCELLED') {
    return 'FAILED'
  }

  return 'PROCESSING'
}

function buildNegativePrompt(input: SubmitThreeDAIRoomRequest): string {
  const avoided = [
    'floating furniture',
    'distorted walls',
    'warped floor',
    'changed room layout',
    'new room design',
    'replaced existing furniture',
    'invented windows',
    'different camera angle',
    'hallucinated architecture',
  ]
  if (input.notes?.toLowerCase().includes('minimal')) {
    avoided.push('clutter')
  }
  return avoided.join(', ')
}

function trimSegment(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

export function buildThreeDAIRoomPrompt(input: SubmitThreeDAIRoomRequest): string {
  const productSummary = (input.recommendations ?? [])
    .slice(0, 4)
    .map((recommendation) => {
      const tags = recommendation.reasonTags
        .slice(0, 2)
        .map((tag) => trimSegment(tag, 32))
        .join(', ')
      const detail = tags ? ` (${tags})` : ''
      return `${trimSegment(recommendation.productName, 48)} in ${trimSegment(recommendation.materialType, 24)}${detail}`
    })
    .join('; ')

  const segments = [
    `Generate a furnished 3D room that preserves the uploaded space and supports a ${trimSegment(input.roomTheme, 48)} mood.`,
    productSummary ? `Reference artisan products: ${productSummary}.` : '',
    input.notes ? `Room notes: ${trimSegment(input.notes, 220)}.` : '',
  ].filter(Boolean)

  return trimSegment(segments.join(' '), 900)
}

export function buildThreeDAIRequestMetadata(input: SubmitThreeDAIRoomRequest) {
  const prompt = buildThreeDAIRoomPrompt(input)
  return {
    roomId: input.roomId,
    presetId: input.presetId,
    roomTheme: input.roomTheme,
    prompt,
    originalNotes: input.notes ?? '',
    productContext: (input.recommendations ?? []).slice(0, 4).map((recommendation) => ({
      productId: recommendation.productId,
      productName: recommendation.productName,
      materialType: recommendation.materialType,
      primaryImageUrl: recommendation.primaryImageUrl,
      imageUrls: (recommendation.imageUrls ?? []).slice(0, 1),
      reasonTags: recommendation.reasonTags,
    })),
  }
}

function dataUriToFile(imageUrl: string, filename: string): File {
  const [header, base64] = imageUrl.split(',')
  const mimeType = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const bytes = Buffer.from(base64, 'base64')
  return new File([bytes], filename, { type: mimeType })
}

function buildTripoFormData(input: SubmitThreeDAIRoomRequest): FormData {
  const fd = new FormData()
  if (input.imageUrl.startsWith('http://') || input.imageUrl.startsWith('https://')) {
    fd.append('image_url', input.imageUrl)
  } else {
    fd.append('image', dataUriToFile(input.imageUrl, 'room.jpg'))
  }
  fd.append('texture', 'true')
  fd.append('pbr', 'true')
  fd.append('texture_quality', 'standard')
  fd.append('geometry_quality', 'standard')
  fd.append('texture_alignment', 'original_image')
  fd.append('enable_image_autofix', 'true')
  fd.append('prompt', buildThreeDAIRoomPrompt(input))
  fd.append('negative_prompt', buildNegativePrompt(input))
  return fd
}

function buildTrellisFormData(input: SubmitThreeDAIRoomRequest): FormData {
  const fd = new FormData()
  if (input.imageUrl.startsWith('http://') || input.imageUrl.startsWith('https://')) {
    fd.append('image_url', input.imageUrl)
  } else {
    fd.append('image', dataUriToFile(input.imageUrl, 'room.jpg'))
  }
  fd.append('resolution', '1024')
  fd.append('steps', '12')
  fd.append('textures', 'true')
  fd.append('texture_size', '2048')
  fd.append('generate_thumbnail', 'true')
  return fd
}

function getSubmitPath(model: ThreeDAIModel): string {
  return model === 'trellis2'
    ? '/v1/3d-models/trellis2/generate/'
    : '/v1/3d-models/tripo/image-to-3d/3.1/'
}

function getTripoMultiviewPath(): string {
  return '/v1/3d-models/tripo/multiview-to-3d/3.1/'
}

function getReferenceImages(input: SubmitThreeDAIRoomRequest): string[] {
  return [input.imageUrl, ...(input.sourceViews ?? [])]
    .filter((value, index, array) => Boolean(value) && array.indexOf(value) === index)
    .slice(0, 4)
}

function imageReference(value: string): { image_url: string } | { image: string } {
  return value.startsWith('http://') || value.startsWith('https://')
    ? { image_url: value }
    : { image: value }
}

function extractFailureReason(data: Record<string, unknown>): string | null {
  if (typeof data.failure_reason === 'string' && data.failure_reason) {
    return data.failure_reason
  }
  if (typeof data.detail === 'string' && data.detail) {
    return data.detail
  }
  if (typeof data.message === 'string' && data.message) {
    return data.message
  }
  return null
}

export async function submitThreeDAIRoomJob(
  input: SubmitThreeDAIRoomRequest,
): Promise<SubmitThreeDAIRoomResponse> {
  const model = getThreeDAIModel()
  const referenceImages = getReferenceImages(input)

  if (model === 'tripo' && referenceImages.length >= 2) {
    const response = await fetch(`${getApiUrl()}${getTripoMultiviewPath()}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        images: referenceImages.map(imageReference),
        texture: true,
        pbr: true,
        texture_quality: 'standard',
        geometry_quality: 'standard',
        texture_alignment: 'original_image',
        negative_prompt: buildNegativePrompt(input),
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      throw new Error(`3D AI Studio multiview submit failed ${response.status}: ${errText.slice(0, 200)}`)
    }

    const data = (await response.json()) as Record<string, unknown>
    const externalJobId = typeof data.task_id === 'string' ? data.task_id : ''

    if (!externalJobId) {
      throw new Error('3D AI Studio multiview response missing task_id')
    }

    return {
      externalJobId,
      status: 'PENDING',
      providerName: `${getThreeDAIProviderName()}-candidate-multiview`,
      raw: data,
    }
  }

  const formData = model === 'trellis2' ? buildTrellisFormData(input) : buildTripoFormData(input)

  // Don't set Content-Type — fetch sets it automatically with the multipart boundary
  const response = await fetch(`${getApiUrl()}${getSubmitPath(model)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${requireApiKey()}` },
    body: formData,
    cache: 'no-store',
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    let detail = ''
    try {
      const errJson = JSON.parse(errText) as Record<string, unknown>
      detail = extractFailureReason(errJson) ?? JSON.stringify(errJson)
    } catch {
      detail = errText.slice(0, 200)
    }
    throw new Error(`3D AI Studio submit failed ${response.status}: ${detail}`)
  }

  const data = (await response.json()) as Record<string, unknown>
  const externalJobId = typeof data.task_id === 'string' ? data.task_id : ''

  if (!externalJobId) {
    throw new Error('3D AI Studio submit response missing task_id')
  }

  return {
    externalJobId,
    status: 'PENDING',
    providerName: getThreeDAIProviderName(),
    raw: data,
  }
}

export async function getThreeDAIJobStatus(jobId: string): Promise<ThreeDAIJobStatusResponse> {
  const response = await fetch(`${getApiUrl()}/v1/generation-request/${jobId}/status/`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`3D AI Studio status failed with ${response.status}`)
  }

  const data = (await response.json()) as Record<string, unknown>
  return {
    status: normalizeThreeDAIStatus(data.status),
    progress: typeof data.progress === 'number' ? data.progress : null,
    errorMessage: extractFailureReason(data),
    raw: data,
  }
}

export async function getThreeDAIJobResult(jobId: string): Promise<ThreeDAIJobResult> {
  const response = await fetch(`${getApiUrl()}/v1/generation-request/${jobId}/status/`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`3D AI Studio result failed with ${response.status}`)
  }

  const data = (await response.json()) as Record<string, unknown>
  const results = Array.isArray(data.results) ? (data.results as Array<Record<string, unknown>>) : []
  const asset = results.find((result) => {
    if (typeof result.asset !== 'string') return false
    if (result.asset_type === '3D_MODEL') return true
    return result.asset.endsWith('.glb')
  })

  const preview = results.find((result) => {
    if (typeof result.asset !== 'string') return false
    return result.asset_type === 'IMAGE' || /\.(png|jpg|jpeg|webp)$/i.test(result.asset)
  })

  const worldAssetUrl = typeof asset?.asset === 'string' ? asset.asset : null
  const previewImageUrl = typeof preview?.asset === 'string' ? preview.asset : null

  return {
    worldAssetUrl,
    worldAssetFormat: worldAssetUrl?.toLowerCase().endsWith('.glb') ? 'glb' : null,
    previewImageUrl,
    generatedImageUrl: previewImageUrl,
    raw: data,
  }
}
