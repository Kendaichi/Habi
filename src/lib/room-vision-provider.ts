import { getRoomPreset } from '@/lib/room-presets'
import type {
  RoomAnalysis,
  RoomDetectedObject,
  RoomGenerateRequest,
  RoomImageInsights,
  RoomPlacementZone,
  RoomSceneAnchor,
  RoomSceneHotspotBounds,
  RoomStructuralAnalysis,
} from '@/types/room'

type RoomVisionProviderInput = {
  imageUrl: string
  sourceViews: string[]
  presetId: RoomGenerateRequest['presetId']
  notes?: string
  imageInsights?: RoomImageInsights
  analysis: RoomAnalysis
}

export type RoomVisionProvider = {
  name: string
  analyze(input: RoomVisionProviderInput): Promise<RoomStructuralAnalysis>
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function clampBounds(bounds: RoomSceneHotspotBounds): RoomSceneHotspotBounds {
  const width = clamp(bounds.width, 6, 64)
  const height = clamp(bounds.height, 6, 64)
  return {
    ...bounds,
    x: clamp(bounds.x, 0, 100 - width),
    y: clamp(bounds.y, 0, 100 - height),
    width,
    height,
  }
}

function overlapRatio(a: RoomSceneHotspotBounds, b: RoomSceneHotspotBounds) {
  const ax2 = a.x + a.width
  const ay2 = a.y + a.height
  const bx2 = b.x + b.width
  const by2 = b.y + b.height
  const overlapWidth = Math.max(0, Math.min(ax2, bx2) - Math.max(a.x, b.x))
  const overlapHeight = Math.max(0, Math.min(ay2, by2) - Math.max(a.y, b.y))
  const overlap = overlapWidth * overlapHeight
  const area = Math.max(1, a.width * a.height)
  return overlap / area
}

function zoneKinds(anchor: RoomSceneAnchor): RoomPlacementZone['preferredObjectKinds'] {
  if (anchor.type === 'wall') return ['wall-art']
  if (anchor.type === 'tabletop' || anchor.type === 'shelf') return ['basket', 'vessel', 'shelf-object']
  if (anchor.type === 'corner') return ['basket', 'vessel', 'shelf-object']
  return ['seat', 'table', 'basket']
}

function createPreservedObjects(input: RoomVisionProviderInput): RoomDetectedObject[] {
  const insights = input.imageInsights
  const centerHeavy = (insights?.focusZones.center ?? 0.34) >= 0.34
  const leftHeavy = (insights?.focusZones.left ?? 0.33) > (insights?.focusZones.right ?? 0.33)
  const lowerBand = clamp(Math.round((insights?.focusZones.bottom ?? 0.58) * 68), 42, 58)
  const largeFurniture: RoomDetectedObject = {
    id: 'existing-large-furniture',
    label: centerHeavy ? 'Existing central furniture' : 'Existing side furniture',
    category: centerHeavy ? 'sofa' : 'cabinet',
    bounds: clampBounds({
      x: centerHeavy ? 28 : leftHeavy ? 10 : 62,
      y: lowerBand,
      width: centerHeavy ? 42 : 28,
      height: 22,
      anchor: 'floor',
    }),
    confidence: insights ? 0.68 : 0.52,
    preserve: true,
    estimatedDepthMeters: 2.6,
  }

  const tabletop: RoomDetectedObject = {
    id: 'existing-tabletop',
    label: 'Existing low surface',
    category: 'table',
    bounds: clampBounds({
      x: 38,
      y: clamp(lowerBand - 10, 36, 54),
      width: 24,
      height: 12,
      anchor: 'tabletop',
    }),
    confidence: insights ? 0.56 : 0.45,
    preserve: true,
    estimatedDepthMeters: 2,
  }

  return [largeFurniture, tabletop].filter((object) => object.confidence >= 0.5)
}

function createPlacementZones(
  analysis: RoomAnalysis,
  preservedObjects: RoomDetectedObject[],
): RoomPlacementZone[] {
  return analysis.anchors
    .map((anchor) => {
      const blockers = preservedObjects
        .filter((object) => object.preserve && overlapRatio(anchor.bounds, object.bounds) > 0.24)
        .map((object) => object.id)

      return {
        id: `zone-${anchor.id}`,
        label: anchor.label,
        type: anchor.type,
        bounds: clampBounds(anchor.bounds),
        confidence: blockers.length > 0 ? anchor.confidence * 0.42 : anchor.confidence,
        preferredObjectKinds: zoneKinds(anchor),
        preferredMaterialTypes: anchor.preferredMaterialTypes,
        minClearanceMeters: anchor.type === 'floor' || anchor.type === 'corner' ? 0.8 : 0.25,
        blockedBy: blockers.length > 0 ? blockers : undefined,
      } satisfies RoomPlacementZone
    })
    .concat([
      {
        id: 'zone-walkable-wall-left',
        label: 'Open wall accent',
        type: 'wall',
        bounds: { x: 12, y: 18, width: 22, height: 16, anchor: 'wall' },
        confidence: 0.72,
        preferredObjectKinds: ['wall-art'],
        preferredMaterialTypes: ['Textile', 'Bamboo', 'Plastic'],
        minClearanceMeters: 0.2,
        blockedBy: undefined,
      },
      {
        id: 'zone-clear-corner',
        label: 'Clear corner',
        type: 'corner',
        bounds: { x: 72, y: 55, width: 16, height: 18, anchor: 'corner' },
        confidence: 0.7,
        preferredObjectKinds: ['basket', 'vessel', 'shelf-object'],
        preferredMaterialTypes: ['Bamboo', 'Textile', 'Plastic'],
        minClearanceMeters: 0.65,
        blockedBy: undefined,
      },
    ])
}

function buildHeuristicStructuralAnalysis(input: RoomVisionProviderInput): RoomStructuralAnalysis {
  const preset = getRoomPreset(input.presetId)
  const insights = input.imageInsights
  const aspect = insights ? insights.width / Math.max(1, insights.height) : 0.75
  const roomWidth = clamp(4.2 + aspect * 2.2, 4.5, 7.4)
  const roomDepth = clamp(4.4 + (insights?.focusZones.bottom ?? 0.55) * 3.2, 4.8, 7.2)
  const roomHeight = insights?.orientation === 'portrait' ? 3.1 : 2.8
  const preservedObjects = createPreservedObjects(input)
  const emptyPlacementZones = createPlacementZones(input.analysis, preservedObjects)
  const wallSplit = clamp((insights?.focusZones.top ?? 0.42) * 100, 36, 54)
  const lightDirection =
    (insights?.focusZones.left ?? 0.33) > (insights?.focusZones.right ?? 0.33) + 0.04
      ? 'left'
      : (insights?.focusZones.right ?? 0.33) > (insights?.focusZones.left ?? 0.33) + 0.04
        ? 'right'
        : 'mixed'

  return {
    source: 'heuristic',
    providerName: 'habi-heuristic-vision-v1',
    imageUrl: input.imageUrl,
    sourceViews: input.sourceViews,
    depthMapUrl: null,
    segmentationMapUrl: null,
    dimensions: {
      widthMeters: Number(roomWidth.toFixed(2)),
      depthMeters: Number(roomDepth.toFixed(2)),
      heightMeters: Number(roomHeight.toFixed(2)),
      confidence: insights ? 0.62 : 0.48,
    },
    camera: {
      fovDegrees: insights?.orientation === 'landscape' ? 64 : 72,
      pitchDegrees: clamp(Math.round(((insights?.focusZones.bottom ?? 0.55) - 0.5) * -18), -8, 8),
      yawDegrees: clamp(Math.round(((insights?.focusZones.left ?? 0.33) - (insights?.focusZones.right ?? 0.33)) * 20), -8, 8),
      rollDegrees: 0,
      heightMeters: 1.45,
      vanishingPoint: { x: 50, y: wallSplit },
      confidence: insights ? 0.58 : 0.42,
    },
    lighting: {
      direction: lightDirection,
      quality: input.analysis.lighting,
      intensity: clamp(insights?.averageBrightness ?? 0.62, 0.2, 0.95),
      confidence: insights ? 0.64 : 0.45,
    },
    planes: [
      {
        id: 'plane-floor',
        label: 'Detected floor plane',
        kind: 'floor',
        polygon: [
          { x: 0, y: 100 },
          { x: 100, y: 100 },
          { x: 82, y: wallSplit },
          { x: 18, y: wallSplit },
        ],
        confidence: insights ? 0.7 : 0.54,
        normal: [0, 1, 0],
        depthRangeMeters: [1.2, roomDepth],
      },
      {
        id: 'plane-back-wall',
        label: 'Back wall',
        kind: 'wall',
        polygon: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
          { x: 82, y: wallSplit },
          { x: 18, y: wallSplit },
        ],
        confidence: insights ? 0.66 : 0.48,
        normal: [0, 0, 1],
        depthRangeMeters: [roomDepth - 0.2, roomDepth],
      },
      {
        id: 'plane-left-wall',
        label: 'Left wall',
        kind: 'wall',
        polygon: [
          { x: 0, y: 0 },
          { x: 18, y: wallSplit },
          { x: 0, y: 100 },
        ],
        confidence: 0.52,
        normal: [1, 0, 0],
      },
      {
        id: 'plane-right-wall',
        label: 'Right wall',
        kind: 'wall',
        polygon: [
          { x: 100, y: 0 },
          { x: 100, y: 100 },
          { x: 82, y: wallSplit },
        ],
        confidence: 0.52,
        normal: [-1, 0, 0],
      },
    ],
    preservedObjects,
    emptyPlacementZones,
    qualityScore: insights ? 0.68 : 0.52,
    warnings: [
      'Heuristic reconstruction used because no external room vision provider returned structural data.',
      `Generated room shell preserves ${preset.roomTheme.toLowerCase()} palette while keeping existing large objects as blockers.`,
    ],
  }
}

