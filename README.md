# Habi

A circular economy marketplace connecting buyers, artisans, and waste suppliers across Mindanao, Philippines. Waste materials flow from suppliers through junk shops to artisans, who transform them into finished products for buyers.

## What it does

**Buyers** — Browse and purchase upcycled products, submit custom requests, and scan rooms for AI-powered furniture recommendations.

**Artisans** — List products for sale/rent/lease, source raw materials from suppliers, and view demand signals showing trending buyer requests.

**Suppliers** — Add and manage waste material inventory, connecting with artisans who need materials.

**Shared** — Traceability chains show the full waste-to-product journey. Environmental impact metrics track sustainability contributions per user.

## Tech stack

- **Framework:** Next.js (App Router) + TypeScript
- **UI:** shadcn/ui (Radix Nova), Tailwind CSS v4, Framer Motion
- **Forms:** React Hook Form + Zod
- **Database:** PostgreSQL (Supabase) via Prisma ORM
- **Auth:** NextAuth v4 with Prisma adapter
- **Fonts:** Fraunces (headings), DM Sans (body)

## Project structure

```
src/
├── app/
│   ├── onboarding/      # Role selection and sign-in
│   ├── buyer/           # Home, product detail, orders, requests, room scan
│   ├── artisan/         # Dashboard, listings, materials, demand signals
│   ├── supplier/        # Dashboard, add materials, inventory
│   └── shared/          # Impact metrics, profile
├── components/
│   ├── ui/              # Base UI components (shadcn)
│   ├── shared/          # BottomNav, TraceabilityCard, BuyRentLeaseToggle
│   ├── buyer/           # ProductCard, OrderCard
│   ├── artisan/         # DemandSignalCard
│   └── supplier/        # MaterialCard
├── context/
│   └── RoleContext.tsx  # Role state (localStorage-backed)
├── data/
│   └── mockData.ts      # Mock products, materials, demand signals
└── lib/
    ├── prisma.ts         # Singleton Prisma client
    └── utils.ts          # cn() helper
```

## Getting started

**Prerequisites:** Node.js 18+, PostgreSQL database (Supabase recommended)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables — create a `.env` file:

   ```
   DATABASE_URL="postgresql://..."   # Pooled connection (app)
   DIRECT_URL="postgresql://..."     # Direct connection (migrations)
   NEXTAUTH_SECRET="..."
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) and select a role to begin.

## Database schema

Key models: `User`, `Product`, `Listing` (sale/rent/lease), `Order`, `Rental`, `JunkShop`, `TraceabilityChain`, `Material`, `DemandSignal`, `RoomScan`, `CustomRequest`.

To explore the schema:

```bash
npx prisma studio
```

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Run production server    |
| `npm run lint`  | Run ESLint               |
