---
id: task-11
title: Upgrade Vite to v8 and plugin-react to v6
status: Done
assignee: []
created_date: '2026-03-20 17:51'
updated_date: '2026-03-20 18:04'
labels:
  - frontend
  - devops
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Vite and @vitejs/plugin-react are coupled and must be upgraded together. Both are major version bumps (vite 7→8, plugin-react 5→6) so migration notes should be checked before upgrading.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Vite 8 migration guide reviewed for breaking changes
- [x] #2 vite and @vitejs/plugin-react updated to latest in package.json
- [x] #3 npm run build succeeds
- [x] #4 npm run dev starts without errors
- [x] #5 npm run storybook starts without errors
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update vite and @vitejs/plugin-react in package.json
2. Run npm install
3. Verify npm run build
4. Verify npm run dev starts
5. Verify npm run storybook starts
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Bumped vite 7→8.0.1 and @vitejs/plugin-react 5→6.0.1 in package.json
- No vite.config.ts changes needed (no rollupOptions/esbuildOptions in use)
- Required full node_modules wipe + fresh npm install to resolve peer dep conflict from stale lockfile
- npm run build:client ✓, npm run storybook ✓ (reached "Storybook ready!")
<!-- SECTION:NOTES:END -->
