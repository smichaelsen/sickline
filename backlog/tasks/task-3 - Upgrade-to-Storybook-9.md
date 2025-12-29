---
id: task-3
title: Upgrade to Storybook 9
status: Done
assignee:
  - '@assistant'
created_date: '2025-12-29 06:42'
updated_date: '2025-12-29 07:06'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Upgrade Storybook from v8 to v9 so our component docs stay current with the latest tooling and compatibility expectations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Storybook core packages and addons are upgraded to v9 with config updates applied for any breaking changes.
- [x] #2 Storybook dev server runs via npm run storybook and build-storybook succeeds.
- [x] #3 Documentation (scripts/readme or task notes) reflects the Storybook 9 upgrade and any new commands or workflows.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Review current Storybook setup (packages, main/preview, Vite config, addons) and note v8-specific settings.
2. Upgrade Storybook core, builder, and addons to v9 (using storybook upgrade or targeted npm installs) and adjust configs for breaking changes (e.g., Vite options, addons config paths, tsconfig).
3. Validate dev and build flows: run npm run storybook and npm run build-storybook, addressing regressions.
4. Update docs/task notes with the upgrade steps, new scripts, and any migration caveats.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Upgraded Storybook to 9.0.x: storybook/react-vite 9.0.18, essentials 9.0.0-alpha.12, interactions 9.0.0-alpha.10, test 9.0.0-alpha.2 (alpha versions needed because stable v9 addons are not published in this registry).
- Regenerated package-lock.json via npm install after clean node_modules removal.
- Verified npm run storybook -- --ci --smoke-test --quiet passes.
- Verified npm run build-storybook succeeds (storybook-static output).
- No config changes required; revisit and bump off alpha when stable v9 addon releases are available.

- Removed deprecated @storybook/testing-library dev dependency (unused); npm install refreshed lock without that package.

- Bumped @fastify/static to ^9.0.0 to drop glob@8; new deps use glob@13 (warning resolved).
<!-- SECTION:NOTES:END -->
