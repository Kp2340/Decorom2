---
description: Full production-readiness audit before a release or the client handover — build, lint, secrets, routes, images, deploy config.
---

# release-check

Run from project root. Report each item PASS/FAIL with evidence; fix nothing without approval.

1. **Build**: `npm run build` exits 0.
2. **Lint**: `npm run lint` — report total errors/warnings and whether the count grew vs. the known ~37 baseline.
3. **Debug leftovers**: `grep -rnE "console\.(log|debug)|debugger" src/` → must be empty.
4. **Hardcoded URLs**: `grep -rnE "localhost|127\.0\.0\.1|http://" src/` — anything outside
   `src/api/client.js` env fallback is a finding. Also grep for hardcoded phone/email
   outside `src/constants/contact.js`.
5. **Secrets**: `git ls-files .env` — if tracked, CRITICAL finding (currently IS tracked;
   flag until fixed). Confirm no `VITE_` values pasted into src.
6. **vercel.json sane**: SPA rewrite to `/index.html` present; cache headers intact; no
   accidental removals.
7. **All routes load**: start `npm run dev`, visit every route registered in `src/App.jsx`
   (public + `/admin/login`; admin pages at least render the login redirect). No blank
   pages, no console errors, 404 route works.
8. **Images optimized**: product images use Cloudinary `f_auto,q_auto` transforms; no
   multi-MB assets newly added to `public/` (check `git status` + dist output of build).
9. **Dead routes/pages**: every file in `src/pages/` is referenced in `App.jsx`; every
   route in `App.jsx` resolves to an existing page.
10. **Deploy config drift**: note that `.github/workflows/static.yml` also deploys to
    GitHub Pages — confirm this is intended or flag for removal before handover.

Output: a checklist with PASS/FAIL, evidence per item, and a ranked list of blockers.
