import { Prisma, Room3DGenerationStatus } from '@/generated/prisma/client'
import { ListingType } from '@/generated/prisma/enums'
import { composeRoomWorld } from '@/lib/room-world-composer'
import { analyzeRoomImage } from '@/lib/room-vision-client'
import {
  getThreeDAIJobResult,
  getThreeDAIJobStatus,
  getThreeDAIProviderName,
  hasThreeDAIService,
  submitThreeDAIRoomJob,
  type ThreeDAIJobStatusResponse,
} from '@/lib/threedai-client'
import { products as mockProducts, traceabilityChains as mockTraceabilityChains } from '@/data/mockData'
import { prisma } from '@/lib/prisma'
import { getRoomPreset, ROOM_PRESETS } from '@/lib/room-presets'
import type {
  AcquisitionMode,
  RoomAnalysis,
  RoomGenerateRequest,
  RoomImageInsights,
  RoomPlacedItem,
  RoomRecommendation,
  RoomResultPayload,
  RoomSceneAnchor,
  RoomSceneData,
  RoomSceneHotspot,
  RoomStatusResponse,
  RoomVisualizerPayload,
  RoomWorldPayload,
  RoomWorldKind,
  WorldAssetFormat,
} from '@/types/room'

const FALLBACK_BUYER_ID = 'user-buyer-juan'
const ROOM_COMPLETION_DELAY_MS = 2400
const MOCK_PROVIDER = 'mock-fallback'
const COMPOSED_PROVIDER = 'app-composed-world-v1'

const mockRoomStore = new Map<string, MockRoomRecord>()
let latestMockRoomId: string | null = null

type ListingRecord = Prisma.ListingGetPayload<{
  include: {
    product: {
      include: {
        artisan: true
        traceability: {
          include: {
            junkShop: true
          }
        }
      }
    }
  }
}>

type RoomRecord = Prisma.RoomGetPayload<{
  include: {
    scan: true
  }
}>

type ScanAnalysis = {
  presetId: string
  notes?: string
  lighting: string
  simulateFailure?: boolean
  imageInsights?: RoomImageInsights
}

type MockRoomRecord = {
  roomId: string
  createdAt: number
  roomTheme: string
  sourceImageUrl: string
  generatedImageUrl: string
  worldAssetUrl: string | null
  worldAssetFormat: WorldAssetFormat | null
  simulateFailure: boolean
  recommendations: RoomRecommendation[]
  roomAnalysis: RoomAnalysis
  sceneAnchors: RoomSceneAnchor[]
  placedItems: RoomPlacedItem[]
  generationWarnings: string[]
  worldKind: RoomWorldKind
  scene: RoomSceneData
  generationProvider: string
}

function modeFromListingType(type: ListingType): AcquisitionMode {
  if (type === ListingType.RENT) return 'RENT'
  if (type === ListingType.LEASE) return 'LEASE'
  return 'BUY'
}

function isDatabaseUnavailable(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return (
    error.message.includes("Can't reach database server") ||
    error.message.includes('Connection error') ||
    error.message.includes('Timed out fetching a new connection') ||
    error.message.includes('Engine is not yet connected')
  )
}

function encodeSvg(markup: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(markup.replace(/\n\s*/g, ''))}`
}

function makeProductArtwork(name: string, materialType: string, accent: string): string {
  const badge = materialType.toUpperCase()
  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 420">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#f9f3ec"/>
          <stop offset="1" stop-color="#eadbc9"/>
        </linearGradient>
      </defs>
      <rect width="420" height="420" rx="40" fill="url(#g)"/>
      <rect x="36" y="44" width="132" height="30" rx="15" fill="${accent}" opacity="0.16"/>
      <text x="102" y="63" text-anchor="middle" font-size="16" font-family="Arial" fill="${accent}">${badge}</text>
      <rect x="112" y="108" width="196" height="180" rx="36" fill="#ffffff" stroke="${accent}" stroke-opacity="0.18" stroke-width="8"/>
      <rect x="134" y="132" width="152" height="22" rx="11" fill="${accent}" opacity="0.2"/>
      <rect x="150" y="175" width="120" height="88" rx="24" fill="${accent}" opacity="0.15"/>
      <text x="210" y="340" text-anchor="middle" font-size="28" font-family="Georgia" fill="#2c2c2c">${escapeSvg(name)}</text>
    </svg>
  `)
}

