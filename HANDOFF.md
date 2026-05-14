# Habi — Demo Readiness Handoff

**Goal:** Get the app to a clean, demo-able state. No supplier role. No real payments — simulated checkout is fine.

---

## What's Already Working

The core buyer → artisan → junk shop circular marketplace flows are solid:

- Auth & onboarding (role select, signup, signin)
- Buyer: product search, product detail, cart, checkout (simulated), orders, rentals view, custom requests, AI Room scan
- Artisan: dashboard, listing creation/editing, material browsing & requests, demand signals, AI room placements, rental returns
- Junk shop: dashboard, inventory management, artisan network
- All 8 REST API endpoints fully implemented
- Shared profile page

---

## What Needs to Be Done (Demo Scope)

### 1. Fix Hardcoded Impact Data

**Priority: High** — Visibly broken in the demo.

- **File:** `src/app/buyer/orders/page.tsx`
- **Issue:** `<ImpactSummary impactKg={32} />` is hardcoded.
- **Fix:** Sum `quantity * material.weightKg` (or equivalent) across the user's completed orders and pass the real value.
- **Also:** Check if `ImpactSummary` has other hardcoded stats (trees saved, etc.) and wire those up the same way.

---

### 2. Build the Impact Dashboard (`/shared/impact`)

**Priority: High** — It's a stub page (8 lines). It's linked from the nav, so it'll show up in the demo.

- **File:** `src/app/shared/impact/page.tsx`
- **Current state:** Placeholder text only.
- **Fix:** Build a real page showing the user's environmental impact across all their activity:
  - Total waste diverted (kg)
  - Trees equivalent saved
  - Number of products purchased/rented
  - Breakdown by material type (if data supports it)
- Reuse the same calculation logic from item 1 above.
- Scope the data to the logged-in user via `requireRole()`.

---

### 3. Complete the Quote Request Flow (Junk Shop Side)

**Priority: Medium** — Artisans can send quotes but junk shops have no way to respond. For a demo showing the full loop, this needs to close.

- **Current state:** `QuoteRequest` and `QuoteCartItem` models exist. Artisans can submit requests. Status enum: `PENDING → SENT → ACCEPTED → REJECTED`.
- **Missing:** Junk shop UI to view incoming quote requests and accept/reject them.
- **Files to create/edit:**
  - New page: `src/app/junkshop/quotes/page.tsx` — list incoming quote requests with status
  - New action: `src/app/junkshop/quotes/actions.ts` — `acceptQuote(id)`, `rejectQuote(id)` using `requireRole('JUNK_SHOP')`
  - Link from junk shop dashboard or nav
- **Scope:** Accept/reject only. No messaging needed for demo.

---

### 4. Rental Checkout Differentiation

**Priority: Medium** — Listings can be typed `RENT`/`LEASE` but checkout treats everything as a sale. If the demo shows rental listings, the checkout will be wrong.

- **Current state:** `ListingType` enum has `SALE | RENT | LEASE`. Checkout creates an `Order` regardless of type.
- **Missing:** Checkout should surface the rental period (start/end date) when the listing type is `RENT` or `LEASE`, and create a `Rental` record instead of (or alongside) the order.
- **Files to edit:**
  - `src/app/buyer/checkout/page.tsx` — conditionally render date pickers for RENT/LEASE listings
  - `src/app/api/buyer/checkout/route.ts` (or equivalent action) — create a `Rental` DB record when type is RENT/LEASE
- **Scope:** UI + DB write only. No payment logic needed.

---

### 5. Minor Cleanup

**Priority: Low** — Won't block the demo but worth doing before showing anyone.

| Item | File | Fix |
|---|---|---|
| Dead variable | `src/lib/room-service.ts:44` | Remove `latestMockRoomId` — declared but never assigned |
| Unimplemented route | `/api/room/glb` | Either implement or remove the reference |
| Supplier stub pages | `src/app/supplier/add/page.tsx`, `src/app/supplier/waste/page.tsx` | Remove from nav or hide behind a role guard so they don't surface in demo |

---

## Out of Scope for Demo

- **Supplier role** — Not needed. Hide or remove nav links.
- **Payment integration** — Simulated checkout (PENDING status) is acceptable for demo.
- **Notifications / messaging** — Skip entirely.
- **Reviews & ratings** — Not in schema, not needed.
- **Wishlist / save for later** — Skip.
- **Advanced search filters** — Full-text search is sufficient for demo.

---

## Suggested Order of Work

1. Fix hardcoded `impactKg` in buyer orders (30 min)
2. Build `/shared/impact` page with real data (1–2 hrs)
3. Quote request flow — junk shop response UI (2–3 hrs)
4. Rental checkout differentiation (2–3 hrs)
5. Minor cleanup (30 min)

---

## Key Files Reference

| Area | Path |
|---|---|
| Buyer orders (hardcoded impact) | `src/app/buyer/orders/page.tsx` |
| Impact dashboard stub | `src/app/shared/impact/page.tsx` |
| Junk shop dashboard (add quotes link here) | `src/app/junkshop/dashboard/page.tsx` |
| Buyer checkout | `src/app/buyer/checkout/page.tsx` |
| Room service (dead variable) | `src/lib/room-service.ts` |
| Auth helper | `src/lib/auth.ts` (`requireRole`) |
| API route dispatcher | `src/api/[[...route]]/routes.ts` |
| Prisma schema | `prisma/schema.prisma` |
