---
id: task-18.4
title: Daily Check screen
status: To Do
assignee: []
created_date: '2026-03-28 07:51'
labels:
  - ios
dependencies: []
parent_task_id: task-18
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the Daily Health Check tab: fetches yesterday's entries to prefill, lets the user set status/title/comment per member, and saves via PUT /api/status.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 DailyCheckViewModel (@Observable) fetches GET /api/status for yesterday to prefill status and title; comments always start empty
- [ ] #2 DailyCheckViewModel exposes saveAll() calling PUT /api/status for all members
- [ ] #3 DailyCheckView uses Form with one Section per family member
- [ ] #4 Each section shows member name as header in their color, three tappable status buttons (green/yellow/red) with SF Symbols, TextField for title, TextEditor for comment
- [ ] #5 Toolbar contains date navigation (prev/next chevrons or DatePicker) and a Save button
- [ ] #6 Navigation title shows Today, Yesterday, or formatted date string
- [ ] #7 Loading and error states are handled gracefully in the UI
<!-- AC:END -->
