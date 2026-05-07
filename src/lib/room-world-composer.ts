import * as THREE from 'three'
import { getRoomPreset } from '@/lib/room-presets'
import type {
  RoomAnalysis,
  RoomGenerateRequest,
  RoomPlacedItem,
  RoomRecommendation,
  RoomSceneAnchor,
  RoomSceneData,
  RoomSceneHotspot,
} from '@/types/room'

type ComposedWorld = {
  roomTheme: string
  scene: RoomSceneData
  previewImageUrl: string
  worldAssetUrl: string
}

type MeshDef = {
  geometry: THREE.BufferGeometry
  color: string
  roughness?: number
  metalness?: number
}

function encodeSvg(markup: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(markup.replace(/\n\s*/g, ''))}`
}

function escapeSvg(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
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

function toBaseColorFactor(hex: string, alpha = 1): [number, number, number, number] {
  const [r, g, b] = hexToRgb(hex)
  return [r / 255, g / 255, b / 255, alpha]
}

function inferObjectKind(recommendation: RoomRecommendation, anchor: RoomSceneAnchor): RoomPlacedItem['objectKind'] {
  const name = recommendation.productName.toLowerCase()
  if (anchor.type === 'wall') return 'wall-art'
  if (anchor.type === 'tabletop' || anchor.type === 'shelf') {
    if (name.includes('basket')) return 'basket'
    return 'vessel'
  }
  if (name.includes('table') || name.includes('console')) return 'table'
  if (name.includes('basket')) return 'basket'
  if (name.includes('chair') || name.includes('sofa') || name.includes('lounge')) return 'seat'
  return anchor.type === 'corner' ? 'shelf-object' : 'seat'
}

function scoreRecommendationForAnchor(recommendation: RoomRecommendation, anchor: RoomSceneAnchor): number {
  let score = recommendation.score + anchor.confidence * 20
  if (anchor.preferredMaterialTypes.includes(recommendation.materialType)) score += 14
  if (anchor.type === 'wall' && /tapestry|wall|lamp|frame|art/i.test(recommendation.productName)) score += 18
  if (anchor.type === 'tabletop' && /basket|pottery|vase|lamp/i.test(recommendation.productName)) score += 16
  if (anchor.type === 'floor' && /chair|sofa|table|lounge/i.test(recommendation.productName)) score += 14
  if (anchor.type === 'corner' && /basket|lamp|table/i.test(recommendation.productName)) score += 12
  return score
}

function placeRecommendations(
  roomTheme: string,
  analysis: RoomAnalysis,
  recommendations: RoomRecommendation[],
): RoomPlacedItem[] {
  const placedItems: RoomPlacedItem[] = []
  const anchors = analysis.anchors.filter((anchor) => !anchor.blocked)
  const desiredCount = Math.max(4, Math.min(6, Math.min(recommendations.length, anchors.length)))
  const usedListings = new Set<string>()
  const usedAnchors = new Set<string>()

  for (let step = 0; step < desiredCount; step += 1) {
    let best:
      | {
          recommendation: RoomRecommendation
          anchor: RoomSceneAnchor
          score: number
        }
      | null = null

    for (const recommendation of recommendations) {
      if (usedListings.has(recommendation.listingId)) continue
      for (const anchor of anchors) {
        if (usedAnchors.has(anchor.id)) continue
        const score = scoreRecommendationForAnchor(recommendation, anchor)
        if (!best || score > best.score) {
          best = { recommendation, anchor, score }
        }
      }
    }

    if (!best) break
    usedListings.add(best.recommendation.listingId)
    usedAnchors.add(best.anchor.id)

    const objectKind = inferObjectKind(best.recommendation, best.anchor)
    placedItems.push({
      listingId: best.recommendation.listingId,
      productId: best.recommendation.productId,
      name: best.recommendation.productName,
      artisanName: best.recommendation.artisanName,
      price: best.recommendation.price,
      primaryMode: best.recommendation.primaryMode,
      reason: `${analysis.styleCues[0] ?? roomTheme} · ${best.anchor.label.toLowerCase()}`,
      label: best.recommendation.productName.split(' ').slice(0, 2).join(' '),
      route: `/buyer/room/visualizer/${best.recommendation.listingId}`,
      imageUrl: best.recommendation.imageUrl,
      bounds: best.anchor.bounds,
      anchorId: best.anchor.id,
      placementScore: best.score,
      scale:
        best.anchor.type === 'wall'
          ? 0.85
          : best.anchor.type === 'tabletop'
            ? 0.72
            : best.anchor.type === 'corner'
              ? 0.92
              : 1,
      colorHint: analysis.palette.accent,
      objectKind,
    })
  }

  return placedItems
}

function buildPreviewImage(theme: string, scene: RoomSceneData): string {
  const labels = scene.placedItems
    .map((item) => {
      const x = item.bounds.x * 4.2
      const y = item.bounds.y * 6.6
      const width = item.bounds.width * 4.2
      const height = item.bounds.height * 5.8
      return `
        <g>
          <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="22" fill="#ffffff" fill-opacity="0.78" stroke="${scene.palette.accent}" stroke-opacity="0.36" stroke-width="5"/>
          <text x="${x + width / 2}" y="${y + height / 2}" text-anchor="middle" font-size="16" font-family="Arial" fill="#2c2c2c">${escapeSvg(item.label)}</text>
        </g>
      `
    })
    .join('')

  return encodeSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 740">
      <defs>
        <linearGradient id="wall" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${scene.palette.wall}"/>
          <stop offset="1" stop-color="${scene.palette.highlight}"/>
        </linearGradient>
        <linearGradient id="floor" x1="0" x2="1" y1="0" y2="0">
          <stop stop-color="${scene.palette.floor}"/>
          <stop offset="1" stop-color="${scene.palette.shadow}"/>
        </linearGradient>
      </defs>
      <rect width="420" height="740" fill="url(#wall)"/>
      <rect y="456" width="420" height="284" fill="url(#floor)"/>
      <rect x="0" y="438" width="420" height="22" fill="${scene.palette.highlight}" fill-opacity="0.88"/>
      <rect x="38" y="32" width="210" height="48" rx="24" fill="#ffffff" fill-opacity="0.72"/>
      <text x="143" y="62" text-anchor="middle" font-size="21" font-family="Georgia" fill="#1b5e3f">${escapeSvg(theme)}</text>
      <rect x="258" y="84" width="108" height="132" rx="36" fill="${scene.palette.accent}" fill-opacity="0.14"/>
      <rect x="58" y="108" width="78" height="96" rx="28" fill="#ffffff" fill-opacity="0.22"/>
      <rect x="146" y="504" width="130" height="54" rx="26" fill="${scene.palette.accent}" fill-opacity="0.18"/>
      ${labels}
    </svg>
  `)
}

