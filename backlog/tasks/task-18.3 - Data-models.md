---
id: task-18.3
title: Data models
status: Done
assignee: []
created_date: '2026-03-28 07:51'
updated_date: '2026-03-28 08:31'
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
- [x] #1 Member struct (id, name, color) conforming to Codable and Identifiable
- [x] #2 HealthStatus enum (green, yellow, red) as RawRepresentable String Codable
- [x] #3 StatusEntry struct (id, memberId, status, title?, comment?)
- [x] #4 StatusResponse struct (date, entries)
- [x] #5 SeverityPeriod and PeriodComment structs matching API shapes
- [x] #6 SickPeriod struct (memberId, startDate, endDate?, status, title?, severityPeriods, comments) with computed Identifiable id
- [x] #7 JSONDecoder configured with convertFromSnakeCase where needed
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create Models/Member.swift
2. Create Models/HealthStatus.swift
3. Create Models/StatusEntry.swift
4. Create Models/StatusResponse.swift
5. Create Models/SickPeriod.swift (SeverityPeriod + PeriodComment + SickPeriod)
6. Verify JSONDecoder key strategy — API returns camelCase so no convertFromSnakeCase needed; document this in AC #7
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Member, HealthStatus, StatusEntry, StatusResponse, SickPeriod models created under Models/
- HealthStatus is String RawRepresentable enum (green/yellow/red) with CaseIterable for picker use
- SickPeriod has no server-provided id; computed id derived from memberId+startDate for Identifiable conformance
- SeverityPeriod and PeriodComment extracted as separate structs matching /api/sick-periods response shape
- API returns camelCase keys already — plain JSONDecoder() is correct; documented with comment in APIClient.swift
<!-- SECTION:NOTES:END -->
