---
id: task-8.4
title: Add SickTimeline scroll/marker UI
status: To Do
assignee: []
created_date: '2025-12-31 07:21'
labels: []
dependencies: []
parent_task_id: task-8
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
With the rows rendering per member (task-8.3) and data flowing through, layer the UI controls: a date range reflector for the past 8 weeks, a container that always starts scrolled right to show today/the latest day, a solid black vertical line marking today, and smooth horizontal scrolling on desktop and mobile.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Timeline view initializes scrolled all the way to the right so the latest day (today) is visible immediately.
- [ ] #2 A solid black vertical line runs through the chart at today, and the date range reflector highlights the displayed 8-week span.
- [ ] #3 The scroll container allows native smooth scrolling on desktop and mobile (e.g., using CSS overflow/scroll snapping or momentum).
<!-- AC:END -->
