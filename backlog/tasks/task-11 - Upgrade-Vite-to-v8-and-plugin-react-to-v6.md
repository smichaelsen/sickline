---
id: task-11
title: Upgrade Vite to v8 and plugin-react to v6
status: To Do
assignee: []
created_date: '2026-03-20 17:51'
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
- [ ] #1 Vite 8 migration guide reviewed for breaking changes
- [ ] #2 vite and @vitejs/plugin-react updated to latest in package.json
- [ ] #3 npm run build succeeds
- [ ] #4 npm run dev starts without errors
- [ ] #5 npm run storybook starts without errors
<!-- AC:END -->
