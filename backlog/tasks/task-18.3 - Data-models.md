---
id: task-18.3
title: Data models
status: To Do
assignee: []
created_date: '2026-03-28 07:51'
labels:
  - ios
dependencies: []
parent_task_id: task-18
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement all Codable Swift structs and enums that map to API response shapes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Member struct (id, name, color) conforming to Codable and Identifiable
- [ ] #2 HealthStatus enum (green, yellow, red) as RawRepresentable String Codable
- [ ] #3 StatusEntry struct (id, memberId, status, title?, comment?)
- [ ] #4 StatusResponse struct (date, entries)
- [ ] #5 SeverityPeriod and PeriodComment structs matching API shapes
- [ ] #6 SickPeriod struct (memberId, startDate, endDate?, status, title?, severityPeriods, comments) with computed Identifiable id
- [ ] #7 JSONDecoder configured with convertFromSnakeCase where needed
<!-- AC:END -->
