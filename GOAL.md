# Decorom UI — Conversion & Usability Roadmap

Source: ChatGPT-generated UX audit of the public site, cross-checked against the
actual codebase (2026-07-17). Constraints from the client: **no backend code
changes** (Render 512MB tier for products CRUD + checkout), **frontend-only**
where possible, **zero new recurring spend**.

## Reality check — audit corrections

The audit was written from the public site only (no JS/code visibility), so several
"missing" items were already built:

- Homepage order (Hero → Trust → Best Sellers → Categories → Videos → FAQ → Reviews)
  already matches the recommended structure (`src/pages/Home.jsx`).
- Trust badges strip ("500+ customers", "Ships in 5–7 days", "Handcrafted in
  Ahmedabad") already exists (`TrustBadges.jsx`), placed right under the hero.
- Instagram-reel style vertical video showcase already exists (`VideoShowcase.jsx`).
- Google reviews with star ratings + link to Maps already exist (`CustomerReviews.jsx`).
- The audit's #1 "highest ROI" feature — a live nameplate preview — **already exists**
  as code (`src/editor/NameplateEditor.jsx` + SVG renderer) but is wired only into an
  internal staff tool (`HandleInquiry.jsx` → `ProductDetailsModal.jsx`), not into the
  customer-facing product page. Customers today only see a numeric price calculator.
- `ProductFilters.jsx` and `Pagination.jsx` exist as components but are **not rendered
  on any page** — dead code.

Catalog size: 47 products today, growing to ~200 within 1–2 weeks. Small enough to
fetch a full category/page in one request and do search/filter/sort in the browser —
no backend endpoint changes needed.

## Phase 0 — Wire up what's already built (near-zero effort, biggest ROI)

1. Surface the existing `NameplateEditor` live visual preview on the customer-facing
   `ProductDetails.jsx` page (for products with `editorConfig.enabled`), synced with
   the price calculator's dimensions.
2. Wire real pagination into `CategoryPage.jsx` (was hardcoded to top 20).
3. Wire a Shape filter (server-supported param, already in `getProducts`) into
   `CategoryPage.jsx`.

## Phase 1 — High ROI, low effort, pure frontend, zero new dependencies

4. Client-side instant search (fetch product list once via existing `getProducts`,
   cached with TanStack Query; substring match — catalog is small enough that no
   search library is needed).
5. Wishlist — `localStorage`-backed, heart icon on `ProductCard`, `/wishlist` page.
6. Recently Viewed — `localStorage`-backed rail shown on `Home.jsx`.
7. Product card badges (Best Seller from existing `BEST_SELLER_IDS` config, LED from
   `product.hasLight`) + the site's real aggregate Google rating (not fake per-product
   ratings).
8. Sticky mobile buy bar on `ProductDetails.jsx` (price + Order Now + WhatsApp).
9. Price-range slider + "LED available" toggle on `CategoryPage.jsx`, filtered
   client-side over the loaded page.

## Phase 2 — Moderate effort, still frontend-only

10. "You may also like" rail on `ProductDetails.jsx` (same material, client-fetched,
    excludes current product).
11. Shareable custom design link — encodes editor state (name, flat number,
    dimensions) into the URL query string; opening the link pre-fills the live
    preview. No backend, no accounts.
12. FAQ search — client-side filter over the existing FAQ list.

## Deferred / skipped — would cost the client money or backend headroom

- AI design suggestions, AR wall preview — ongoing paid API cost.
- Real PIN-based delivery estimator via a courier API — integration + ongoing cost;
  the existing static "Ships in 5–7 days" trust badge already covers this.
- Loyalty program / personalized recommendation engine — needs backend + data infra,
  risks the 512MB Render tier.
- Desktop mega-menu with hover previews — meaningful new complexity for a
  desktop-only, likely-minority-traffic gain.

## Progress tracking

See `DEVELOPED.md` for the running log of what's actually been implemented.
