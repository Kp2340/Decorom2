---
description: Disciplined bug-fix workflow — reproduce, find root cause, minimal fix, verify in the running app. Use for any bug report.
---

# fix-bug

1. **Reproduce FIRST**: start `npm run dev`, follow the reported steps, confirm the bug and
   capture the exact symptom (screen state, browser console error, network response). If you
   cannot reproduce, stop and report what you tried — do not fix blind.
2. **Locate the root cause**: trace from symptom to source (component → hook → api layer →
   backend response shape). Remember `src/api/client.js` unwraps `response.data` and throws
   `Error` with `.status` — many "undefined" bugs start there. Explain WHY it happens, not
   just where. Fixing the symptom (e.g. adding `?.` to silence a crash) is not a fix.
3. **Minimal fix matching existing patterns**: smallest change that removes the root cause.
   Same style as surrounding code, no drive-by refactors, no new dependencies, no pattern
   changes — this app hands over in ~1 month.
4. **Verify the fix**: rerun the exact reproduction steps in the running app — bug gone,
   browser console clean.
5. **Check nothing else broke**: `npm run lint` (no new errors) + `npm run build` (exit 0);
   quickly exercise adjacent flows that share the touched code (grep for other importers of
   the changed module).
6. **Report**: root cause explanation, the fix, and verification evidence (steps 4-5).
