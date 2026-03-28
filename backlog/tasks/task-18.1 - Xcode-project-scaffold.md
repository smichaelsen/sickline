---
id: task-18.1
title: Xcode project scaffold
status: Done
assignee: []
created_date: '2026-03-28 07:51'
updated_date: '2026-03-28 09:13'
labels:
  - ios
dependencies: []
parent_task_id: task-18
priority: high
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the Xcode project manually, then wire it into the repo structure.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 New Xcode project created in ios/SicklineApp/ subfolder of the repo (File → New → App, SwiftUI interface, Swift language, iOS 17.0 minimum deployment)
- [x] #2 Folder groups created in Xcode navigator: Network/, Models/, Features/DailyCheck/, Features/Timeline/, Shared/
- [x] #3 TabView shell in SicklineApp.swift with two placeholder tabs (Daily Check, Timeline)
- [x] #4 Project builds and runs on simulator without errors
- [x] #5 ios/ folder committed to the repo (ensure .gitignore does not exclude xcodeproj or xcworkspace)
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Xcode project created in ios/SicklineApp/, renamed from SicklineApp to Sickline to avoid SicklineAppApp redundancy. Folder groups: Network, Models, Features/DailyCheck, Features/Timeline, Shared. TabView shell with two placeholder tabs. Built and ran on iPhone 16 Pro simulator (iOS 26.4). Committed to topic/ios-app branch.
<!-- SECTION:NOTES:END -->
