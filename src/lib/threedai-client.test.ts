import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildThreeDAIRequestMetadata,
  buildThreeDAIRoomPrompt,
  normalizeThreeDAIStatus,
} from '@/lib/threedai-client'

test('normalizeThreeDAIStatus maps service aliases', () => {
  assert.equal(normalizeThreeDAIStatus('QUEUED'), 'PENDING')
  assert.equal(normalizeThreeDAIStatus('RUNNING'), 'PROCESSING')
  assert.equal(normalizeThreeDAIStatus('FINISHED'), 'COMPLETED')
  assert.equal(normalizeThreeDAIStatus('FAILED'), 'FAILED')
})

test('buildThreeDAIRoomPrompt includes room and product context with bounded length', () => {
  const prompt = buildThreeDAIRoomPrompt({
    roomId: 'room-1',
    imageUrl: 'https://example.com/room.jpg',
    roomTheme: 'Tropical Calm',
    presetId: 'sunlit-sala',
    notes:
      'Keep the center walkway open for foot traffic and preserve the natural window light across the woven textures.',
    recommendations: [
      {
        productId: 'prod-1',
        productName: 'Handwoven Rattan Basket',
        materialType: 'Rattan',
        primaryImageUrl: 'https://example.com/seed/prod-1.webp',
        imageUrls: ['https://example.com/seed/prod-1.webp'],
        reasonTags: ['Tropical Calm', 'storage accent'],
      },
    ],
  })

  assert.match(prompt, /Tropical Calm/)
  assert.match(prompt, /Handwoven Rattan Basket/)
  assert.match(prompt, /Rattan/)
  assert.match(prompt, /center walkway open/)
  assert.ok(prompt.length <= 900)
})

test('buildThreeDAIRequestMetadata keeps top 4 product contexts and primary images', () => {
  const metadata = buildThreeDAIRequestMetadata({
    roomId: 'room-1',
    imageUrl: 'https://example.com/room.jpg',
    roomTheme: 'Crafted Modern',
    presetId: 'maker-loft',
    recommendations: Array.from({ length: 5 }, (_, index) => ({
      productId: `prod-${index + 1}`,
      productName: `Product ${index + 1}`,
      materialType: 'Bamboo',
      primaryImageUrl: index === 0 ? 'https://example.com/seed/prod-1.webp' : null,
      imageUrls: index === 0 ? ['https://example.com/seed/prod-1.webp'] : [],
      reasonTags: ['Crafted Modern'],
    })),
  })

  assert.equal(metadata.productContext.length, 4)
  assert.equal(metadata.productContext[0]?.primaryImageUrl, 'https://example.com/seed/prod-1.webp')
  assert.deepEqual(metadata.productContext[0]?.imageUrls, ['https://example.com/seed/prod-1.webp'])
})
