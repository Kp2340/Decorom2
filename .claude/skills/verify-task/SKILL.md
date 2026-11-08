---
description: Verify a completed change end-to-end (lint, build, exercise the flow in the running app) before claiming it done. Run at the end of every task.
---

# verify-task

Run every step from the project root. Do not skip steps. Do not claim done without evidence.

1. **Lint**: `npm run lint`. The baseline has ~37 pre-existing errors — confirm zero NEW
   errors/warnings in the files you changed (compare against `git diff --name-only`).
2. **Build**: `npm run build`. Must exit 0. Note any new warnings.
3. **Leftovers**: grep the changed files for `console.log`, `console.debug`, `debugger`,
   `alert(`. Must be zero hits.
4. **Exercise the flow**: start `npm run dev` (background), open the app, and drive the
   SPECIFIC flow you changed — the actual route, click, form submit, or admin action.
   Not just "page loads": perform the user action the task was about and observe the result.
5. **Browser console**: while exercising, confirm no errors or React warnings appear.
6. **Report evidence**: state exactly what commands ran (with results), which flow was
   exercised, what was observed on screen and in the console. Only then declare the task done.

If any step fails: fix, then rerun the FULL checklist from step 1.
