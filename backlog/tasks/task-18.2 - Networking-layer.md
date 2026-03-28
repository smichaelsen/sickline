---
id: task-18.2
title: Networking layer
status: Done
assignee: []
created_date: '2026-03-28 07:51'
updated_date: '2026-03-28 09:13'
labels:
  - ios
dependencies: []
parent_task_id: task-18
priority: high
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the shared networking infrastructure: hardcoded config, APIClient actor, error types, and shared utility extensions used across both feature screens.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Config.swift with hardcoded baseURL and base64-encoded basicAuth credential
- [x] #2 APIClient actor with generic get<T: Decodable> and put<Body: Encodable, T: Decodable> methods using URLSession async/await
- [x] #3 APIError enum covering HTTP error status codes and decoding failures
- [x] #4 Color+Hex.swift extension parsing hex strings (e.g. #f97316) into SwiftUI Color
- [x] #5 Date+Formatting.swift with helpers for ISO8601 parsing and display formatting
- [x] #6 APIClient injected into SwiftUI environment via SicklineApp.swift
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create Config.swift with baseURL and basicAuthHeader
2. Create Network/APIError.swift
3. Create Network/APIClient.swift actor
4. Create Shared/Color+Hex.swift
5. Create Shared/Date+Formatting.swift
6. Update SicklineApp.swift to inject APIClient into environment
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Config.swift: enum with baseURL placeholder and basicAuthHeader (lazy base64 computation)
- Network/APIError.swift: httpError(Int), decodingError(Error), unknown(Error)
- Network/APIClient.swift: actor with generic get<T> and put<Body,T> using URLSession async/await; Authorization header injected from Config
- Shared/Color+Hex.swift: Color(hex:) init supporting "#rrggbb" and "rrggbb"
- Shared/Date+Formatting.swift: Date(iso8601:) with fallback chains, relativeDisplayString, apiDateString, and String.iso8601Date
- SicklineApp.swift: EnvironmentKey + EnvironmentValues extension; single APIClient instance injected via .environment()
- No pbxproj changes needed — project uses PBXFileSystemSynchronizedRootGroup (auto-discovers files)
- TODO: fill in real baseURL and credentials in Config.swift before running on device
<!-- SECTION:NOTES:END -->
