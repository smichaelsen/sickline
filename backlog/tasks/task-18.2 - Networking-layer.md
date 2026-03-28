---
id: task-18.2
title: Networking layer
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
Implement the shared networking infrastructure: hardcoded config, APIClient actor, error types, and shared utility extensions used across both feature screens.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Config.swift with hardcoded baseURL and base64-encoded basicAuth credential
- [ ] #2 APIClient actor with generic get<T: Decodable> and put<Body: Encodable, T: Decodable> methods using URLSession async/await
- [ ] #3 APIError enum covering HTTP error status codes and decoding failures
- [ ] #4 Color+Hex.swift extension parsing hex strings (e.g. #f97316) into SwiftUI Color
- [ ] #5 Date+Formatting.swift with helpers for ISO8601 parsing and display formatting
- [ ] #6 APIClient injected into SwiftUI environment via SicklineApp.swift
<!-- AC:END -->
