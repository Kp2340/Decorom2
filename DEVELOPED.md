# Development Log

Filled in as each task from `GOAL.md` is completed. One entry per task, appended in
completion order.

## Verification status (2026-07-17)
- `npm run build` — **passes**, no errors (one pre-existing `INEFFECTIVE_DYNAMIC_IMPORT`
  warning from `promos.api.js`/`Checkout.jsx`/`PromoSection.jsx`, unrelated to this work).
- `npm run lint` — **passes** for everything touched in this round. Fixed one new error
  (`WishlistContext.jsx` needed the same `// eslint-disable-next-line
  react-refresh/only-export-components` comment `auth/AuthContext.jsx` already uses for
  exporting a hook alongside a provider). Remaining 4 lint problems are all pre-existing
  baseline issues in files this work never touched (`Hero.jsx`, `PromoSection.jsx`,
  `Checkout.jsx`).
- Dev server click-through — see per-entry "Verification" notes below for what's still
  outstanding (most items still need manual clicking in the running app against real
  product data).

## Bugs found and fixed during live click-through (2026-07-18)

Tested against the real production API (read-only GETs only, via a temporary dev-proxy
retarget — no orders/checkout submitted, no writes). Found and fixed:

1. **CategoryPage pagination never worked.** Assumed a flat `data.totalPages`, but Spring
   Boot 3's default `Page` JSON nests it under `data.page.totalPages`. Fixed to check both.
2. **Wishlist/Recently-Viewed images were always blank.** List-view products carry a
   `thumbnailUrl` field, not an `images` array — my snapshot code only copied `images`.
   Fixed in `WishlistContext.jsx`, `recentlyViewedUtils.js`, and `SearchBar.jsx` (which had
   the same issue, reading `product.images?.[0]` directly instead of using `toImageUrls`).
3. **Category shape/price/LED filter race condition.** A separate "reset page to 0" effect
   and the fetch effect (which depends on `page`) could both fire on the same filter
   change — the fetch effect ran once with the stale page (often out of range for the
   filtered result set, e.g. "Page 2" of a 9-item filtered list) and again with the reset
   page; if the stale request resolved second, it overwrote the correct results with
   "No products match these filters." Fixed with the same cancellation-guard pattern
   already used in the "You may also like" fetch.
4. **`editorConfig` is always a raw JSON string on the wire, never a pre-parsed object**
   (confirmed via the backend DTO field type and every live product's API response) — so
   `product.editorConfig?.enabled` can never be truthy without `JSON.parse` first. Fixed
   in `ProductDetails.jsx` (parses once via `useMemo`, passes the parsed object through to
   `NameplateEditor`). Note: `ProductDetailsModal.jsx` (the pre-existing internal staff
   tool) has the exact same unparsed check and is very likely affected too — not fixed
   here since it's outside this round's scope, but flagged for follow-up.

**Known limitation, not a bug:** every live product's `editorConfig` currently serializes
to `"{}"` (empty) — none have `enabled`/`textZones`/`defaultWidth`/`defaultHeight`
populated. So even with the parse fix, the live nameplate preview and the shareable
design link (Phase 0.1 / 2.11) won't visibly activate for any real product until the
client configures real editorConfig JSON for at least one product via the admin
dashboard's product form. Verified structurally against the exact shape
`useNameplateEditor`/`SvgRenderer` expect; not verified end-to-end with live rendered
output since no such product exists yet.

**What still hasn't been exercised live:** the "Order Now"/checkout flow (intentionally —
read-only testing only, no real orders), and the live nameplate editor's actual rendered
output (blocked by the data gap above — no live product has real editorConfig content).

## Final live click-through results (2026-07-18)

Confirmed working end-to-end against real production data (screenshots taken, console
checked clean at every step — 0 JS errors throughout):

- Home: trust badges, Recently Viewed rail (empty until a product is viewed, then
  populates correctly), Best Sellers, Categories, Videos, **FAQ search** (typed "delivery"
  → correctly narrowed to the one matching question).
- Header: Search icon + overlay, Wishlist icon with live count badge — both on desktop
  and mobile (390×844 viewport).
- Product page: real rating/price/description, **wishlist heart toggle** (persists across
  reload and across pages), **"You may also like" rail** (same-material, badges correct),
  **sticky mobile buy bar** (price + Order Now + WhatsApp, no overlap with the
  repositioned floating Call/WhatsApp buttons).
- Wishlist page: added/persisted item shows with correct image, price, Best Seller badge;
  count badge in header updates live.