function escapeSvg(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildRoomArtwork(
  theme: string,
  wall: string,
  floor: string,
  accent: string,
  hotspots: RoomSceneHotspot[],
): string {
  const labels = hotspots
    .map((hotspot) => {
      const x = hotspot.bounds.x * 4.2
      const y = hotspot.bounds.y * 6.6
      const width = hotspot.bounds.width * 4.2
      const height = hotspot.bounds.height * 5.8
      return `
        <g>
          <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="24" fill="#ffffff" fill-opacity="0.78" stroke="${accent}" stroke-opacity="0.38" stroke-width="6"/>
          <text x="${x + width / 2}" y="${y + height / 2}" text-anchor="middle" font-size="18" font-family="Arial" fill="#2c2c2c">${escapeSvg(hotspot.label)}</text>
        </g>
      `
    })
    .join('')

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 740">
      <defs>
        <linearGradient id="wall" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${wall}"/>
          <stop offset="1" stop-color="#fffaf5"/>
        </linearGradient>
        <linearGradient id="floor" x1="0" x2="1" y1="0" y2="0">
          <stop stop-color="${floor}"/>
          <stop offset="1" stop-color="#5f4234"/>
        </linearGradient>
      </defs>
      <rect width="420" height="740" fill="url(#wall)"/>
      <rect y="450" width="420" height="290" fill="url(#floor)"/>
      <rect x="38" y="36" width="200" height="44" rx="22" fill="#ffffff" fill-opacity="0.72"/>
      <text x="138" y="63" text-anchor="middle" font-size="22" font-family="Georgia" fill="#1b5e3f">${escapeSvg(theme)}</text>
      <circle cx="332" cy="118" r="42" fill="${accent}" fill-opacity="0.14"/>
      <circle cx="90" cy="162" r="26" fill="${accent}" fill-opacity="0.12"/>
      <path d="M0 449 C110 394 310 394 420 449 L420 470 L0 470 Z" fill="#fff8f1" fill-opacity="0.82"/>
      ${labels}
    </svg>
  `)
}

function choosePrimaryListing(listings: ListingRecord[]): ListingRecord {
  return [...listings].sort((left, right) => {
    const availabilityBoost =
      Number(right.status === 'AVAILABLE') - Number(left.status === 'AVAILABLE')
    if (availabilityBoost !== 0) return availabilityBoost
    const modeBoost =
      Number(modeFromListingType(left.type) === 'BUY') -
      Number(modeFromListingType(right.type) === 'BUY')
    if (modeBoost !== 0) return modeBoost
    return right.views - left.views
  })[0]
}

function uniqueModes(listings: ListingRecord[]): AcquisitionMode[] {
  return Array.from(new Set(listings.map((listing) => modeFromListingType(listing.type))))
}

function roomTypeBoost(roomType: RoomAnalysis['roomType'], materialType: string): number {
  if (roomType === 'living-room' && /Bamboo|Textile/i.test(materialType)) return 8
  if (roomType === 'den' && /Textile|Bamboo/i.test(materialType)) return 10
  if (roomType === 'studio' && /Plastic|Bamboo/i.test(materialType)) return 9
  if (roomType === 'gallery' && /Textile|Plastic/i.test(materialType)) return 7
  return 0
}

function anchorAffinityScore(listing: ListingRecord, analysis: RoomAnalysis): number {
  return analysis.anchors.reduce((best, anchor) => {
    const anchorMatch = anchor.preferredMaterialTypes.includes(listing.product.materialType) ? 10 : 0
    const name = listing.product.name.toLowerCase()
    const semanticMatch =
      anchor.type === 'wall' && /tapestry|lamp|art|wall/i.test(name)
        ? 12
        : anchor.type === 'tabletop' && /basket|pottery|vase/i.test(name)
          ? 10
          : anchor.type !== 'wall' && /chair|lounge|table/i.test(name)
            ? 8
            : 0
    return Math.max(best, anchorMatch + semanticMatch + anchor.confidence * 6)
  }, 0)
}

function scoreListing(listings: ListingRecord[], presetId: string, analysis: RoomAnalysis): number {
  const preset = getRoomPreset(presetId)
  const listing = choosePrimaryListing(listings)
  const materialType = listing.product.materialType
  const materialIndex = preset.materialAffinity.findIndex((value) => value === materialType)
  const materialScore = materialIndex === -1 ? 8 : 40 - materialIndex * 8
  const modeScore = listing.type === ListingType.SALE ? 12 : listing.type === ListingType.RENT ? 9 : 7
  const popularityScore = Math.min(24, Math.round(listing.views / 140))
  const traceabilityScore = listing.product.traceability ? 10 : 0
  return (
    materialScore +
    modeScore +
    popularityScore +
    traceabilityScore +
    roomTypeBoost(analysis.roomType, materialType) +
    anchorAffinityScore(listing, analysis)
  )
}

function createReasonTags(listing: ListingRecord, presetId: string, analysis: RoomAnalysis): string[] {
  const preset = getRoomPreset(presetId)
  const tags = [preset.roomTheme, `${listing.product.materialType} fit`, analysis.styleCues[0] ?? 'room match']

  if (preset.lighting === 'natural') tags.push('lighting match')
  if (listing.type === ListingType.RENT) tags.push('rental ready')
  if (listing.product.traceability) tags.push('traceable craft')

  return tags.slice(0, 3)
}

function getFallbackRecommendations(presetId: string): RoomRecommendation[] {
  const preset = getRoomPreset(presetId)

  return mockProducts.slice(0, 4).map((product, index) => {
    const traceability = mockTraceabilityChains.find((item) => item.productId === product.id)
    const primaryMode: AcquisitionMode = index % 3 === 0 ? 'BUY' : index % 3 === 1 ? 'RENT' : 'LEASE'
    const reasonTags = [preset.roomTheme, `${product.materialType} fit`, 'offline preview']

    return {
      listingId: `mock-listing-${product.id}`,
      productId: product.id,
      productName: product.name,
      artisanName: product.artisanName,
      artisanId: product.artisanId,
      materialType: product.materialType,
      price: product.price,
      primaryMode,
      availableModes: primaryMode === 'BUY' ? ['BUY', 'RENT'] : [primaryMode, 'BUY'],
      imageUrl:
        product.images[0] || makeProductArtwork(product.name, product.materialType, preset.accent),
      score: 100 - index * 7,
      reasonTags,
      summary: `${product.name} complements a ${preset.roomTheme.toLowerCase()} room even while the live database is offline.`,
      traceability: traceability
        ? {
            wasteSupplierName: traceability.wasteSupplierName,
            junkShopName: traceability.junkShopName,
            artisanName: traceability.artisanName,
          }
        : null,
    }
  })
}

async function getRankedRecommendations(
  presetId: string,
  analysis: RoomAnalysis,
): Promise<RoomRecommendation[]> {
  let listings: ListingRecord[]

  try {
    listings = await prisma.listing.findMany({
      include: {
        product: {
          include: {
            artisan: true,
            traceability: {
              include: {
                junkShop: true,
              },
            },
          },
        },
      },
      orderBy: { views: 'desc' },
    })
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return getFallbackRecommendations(presetId)
    }
    throw error
  }

  const groups = new Map<string, ListingRecord[]>()
  for (const listing of listings) {
    const group = groups.get(listing.productId) ?? []
    group.push(listing)
    groups.set(listing.productId, group)
  }

  return Array.from(groups.values())
    .map((group) => {
      const primary = choosePrimaryListing(group)
      const score = scoreListing(group, presetId, analysis)
      const reasonTags = createReasonTags(primary, presetId, analysis)
      const availableModes = uniqueModes(group)
      return {
        listingId: primary.id,
        productId: primary.productId,
        productName: primary.product.name,
        artisanName: primary.product.artisan.name,
        artisanId: primary.product.artisan.id,
        materialType: primary.product.materialType,
        price: primary.price,
        primaryMode: modeFromListingType(primary.type),
        availableModes,
        imageUrl:
          primary.product.images[0] ||
          makeProductArtwork(primary.product.name, primary.product.materialType, getRoomPreset(presetId).accent),
        score,
        reasonTags,
        summary: `${primary.product.name} complements a ${getRoomPreset(presetId).roomTheme.toLowerCase()} room with ${primary.product.materialType.toLowerCase()} texture and artisan detail.`,
        traceability: primary.product.traceability
          ? {
              wasteSupplierName: primary.product.traceability.wasteSupplierName,
              junkShopName: primary.product.traceability.junkShop.name,
              artisanName: primary.product.artisan.name,
            }
          : null,
      }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 6)
}

function parseAnalysis(value: Prisma.JsonValue | null): ScanAnalysis {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {
      presetId: ROOM_PRESETS[0].id,
      lighting: ROOM_PRESETS[0].lighting,
    }
  }

  const json = value as Record<string, Prisma.JsonValue>
  return {
    presetId: typeof json.presetId === 'string' ? json.presetId : ROOM_PRESETS[0].id,
    notes: typeof json.notes === 'string' ? json.notes : undefined,
    lighting: typeof json.lighting === 'string' ? json.lighting : ROOM_PRESETS[0].lighting,
    simulateFailure: json.simulateFailure === true,
    imageInsights:
      json.imageInsights && typeof json.imageInsights === 'object' && !Array.isArray(json.imageInsights)
        ? (json.imageInsights as unknown as RoomImageInsights)
        : undefined,
  }
}

function isPersistedMockRoom(room: RoomRecord): boolean {
  return room.generationProvider === MOCK_PROVIDER || (!room.generationProvider && !room.externalJobId)
}

function getSceneData(room: RoomRecord): RoomSceneData | null {
  if (!room.sceneData || typeof room.sceneData !== 'object' || Array.isArray(room.sceneData)) {
    return null
  }
  return room.sceneData as unknown as RoomSceneData
}

function getGeneratedPreview(room: RoomRecord): string {
  return room.previewImageUrl ?? room.imageUrl
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

async function buildComposedScene(
  roomId: string,
  input: Pick<RoomGenerateRequest, 'presetId' | 'imageUrl' | 'notes' | 'imageInsights'>,
  recommendations: RoomRecommendation[],
): Promise<{
  roomTheme: string
  scene: RoomSceneData
  previewImageUrl: string
  worldAssetUrl: string
  worldAssetFormat: WorldAssetFormat
}> {
  const analysis = await analyzeRoomImage(input)
  const composed = composeRoomWorld({ presetId: input.presetId }, analysis, recommendations)
  return {
    roomTheme: composed.roomTheme,
    scene: {
      ...composed.scene,
      title: roomId ? composed.scene.title : composed.scene.title,
    },
    previewImageUrl: composed.previewImageUrl,
    worldAssetUrl: composed.worldAssetUrl,
    worldAssetFormat: 'glb',
  }
}

async function hydrateResult(room: RoomRecord): Promise<RoomResultPayload> {
  if (!room.scan) {
    throw new Error('Room scan missing')
  }

  const listingIds = room.scan.recommendations
  const scanAnalysis = parseAnalysis(room.scan.analysis)
  const analysisForRanking = await analyzeRoomImage({
    presetId: scanAnalysis.presetId as RoomGenerateRequest['presetId'],
    imageUrl: room.scan.imageUrl,
    notes: scanAnalysis.notes,
    imageInsights: scanAnalysis.imageInsights,
  })
  const recommendations = await getRankedRecommendations(scanAnalysis.presetId, analysisForRanking)
  const byId = new Map(recommendations.map((recommendation) => [recommendation.listingId, recommendation]))
  const orderedRecommendations = listingIds
    .map((id) => byId.get(id))
    .filter((value): value is RoomRecommendation => Boolean(value))

  const normalizedRecommendations = orderedRecommendations.length > 0 ? orderedRecommendations : recommendations
  const rawScene =
    getSceneData(room) ??
    (
      await buildComposedScene(
        room.id,
        {
          presetId: scanAnalysis.presetId as RoomGenerateRequest['presetId'],
          imageUrl: room.scan.imageUrl,
          notes: scanAnalysis.notes,
          imageInsights: scanAnalysis.imageInsights,
        },
        normalizedRecommendations,
      )
    ).scene

  const imageUrlById = new Map(normalizedRecommendations.map((r) => [r.listingId, r.imageUrl]))
  const placedItems =
    rawScene.placedItems?.map((item) => ({
      ...item,
      imageUrl: item.imageUrl ?? imageUrlById.get(item.listingId) ?? '',
    })) ?? []
  const scene: RoomSceneData = {
    ...rawScene,
    placedItems,
    hotspots: rawScene.hotspots.map((h) => ({
      ...h,
      imageUrl: h.imageUrl ?? imageUrlById.get(h.listingId) ?? '',
    })),
  }

  return {
    roomId: room.id,
    roomTheme: room.roomTheme,
    sourceImageUrl: room.scan.imageUrl,
    generatedImageUrl: getGeneratedPreview(room),
    worldAssetUrl: room.worldAssetUrl ?? null,
    worldAssetFormat: (room.worldAssetFormat as WorldAssetFormat | null) ?? null,
    generationProvider: room.generationProvider ?? null,
    worldKind: scene.worldKind,
    worldPreviewImageUrl: room.previewImageUrl ?? room.imageUrl,
    roomAnalysis: scene.analysis,
    sceneAnchors: scene.anchors,
    placedItems: scene.placedItems,
    generationWarnings: scene.generationWarnings,
    insight:
      room.generationProvider?.startsWith('3d-ai-studio') && room.worldAssetUrl
        ? `3D AI Studio generated the room world from your upload, while Habi matched artisan pieces to the room's ${scene.analysis.lighting} light and available placement zones.`
        : scene.worldKind === 'composed'
        ? `Habi reconstructed a colored room world from your upload and auto-organized artisan pieces around the room's ${scene.analysis.lighting} light and visible free space.`
        : room.generationProvider?.startsWith('3d-ai-studio')
          ? `3D AI Studio is generating the room world while Habi keeps your artisan recommendations aligned to the room.`
          : `AI matched ${room.roomTheme.toLowerCase()} styling with locally crafted pieces that fit the room's ${scanAnalysis.lighting} lighting profile.`,
    recommendations: normalizedRecommendations,
    scene,
  }
}

