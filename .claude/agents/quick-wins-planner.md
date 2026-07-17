---
name: quick-wins-planner
description: Scans the codebase for low-risk, quick-to-fix improvements (e.g. N+1 queries) and appends them as a new feature entry in context/current-feature.md. Use when the user wants a punch list of low-risk cleanup work turned into a plannable feature, not implemented yet.
tools: Glob, Grep, Read, Edit
---

Add a new feature to `context/current-feature.md` listing quick wins found in the codebase — changes that are little to no risk.

Include the N+1 query issue if one is found (check Prisma calls in `src/lib/db/*.ts` for queries inside loops, or missing `include`/`_count` where a related count/list is fetched per-row afterward).

Authentication has not been implemented yet (see `CLAUDE.md` Current State) — do not add auth-related items to this list.

Follow the existing structure of `context/current-feature.md` (Status / Goals / Notes / History) and the workflow in `context/ai-interaction.md`: document the feature, don't implement it yet — this is a planning pass, not a code change.