- Category pages: **shape filter**, **price range**, **LED-only toggle**, and
  **pagination** (Page 1 of 3 → Page 2 correctly shows different products) all confirmed
  — including specifically re-testing the shape filter from page 2 (the exact race
  condition scenario) after the fix, which returned the correct 9 results instead of
  "No products match these filters."
- Search: header dropdown (live results with thumbnails as you type) and the full
  `/search?q=...` results page both confirmed with a real multi-word-matching query.

Final `npm run build` and `npm run lint` both re-run after all fixes above — clean,
same 4 pre-existing baseline issues only, zero new ones.

## Pre-freeze fixes (2026-07-18)

Ahead of a strict 1-year production freeze, reviewed prior findings against the actual
current code (not memory/stale docs) and applied the ones the client approved:

1. **Corrected stale `Decorom Backend/AGENTS.md`.** It described a live `javax.validation`
   bug in `CheckoutController`/`InquiryController`/`WebhookCreateOrderRequest` and an
   insecure `String.equals` secret comparison in `SalesOrderWebhookController` — verified
   both are already fixed in the actual code (correctly using `jakarta.validation` and
   `MessageDigest.isEqual`). Updated the doc so it no longer misleads whoever touches this
   code next, and removed the now-redundant duplicate gotcha entry.
2. **Fixed the same `editorConfig` JSON-string-not-parsed bug in `ProductDetailsModal.jsx`**
   that was fixed in `ProductDetails.jsx` earlier this session (see Phase 0.1 entry above).
   Correction to my earlier report: `ProductDetailsModal` is only ever rendered by
   `HandleInquiry.jsx`, which is **not wired into any route in `App.jsx`** and doesn't even
   call the real product API (it imports a static local `data/nameplate.js` file) — so this
   was NOT an active staff-tool regression as I'd characterized it, just orphaned/unreachable
   code today. Fixed anyway for correctness in case it's ever wired up or reused.
3. **Fixed two `no-unused-vars` false positives** (`Hero.jsx`, `PromoSection.jsx`) —
   correction to my earlier report: these were NOT dead imports. `motion` (from
   `framer-motion`) is genuinely used in both files, but only as JSX tag names
   (`<motion.h1>`, `<motion.div>`, etc.), which core ESLint's `no-unused-vars` can't see
   without `eslint-plugin-react`. Deleting the imports as originally suggested would have
   broken both components at runtime. Added a scoped `eslint-disable-next-line` comment
   instead (matching the existing suppression pattern already used in `auth/AuthContext.jsx`
   for a different rule) — no functional change, no new dependency.
4. **Unified the Google rating/review count**, previously inconsistent across two spots —
   `ProductDetails.jsx` showed "4.9 · 47 reviews", `CustomerReviews.jsx` showed "5.0 · 27
   reviews". Both now show **4.8 · 3 reviews** (per the client's correction — this is the
   real current number, not a placeholder). Also fixed `CustomerReviews.jsx`'s display
   template, which previously hardcoded a `.0` suffix (`{GOOGLE_RATING}.0`) assuming a
   whole-number rating — that would have rendered "4.8.0" — now just renders
   `{GOOGLE_RATING}` directly.