async function persistMockFallbackRoom(room: RoomRecord): Promise<RoomRecord> {
  if (room.generationStatus !== Room3DGenerationStatus.PROCESSING) return room

  const elapsed = Date.now() - room.createdAt.getTime()
  if (elapsed < ROOM_COMPLETION_DELAY_MS) return room

  const failed = parseAnalysis(room.scan?.analysis ?? null).simulateFailure === true
  return prisma.room.update({
    where: { id: room.id },
    data: {
      generationStatus: failed ? Room3DGenerationStatus.FAILED : Room3DGenerationStatus.COMPLETED,
      providerStatus: failed ? 'FAILED' : 'COMPLETED',
      // Preserve any existing providerError (e.g. Tripo submission failure reason)
      ...(failed ? { providerError: 'Mock fallback generation failed.' } : {}),
    },
    include: { scan: true },
  })
}

async function persistThreeDAIRoomStatus(
  room: RoomRecord,
  status: ThreeDAIJobStatusResponse,
): Promise<RoomRecord> {
  return prisma.room.update({
    where: { id: room.id },
    data: {
      providerStatus: status.status,
      providerError: status.errorMessage ?? null,
      providerPayload: status.raw ? toInputJsonValue(status.raw) : Prisma.JsonNull,
    },
    include: { scan: true },
  })
}