function normalizeExternalAnalysis(
  input: RoomVisionProviderInput,
  payload: unknown,
): RoomStructuralAnalysis | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null
  const value = payload as Partial<RoomStructuralAnalysis>
  const fallback = buildHeuristicStructuralAnalysis(input)

  return {
    ...fallback,
    ...value,
    source: 'vision-provider',
    providerName: typeof value.providerName === 'string' ? value.providerName : 'external-room-vision',
    imageUrl: input.imageUrl,
    sourceViews: input.sourceViews,
    dimensions: {
      ...fallback.dimensions,
      ...(value.dimensions && typeof value.dimensions === 'object' ? value.dimensions : {}),
    },
    camera: {
      ...fallback.camera,
      ...(value.camera && typeof value.camera === 'object' ? value.camera : {}),
    },
    lighting: {
      ...fallback.lighting,
      ...(value.lighting && typeof value.lighting === 'object' ? value.lighting : {}),
    },
    planes: Array.isArray(value.planes) && value.planes.length > 0 ? value.planes : fallback.planes,
    preservedObjects:
      Array.isArray(value.preservedObjects) && value.preservedObjects.length > 0
        ? value.preservedObjects.map((object) => ({
            ...object,
            bounds: clampBounds(object.bounds),
            preserve: object.preserve !== false,
          }))
        : fallback.preservedObjects,
    emptyPlacementZones:
      Array.isArray(value.emptyPlacementZones) && value.emptyPlacementZones.length > 0
        ? value.emptyPlacementZones.map((zone) => ({ ...zone, bounds: clampBounds(zone.bounds) }))
        : fallback.emptyPlacementZones,
    qualityScore: clamp(typeof value.qualityScore === 'number' ? value.qualityScore : fallback.qualityScore, 0, 1),
    warnings: Array.isArray(value.warnings) ? value.warnings : fallback.warnings,
  }
}

function getHttpVisionProvider(): RoomVisionProvider | null {
  const endpoint = process.env.ROOM_VISION_API_URL?.trim()
  if (!endpoint) return null
  const apiKey = process.env.ROOM_VISION_API_KEY?.trim()

  return {
    name: 'external-room-vision',
    async analyze(input) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(input),
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Room vision provider failed with ${response.status}`)
      }

      const normalized = normalizeExternalAnalysis(input, await response.json())
      if (!normalized) {
        throw new Error('Room vision provider returned an invalid structural payload.')
      }
      return normalized
    },
  }
}

export async function getRoomStructuralAnalysis(
  input: RoomVisionProviderInput,
): Promise<RoomStructuralAnalysis> {
  const provider = getHttpVisionProvider()
  if (!provider) return buildHeuristicStructuralAnalysis(input)

  try {
    return await provider.analyze(input)
  } catch (error) {
    const fallback = buildHeuristicStructuralAnalysis(input)
    return {
      ...fallback,
      warnings: [
        ...fallback.warnings,
        error instanceof Error
          ? `External room vision unavailable: ${error.message}`
          : 'External room vision unavailable.',
      ],
    }
  }
}
