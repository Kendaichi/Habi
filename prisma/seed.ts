import 'dotenv/config'
import {
  PrismaClient,
  Role,
  ListingType,
  ListingStatus,
  OrderStatus,
  RefurbStatus,
} from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DIRECT_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // ── Users ──────────────────────────────────────────────────────────────────
  const artisan = await prisma.user.upsert({
    where: { email: 'sitti@habi.ph' },
    update: {},
    create: {
      id: 'user-artisan-sitti',
      email: 'sitti@habi.ph',
      name: 'Sitti Anang',
      role: Role.ARTISAN,
    },
  })

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@habi.ph' },
    update: {},
    create: {
      id: 'user-buyer-juan',
      email: 'buyer@habi.ph',
      name: 'Juan dela Cruz',
      role: Role.BUYER,
    },
  })

  // ── JunkShops ──────────────────────────────────────────────────────────────
  const junkShops = [
    {
      id: 'junkshop-manila-plastic-hub',
      name: 'Manila Plastic Hub',
      city: 'Manila',
      address: 'Tondo District, Manila',
      materials: ['Plastic'],
      verifiedAt: new Date('2025-01-01'),
    },
    {
      id: 'junkshop-koronadal-recyclers',
      name: 'Koronadal Recyclers',
      city: 'Koronadal City',
      address: 'Purok 12, Koronadal City',
      materials: ['Plastic', 'Metal'],
      verifiedAt: new Date('2025-01-15'),
    },
    {
      id: 'junkshop-south-cotabato-green',
      name: 'South Cotabato Green Hub',
      city: 'Surallah',
      address: 'GenSan Drive, Surallah',
      materials: ['Bamboo', 'Textile'],
      verifiedAt: new Date('2025-02-10'),
    },
    {
      id: 'junkshop-mindanao-recyclers',
      name: 'Mindanao Recyclers Hub',
      city: 'Davao City',
      address: 'Ilustre St., Davao City',
      materials: ['Plastic', 'Metal', 'Bamboo'],
      verifiedAt: new Date('2025-03-05'),
    },
  ]

  for (const shop of junkShops) {
    await prisma.junkShop.upsert({
      where: { id: shop.id },
      update: {},
      create: shop,
    })
  }

  // ── Materials ──────────────────────────────────────────────────────────────
  const materials = [
    {
      id: 'mat-manila-plastic',
      junkShopId: 'junkshop-manila-plastic-hub',
      type: 'Plastic',
      quantityKg: 200,
      pricePerKg: 10,
    },
    {
      id: 'mat-koronadal-plastic',
      junkShopId: 'junkshop-koronadal-recyclers',
      type: 'Plastic',
      quantityKg: 45,
      pricePerKg: 12,
    },
    {
      id: 'mat-koronadal-metal',
      junkShopId: 'junkshop-koronadal-recyclers',
      type: 'Metal',
      quantityKg: 12,
      pricePerKg: 25,
    },
    {
      id: 'mat-southcot-bamboo',
      junkShopId: 'junkshop-south-cotabato-green',
      type: 'Bamboo',
      quantityKg: 120,
      pricePerKg: 8,
    },
    {
      id: 'mat-southcot-textile',
      junkShopId: 'junkshop-south-cotabato-green',
      type: 'Textile',
      quantityKg: 28,
      pricePerKg: 15,
    },
    {
      id: 'mat-mindanao-plastic',
      junkShopId: 'junkshop-mindanao-recyclers',
      type: 'Plastic',
      quantityKg: 80,
      pricePerKg: 11,
    },
    {
      id: 'mat-mindanao-metal',
      junkShopId: 'junkshop-mindanao-recyclers',
      type: 'Metal',
      quantityKg: 30,
      pricePerKg: 22,
    },
    {
      id: 'mat-mindanao-bamboo',
      junkShopId: 'junkshop-mindanao-recyclers',
      type: 'Bamboo',
      quantityKg: 60,
      pricePerKg: 9,
    },
  ]

  for (const mat of materials) {
    await prisma.material.upsert({
      where: { id: mat.id },
      update: {},
      create: { ...mat, available: true },
    })
  }

  // ── Products ───────────────────────────────────────────────────────────────
  const products = [
    {
      id: 'prod-plastic-brick-panels',
      name: 'Plastic Brick Panels',
      description: 'Compressed HDPE panels for construction and design',
      materialType: 'Plastic',
    },
    {
      id: 'prod-woven-abaca-rugs',
      name: 'Woven Abaca Rugs',
      description: 'Hand-woven natural fiber rugs from local abaca',
      materialType: 'Textile',
    },
    {
      id: 'prod-rattan-baskets',
      name: 'Rattan Baskets',
      description: 'Handcrafted rattan baskets for storage and décor',
      materialType: 'Bamboo',
    },
    {
      id: 'prod-bamboo-planters',
      name: 'Bamboo Planters',
      description: 'Eco-friendly bamboo planters for indoor and outdoor use',
      materialType: 'Bamboo',
    },
    {
      id: 'prod-coco-coir-mats',
      name: 'Coco Coir Mats',
      description: 'Natural coir doormats and floor mats',
      materialType: 'Textile',
    },
    {
      id: 'prod-clay-pottery',
      name: 'Clay Pottery',
      description: 'Handmade clay pots and decorative pottery',
      materialType: 'Plastic',
    },
    {
      id: 'prod-upcycled-wood-trays',
      name: 'Upcycled Wood Trays',
      description: 'Serving trays made from reclaimed wood offcuts',
      materialType: 'Bamboo',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: { ...product, images: [], artisanId: artisan.id },
    })
  }

  // ── Traceability Chains ────────────────────────────────────────────────────
  const chains = [
    {
      id: 'trace-brick-panels',
      productId: 'prod-plastic-brick-panels',
      wasteSupplierName: 'Manila Plastic Hub',
      junkShopId: 'junkshop-manila-plastic-hub',
    },
    {
      id: 'trace-abaca-rugs',
      productId: 'prod-woven-abaca-rugs',
      wasteSupplierName: 'South Cotabato Green Hub',
      junkShopId: 'junkshop-south-cotabato-green',
    },
    {
      id: 'trace-rattan-baskets',
      productId: 'prod-rattan-baskets',
      wasteSupplierName: 'Mindanao Recyclers Hub',
      junkShopId: 'junkshop-mindanao-recyclers',
    },
  ]

  for (const chain of chains) {
    await prisma.traceabilityChain.upsert({
      where: { productId: chain.productId },
      update: {},
      create: { ...chain, artisanId: artisan.id },
    })
  }

  // ── Listings ───────────────────────────────────────────────────────────────
  const listings = [
    {
      id: 'listing-brick-sale',
      productId: 'prod-plastic-brick-panels',
      type: ListingType.SALE,
      price: 185,
      status: ListingStatus.AVAILABLE,
      views: 1240,
    },
    {
      id: 'listing-brick-lease',
      productId: 'prod-plastic-brick-panels',
      type: ListingType.LEASE,
      price: 45,
      status: ListingStatus.IN_USE,
      views: 980,
    },
    {
      id: 'listing-abaca-sale',
      productId: 'prod-woven-abaca-rugs',
      type: ListingType.SALE,
      price: 850,
      status: ListingStatus.AVAILABLE,
      views: 870,
    },
    {
      id: 'listing-rattan-rent',
      productId: 'prod-rattan-baskets',
      type: ListingType.RENT,
      price: 120,
      status: ListingStatus.IN_USE,
      views: 3480,
    },
    {
      id: 'listing-bamboo-sale',
      productId: 'prod-bamboo-planters',
      type: ListingType.SALE,
      price: 350,
      status: ListingStatus.AVAILABLE,
      views: 540,
    },
    {
      id: 'listing-coir-sale',
      productId: 'prod-coco-coir-mats',
      type: ListingType.SALE,
      price: 280,
      status: ListingStatus.AVAILABLE,
      views: 310,
    },
    {
      id: 'listing-pottery-sale',
      productId: 'prod-clay-pottery',
      type: ListingType.SALE,
      price: 450,
      status: ListingStatus.AVAILABLE,
      views: 220,
    },
    {
      id: 'listing-wood-tray-sale',
      productId: 'prod-upcycled-wood-trays',
      type: ListingType.SALE,
      price: 620,
      status: ListingStatus.DRAFT,
      views: 0,
    },
    {
      id: 'listing-brick-rent-1',
      productId: 'prod-plastic-brick-panels',
      type: ListingType.RENT,
      price: 35,
      status: ListingStatus.IN_USE,
      views: 450,
    },
    {
      id: 'listing-bamboo-rent',
      productId: 'prod-bamboo-planters',
      type: ListingType.RENT,
      price: 80,
      status: ListingStatus.IN_USE,
      views: 290,
    },
  ]

  for (const listing of listings) {
    await prisma.listing.upsert({
      where: { id: listing.id },
      update: {},
      create: listing,
    })
  }

  // ── Orders ─────────────────────────────────────────────────────────────────
  const orders = [
    { id: 'order-001', listingId: 'listing-brick-sale', status: OrderStatus.CONFIRMED },
    { id: 'order-002', listingId: 'listing-abaca-sale', status: OrderStatus.PENDING },
    { id: 'order-003', listingId: 'listing-coir-sale', status: OrderStatus.SHIPPED },
    { id: 'order-004', listingId: 'listing-pottery-sale', status: OrderStatus.DELIVERED },
    { id: 'order-005', listingId: 'listing-wood-tray-sale', status: OrderStatus.PENDING },
  ]

  for (const order of orders) {
    await prisma.order.upsert({
      where: { id: order.id },
      update: {},
      create: { ...order, buyerId: buyer.id },
    })
  }

  // ── Rentals (8 active, 1 pending return) ───────────────────────────────────
  const rentals = [
    {
      id: 'rental-001',
      listingId: 'listing-brick-lease',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-06-30'),
      returnedAt: null,
      refurbStatus: RefurbStatus.IN_USE,
    },
    {
      id: 'rental-002',
      listingId: 'listing-rattan-rent',
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-05-15'),
      returnedAt: null,
      refurbStatus: RefurbStatus.AWAITING,
    },
    {
      id: 'rental-003',
      listingId: 'listing-brick-rent-1',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-05-31'),
      returnedAt: null,
      refurbStatus: RefurbStatus.IN_USE,
    },
    {
      id: 'rental-004',
      listingId: 'listing-bamboo-rent',
      startDate: new Date('2026-04-10'),
      endDate: new Date('2026-05-10'),
      returnedAt: null,
      refurbStatus: RefurbStatus.IN_USE,
    },
    {
      id: 'rental-005',
      listingId: 'listing-brick-lease',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-04-30'),
      returnedAt: new Date('2026-04-28'),
      refurbStatus: RefurbStatus.REFURBISHING,
    },
    {
      id: 'rental-006',
      listingId: 'listing-rattan-rent',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-03-15'),
      returnedAt: new Date('2026-03-14'),
      refurbStatus: RefurbStatus.REFURBISHING,
    },
    {
      id: 'rental-007',
      listingId: 'listing-bamboo-rent',
      startDate: new Date('2026-03-20'),
      endDate: new Date('2026-04-20'),
      returnedAt: null,
      refurbStatus: RefurbStatus.IN_USE,
    },
    {
      id: 'rental-008',
      listingId: 'listing-brick-lease',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-07-01'),
      returnedAt: null,
      refurbStatus: RefurbStatus.IN_USE,
    },
  ]

  for (const rental of rentals) {
    await prisma.rental.upsert({
      where: { id: rental.id },
      update: {},
      create: { ...rental, buyerId: buyer.id },
    })
  }

  // ── Demand Signals (top 10 from /artisan/demand) ───────────────────────────
  const demandSignals = [
    { id: 'demand-001', keyword: 'Plastic Brick Panels', city: 'Siargao', count: 1800 },
    { id: 'demand-002', keyword: 'Woven Abaca Rugs', city: 'Davao City', count: 1500 },
    { id: 'demand-003', keyword: 'Rattan Baskets', city: 'Cagayan de Oro', count: 1200 },
    { id: 'demand-004', keyword: 'Bamboo Planters', city: 'Iligan City', count: 980 },
    { id: 'demand-005', keyword: 'Coco Coir Mats', city: 'General Santos City', count: 850 },
    { id: 'demand-006', keyword: 'Clay Pottery', city: 'Davao City', count: 720 },
    { id: 'demand-007', keyword: 'Pandán Totes', city: 'Siargao', count: 650 },
    { id: 'demand-008', keyword: 'Recycled Glassware', city: 'Iligan City', count: 540 },
    { id: 'demand-009', keyword: 'Seashell Decor', city: 'Zamboanga City', count: 490 },
    { id: 'demand-010', keyword: 'Upcycled Wood Trays', city: 'Bukidnon', count: 410 },
    // Near-you signals shown on the dashboard ("12 buyers searched plastic brick panels")
    { id: 'demand-011', keyword: 'Plastic Brick Panels', city: 'Koronadal City', count: 12 },
    { id: 'demand-012', keyword: 'Bamboo Planters', city: 'Koronadal City', count: 7 },
    { id: 'demand-013', keyword: 'Rattan Baskets', city: 'Koronadal City', count: 5 },
  ]

  for (const signal of demandSignals) {
    await prisma.demandSignal.upsert({
      where: { id: signal.id },
      update: { count: signal.count },
      create: signal,
    })
  }

  console.log(`Seeded:
  - 2 users (1 artisan, 1 buyer)
  - ${junkShops.length} junk shops
  - ${materials.length} materials
  - ${products.length} products
  - ${chains.length} traceability chains
  - ${listings.length} listings
  - ${orders.length} orders
  - ${rentals.length} rentals
  - ${demandSignals.length} demand signals`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
