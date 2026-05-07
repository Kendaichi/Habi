import { getRoomPreset } from '@/lib/room-presets'
import type {
  RoomAnalysis,
  RoomGenerateRequest,
  RoomImageInsights,
  RoomPalette,
  RoomSceneAnchor,
} from '@/types/room'

type AnalyzeRoomInput = Pick<RoomGenerateRequest, 'imageUrl' | 'notes' | 'presetId' | 'imageInsights'>

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ]
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((value) => clampChannel(value).toString(16).padStart(2, '0')).join('')}`
}

function adjustHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex([r + amount, g + amount, b + amount])
}

function hashText(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

function buildHeuristicAnchors(
  presetId: string,
  insights?: RoomImageInsights,
): RoomSceneAnchor[] {
  const preset = getRoomPreset(presetId)
  const floorMaterials = preset.materialAffinity.length > 0 ? preset.materialAffinity : ['Bamboo', 'Textile']
  const leftBias = insights ? Math.round((insights.focusZones.left - insights.focusZones.right) * 12) : 0
  const centerBias = insights ? Math.round((insights.focusZones.center - 0.34) * 18) : 0
  const topBias = insights ? Math.round((0.45 - insights.focusZones.top) * 10) : 0
  const sizeBias = insights ? Math.round(insights.contrast * 6) : 0

  return [
    {
      id: 'anchor-floor-left',
      label: 'Seating zone',
      type: 'floor',
      confidence: 0.88,
      bounds: { x: 12 + leftBias, y: 58 + Math.max(-3, topBias), width: 20 + sizeBias, height: 22, anchor: 'floor' },
      preferredMaterialTypes: floorMaterials,
    },
    {
      id: 'anchor-floor-center',
      label: 'Conversation zone',
      type: 'floor',
      confidence: 0.9,
      bounds: { x: 36 + centerBias, y: 54 + Math.max(-2, topBias), width: 24, height: 24 + sizeBias, anchor: 'floor' },
      preferredMaterialTypes: floorMaterials,
    },
    {
      id: 'anchor-floor-right',
      label: 'Feature corner',
      type: 'corner',
      confidence: 0.84,
      bounds: { x: 66 + leftBias, y: 56 + Math.min(3, -topBias), width: 18 + Math.max(0, sizeBias - 1), height: 22, anchor: 'corner' },
      preferredMaterialTypes: ['Bamboo', 'Plastic', 'Textile'],
    },
    {
      id: 'anchor-wall-main',
      label: 'Primary wall',
      type: 'wall',
      confidence: 0.86,
      bounds: { x: 24 + centerBias, y: 18 + topBias, width: 22 + Math.max(0, sizeBias - 1), height: 16, anchor: 'wall' },
      preferredMaterialTypes: ['Textile', 'Bamboo'],
    },
    {
      id: 'anchor-wall-secondary',
      label: 'Accent wall',
      type: 'wall',
      confidence: 0.8,
      bounds: { x: 58 + leftBias, y: 20 + topBias, width: 20, height: 15 + Math.max(0, sizeBias - 2), anchor: 'wall' },
      preferredMaterialTypes: ['Textile', 'Plastic'],
    },
    {
      id: 'anchor-tabletop',
      label: 'Tabletop accent',
      type: 'tabletop',
      confidence: 0.74,
      bounds: { x: 46 + centerBias, y: 47 + Math.round((insights?.focusZones.bottom ?? 0.55 - 0.55) * 12), width: 12, height: 11, anchor: 'tabletop' },
      preferredMaterialTypes: ['Bamboo', 'Textile', 'Plastic'],
    },
  ]
}

function clampPercent(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function shiftHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex([r + amount, g + amount, b + amount])
}

function buildHeuristicAnalysis(input: AnalyzeRoomInput): RoomAnalysis {
  const preset = getRoomPreset(input.presetId)
  const signal = hashText(`${input.imageUrl ?? ''}|${input.notes ?? ''}|${preset.id}`)
  const insights = input.imageInsights
  const dominantColors = insights?.dominantColors
  const palette: RoomPalette = {
    wall:
      dominantColors?.[0] ??
      adjustHex(preset.wall, (signal % 11) - 5),
    floor:
      dominantColors?.[1] ??
      adjustHex(preset.floor, (signal % 9) - 4),
    accent:
      dominantColors?.[2] ??
      adjustHex(preset.accent, ((signal >> 4) % 7) - 3),
    highlight: shiftHex(
      dominantColors?.[0] ?? '#f7efe3',
      insights ? Math.round((1 - insights.averageBrightness) * 16) : (signal % 7) - 3,
    ),
    shadow: shiftHex(
      dominantColors?.[1] ?? '#5a4736',
      insights ? -Math.round((0.25 + insights.contrast) * 32) : ((signal >> 5) % 11) - 5,
    ),
  }

  const notes = (input.notes ?? '').toLowerCase()
  const roomType =
    insights?.orientation === 'landscape' && insights.focusZones.bottom > 0.58
      ? 'living-room'
      : preset.id === 'maker-loft'
      ? 'studio'
      : notes.includes('gallery')
        ? 'gallery'
        : preset.id === 'heritage-den'
          ? 'den'
          : 'living-room'

  const styleCues = Array.from(
    new Set(
      [preset.roomTheme, `${preset.lighting} light`, 'artisan layout']
        .concat(insights?.orientation === 'portrait' ? ['vertical framing'] : [])
        .concat((insights?.warmth ?? 0.5) > 0.58 ? ['warm wood tones'] : ['cool balanced tones'])
        .concat(notes.includes('wall') ? ['wall emphasis'] : [])
        .concat(notes.includes('seat') ? ['extra seating'] : [])
        .concat(notes.includes('bright') ? ['brightened palette'] : []),
    ),
  ).slice(0, 5)

  return {
    source: 'heuristic',
    roomType,
    lighting:
      insights && insights.averageBrightness > 0.7
        ? 'natural'
        : insights && insights.contrast > 0.45
          ? 'dramatic'
          : preset.lighting,
    palette,
    styleCues,
    visibleSurfaces: {
      wall: clampPercent(insights ? insights.focusZones.top * 1.15 : 0.62, 0.42, 0.74),
      floor: clampPercent(insights ? insights.focusZones.bottom * 0.72 : 0.33, 0.2, 0.5),
      ceiling: clampPercent(insights ? 1 - (insights.focusZones.top + insights.focusZones.bottom) * 0.9 : 0.05, 0.03, 0.18),
    },
    freeSpaceSummary:
      insights && insights.focusZones.center > insights.focusZones.left && insights.focusZones.center > insights.focusZones.right
        ? `The uploaded room suggests the strongest furnishing opportunity runs through the center line, with supporting wall accents above it.`
        : `The uploaded room suggests the clearest furnishing zones lean toward the ${insights && insights.focusZones.left > insights.focusZones.right ? 'left' : 'right'} side with supporting wall anchors.`,
    anchors: buildHeuristicAnchors(preset.id, insights),
    warnings: [],
  }
}

export async function analyzeRoomImage(input: AnalyzeRoomInput): Promise<RoomAnalysis> {
  return buildHeuristicAnalysis(input)
}