async function reconcileThreeDAIRoom(room: RoomRecord): Promise<RoomRecord> {
  if (!room.externalJobId) return room
  const currentScene = getSceneData(room)
  const isPrimaryProviderWorld = currentScene?.worldKind === 'composed'
  const completionWarning = isPrimaryProviderWorld
    ? null
    : '3D AI Studio supplied a helper shell because the primary composed world degraded.'
  const failureWarning = isPrimaryProviderWorld
    ? null
    : '3D AI Studio helper generation failed after the primary composed world degraded.'

  if (!hasThreeDAIService()) {
    return prisma.room.update({
      where: { id: room.id },
      data: {
        generationStatus: Room3DGenerationStatus.FAILED,
        providerStatus: 'FAILED',
        providerError: 'THREEDAI_API_KEY is not configured on this environment.',
      },
      include: { scan: true },
    })
  }

  try {
    const status = await getThreeDAIJobStatus(room.externalJobId)

    if (status.status === 'PENDING' || status.status === 'PROCESSING') {
      return persistThreeDAIRoomStatus(room, status)
    }

    if (status.status === 'FAILED') {
      return prisma.room.update({
        where: { id: room.id },
        data: {
          generationStatus: Room3DGenerationStatus.FAILED,
          providerStatus: status.status,
          providerError: status.errorMessage ?? '3D AI Studio generation failed.',
          providerPayload: status.raw ? toInputJsonValue(status.raw) : Prisma.JsonNull,
        },
        include: { scan: true },
      })
    }

    const result = await getThreeDAIJobResult(room.externalJobId)
    const previewImageUrl = result.previewImageUrl ?? result.generatedImageUrl ?? getGeneratedPreview(room)

    // Asset URL not yet available on R2 — stay PROCESSING so the next poll retries
    if (!result.worldAssetUrl) {
      return persistThreeDAIRoomStatus(room, { status: 'PROCESSING', raw: result.raw })
    }

    return prisma.room.update({
      where: { id: room.id },
      data: {
        generationStatus: Room3DGenerationStatus.COMPLETED,
        sceneData:
          currentScene
            ? toInputJsonValue({
                ...currentScene,
                worldKind: isPrimaryProviderWorld ? 'composed' : 'helper',
                generationWarnings: completionWarning
                  ? Array.from(new Set([...currentScene.generationWarnings, completionWarning]))
                  : currentScene.generationWarnings,
              })
            : undefined,
        providerStatus: 'COMPLETED',
        providerError: null,
        providerPayload: result.raw ? toInputJsonValue(result.raw) : Prisma.JsonNull,
        worldAssetUrl: result.worldAssetUrl,
        worldAssetFormat: result.worldAssetFormat,
        previewImageUrl,
        imageUrl: previewImageUrl,
      },
      include: { scan: true },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach the 3D AI Studio service.'
    return prisma.room.update({
      where: { id: room.id },
      data: {
        generationStatus: Room3DGenerationStatus.FAILED,
        sceneData:
          currentScene
            ? toInputJsonValue({
                ...currentScene,
                worldKind: isPrimaryProviderWorld ? 'composed' : 'helper',
                generationWarnings: failureWarning
                  ? Array.from(new Set([...currentScene.generationWarnings, failureWarning]))
                  : currentScene.generationWarnings,
              })
            : undefined,
        providerStatus: 'FAILED',
        providerError: message,
      },
      include: { scan: true },
    })
  }
}

async function maybeAdvanceRoom(room: RoomRecord): Promise<RoomRecord> {
  if (room.generationStatus !== Room3DGenerationStatus.PROCESSING) return room

  if (room.generationProvider?.startsWith('3d-ai-studio') && room.externalJobId) {
    return reconcileThreeDAIRoom(room)
  }

  if (isPersistedMockRoom(room)) {
    return persistMockFallbackRoom(room)
  }

  return room
}

function makeMockStatus(room: MockRoomRecord): RoomStatusResponse {
  const elapsed = Date.now() - room.createdAt
  const completed = elapsed >= ROOM_COMPLETION_DELAY_MS
  const failed = completed && room.simulateFailure

  if (failed) {
    return {
      roomId: room.roomId,
      status: 'FAILED',
      roomTheme: room.roomTheme,
      generationProvider: room.generationProvider,
      providerStatus: 'FAILED',
      previewImageUrl: room.generatedImageUrl,
      worldAssetUrl: room.worldAssetUrl,
      worldAssetFormat: room.worldAssetFormat,
      worldKind: room.worldKind,
      generationWarnings: room.generationWarnings,
      progressLabel: 'We hit a snag while mapping your space.',
      errorMessage: 'Offline preview could not finish this room. Try again with a new capture.',
    }
  }

  if (completed) {
    return {
      roomId: room.roomId,
      status: 'COMPLETED',
      roomTheme: room.roomTheme,
      generationProvider: room.generationProvider,
      providerStatus: 'COMPLETED',
      previewImageUrl: room.generatedImageUrl,
      worldAssetUrl: room.worldAssetUrl,
      worldAssetFormat: room.worldAssetFormat,
      worldKind: room.worldKind,
      generationWarnings: room.generationWarnings,
      progressLabel: 'Your AI room is ready.',
      redirectTo: '/buyer/room/result',
    }
  }

  return {
    roomId: room.roomId,
    status: 'PROCESSING',
    roomTheme: room.roomTheme,
    generationProvider: room.generationProvider,
    providerStatus: 'PROCESSING',
    previewImageUrl: room.generatedImageUrl,
    worldAssetUrl: room.worldAssetUrl,
    worldAssetFormat: room.worldAssetFormat,
    worldKind: room.worldKind,
    generationWarnings: room.generationWarnings,
    progressLabel: 'Running offline preview while the database reconnects.',
  }
}

function hydrateMockResult(room: MockRoomRecord): RoomResultPayload {
  return {
    roomId: room.roomId,
    roomTheme: room.roomTheme,
    sourceImageUrl: room.sourceImageUrl,
    generatedImageUrl: room.generatedImageUrl,
    worldAssetUrl: room.worldAssetUrl,
    worldAssetFormat: room.worldAssetFormat,
    generationProvider: room.generationProvider,
    worldKind: room.worldKind,
    worldPreviewImageUrl: room.generatedImageUrl,
    roomAnalysis: room.roomAnalysis,
    sceneAnchors: room.sceneAnchors,
    placedItems: room.placedItems,
    generationWarnings: room.generationWarnings,
    insight: `Offline preview matched ${room.roomTheme.toLowerCase()} styling while your live database connection is unavailable.`,
    recommendations: room.recommendations,
    scene: room.scene,
  }
}

export async function createRoomGeneration(
  input: RoomGenerateRequest,
  userId = FALLBACK_BUYER_ID,
): Promise<{ roomId: string }> {
  const preset = getRoomPreset(input.presetId)
  const roomId = `room-${crypto.randomUUID()}`
  const hasRealPhoto = Boolean(input.imageUrl && !input.imageUrl.startsWith('data:image/svg+xml'))
  if (!hasRealPhoto) {
    throw new Error('A real room photo is required for 3D world generation.')
  }
  if (!hasThreeDAIService()) {
    throw new Error('THREEDAI_API_KEY is required for 3D world generation.')
  }
  const useThreeDAIPrimary = true
  const sourceImageUrl = input.imageUrl
  const analysis = await analyzeRoomImage({
    presetId: input.presetId,
    imageUrl: sourceImageUrl,
    notes: input.notes,
    imageInsights: input.imageInsights,
  })
  const recommendations = await getRankedRecommendations(preset.id, analysis)

  let composed = null as Awaited<ReturnType<typeof buildComposedScene>> | null
  let generationProvider = useThreeDAIPrimary ? getThreeDAIProviderName() : COMPOSED_PROVIDER
  let providerStatus: string = useThreeDAIPrimary ? 'PENDING' : 'COMPLETED'
  let providerError: string | null = null
  let worldAssetUrl: string | null = null
  let worldAssetFormat: WorldAssetFormat | null = null
  let previewImageUrl: string | null = buildRoomArtwork(
    preset.roomTheme,
    preset.wall,
    preset.floor,
    preset.accent,
    [],
  )
  let generationStatus: Room3DGenerationStatus = useThreeDAIPrimary
    ? Room3DGenerationStatus.PROCESSING
    : Room3DGenerationStatus.COMPLETED
  let scene: RoomSceneData = {
    title: `${preset.name} Planned World`,
    theme: preset.roomTheme,
    worldKind: 'composed',
    palette: analysis.palette,
    analysis,
    anchors: analysis.anchors,
    placedItems: [],
    generationWarnings: [],
    hotspots: [],
  }
  let roomTheme = preset.roomTheme

  if (useThreeDAIPrimary) {
    try {
      composed = await buildComposedScene(
        roomId,
        {
          presetId: input.presetId,
          imageUrl: sourceImageUrl,
          notes: input.notes,
          imageInsights: input.imageInsights,
        },
        recommendations,
      )
      roomTheme = composed.roomTheme
      previewImageUrl = composed.previewImageUrl
      scene = {
        ...composed.scene,
        worldKind: 'composed',
        generationWarnings: composed.scene.generationWarnings.filter(
          (warning) => !warning.toLowerCase().includes('fallback'),
        ),
      }
    } catch (error) {
      providerError =
        error instanceof Error
          ? `${error.message}. Using a lightweight planning preview while 3D AI Studio generates the room world.`
          : 'Using a lightweight planning preview while 3D AI Studio generates the room world.'
      previewImageUrl = buildRoomArtwork(preset.roomTheme, preset.wall, preset.floor, preset.accent, [])
      scene = {
        title: `${preset.name} Planned World`,
        theme: preset.roomTheme,
        worldKind: 'composed',
        palette: analysis.palette,
        analysis: {
          ...analysis,
          warnings: [
            ...analysis.warnings,
            'Habi is using a simplified planning overlay while 3D AI Studio generates the final room world.',
          ],
        },
        anchors: analysis.anchors,
        placedItems: [],
        generationWarnings: [
          ...analysis.warnings,
          'Habi is using a simplified planning overlay while 3D AI Studio generates the final room world.',
        ],
        hotspots: [],
      }
    }
  }

  try {
    const createdRoom = await prisma.room.create({
      data: {
        id: roomId,
        userId,
        imageUrl: previewImageUrl ?? sourceImageUrl ?? buildRoomArtwork(preset.roomTheme, preset.wall, preset.floor, preset.accent, []),
        previewImageUrl,
        generationStatus,
        roomTheme,
        sceneData: scene as unknown as Prisma.InputJsonValue,
        generationProvider,
        worldAssetUrl,
        worldAssetFormat,
        providerStatus,
        providerError,
        scan: {
          create: {
            buyerId: userId,
            imageUrl: sourceImageUrl ?? previewImageUrl ?? '',
            recommendations: recommendations.map((recommendation) => recommendation.listingId),
            analysis: {
              presetId: preset.id,
              notes: input.notes ?? '',
              lighting: analysis.lighting,
              simulateFailure: input.simulateFailure ?? false,
              imageInsights: input.imageInsights,
              roomAnalysis: analysis,
              generationWarnings: scene.generationWarnings,
            } satisfies Prisma.InputJsonValue,
          },
        },
      },
      include: { scan: true },
    })

    if (createdRoom.generationStatus === Room3DGenerationStatus.PROCESSING && useThreeDAIPrimary) {
      try {
        const submitted = await submitThreeDAIRoomJob({
          roomId,
          imageUrl: sourceImageUrl!,
          roomTheme,
          presetId: preset.id,
          notes: input.notes,
          recommendations: recommendations.map((recommendation) => ({
            productName: recommendation.productName,
            materialType: recommendation.materialType,
            reasonTags: recommendation.reasonTags,
          })),
        })

        await prisma.room.update({
          where: { id: createdRoom.id },
          data: {
            generationProvider: submitted.providerName,
            externalJobId: submitted.externalJobId,
            providerStatus: submitted.status,
            providerPayload: submitted.raw ? toInputJsonValue(submitted.raw) : Prisma.JsonNull,
            providerError,
          },
        })
      } catch (error) {
        await prisma.room.update({
          where: { id: createdRoom.id },
          data: {
            generationStatus: Room3DGenerationStatus.FAILED,
            generationProvider: getThreeDAIProviderName(),
            providerStatus: 'FAILED',
            providerError:
              error instanceof Error
                ? `${providerError ?? ''} ${error.message}`.trim()
                : providerError ?? '3D AI Studio could not start room generation.',
            sceneData: toInputJsonValue({
              ...scene,
              generationWarnings: Array.from(
                new Set([
                  ...scene.generationWarnings,
                  '3D AI Studio could not start the room generation.',
                ]),
              ),
            }),
          },
        })
      }
    }

    return { roomId }
  } catch (error) {
    if (!isDatabaseUnavailable(error)) {
      throw error
    }
    throw new Error('The database is unavailable, so room generation cannot start right now.')
  }
}

export async function getRoomStatus(roomId: string): Promise<RoomStatusResponse | null> {
  const mockRoom = mockRoomStore.get(roomId)
  if (mockRoom) {
    return makeMockStatus(mockRoom)
  }

  let room: RoomRecord | null
  try {
    room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { scan: true },
    })
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return null
    }
    throw error
  }

  if (!room) return null

  const currentRoom = await maybeAdvanceRoom(room)

  if (currentRoom.generationStatus === Room3DGenerationStatus.FAILED) {
    const scene = getSceneData(currentRoom)
    return {
      roomId: currentRoom.id,
      status: 'FAILED',
      roomTheme: currentRoom.roomTheme,
      generationProvider: currentRoom.generationProvider ?? null,
      providerStatus: currentRoom.providerStatus ?? null,
      previewImageUrl: currentRoom.previewImageUrl ?? currentRoom.imageUrl,
      worldAssetUrl: currentRoom.worldAssetUrl ?? null,
      worldAssetFormat: (currentRoom.worldAssetFormat as WorldAssetFormat | null) ?? null,
      worldKind: scene?.worldKind ?? 'fallback',
      generationWarnings: scene?.generationWarnings ?? [],
      progressLabel: 'We hit a snag while mapping your space.',
      errorMessage: currentRoom.providerError ?? 'Try another room angle or start a fresh generation.',
    }
  }

  if (currentRoom.generationStatus === Room3DGenerationStatus.COMPLETED) {
    const isMock = currentRoom.generationProvider === MOCK_PROVIDER
    const scene = getSceneData(currentRoom)
    const hasRealWorldAsset = Boolean(currentRoom.worldAssetUrl)
    if (currentRoom.generationProvider?.startsWith('3d-ai-studio') && !hasRealWorldAsset) {
      return {
        roomId: currentRoom.id,
        status: 'FAILED',
        roomTheme: currentRoom.roomTheme,
        generationProvider: currentRoom.generationProvider ?? null,
        providerStatus: currentRoom.providerStatus ?? null,
        previewImageUrl: currentRoom.previewImageUrl ?? currentRoom.imageUrl,
        worldAssetUrl: null,
        worldAssetFormat: null,
        worldKind: scene?.worldKind ?? 'composed',
        generationWarnings: scene?.generationWarnings ?? [],
        progressLabel: 'The generated world did not finish syncing.',
        errorMessage: currentRoom.providerError ?? '3D AI Studio completed without returning a world asset.',
      }
    }
    return {
      roomId: currentRoom.id,
      status: 'COMPLETED',
      roomTheme: currentRoom.roomTheme,
      generationProvider: currentRoom.generationProvider ?? null,
      providerStatus: currentRoom.providerStatus ?? null,
      previewImageUrl: currentRoom.previewImageUrl ?? currentRoom.imageUrl,
      worldAssetUrl: currentRoom.worldAssetUrl ?? null,
      worldAssetFormat: (currentRoom.worldAssetFormat as WorldAssetFormat | null) ?? null,
      worldKind: scene?.worldKind ?? (isMock ? 'fallback' : 'composed'),
      generationWarnings: scene?.generationWarnings ?? [],
      progressLabel:
        hasRealWorldAsset ? 'Your reconstructed AI room is ready.' : 'Waiting for the generated world asset to finish syncing.',
      redirectTo: '/buyer/room/result',
    }
  }

  const payload = currentRoom.providerPayload as Record<string, unknown> | null
  const progressPercent =
    payload && typeof payload.progress === 'number' ? payload.progress : null

  return {
    roomId: currentRoom.id,
    status: currentRoom.generationStatus,
    roomTheme: currentRoom.roomTheme,
    generationProvider: currentRoom.generationProvider ?? null,
    providerStatus: currentRoom.providerStatus ?? null,
    previewImageUrl: currentRoom.previewImageUrl ?? currentRoom.imageUrl,
    worldAssetUrl: currentRoom.worldAssetUrl ?? null,
    worldAssetFormat: (currentRoom.worldAssetFormat as WorldAssetFormat | null) ?? null,
    worldKind: getSceneData(currentRoom)?.worldKind ?? 'helper',
    generationWarnings: getSceneData(currentRoom)?.generationWarnings ?? [],
    progressPercent,
    progressLabel:
      currentRoom.generationProvider === COMPOSED_PROVIDER
        ? 'Analyzing your room photo, matching products, and composing a colored world.'
        : currentRoom.generationProvider?.startsWith('3d-ai-studio')
          ? '3D AI Studio is generating the room world from your uploaded photo.'
          : 'No room photo uploaded — building a preview room instead of a generated world.',
  }
}

