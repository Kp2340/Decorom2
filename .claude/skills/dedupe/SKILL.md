---
description: Find duplicated code, extract the worst cluster into a shared helper/component, and keep lint+build green. Use when asked to reduce duplication.
---

# dedupe

Production project near handover: dedupe conservatively — one cluster at a time, behavior identical.

1. **Detect**: `npx jscpd src --min-tokens 50` (confirm jscpd is a real, current package before
   first run). If that fails, fall back to manual inspection of suspiciously similar names:
   `Carousel` / `ImageCarousel` / `ProductImageCarousel`, `PriceCalculator` /
   `ProductPriceCalculator`, and repeated Tailwind/JSX blocks found via Grep.
2. **Pick ONE cluster**: the worst offender by duplicated lines x number of copies. List the
   files:lines involved and show the duplicated fragment.
3. **Plan the extraction**: shared helper in `src/utils/` or shared component in
   `src/components/` — matching existing naming and code style. No new patterns, no new deps.
   Get the plan confirmed if the cluster spans more than 3 files.
4. **Extract**: replace each copy with the shared version. Keep props/behavior identical —
   this is a pure refactor; any visual or behavioral diff is a bug.
5. **Verify**: `npm run lint` (no new errors) and `npm run build` (exit 0) must stay green,
   then exercise each affected screen in `npm run dev` and compare against pre-change behavior.
6. **Report**: duplicated lines removed, files touched, evidence of verification.

Never dedupe across public vs. admin flows if it couples their release risk without clear payoff.
