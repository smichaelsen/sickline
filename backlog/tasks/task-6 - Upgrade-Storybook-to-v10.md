---
id: task-6
title: Upgrade Storybook to v10
status: To Do
assignee: []
created_date: '2025-12-29 07:49'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Track upgrade of Storybook from v9 to v10 once official v10 addons are published.
Current blockers: @storybook/addon-essentials and @storybook/addon-interactions have no v10 releases (latest tags 8.6.x / 9.0.0-alpha.*). Storybook core/react-vite 10.1.10 exists.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Confirm v10 versions are available for required addons (addon-essentials, addon-interactions, docs/autodocs flow) and update package.json accordingly.
- [ ] #2 Update .storybook/main.ts/preview.ts to v10 conventions (e.g., autodocs config, framework options) and ensure stories still render.
- [ ] #3 Verify npm run storybook -- --ci --smoke-test --quiet and npm run build-storybook pass on v10.
- [ ] #4 Document migration notes (breaking changes addressed, addon versions used, any config updates) in task notes.
<!-- AC:END -->