export async function getLatestCompletedRoomResult(
  userId = FALLBACK_BUYER_ID,
): Promise<RoomResultPayload | null> {
  if (latestMockRoomId) {
    const mockRoom = mockRoomStore.get(latestMockRoomId)
    if (mockRoom) {
      const mockStatus = makeMockStatus(mockRoom)
      if (mockStatus.status === 'COMPLETED') {
        return hydrateMockResult(mockRoom)
      }
    }
  }

  let room: RoomRecord | null
  try {
    room = await prisma.room.findFirst({
      where: { userId },
      include: { scan: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return null
    }
    throw error
  }

  if (!room) return null

  const currentRoom = await maybeAdvanceRoom(room)
  if (currentRoom.generationStatus !== Room3DGenerationStatus.COMPLETED || !currentRoom.worldAssetUrl) {
    return null
  }

  return hydrateResult(currentRoom)
}

export async function getRoomWorldPayload(roomId: string): Promise<RoomWorldPayload | null> {
  const mockRoom = mockRoomStore.get(roomId)
  if (mockRoom) {
    const mockStatus = makeMockStatus(mockRoom)
    if (mockStatus.status !== 'COMPLETED') return null
    return {
      roomId: mockRoom.roomId,
      roomTheme: mockRoom.roomTheme,
      generatedImageUrl: mockRoom.generatedImageUrl,
      worldAssetUrl: mockRoom.worldAssetUrl,
      worldAssetFormat: mockRoom.worldAssetFormat,
      generationProvider: mockRoom.generationProvider,
      worldKind: mockRoom.worldKind,
      worldPreviewImageUrl: mockRoom.generatedImageUrl,
      roomAnalysis: mockRoom.roomAnalysis,
      sceneAnchors: mockRoom.sceneAnchors,
      placedItems: mockRoom.placedItems,
      generationWarnings: mockRoom.generationWarnings,
      scene: mockRoom.scene,
    }
  }

  let room: RoomRecord | null
  try {
    room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { scan: true },
    })
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return null
    }
    throw error
  }

  if (!room) return null

  const currentRoom = await maybeAdvanceRoom(room)
  if (currentRoom.generationStatus !== Room3DGenerationStatus.COMPLETED || !currentRoom.worldAssetUrl) {
    return null
  }

  const result = await hydrateResult(currentRoom)
  return {
    roomId: result.roomId,
    roomTheme: result.roomTheme,
    generatedImageUrl: result.generatedImageUrl,
    worldAssetUrl: result.worldAssetUrl,
    worldAssetFormat: result.worldAssetFormat,
    generationProvider: result.generationProvider,
    worldKind: result.worldKind,
    worldPreviewImageUrl: result.worldPreviewImageUrl,
    roomAnalysis: result.roomAnalysis,
    sceneAnchors: result.sceneAnchors,
    placedItems: result.placedItems,
    generationWarnings: result.generationWarnings,
    scene: result.scene,
  }
}

