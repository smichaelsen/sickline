---
id: task-18.1
title: Xcode project scaffold
status: In Progress
assignee: []
created_date: '2026-03-28 07:51'
updated_date: '2026-03-28 08:19'
labels:
  - ios
dependencies: []
parent_task_id: task-18
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the Xcode project manually, then wire it into the repo structure.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 New Xcode project created in ios/SicklineApp/ subfolder of the repo (File → New → App, SwiftUI interface, Swift language, iOS 17.0 minimum deployment)
- [ ] #2 Folder groups created in Xcode navigator: Network/, Models/, Features/DailyCheck/, Features/Timeline/, Shared/
- [ ] #3 TabView shell in SicklineApp.swift with two placeholder tabs (Daily Check, Timeline)
- [ ] #4 Project builds and runs on simulator without errors
- [ ] #5 ios/ folder committed to the repo (ensure .gitignore does not exclude xcodeproj or xcworkspace)
<!-- AC:END -->
