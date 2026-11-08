---
description: Generate or update the client handover documentation (HANDOVER.md) — setup, env vars, deploy, architecture, known issues. Use when preparing handover materials.
---

# handover-doc

Write/update `HANDOVER.md` at project root. Audience: the client's future developer, who has
never seen this codebase. Verify every claim against the actual repo — no guessing.

Sections, in order:

1. **What this is**: Decorom UI — React 19 + Vite 7 storefront for https://decorom.in,
   talking to the Spring Boot API at https://api.decorom.in (separate repo).
2. **Setup from clean clone** (verify each step actually works):
   - Node 20+, `npm ci`, create `.env` (see below), `npm run dev`, open the printed URL.
   - Commands table: dev / build / lint / preview with one-line descriptions.
3. **Environment variables** — NAMES ONLY, never values:
   `VITE_APP_URL` (backend base URL; localhost:8080 dev, https://api.decorom.in prod),
   `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
   State where prod values live (Vercel dashboard) and who owns the EmailJS account.
4. **Deploy (Vercel)**: auto-deploy on push to main; `vercel.json` = SPA rewrite + cache
   headers; env vars set in Vercel project settings. Mention the legacy GitHub Pages
   workflow (`.github/workflows/static.yml`) and whether it should be deleted.
5. **Architecture overview**: the `src/` folder map from AGENTS.md, plus the key flows:
   product browse → details → checkout; admin login (JWT in sessionStorage) → dashboard;
   contact form (EmailJS); images via Cloudinary.
6. **Known issues / debt** (verify current state before writing): ESLint baseline errors,
   `.env` tracked in git (rotate EmailJS keys if still true), duplicated
   carousel/price-calculator components, no test suite, dual deploy workflows.
7. **Third-party accounts inventory**: Vercel, Cloudinary, EmailJS, domain (decorom.in),
   backend hosting — what needs credential/ownership transfer.

Keep it under ~200 lines, plain language, everything copy-pasteable and verified.