function pushBytes(target: number[], bytes: Uint8Array) {
  for (const value of bytes) target.push(value)
}

function alignBytes(target: number[], multiple: number, fill = 0) {
  while (target.length % multiple !== 0) target.push(fill)
}

function arrayBufferToBytes(buffer: ArrayBufferLike): Uint8Array {
  return new Uint8Array(buffer.slice(0))
}

function createMeshDefs(scene: RoomSceneData): MeshDef[] {
  const roomWidth = 7.2
  const roomDepth = 6.2
  const roomHeight = 3.1
  const defs: MeshDef[] = []

  const makePlane = (width: number, height: number, color: string, transform: (g: THREE.BufferGeometry) => void) => {
    const geometry = new THREE.PlaneGeometry(width, height)
    transform(geometry)
    defs.push({ geometry, color, roughness: 0.88, metalness: 0.02 })
  }

  makePlane(roomWidth, roomDepth, scene.palette.floor, (g) => {
    g.rotateX(-Math.PI / 2)
    g.translate(0, 0, 0)
  })
  makePlane(roomWidth, roomHeight, scene.palette.wall, (g) => {
    g.translate(0, roomHeight / 2, -roomDepth / 2)
  })
  makePlane(roomDepth, roomHeight, scene.palette.wall, (g) => {
    g.rotateY(Math.PI / 2)
    g.translate(-roomWidth / 2, roomHeight / 2, 0)
  })
  makePlane(roomDepth, roomHeight, scene.palette.highlight, (g) => {
    g.rotateY(-Math.PI / 2)
    g.translate(roomWidth / 2, roomHeight / 2, 0)
  })

  const rug = new THREE.BoxGeometry(2.6, 0.05, 1.8)
  rug.translate(0.25, 0.03, 0.55)
  defs.push({ geometry: rug, color: scene.palette.accent, roughness: 0.95, metalness: 0.02 })

  const windowPane = new THREE.BoxGeometry(1.6, 1.1, 0.04)
  windowPane.translate(2.05, 2.0, -roomDepth / 2 + 0.03)
  defs.push({ geometry: windowPane, color: '#f5f8fb', roughness: 0.25, metalness: 0.05 })

  const consoleTable = new THREE.BoxGeometry(1.4, 0.78, 0.42)
  consoleTable.translate(-2.1, 0.39, -2.0)
  defs.push({ geometry: consoleTable, color: '#7b5a45', roughness: 0.86, metalness: 0.04 })

  for (const item of scene.placedItems) {
    const x = (item.bounds.x / 100) * roomWidth - roomWidth / 2 + ((item.bounds.width / 100) * roomWidth) / 2
    const z = (item.bounds.y / 100) * roomDepth - roomDepth / 2 + ((item.bounds.height / 100) * roomDepth) / 2
    const accent = item.colorHint || scene.palette.accent
    if (item.bounds.anchor === 'wall') {
      const geometry = new THREE.BoxGeometry(0.9 * item.scale, 0.62 * item.scale, 0.06)
      geometry.translate(x, 1.72, -roomDepth / 2 + 0.08)
      defs.push({ geometry, color: accent, roughness: 0.72, metalness: 0.06 })
      continue
    }

    if (item.bounds.anchor === 'tabletop' || item.bounds.anchor === 'shelf') {
      const top = new THREE.CylinderGeometry(0.12 * item.scale, 0.16 * item.scale, 0.42 * item.scale, 18)
      top.translate(x, 0.95, z * 0.6)
      defs.push({ geometry: top, color: accent, roughness: 0.58, metalness: 0.08 })
      continue
    }

    if (item.objectKind === 'table') {
      const table = new THREE.BoxGeometry(1.0 * item.scale, 0.52, 0.62 * item.scale)
      table.translate(x, 0.27, z * 0.72)
      defs.push({ geometry: table, color: '#8f6b45', roughness: 0.82, metalness: 0.04 })
      continue
    }

    if (item.objectKind === 'basket' || item.objectKind === 'vessel') {
      const vessel = new THREE.CylinderGeometry(0.24 * item.scale, 0.28 * item.scale, 0.45 * item.scale, 20)
      vessel.translate(x, 0.24, z * 0.72)
      defs.push({ geometry: vessel, color: accent, roughness: 0.66, metalness: 0.04 })
      continue
    }

    const seat = new THREE.BoxGeometry(1.12 * item.scale, 0.74, 0.72 * item.scale)
    seat.translate(x, 0.37, z * 0.72)
    defs.push({ geometry: seat, color: accent, roughness: 0.74, metalness: 0.04 })
  }

  return defs
}

