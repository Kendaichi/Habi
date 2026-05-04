export const artisans = [
  {
    id: "artisan-1",
    name: "Maria Santos",
    email: "maria.santos@habi.ph",
    city: "Davao City",
    role: "ARTISAN" as const,
  },
  {
    id: "artisan-2",
    name: "Jose Reyes",
    email: "jose.reyes@habi.ph",
    city: "Cagayan de Oro",
    role: "ARTISAN" as const,
  },
  {
    id: "artisan-3",
    name: "Liza Bautista",
    email: "liza.bautista@habi.ph",
    city: "Iligan",
    role: "ARTISAN" as const,
  },
]

export const junkShops = [
  {
    id: "shop-1",
    name: "ABC Recyclers Davao",
    city: "Davao City",
    materials: ["plastic", "metal", "paper"],
    verifiedAt: new Date("2024-01-15"),
  },
  {
    id: "shop-2",
    name: "GreenSort CDO",
    city: "Cagayan de Oro",
    materials: ["plastic", "textile", "bamboo"],
    verifiedAt: new Date("2024-03-20"),
  },
  {
    id: "shop-3",
    name: "Bukidnon EcoHub",
    city: "Malaybalay",
    materials: ["bamboo", "abaca", "agricultural waste"],
    verifiedAt: new Date("2024-02-10"),
  },
]

export const wasteSuppliers = [
  { id: "ws-1", name: "Lim Family Farm", city: "Davao del Sur", type: "agricultural" },
  { id: "ws-2", name: "DelMonte Processing Plant", city: "Bukidnon", type: "industrial" },
  { id: "ws-3", name: "Sarrosa Textile Works", city: "Iligan", type: "textile" },
]

export const products = [
  {
    id: "prod-1",
    name: "Woven Abaca Lamp",
    description:
      "Hand-woven pendant lamp made from dried abaca fiber, casting warm dappled light perfect for Mindanao evenings.",
    images: [] as string[],
    materialType: "Abaca Fiber",
    artisanId: "artisan-1",
    artisanName: "Maria Santos",
    price: 2800,
  },
  {
    id: "prod-2",
    name: "Recycled Plastic Chair",
    description:
      "Sturdy monobloc-style chair crafted from compressed recycled plastic bales collected from Davao barangays.",
    images: [] as string[],
    materialType: "Recycled Plastic",
    artisanId: "artisan-2",
    artisanName: "Jose Reyes",
    price: 1500,
  },
  {
    id: "prod-3",
    name: "Bamboo Shelf",
    description:
      "Three-tier floating shelf fashioned from locally harvested bamboo poles, lightly stained with natural dye.",
    images: [] as string[],
    materialType: "Bamboo",
    artisanId: "artisan-3",
    artisanName: "Liza Bautista",
    price: 3200,
  },
  {
    id: "prod-4",
    name: "Upcycled Tire Table",
    description:
      "Industrial coffee table with a base of stacked truck tires and a tempered glass top — bold, durable, zero-waste.",
    images: [] as string[],
    materialType: "Recycled Tire",
    artisanId: "artisan-1",
    artisanName: "Maria Santos",
    price: 5500,
  },
]

export const materials = [
  {
    id: "mat-1",
    type: "Recycled Plastic",
    quantityKg: 45,
    pricePerKg: 12,
    available: true,
    junkShopId: "shop-1",
    junkShopName: "ABC Recyclers Davao",
    junkShopCity: "Davao City",
  },
  {
    id: "mat-2",
    type: "Bamboo Scraps",
    quantityKg: 20,
    pricePerKg: 8,
    available: true,
    junkShopId: "shop-3",
    junkShopName: "Bukidnon EcoHub",
    junkShopCity: "Malaybalay",
  },
  {
    id: "mat-3",
    type: "Textile Offcuts",
    quantityKg: 15,
    pricePerKg: 25,
    available: false,
    junkShopId: "shop-2",
    junkShopName: "GreenSort CDO",
    junkShopCity: "Cagayan de Oro",
  },
]

export const traceabilityChains = [
  {
    id: "trace-1",
    productId: "prod-1",
    wasteSupplierName: "Lim Family Farm",
    junkShopName: "Bukidnon EcoHub",
    artisanName: "Maria Santos",
  },
  {
    id: "trace-2",
    productId: "prod-2",
    wasteSupplierName: "DelMonte Processing Plant",
    junkShopName: "ABC Recyclers Davao",
    artisanName: "Jose Reyes",
  },
  {
    id: "trace-3",
    productId: "prod-3",
    wasteSupplierName: "Lim Family Farm",
    junkShopName: "Bukidnon EcoHub",
    artisanName: "Liza Bautista",
  },
]

export const demandSignals = [
  { id: "ds-1", keyword: "abaca lampshade", city: "Davao City", count: 47 },
  { id: "ds-2", keyword: "bamboo furniture", city: "Cagayan de Oro", count: 32 },
  { id: "ds-3", keyword: "recycled plastic stool", city: "Iligan", count: 28 },
  { id: "ds-4", keyword: "woven placemats", city: "Cotabato City", count: 19 },
  { id: "ds-5", keyword: "upcycled tire ottoman", city: "General Santos", count: 14 },
]

export const mockOrders = [
  {
    id: "order-1",
    productName: "Woven Abaca Lamp",
    status: "DELIVERED" as const,
    price: 2800,
    createdAt: new Date("2025-04-10"),
  },
  {
    id: "order-2",
    productName: "Bamboo Shelf",
    status: "SHIPPED" as const,
    price: 3200,
    createdAt: new Date("2025-04-28"),
  },
  {
    id: "order-3",
    productName: "Recycled Plastic Chair",
    status: "PENDING" as const,
    price: 1500,
    createdAt: new Date("2025-05-02"),
  },
]