function getMockProductDescription(productId: string): string | null {
  const product = mockProducts.find((item) => item.id === productId)
  return product?.description ?? null
}

export async function getVisualizerPayload(
  listingId: string,
  userId = FALLBACK_BUYER_ID,
): Promise<RoomVisualizerPayload | null> {
  const result = await getLatestCompletedRoomResult(userId)
  if (!result) return null

  const recommendation = result.recommendations.find((item) => item.listingId === listingId)
  if (!recommendation) return null

  if (listingId.startsWith('mock-listing-')) {
    const description = getMockProductDescription(recommendation.productId)
    if (!description) return null

    return {
      roomId: result.roomId,
      listingId: recommendation.listingId,
      productId: recommendation.productId,
      productName: recommendation.productName,
      artisanName: recommendation.artisanName,
      artisanId: recommendation.artisanId,
      materialType: recommendation.materialType,
      description,
      roomTheme: result.roomTheme,
      generatedImageUrl: result.generatedImageUrl,
      worldAssetUrl: result.worldAssetUrl,
      worldAssetFormat: result.worldAssetFormat,
      price: recommendation.price,
      primaryMode: recommendation.primaryMode,
      availableModes: recommendation.availableModes,
      reasonTags: recommendation.reasonTags,
      summary: recommendation.summary,
      traceability: recommendation.traceability,
    }
  }

  let listing
  try {
    listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        product: {
          include: {
            artisan: true,
            traceability: {
              include: {
                junkShop: true,
              },
            },
            listings: true,
          },
        },
      },
    })
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      const description = getMockProductDescription(recommendation.productId)
      if (!description) return null
      return {
        roomId: result.roomId,
        listingId: recommendation.listingId,
        productId: recommendation.productId,
        productName: recommendation.productName,
        artisanName: recommendation.artisanName,
        artisanId: recommendation.artisanId,
        materialType: recommendation.materialType,
        description,
        roomTheme: result.roomTheme,
        generatedImageUrl: result.generatedImageUrl,
        worldAssetUrl: result.worldAssetUrl,
        worldAssetFormat: result.worldAssetFormat,
        price: recommendation.price,
        primaryMode: recommendation.primaryMode,
        availableModes: recommendation.availableModes,
        reasonTags: recommendation.reasonTags,
        summary: recommendation.summary,
        traceability: recommendation.traceability,
      }
    }
    throw error
  }

  if (!listing) return null

  return {
    roomId: result.roomId,
    listingId: recommendation.listingId,
    productId: recommendation.productId,
    productName: recommendation.productName,
    artisanName: recommendation.artisanName,
    artisanId: recommendation.artisanId,
    materialType: recommendation.materialType,
    description: listing.product.description,
    roomTheme: result.roomTheme,
    generatedImageUrl: result.generatedImageUrl,
    worldAssetUrl: result.worldAssetUrl,
    worldAssetFormat: result.worldAssetFormat,
    price: recommendation.price,
    primaryMode: recommendation.primaryMode,
    availableModes: Array.from(
      new Set(listing.product.listings.map((item) => modeFromListingType(item.type))),
    ),
    reasonTags: recommendation.reasonTags,
    summary: recommendation.summary,
    traceability: recommendation.traceability,
  }
}

export async function getBuyerHomeRecommendations(): Promise<RoomRecommendation[]> {
  const analysis = await analyzeRoomImage({ presetId: ROOM_PRESETS[0].id })
  return getRankedRecommendations(ROOM_PRESETS[0].id, analysis)
}

export { FALLBACK_BUYER_ID }