function createGlbDataUri(meshes: MeshDef[]): string {
  const gltf: Record<string, unknown> = {
    asset: { version: '2.0', generator: 'habi-room-composer' },
    scene: 0,
    scenes: [{ nodes: [] as number[] }],
    nodes: [] as Array<Record<string, unknown>>,
    meshes: [] as Array<Record<string, unknown>>,
    materials: [] as Array<Record<string, unknown>>,
    accessors: [] as Array<Record<string, unknown>>,
    bufferViews: [] as Array<Record<string, unknown>>,
    buffers: [{ byteLength: 0 }],
  }

  const binary: number[] = []
  const sceneNodes = gltf.scenes as Array<{ nodes: number[] }>
  const nodes = gltf.nodes as Array<Record<string, unknown>>
  const gltfMeshes = gltf.meshes as Array<Record<string, unknown>>
  const materials = gltf.materials as Array<Record<string, unknown>>
  const accessors = gltf.accessors as Array<Record<string, unknown>>
  const bufferViews = gltf.bufferViews as Array<Record<string, unknown>>

  for (const meshDef of meshes) {
    const geometry = meshDef.geometry.toNonIndexed()
    geometry.computeVertexNormals()
    const position = geometry.getAttribute('position')
    const normal = geometry.getAttribute('normal')
    const positionBytes = arrayBufferToBytes(position.array.buffer)
    const normalBytes = arrayBufferToBytes(normal.array.buffer)

    alignBytes(binary, 4)
    const positionOffset = binary.length
    pushBytes(binary, positionBytes)
    alignBytes(binary, 4)
    const normalOffset = binary.length
    pushBytes(binary, normalBytes)

    const positionBufferView = bufferViews.push({
      buffer: 0,
      byteOffset: positionOffset,
      byteLength: positionBytes.byteLength,
      target: 34962,
    }) - 1

    const normalBufferView = bufferViews.push({
      buffer: 0,
      byteOffset: normalOffset,
      byteLength: normalBytes.byteLength,
      target: 34962,
    }) - 1

    const positionAccessor = accessors.push({
      bufferView: positionBufferView,
      componentType: 5126,
      count: position.count,
      type: 'VEC3',
      min: [position.getX(0), position.getY(0), position.getZ(0)],
      max: [position.getX(0), position.getY(0), position.getZ(0)],
    }) - 1

    for (let index = 1; index < position.count; index += 1) {
      const accessor = accessors[positionAccessor] as {
        min: [number, number, number]
        max: [number, number, number]
      }
      accessor.min[0] = Math.min(accessor.min[0], position.getX(index))
      accessor.min[1] = Math.min(accessor.min[1], position.getY(index))
      accessor.min[2] = Math.min(accessor.min[2], position.getZ(index))
      accessor.max[0] = Math.max(accessor.max[0], position.getX(index))
      accessor.max[1] = Math.max(accessor.max[1], position.getY(index))
      accessor.max[2] = Math.max(accessor.max[2], position.getZ(index))
    }

    const normalAccessor = accessors.push({
      bufferView: normalBufferView,
      componentType: 5126,
      count: normal.count,
      type: 'VEC3',
    }) - 1

    const materialIndex =
      materials.push({
        pbrMetallicRoughness: {
          baseColorFactor: toBaseColorFactor(meshDef.color),
          metallicFactor: meshDef.metalness ?? 0.05,
          roughnessFactor: meshDef.roughness ?? 0.8,
        },
        doubleSided: true,
      }) - 1

    const meshIndex =
      gltfMeshes.push({
        primitives: [
          {
            attributes: {
              POSITION: positionAccessor,
              NORMAL: normalAccessor,
            },
            material: materialIndex,
          },
        ],
      }) - 1

    const nodeIndex = nodes.push({ mesh: meshIndex }) - 1
    sceneNodes[0].nodes.push(nodeIndex)
  }

  ;(gltf.buffers as Array<{ byteLength: number }>)[0].byteLength = binary.length

  const jsonChunk = Buffer.from(JSON.stringify(gltf), 'utf8')
  const jsonPadding = (4 - (jsonChunk.length % 4)) % 4
  const paddedJson = Buffer.concat([jsonChunk, Buffer.alloc(jsonPadding, 0x20)])
  const binChunk = Buffer.from(binary)
  const binPadding = (4 - (binChunk.length % 4)) % 4
  const paddedBin = Buffer.concat([binChunk, Buffer.alloc(binPadding, 0x00)])

  const totalLength = 12 + 8 + paddedJson.length + 8 + paddedBin.length
  const glb = Buffer.alloc(totalLength)
  let offset = 0
  glb.writeUInt32LE(0x46546c67, offset)
  offset += 4
  glb.writeUInt32LE(2, offset)
  offset += 4
  glb.writeUInt32LE(totalLength, offset)
  offset += 4
  glb.writeUInt32LE(paddedJson.length, offset)
  offset += 4
  glb.writeUInt32LE(0x4e4f534a, offset)
  offset += 4
  paddedJson.copy(glb, offset)
  offset += paddedJson.length
  glb.writeUInt32LE(paddedBin.length, offset)
  offset += 4
  glb.writeUInt32LE(0x004e4942, offset)
  offset += 4
  paddedBin.copy(glb, offset)

  return `data:model/gltf-binary;base64,${glb.toString('base64')}`
}

