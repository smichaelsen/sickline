---
id: task-6
title: Upgrade Storybook to v10
status: Done
assignee: []
created_date: '2025-12-29 07:49'
updated_date: '2026-03-28 09:13'
labels: []
dependencies: []
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Track upgrade of Storybook from v9 to v10 once official v10 addons are published.
Current blockers: @storybook/addon-essentials and @storybook/addon-interactions have no v10 releases (latest tags 8.6.x / 9.0.0-alpha.*). Storybook core/react-vite 10.1.10 exists.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Confirm v10 versions are available for required addons (addon-essentials, addon-interactions, docs/autodocs flow) and update package.json accordingly.
- [x] #2 Update .storybook/main.ts/preview.ts to v10 conventions (e.g., autodocs config, framework options) and ensure stories still render.
- [x] #3 Verify npm run storybook -- --ci --smoke-test --quiet and npm run build-storybook pass on v10.
- [x] #4 Document migration notes (breaking changes addressed, addon versions used, any config updates) in task notes.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update package.json: bump storybook and @storybook/react-vite to ^10.3.1, remove @storybook/addon-essentials, @storybook/addon-interactions, @storybook/test
2. Update .storybook/main.ts: remove addons array entries (now built-in)
3. Update .storybook/preview.ts: remove deprecated argTypesRegex actions param
4. Run npm install
5. Verify npm run storybook -- --ci --smoke-test --quiet and npm run build-storybook pass
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Upgraded storybook and @storybook/react-vite from v9.1.17 to v10.3.1.

- Removed @storybook/addon-essentials, @storybook/addon-interactions, @storybook/test from package.json — these were merged into storybook core in v9/v10 and are no longer published as v10 packages.
- Removed the addons array from .storybook/main.ts (addons are now built-in, zero config required).
- Removed deprecated `actions: { argTypesRegex }` parameter from .storybook/preview.ts (auto-detection is now built-in).
- Added storybook-static to .gitignore.
- Clean npm install required (removed node_modules + package-lock.json first due to cached old storybook packages).
- `npm run build-storybook` passes on v10.3.1 with all 3 stories rendering.
<!-- SECTION:NOTES:END -->
