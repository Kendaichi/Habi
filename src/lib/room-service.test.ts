import test from 'node:test'
import assert from 'node:assert/strict'
import { buildProviderRecommendationContext, normalizeProductImageUrls, selectPrimaryProductImageUrl } from '@/lib/room-service'
import type { RoomRecommendation } from '@/types/room'

function makeRecommendation(
  overrides: Partial<RoomRecommendation> & Pick<RoomRecommendation, 'listingId' | 'productId' | 'productName'>,
): RoomRecommendation {
  return {
    listingId: overrides.listingId,
    productId: overrides.productId,
    productName: overrides.productName,
    artisanName: overrides.artisanName ?? 'Sitti Anang',
    artisanId: overrides.artisanId ?? 'artisan-1',
    materialType: overrides.materialType ?? 'Rattan',
    price: overrides.price ?? 1200,
    primaryMode: overrides.primaryMode ?? 'BUY',
    availableModes: overrides.availableModes ?? ['BUY'],
    imageUrl: overrides.imageUrl ?? 'https://example.com/fallback.webp',
    imageUrls: overrides.imageUrls ?? ['https://example.com/fallback.webp'],
    score: overrides.score ?? 80,
    reasonTags: overrides.reasonTags ?? ['Tropical Calm', 'rattan fit'],
    summary: overrides.summary ?? 'Summary',
    traceability: overrides.traceability ?? null,
  }
}

test('normalizeProductImageUrls keeps only unique public URLs', () => {
  assert.deepEqual(normalizeProductImageUrls([
    '',
    '   ',
    'relative/path.webp',
    'https://cdn.example.com/a.webp',
    'https://cdn.example.com/a.webp',
    'http://cdn.example.com/b.webp',
  ]), [
    'https://cdn.example.com/a.webp',
    'http://cdn.example.com/b.webp',
  ])
})

test('selectPrimaryProductImageUrl prefers seed product images', () => {
  assert.equal(
    selectPrimaryProductImageUrl([
      'https://supabase.example/storage/v1/object/public/product-images/pending/item.webp',
      'https://supabase.example/storage/v1/object/public/product-images/seed/prod-1.webp',
    ]),
    'https://supabase.example/storage/v1/object/public/product-images/seed/prod-1.webp',
  )
})

test('buildProviderRecommendationContext falls back to first public image and limits to top 4', () => {
  const recommendations = [
    makeRecommendation({
      listingId: 'l1',
      productId: 'p1',
      productName: 'Seeded Basket',
      imageUrls: [
        'https://supabase.example/storage/v1/object/public/product-images/pending/p1.webp',
        'https://supabase.example/storage/v1/object/public/product-images/seed/p1.webp',
      ],
    }),
    makeRecommendation({
      listingId: 'l2',
      productId: 'p2',
      productName: 'Fallback Lamp',
      imageUrls: ['relative.webp', 'https://cdn.example.com/p2.webp'],
    }),
    makeRecommendation({
      listingId: 'l3',
      productId: 'p3',
      productName: 'No Image Rug',
      imageUrls: ['relative.webp', ''],
    }),
    makeRecommendation({ listingId: 'l4', productId: 'p4', productName: 'Chair' }),
    makeRecommendation({ listingId: 'l5', productId: 'p5', productName: 'Should Be Trimmed' }),
  ]

  const context = buildProviderRecommendationContext(recommendations)
  assert.equal(context.length, 4)
  assert.equal(context[0]?.primaryImageUrl, 'https://supabase.example/storage/v1/object/public/product-images/seed/p1.webp')
  assert.deepEqual(context[0]?.imageUrls, ['https://supabase.example/storage/v1/object/public/product-images/seed/p1.webp'])
  assert.equal(context[1]?.primaryImageUrl, 'https://cdn.example.com/p2.webp')
  assert.deepEqual(context[1]?.imageUrls, ['https://cdn.example.com/p2.webp'])
  assert.equal(context[2]?.primaryImageUrl, null)
  assert.deepEqual(context[2]?.imageUrls, [])
})