export function composeRoomWorld(
  input: Pick<RoomGenerateRequest, 'presetId'>,
  analysis: RoomAnalysis,
  recommendations: RoomRecommendation[],
): ComposedWorld {
  const preset = getRoomPreset(input.presetId)
  const placedItems = placeRecommendations(preset.roomTheme, analysis, recommendations)
  const hotspots: RoomSceneHotspot[] = placedItems.map((item) => ({
    listingId: item.listingId,
    productId: item.productId,
    name: item.name,
    artisanName: item.artisanName,
    price: item.price,
    primaryMode: item.primaryMode,
    reason: item.reason,
    label: item.label,
    route: item.route,
    imageUrl: item.imageUrl,
    bounds: item.bounds,
  }))

  const generationWarnings = [...analysis.warnings]
  if (placedItems.length < 4) {
    generationWarnings.push('Limited anchor confidence reduced furnishing density for this room.')
  }

  const scene: RoomSceneData = {
    title: `${preset.name} Reconstruction`,
    theme: preset.roomTheme,
    worldKind: 'composed',
    palette: analysis.palette,
    analysis,
    anchors: analysis.anchors,
    placedItems,
    generationWarnings,
    hotspots,
  }

  return {
    roomTheme: preset.roomTheme,
    scene,
    previewImageUrl: buildPreviewImage(preset.roomTheme, scene),
    worldAssetUrl: createGlbDataUri(createMeshDefs(scene)),
  }
}
