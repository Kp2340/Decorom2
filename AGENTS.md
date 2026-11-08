# Decorom UI — Agent Instructions

## Overview
Premium nameplate e-commerce website for Decorom (Ahmedabad). Public storefront
(browse products by material, price calculator, nameplate editor, checkout,
order tracking) plus a JWT-protected admin dashboard.

- **Live:** https://decorom.in — **API:** https://api.decorom.in (Spring Boot backend, separate repo)
- **Stack:** React 19, Vite 7, JavaScript (JSX, no TypeScript), Tailwind CSS 3, TanStack Query 5, React Router 7, Axios, Framer Motion, EmailJS, Swiper
- **Deploy:** Vercel (auto-deploy on push to main). `vercel.json` handles SPA rewrites + cache headers.

**STATUS: PRODUCTION client project. Full handover to the client in ~1 month.**
Prioritize stability. No risky refactors, no new patterns, no new architecture.
Match existing style exactly. Smallest change that correctly solves the task wins.

## Commands (run from project root)
- `npm run dev` — Vite dev server (`--host`, LAN-exposed)
- `npm run build` — production build (includes image optimizer; can take a while)
- `npm run lint` — ESLint flat config. NOTE: baseline currently has ~37 pre-existing errors (unused vars). Do not add new ones; fix any that touch files you edit.
- `npm run preview` — serve the built `dist/`
- There is **no test suite** and **no prettier**. Do not add either without explicit approval.

## Architecture Map
```
src/
├── api/          # Axios layer. client.js = base instance; *.api.js per domain (products, orders, promos, reviews, checkout, admin)
├── auth/         # AuthContext.jsx (JWT in sessionStorage as "adminToken") + ProtectedRoute.jsx
├── components/   # Reusable UI; components/model/ = product-detail modal parts (Gallery, ProductInfo, ShippingForm, CheckoutButton)
├── config/       # bestSellers.js, promos.js
├── constants/    # contact.js, categories.js, orderStages.js — ALWAYS import from here, never hardcode
├── data/         # Static hardcoded catalog/banner data (nameplate.js, film.js, ...)
├── editor/       # Nameplate editor: NameplateEditor.jsx, hooks/useNameplateEditor.js, renderers/SvgRenderer.jsx
├── pages/        # One file per route; all lazy-loaded via React.lazy() in App.jsx
└── utils/        # imageUtils.js, pricingUtils.js, promoUtils.js
```
Routing lives in `src/App.jsx`. Public routes + `/admin/*` behind `<ProtectedRoute>`; `path="*"` → NotFound.

## API Layer Conventions
- Base client: `src/api/client.js` — reads `VITE_APP_URL`, falls back to `https://api.decorom.in`.
- Response interceptor returns `response.data` directly; converts errors to `Error` with `.status`; 401 clears token and redirects to `/admin/login`.
- New endpoint pattern: `export const getX = async (id) => apiClient.get(\`/api/x/${id}\`);` in the matching `*.api.js` file.
- Pages fetch with TanStack Query `useQuery`/`useMutation` (5-min staleTime) — never `useEffect` + `fetch`.

## Code Conventions (derived from existing code — follow exactly)
- JSX function components, arrow-function style, `export default` at bottom. PascalCase files for components/pages, camelCase for js modules.
- Tailwind utility classes only — no custom CSS files, no inline style objects (exception: existing `calc(100vh - 64px)` hero height).
- Brand palette: header/footer `bg-yellow-100`, CTA `bg-pink-600 hover:bg-pink-700`, alt sections `bg-yellow-50`, body `bg-white`/`bg-gray-50`. Never raw hex.
- Font: Poppins via `@fontsource/poppins` (imported in `main.jsx`). No Google Fonts CDN.
- Sections: `py-12 md:py-16`; container: `max-w-7xl mx-auto px-4`.
- Images: Cloudinary URLs with `w_...,f_auto,q_auto`; `<LazyLoadImage>` for product images; helpers in `src/utils/imageUtils.js` (`responsiveImageProps()`, `toImageUrls()`).
- Memoize list-item components (`React.memo`) like `ProductCard.jsx` does; set `displayName`.
- Forms: status via `useState` (`idle | sending | success | error`) with inline messages — never `alert()`. Contact form uses EmailJS env vars.
- SEO: every page starts with `<SEO title description />` (react-helmet-async). No meta tags in `index.html`.
- Navigation: `NavLink`/`Link` for internal links, never `<a>`.
- Contact info: import from `src/constants/contact.js` (`CONTACT_WHATSAPP_URL()`, `CONTACT_PHONE`, ...). Never hardcode phone/email.
- State: TanStack Query for server state, `useState`/`useReducer` locally, `AuthContext` for auth. No Redux, no new state libraries.
- Keep components under ~150 lines where practical; new pages must be lazy-loaded and registered in `App.jsx`.
- Copyright year: `new Date().getFullYear()`.

## Environment Variables (names only — values live in `.env` locally / Vercel dashboard)
- `VITE_APP_URL` — backend base URL (`http://localhost:8080` dev, `https://api.decorom.in` prod)
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

## Definition of Done — EVERY task
1. `npm run build` succeeds.
2. `npm run lint` passes for all files you touched (no new errors vs. baseline).
3. The changed flow was actually exercised in the running app (`npm run dev`) — clicked through, observed working, browser console clean.
4. No `console.log`/`debugger` leftovers (grep before finishing — src is currently clean; keep it that way).
5. No new dependencies unless verified real, popular, actively maintained — and approved.

## Never Do
- Edit, commit, or print the contents of `.env` or any secret.
- `git push --force`, history rewrites, or push without being asked.
- Introduce breaking API changes or rename/move files without explicit need.
- Skip the Definition of Done, claim untested work as done, or leave unexplained TODOs.
- Add new patterns/libraries/abstractions this close to handover — mirror what exists.
- Use `alert()`, raw hex colors, Google Fonts CDN, or hardcoded contact info/URLs.

## Gotchas
- Material filter codes are integers: 1=Acrylic, 2=ACP, 3=Wooden, 4=Stainless Steel, 5=Mild Steel.
- Admin login is a single hardcoded user via backend env vars — no user table.
- Header is 64px (`h-16`); hero uses `calc(100vh - 64px)`.
- `.github/workflows/static.yml` deploys to GitHub Pages in addition to Vercel — legacy; do not extend it.
- Large media is gitignored (`public/videos/`) and served via Cloudinary.
