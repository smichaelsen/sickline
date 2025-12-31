---
id: task-8.5
title: Wire SickCommentTooltip to timeline
status: To Do
assignee: []
created_date: '2025-12-31 07:21'
labels: []
dependencies: []
parent_task_id: task-8
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
After the timeline rows and UI container exist, hook the SickPeriod comment dots into the existing  (client/src/components/SickCommentTooltip.tsx). Clicking a dot should open the tooltip near that period, and clicking again or clicking outside should close it, mirroring the behavior expected in the new timeline.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Clicking a SickPeriod comment dot toggles the SickCommentTooltip for that comment.
- [ ] #2 Clicking outside the tooltip or toggling to another dot closes the previously open tooltip so interactions stay consistent.
<!-- AC:END -->
