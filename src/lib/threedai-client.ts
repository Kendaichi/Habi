import type { ProviderJobStatus, WorldAssetFormat } from '@/types/room'

const DEFAULT_API_URL = 'https://api.3daistudio.com'

export type ThreeDAIModel = 'tripo' | 'trellis2'

export type SubmitThreeDAIRoomRequest = {
  roomId: string
  imageUrl: string
  roomTheme: string
  presetId: string
  notes?: string
  recommendations: Array<{
    productName: string
    materialType: string
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
  const avoided = ['floating furniture', 'distorted walls', 'warped floor']
  if (input.notes?.toLowerCase().includes('minimal')) {
    avoided.push('clutter')
  }
  return avoided.join(', ')
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
