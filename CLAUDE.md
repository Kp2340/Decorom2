# Decorom Frontend — CLAUDE.md

## Project
Premium nameplate e-commerce website for Decorom, Ahmedabad.
- **Live:** https://decorom.in
- **Stack:** React 19 + Vite 7 + Tailwind CSS 3 + TanStack Query 5
- **Deploy:** Vercel (auto-deploy on git push to main)
- **API:** https://api.decorom.in (Spring Boot backend)

---

## Directory Structure
```
src/
├── api/          # All API calls (client.js, products.api.js, orders.api.js, etc.)
├── auth/         # JWT auth context + ProtectedRoute
├── components/   # Reusable UI components
├── constants/    # contact.js, categories.js, orderStages.js
├── data/         # Static hardcoded data (banner, film, etc.)
├── editor/       # Nameplate editor (NameplateEditor.jsx + sub-components)
├── pages/        # One file per route
└── utils/        # imageUtils.js, pricingUtils.js
```

---

## Brand & Design System

### Colors (Tailwind classes — never use raw hex)
| Role | Class |
|------|-------|
| Header / Footer background | `bg-yellow-100` |
| Footer bottom bar | `bg-yellow-200` |
| Primary CTA / accent | `bg-pink-600`, `hover:bg-pink-700` |
| Active nav link | `text-pink-600` |
| Body background | `bg-white` or `bg-gray-50` |
| Section background (alt) | `bg-yellow-50` |
| Dark text | `text-gray-900` |
| Muted text | `text-gray-500` |

### Typography
- Font: **Poppins** (self-hosted via `@fontsource/poppins`, imported in `main.jsx`)
- DO NOT add Google Fonts CDN links
- Scale: `text-sm` body, `text-2xl md:text-3xl` section headings, `text-4xl md:text-6xl` hero

### Spacing
- Section padding: `py-12 md:py-16`
- Container: `max-w-7xl mx-auto px-4`
- Card padding: `p-5` or `p-6`
- Gap between cards: `gap-5 md:gap-8`

### Buttons
- Primary: `bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full transition-all`
- Secondary: `bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-full`
- Black CTA: `bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl`

---

## Key Constants (always import, never hardcode)

```js
// src/constants/contact.js
CONTACT_WHATSAPP_NUMBER  // "919016707658"
CONTACT_PHONE            // "+91 90167 07658"
CONTACT_EMAIL            // "decorom213@gmail.com"
CONTACT_ADDRESS          // Full address string
CONTACT_WHATSAPP_URL()   // Function — returns wa.me link with optional message

// src/constants/categories.js
CATEGORIES               // Array of {name, id, images[]}
slugify()                // Converts category name to URL slug
```

---

## API Layer (`src/api/`)

- **Base client:** `src/api/client.js` — Axios instance, reads `VITE_APP_URL` env var
- **Auth:** JWT stored in `sessionStorage` as `adminToken`, auto-attached by interceptor
- **Error handling:** interceptor handles 401 (auto-redirect to `/admin/login`)
- All API functions return `response.data` directly (unwrapped by interceptor)

```js
// Pattern for new API calls
import apiClient from "./client";
export const getSomething = async (id) => apiClient.get(`/api/something/${id}`);
```

---

## Routing (`src/App.jsx`)

All pages are **lazy-loaded** with `React.lazy()`. Add new routes there.
- Public routes: `/`, `/products`, `/products/:id`, `/category/:materialName`, etc.
- Protected routes (admin JWT): `/admin`, `/admin/api-test`
- 404: `path="*"` → `<NotFound />`
- `<FloatingButtons />` renders outside routes (always visible)

---

## Component Patterns

### New page checklist
1. Add `<SEO title="..." description="..." />` at top
2. Use `useQuery` from TanStack Query for data fetching (not useEffect+fetch)
3. Wrap sections in `<section className="py-12 md:py-16 bg-...">` 
4. Add lazy import + route in `App.jsx`

### Images
- Always use Cloudinary URLs with transformations: `w_400,f_auto,q_auto`
- Use `<LazyLoadImage>` from `react-lazy-load-image-component` for product images
- Helper: `src/utils/imageUtils.js` → `responsiveImageProps()`, `toImageUrls()`

### Forms
- Success/error: use `useState` with inline message — **never use `alert()`**
- Contact form uses EmailJS via env vars: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

---

## State Management
- **Server state:** TanStack Query (`useQuery`, `useMutation`) — 5 min stale time
- **Local UI state:** `useState` / `useReducer`
- **Auth state:** `AuthContext` in `src/auth/AuthContext.jsx`
- **No Redux** — keep it simple

---

## Environment Variables
```
VITE_APP_URL=http://localhost:8080          # dev
# VITE_APP_URL=https://api.decorom.in      # prod (set in Vercel dashboard)
VITE_EMAILJS_SERVICE_ID=service_6f1m0vg
VITE_EMAILJS_TEMPLATE_ID=template_9fr3704
VITE_EMAILJS_PUBLIC_KEY=ORCA1kgmEtxgDX-2R
```
**Never hardcode credentials in source files.**

---

## Performance Rules
- All page components: lazy-loaded via `React.lazy()`
- Images: Cloudinary auto-format (`f_auto`) + quality (`q_auto`) + width cap
- Videos: `preload="none"`, `muted`, `autoPlay`, `playsInline`
- Fonts: self-hosted Poppins — no external CDN
- TanStack Query caches API responses for 5 minutes

---

## DO / DON'T

| DO | DON'T |
|----|-------|
| Import contact info from `constants/contact.js` | Hardcode phone numbers or emails |
| Use Tailwind classes | Write custom CSS or inline styles |
| Use `NavLink` for navigation (active states) | Use plain `<a>` tags for internal links |
| Keep components under ~150 lines | Create giant monolithic components |
| Use `react-helmet-async` (`<SEO />`) for meta | Add meta tags in `index.html` directly |
| `useQuery` for data fetching | `useEffect` + `fetch` for API calls |
| Inline success/error messages in forms | `alert()` or `console.log` in production |
| `new Date().getFullYear()` for copyright | Hardcode year |

---

## Common Gotchas
- **Admin login:** hardcoded single user via backend env vars — no user table
- **Material filter codes:** 1=Acrylic, 2=ACP, 3=Wooden, 4=Stainless Steel, 5=Mild Steel (integer, not string)
- **WhatsApp URL:** always use `CONTACT_WHATSAPP_URL()` from constants — number includes country code `91`
- **Hero height:** `style={{ height: "calc(100vh - 64px)" }}` — header is 64px (`h-16`)
- **`vercel.json`** handles SPA routing — all unknown URLs serve `index.html`
