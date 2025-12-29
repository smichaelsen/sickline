---
id: task-7
title: Add SickCommentTooltip component
status: Done
assignee:
  - '@assistant'
created_date: '2025-12-29 09:32'
updated_date: '2025-12-29 09:58'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a reusable tooltip container that can display the comment date and the message text. It should be theme-aware and ready to wrap the SickPeriod comment dots, but the interaction wiring (hover/click) is not part of this task.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Render the provided date and comment text with semantic structure so the tooltip can show both pieces of information clearly.
- [x] #2 Keep the tooltip presentation independent from SickPeriod interactivity; no event wiring is required for this task.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Build a SickCommentTooltip component that accepts date and comment props and renders them with semantic markup, spacing, and typographic hierarchy.
2. Add a Storybook story so we can preview the default tooltip presentation before integrating it with SickPeriod.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Built SickCommentTooltip with formatted date text, semantic markup, and padding plus a Storybook story so the tooltip presentation can be verified before wiring it to SickPeriod.

Added newline handling support and updated the story sample comment so multi-line text renders correctly.
<!-- SECTION:NOTES:END -->
