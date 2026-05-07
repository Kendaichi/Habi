import test from 'node:test'
import assert from 'node:assert/strict'
import { composeRoomWorld } from '@/lib/room-world-composer'
import { getRoomStructuralAnalysis } from '@/lib/room-vision-provider'
import type { AcquisitionMode, RoomAnalysis, RoomRecommendation } from '@/types/room'

const analysis: RoomAnalysis = {
  source: 'heuristic',
  roomType: 'living-room',
  lighting: 'natural',
  palette: {
    wall: '#f4eadf',
    floor: '#8a6b4d',
    accent: '#1b5e3f',
    highlight: '#fff8ef',
    shadow: '#4f3b2d',
  },
  styleCues: ['Tropical Calm', 'natural light'],
  visibleSurfaces: {
    wall: 0.55,
    floor: 0.38,
    ceiling: 0.07,
  },
  freeSpaceSummary: 'Open wall and corner zones are visible.',
  anchors: [
    {
      id: 'anchor-blocked-floor',
      label: 'Existing sofa zone',
      type: 'floor',
      confidence: 0.9,
      bounds: { x: 30, y: 52, width: 36, height: 22, anchor: 'floor' },
      preferredMaterialTypes: ['Bamboo'],
    },
    {
      id: 'anchor-open-wall',
      label: 'Open wall',
      type: 'wall',
      confidence: 0.88,
      bounds: { x: 18, y: 18, width: 24, height: 16, anchor: 'wall' },
      preferredMaterialTypes: ['Textile'],
    },
  ],
  warnings: [],
}

function recommendation(
  listingId: string,
  productName: string,
  materialType: string,
  primaryMode: AcquisitionMode = 'BUY',
): RoomRecommendation {
  return {
    listingId,
    productId: `product-${listingId}`,
    productName,
    artisanName: 'Habi Artisan',
    artisanId: 'artisan-1',
    materialType,
    price: 1200,
    primaryMode,
    availableModes: [primaryMode],
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E',
    score: 100,
    reasonTags: ['fit'],
    summary: 'Room fit',
    traceability: null,
  }
}

test('room structural analysis creates geometry, blockers, and empty zones', async () => {
  const structural = await getRoomStructuralAnalysis({
    imageUrl: 'data:image/jpeg;base64,room',
    sourceViews: ['data:image/jpeg;base64,room', 'data:image/jpeg;base64,left'],
    presetId: 'sunlit-sala',
    analysis,
    imageInsights: {
      width: 1200,
      height: 1600,
      orientation: 'portrait',
      averageBrightness: 0.62,
      contrast: 0.31,
      warmth: 0.58,
      dominantColors: ['#eadfce', '#8a6b4d', '#1b5e3f'],
      focusZones: { left: 0.37, center: 0.36, right: 0.27, top: 0.42, bottom: 0.58 },
    },
  })

  assert.equal(structural.source, 'heuristic')
  assert.ok(structural.dimensions.widthMeters > 0)
  assert.ok(structural.planes.some((plane) => plane.kind === 'floor'))
  assert.ok(structural.preservedObjects.some((object) => object.preserve))
  assert.ok(structural.emptyPlacementZones.length >= 2)
})

test('room composer avoids blocked floor zones and places products in empty zones', async () => {
  const structural = await getRoomStructuralAnalysis({
    imageUrl: 'data:image/jpeg;base64,room',
    sourceViews: ['data:image/jpeg;base64,room'],
    presetId: 'sunlit-sala',
    analysis,
  })
  const world = composeRoomWorld(
    { presetId: 'sunlit-sala', imageUrl: structural.imageUrl, sourceViews: structural.sourceViews },
    analysis,
    [
      recommendation('listing-wall', 'Abaca Wall Tapestry', 'Textile'),
      recommendation('listing-basket', 'Bamboo Floor Basket', 'Bamboo'),
    ],
    structural,
  )

  assert.equal(world.scene.worldKind, 'reconstructed')
  assert.ok(world.worldAssetUrl.startsWith('data:model/gltf-binary;base64,'))
  assert.ok(world.scene.placedItems.length > 0)
  assert.ok(world.scene.placedItems.every((item) => !item.anchorId.includes('blocked')))
})
