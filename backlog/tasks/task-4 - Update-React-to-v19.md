---
id: task-4
title: Update React to v19
status: Done
assignee:
  - '@assistant'
created_date: '2025-12-29 07:13'
updated_date: '2025-12-29 07:19'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update React (and related packages) to v19, ensuring the small React surface in this repo follows React 19 best practices.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Use ncu to identify and apply React ecosystem updates (react, react-dom, types, Vite plugin if needed) targeting React 19.
- [x] #2 React app builds and tests succeed with React 19 (including Storybook smoke/build).
- [x] #3 Code/config adjustments align with React 19 best practices for the existing components.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Run ncu to list React ecosystem updates (react, react-dom, @types/react, @types/react-dom, @vitejs/plugin-react, related Storybook deps) targeting React 19.
2. Upgrade dependencies to React 19, adjust config/build settings if any React 19 requirements (e.g., React Compiler opt-outs not needed yet) and keep Storybook aligned.
3. npm install and verify builds/tests: npm run build, npm test, npm run storybook -- --ci --smoke-test --quiet, npm run build-storybook.
4. Review our small React surface for React 19 best practices (strict mode root, modern APIs) and adjust if needed.
5. Document changes/commands in task notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Ran ncu (dry-run) to identify React ecosystem updates; focused on React 19 stack while leaving non-React deps unchanged.
- Upgraded react/react-dom to ^19.2.3 plus @types/react ^19.2.7, @types/react-dom ^19.2.3, and @vitejs/plugin-react ^5.1.2; npm install succeeds (storybook 9 emits peer-range warning for React 19 but works with createRoot).
- Fixed NodeNext TS errors by adding .js extensions in server imports and typing migrations query.
- Verified builds/tests: npm run build, npm test, npm run storybook -- --ci --smoke-test --quiet, npm run build-storybook (clean, storybook-static removed).
- React app already uses createRoot + StrictMode; no additional React 19-specific code changes required given current surface area.
<!-- SECTION:NOTES:END -->
