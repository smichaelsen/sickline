---
id: task-18
title: iOS App — Sickline native SwiftUI app
status: To Do
assignee: []
created_date: '2026-03-28 07:47'
labels:
  - ios
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Native SwiftUI app for Sickline family health tracking. Distributes via TestFlight.

## Goals & Constraints
- Native SwiftUI app, no web views
- Use Apple design language throughout — no pixel-perfect recreation of the web UI
- Hardcoded endpoint + credentials in v1
- Distribute via TestFlight

## Tech Stack
- UI: SwiftUI (native, declarative, first-class Apple support)
- Min iOS: 17.0 — unlocks `@Observable` macro and the best Charts API; ~90%+ device coverage
- Networking: URLSession + async/await (no third-party deps)
- Charts: Swift Charts built-in — native Gantt-style bars via BarMark with xStart/xEnd ranges
- State management: `@Observable` + `@State`/`@Binding`
- Date handling: Foundation (Calendar, DateFormatter, ISO8601DateFormatter)
- Dependency management: Swift Package Manager
- No third-party dependencies in v1

## Architecture: MVVM

Views (SwiftUI) → DailyCheckView, TimelineView
Each screen gets its own `@Observable` ViewModel.
APIClient is a shared singleton (or passed via SwiftUI environment) containing the hardcoded base URL and credentials.

## Networking Layer

Config.swift holds hardcoded baseURL and basicAuth (base64-encoded credentials).
APIClient is an `actor` with generic `get<T>` and `put<Body, T>` methods.
The actor isolation prevents data races. JSON decoding uses JSONDecoder with `keyDecodingStrategy = .convertFromSnakeCase` where needed (API already returns camelCase).

## Data Models

- Member: id, name, color (hex → SwiftUI Color via extension)
- HealthStatus: enum green/yellow/red
- StatusEntry: id, memberId, status, title?, comment?
- StatusResponse: date, entries
- SickPeriod: memberId, startDate, endDate?, status, title?, severityPeriods, comments

## Screens & Navigation

TabView:
- Tab 1: Daily Check (person.fill icon)
- Tab 2: Timeline (chart.bar.xaxis icon)

### Tab 1 — Daily Health Check
Native pattern: Form inside a NavigationStack.
- Navigation title shows date ("Today", "Yesterday", or "Mon, 24 Mar")
- DatePicker in toolbar (or chevron prev/next buttons)
- One Section per family member: member name as header (in their color), status picker (3 large tappable buttons green/yellow/red using SF Symbols), TextField for title, TextEditor for comment
- Toolbar: Save button (.navigationBarTrailing)
- On load: fetch yesterday's status + titles to prefill (matching web behavior); comments always start empty
- Save triggers PUT /api/status for all members at once

### Tab 2 — Timeline
Native pattern: Swift Charts BarMark with date ranges, inside a ScrollView.
- Gantt-style bars using BarMark(xStart:xEnd:y:) with foregroundStyle per member color
- chartScrollableAxes(.horizontal) — iOS 17 native horizontal scrolling with momentum
- Range selector (30/60/90 days): Picker with .segmented style in toolbar
- Each member row uses their configured color
- Comments: chartOverlay + SpatialTapGesture to detect bar taps → show popover or sheet with comments

## Project Structure

SicklineApp/
├── SicklineApp.swift          # @main entry, inject APIClient into environment
├── Config.swift               # hardcoded baseURL + credentials
├── Network/
│   ├── APIClient.swift
│   └── APIError.swift
├── Models/
│   ├── Member.swift
│   ├── StatusEntry.swift
│   └── SickPeriod.swift
├── Features/
│   ├── DailyCheck/
│   │   ├── DailyCheckView.swift
│   │   └── DailyCheckViewModel.swift
│   └── Timeline/
│       ├── TimelineView.swift
│       └── TimelineViewModel.swift
└── Shared/
    ├── Color+Hex.swift        # parse "#f97316" → SwiftUI Color
    └── Date+Formatting.swift

## Distribution
- Apple Developer Program ($99/yr) required
- Build → Archive → Upload to TestFlight
- Invite family members by email
- Builds expire after 90 days; re-upload to extend

## What's Deferred (not v1)
- Settings screen for URL/credentials (hardcoded in v1; add later with @AppStorage + Keychain)
- Offline / local cache (always-online in v1)
- Push notifications (requires APNs integration on the server)
- Add/edit family members (no API for this; file-based config stays for now)
- iPad layout (iPhone-first; adaptive layout comes for free later)
- Widget (could show today's family status in Lock Screen / Home widget via WidgetKit)

## Notes
- CORS is NOT needed: iOS URLSession does not enforce CORS (only browsers do). No backend change required for v1.
<!-- SECTION:DESCRIPTION:END -->