Explicitly deferred (client's call, not mine): pricing hardcoded in `PricingService.java`/
`pricingUtils.js` (client will update if needed), `ddl-auto=update` (client will update the
DB manually before any future push), uptime monitoring (already covered by UptimeRobot).

Final `npm run build` + `npm run lint` re-run after these four fixes — clean, only the
same 2 pre-existing `Checkout.jsx` warnings remain (untouched, out of scope).

**Not tested:** actual order placement/checkout (out of scope — read-only verification
only, per explicit agreement not to submit real orders against production).

<!-- Template:
## [Phase X.N] Task title
- **Files:** path/one.jsx (new), path/two.jsx (edited)
- **What it does:** one or two sentences.
- **Verification:** what's been checked so far, and what's still needed (npm run build / lint / manual click-through) before this ships.
-->

## [Phase 0.1] Live nameplate preview on the customer-facing product page
- **Files:** `src/pages/ProductDetails.jsx` (edited), `src/components/ProductPriceCalculator.jsx` (edited)
- **What it does:** Lazy-loads the existing `NameplateEditor` (SVG live preview, already used internally in `ProductDetailsModal`) onto the public `ProductDetails.jsx` page whenever `product.editorConfig?.enabled` is true, above the price calculator. Editor dimension changes now flow into `ProductPriceCalculator` via a new `externalDimensions` prop (mirrors the pattern the internal modal's `PriceCalculator` already uses), so price stays authoritative as the customer resizes the live preview.
- **Verification:** Not yet build/lint/dev-server tested (per instruction, no npm commands run this session). Needs: `npm run build`, `npm run lint`, and manually opening a product with `editorConfig.enabled = true` to confirm the preview renders and price updates when resizing.

## [Phase 0.2 + 0.3 + 1.9] Real pagination, shape filter, price range + LED filter on category pages
- **Files:** `src/pages/CategoryPage.jsx` (edited), `src/components/ProductFilters.jsx` (edited)
- **What it does:** `CategoryPage.jsx` previously hardcoded a fetch of the top 20 products with no filters — `ProductFilters.jsx` and `Pagination.jsx` existed as components but were never rendered anywhere. Now: real server-paginated browsing (12/page) using the existing `getProducts(page, size, material, shape)` endpoint (no backend change — `shape` was already a supported query param), a Shape filter dropdown (added a `hideMaterial` prop to `ProductFilters` since material is already fixed by the category page), and a price-range + "LED available only" refinement filtered client-side over the loaded page.
- **Verification:** Not yet build/lint/dev-server tested. Needs: confirm `data.totalPages` field name matches what Spring's `Page<ProductListDTO>` actually serializes (should be standard Spring Data JSON), and click through pagination + filters against a running backend.

## [Phase 1.4] Client-side instant search
- **Files:** `src/utils/searchUtils.js` (new), `src/api/products.api.js` (edited — added `getAllProductsForSearch`), `src/components/SearchBar.jsx` (new), `src/pages/SearchResults.jsx` (new), `src/components/Header.jsx` (edited), `src/App.jsx` (edited — added `/search` and `/wishlist` routes)
- **What it does:** Search icon in the header (all breakpoints) opens an overlay (`SearchBar`) that fetches the full catalog once via the existing `getProducts` endpoint (`size=300`, no new backend endpoint), cached 5 min by the app's existing `QueryClient`, and filters client-side by name/material/shape/description substring match. Shows a live dropdown of up to 6 matches with thumbnail + price, or "See all results" → `/search?q=...` (`SearchResults.jsx`) for the full grid.
- **Note:** `App.jsx` also references `./pages/Wishlist` for the `/wishlist` route added in this edit — that file is created in the next log entry (Phase 1.5). Until that entry lands, the app will not build.
- **Verification:** Not yet build/lint/dev-server tested. Needs: confirm search overlay positions correctly under the fixed header (relies on `position: fixed` on `<header>` establishing the containing block for the overlay's `absolute` positioning), and a manual search click-through once Phase 1.5 lands.

## [Phase 1.5] Wishlist (localStorage, no backend)
- **Files:** `src/wishlist/WishlistContext.jsx` (new), `src/pages/Wishlist.jsx` (new — resolves the `/wishlist` route added in Phase 1.4), `src/components/ProductCard.jsx` (edited), `src/components/Header.jsx` (edited), `src/App.jsx` (edited — wrapped tree in `WishlistProvider`)
- **What it does:** New `WishlistProvider` (mirrors the existing `auth/AuthContext.jsx` pattern) persists a wishlist as a JSON array in `localStorage` under `decorom_wishlist`, storing a minimal product snapshot at add-time (id, name, price, material, images) so the wishlist page never needs a re-fetch. `ProductCard` gets a heart toggle button (top-right of the image, `stopPropagation`'d so it doesn't trigger the card's own click). Header gets a heart icon with a live count badge linking to `/wishlist`.
- **Verification:** Not yet build/lint/dev-server tested. Needs: add/remove a few products, confirm persistence across a page reload, confirm the heart click doesn't also navigate to the product page.

## [Phase 1.6] Recently Viewed rail
- **Files:** `src/utils/recentlyViewedUtils.js` (new), `src/components/RecentlyViewedRail.jsx` (new), `src/pages/ProductDetails.jsx` (edited), `src/pages/Home.jsx` (edited)
- **What it does:** `recordProductView()` is called whenever `ProductDetails.jsx` loads a product, storing a snapshot (most-recent-first, deduped, capped at 10) in `localStorage` under `decorom_recently_viewed`. `RecentlyViewedRail` reads that list and renders a rail on `Home.jsx` (right after the trust badges strip); renders nothing when the visitor has no view history yet, so first-time visitors never see an empty section.
- **Verification:** Not yet build/lint/dev-server tested. Needs: view a couple of products, reload Home, confirm the rail appears in view order with newest first and no duplicates.

## [Phase 1.7] Product card badges
- **Files:** `src/components/ProductCard.jsx` (edited)
- **What it does:** Adds "Best Seller" (from the existing `BEST_SELLER_IDS` config, already used by `BestSellers.jsx`) and "LED" (from `product.hasLight`, the same field `ProductDetailsModal.jsx` already reads) badges to the top-left of each product card.
- **Scope note:** Did NOT add a per-product star rating badge as the original audit suggested. The codebase has no per-product rating data — only one site-wide aggregate Google rating, and that number is already inconsistently hardcoded in two places (`ProductDetails.jsx` shows "4.9 · 47 reviews", `CustomerReviews.jsx` shows "5.0 · 27 reviews"). Adding a third guessed number on every card would compound that inconsistency and risks an inaccurate/misleading rating claim. Recommend fixing the existing 4.9-vs-5.0 discrepancy against the real current Google listing as a small follow-up, then optionally surfacing that single corrected number on cards.
- **Verification:** Not yet build/lint/dev-server tested. Needs: confirm badges only show for products actually in `BEST_SELLER_IDS` / with `hasLight: true`, and don't overlap the wishlist heart at narrow card widths.

## [Phase 1.8] Sticky mobile buy bar on ProductDetails
- **Files:** `src/pages/ProductDetails.jsx` (edited), `src/components/FloatingButtons.jsx` (edited)
- **What it does:** Adds a fixed bottom bar on mobile only (`md:hidden`) showing live price + "Order Now" + a WhatsApp icon button, mirroring the sticky footer pattern already used in `ProductDetailsModal.jsx`'s `CheckoutButton`. Added `pb-28` to the page container so the bar doesn't cover the last content. Since the global floating Call/WhatsApp buttons (`FloatingButtons.jsx`, rendered on every page) sit at `bottom-6` and would otherwise overlap this new bar, bumped their mobile position to `bottom-24` (unchanged on desktop, `md:bottom-6`).
- **Verification:** Not yet build/lint/dev-server tested. Needs: check on an actual small viewport that the sticky bar and floating buttons don't visually collide, and that page content isn't hidden behind the bar when scrolled to the bottom.

## [Phase 2.10] "You may also like" rail on ProductDetails
- **Files:** `src/pages/ProductDetails.jsx` (edited)
- **What it does:** After a product loads, maps its `material` string to a category id via the existing `CATEGORIES` constant (case-insensitive name match), fetches up to 8 products in that category via the existing `getProducts` endpoint, excludes the current product, and shows the first 4 as a "You May Also Like" grid below the main product content.
- **Verification:** Not yet build/lint/dev-server tested. Needs: confirm the material-name-to-category-id match works for all real `product.material` values coming back from the backend (it depends on exact string casing/spelling matching one of the 5 `CATEGORIES` names).

## [Phase 2.11] Shareable custom design link
- **Files:** `src/editor/hooks/useNameplateEditor.js` (edited — accepts optional `initialValues`/`initialDimensions`), `src/editor/NameplateEditor.jsx` (edited — passes the two new optional props through), `src/pages/ProductDetails.jsx` (edited)
- **What it does:** No backend, no accounts. `ProductDetails.jsx` reads `?name=&flat=&w=&h=` from the URL on load and seeds the live editor's initial state with them (both hook changes are additive/optional — the existing internal `ProductDetailsModal` usage is unaffected since it never passes these props). Once a customer has entered a name, a "Copy link to this design" button builds that same query string from the current live values and copies it to the clipboard (`navigator.clipboard`, no `alert()`, matches the codebase's inline-status convention) so they can share/save/reopen the exact same preview later.
- **Verification:** Not yet build/lint/dev-server tested. Needs: manually copy a link, open it in a new tab, confirm the preview and dimensions come back pre-filled; confirm `navigator.clipboard.writeText` doesn't throw on a non-HTTPS local dev origin (it's only available in secure contexts).

## [Phase 2.12] FAQ search
- **Files:** `src/components/FAQ.jsx` (edited)
- **What it does:** Adds a search input above the FAQ accordion that filters the existing hardcoded FAQ list client-side by question/answer substring match. Also fixed the open/closed accordion state to key off the question text instead of array index — with filtering, an item's index shifts as the list narrows, so index-based state would have expanded the wrong answer after a search.
- **Verification:** Not yet build/lint/dev-server tested. Needs: type a partial match, confirm only matching FAQs show and an open answer still corresponds to the right question; clear the search and confirm all 6 return.

