export type Room3DGenerationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type ProviderJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export type AcquisitionMode = 'BUY' | 'RENT' | 'LEASE'
export type WorldAssetFormat = 'glb' | 'gltf' | 'obj'
export type RoomWorldKind = 'composed' | 'fallback' | 'helper'

export type RoomPresetId = 'sunlit-sala' | 'heritage-den' | 'maker-loft'

export type RoomPreset = {
  id: RoomPresetId
  name: string
  badge: string
  description: string
  tip: string
  roomTheme: string
  lighting: 'soft' | 'natural' | 'dramatic'
  materialAffinity: string[]
  accent: string
  floor: string
  wall: string
}

export type RoomSceneHotspotBounds = {
  x: number
  y: number
  width: number
  height: number
  anchor: 'floor' | 'wall' | 'tabletop' | 'corner' | 'shelf'
}

export type RoomAnchorType = RoomSceneHotspotBounds['anchor']

export type RoomPalette = {
  wall: string
  floor: string
  accent: string
  highlight: string
  shadow: string
}

export type RoomSceneAnchor = {
  id: string
  label: string
  type: RoomAnchorType
  confidence: number
  bounds: RoomSceneHotspotBounds
  preferredMaterialTypes: string[]
  blocked?: boolean
}

export type RoomAnalysis = {
  source: 'vision-api' | 'heuristic'
  roomType: 'living-room' | 'den' | 'studio' | 'gallery'
  lighting: 'soft' | 'natural' | 'dramatic'
  palette: RoomPalette
  styleCues: string[]
  visibleSurfaces: {
    wall: number
    floor: number
    ceiling: number
  }
  freeSpaceSummary: string
  anchors: RoomSceneAnchor[]
  warnings: string[]
}

export type RoomSceneHotspot = {
  listingId: string
  productId: string
  name: string
  artisanName: string
  price: number
  primaryMode: AcquisitionMode
  reason: string
  label: string
  route: string
  imageUrl: string
  bounds: RoomSceneHotspotBounds
}

export type RoomPlacedItem = RoomSceneHotspot & {
  anchorId: string
  placementScore: number
  scale: number
  colorHint: string
  objectKind: 'seat' | 'table' | 'basket' | 'wall-art' | 'vessel' | 'shelf-object'
}

export type RoomSceneData = {
  title: string
  theme: string
  worldKind: RoomWorldKind
  palette: RoomPalette
  analysis: RoomAnalysis
  anchors: RoomSceneAnchor[]
  placedItems: RoomPlacedItem[]
  generationWarnings: string[]
  hotspots: RoomSceneHotspot[]
}

export type RoomGenerateRequest = {
  presetId: RoomPresetId
  imageUrl?: string
  notes?: string
  simulateFailure?: boolean
  imageInsights?: RoomImageInsights
}

export type RoomImageInsights = {
  width: number
  height: number
  orientation: 'portrait' | 'landscape' | 'square'
  averageBrightness: number
  contrast: number
  warmth: number
  dominantColors: [string, string, string]
  focusZones: {
    left: number
    center: number
    right: number
    top: number
    bottom: number
  }
}

export type RoomRecommendation = {
  listingId: string
  productId: string
  productName: string
  artisanName: string
  artisanId: string
  materialType: string
  price: number
  primaryMode: AcquisitionMode
  availableModes: AcquisitionMode[]
  imageUrl: string
  score: number
  reasonTags: string[]
  summary: string
  traceability: {
    wasteSupplierName: string
    junkShopName: string
    artisanName: string
  } | null
}

export type RoomStatusResponse = {
  roomId: string
  status: Room3DGenerationStatus
  roomTheme: string
  progressLabel: string
  progressPercent?: number | null
  generationProvider?: string | null
  providerStatus?: ProviderJobStatus | string | null
  previewImageUrl?: string | null
  worldAssetUrl?: string | null
  worldAssetFormat?: WorldAssetFormat | null
  worldKind?: RoomWorldKind
  generationWarnings?: string[]
  redirectTo?: string
  errorMessage?: string
}

export type RoomResultPayload = {
  roomId: string
  roomTheme: string
  sourceImageUrl: string
  generatedImageUrl: string
  worldAssetUrl: string | null
  worldAssetFormat: WorldAssetFormat | null
  generationProvider: string | null
  worldKind: RoomWorldKind
  worldPreviewImageUrl: string | null
  roomAnalysis: RoomAnalysis
  sceneAnchors: RoomSceneAnchor[]
  placedItems: RoomPlacedItem[]
  generationWarnings: string[]
  insight: string
  recommendations: RoomRecommendation[]
  scene: RoomSceneData
}

export type RoomWorldPayload = {
  roomId: string
  roomTheme: string
  generatedImageUrl: string
  worldAssetUrl: string | null
  worldAssetFormat: WorldAssetFormat | null
  generationProvider: string | null
  worldKind: RoomWorldKind
  worldPreviewImageUrl: string | null
  roomAnalysis: RoomAnalysis
  sceneAnchors: RoomSceneAnchor[]
  placedItems: RoomPlacedItem[]
  generationWarnings: string[]
  scene: RoomSceneData
}

export type RoomVisualizerPayload = {
  roomId: string
  listingId: string
  productId: string
  productName: string
  artisanName: string
  artisanId: string
  materialType: string
  description: string
  roomTheme: string
  generatedImageUrl: string
  worldAssetUrl: string | null
  worldAssetFormat: WorldAssetFormat | null
  price: number
  primaryMode: AcquisitionMode
  availableModes: AcquisitionMode[]
  reasonTags: string[]
  summary: string
  traceability: {
    wasteSupplierName: string
    junkShopName: string
    artisanName: string
  } | null
}
