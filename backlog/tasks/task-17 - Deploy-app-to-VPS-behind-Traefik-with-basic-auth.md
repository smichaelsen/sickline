---
id: task-17
title: Deploy app to VPS behind Traefik with basic auth
status: Done
assignee: []
created_date: '2026-03-20 22:59'
updated_date: '2026-03-28 09:13'
labels:
  - devops
  - infra
dependencies: []
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Make the app deployable to a VPS running Traefik. Basic authentication should be handled by Traefik middleware (not the app), so no auth is needed in local development.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Dockerfile builds and serves the production app
- [x] #2 docker-compose.prod.yml (or production profile) includes Traefik labels for routing and BasicAuth middleware
- [x] #3 Basic auth credentials are not hardcoded — sourced from env var or Docker secret
- [x] #4 Local dev (npm run dev / docker-compose without prod profile) requires no authentication
- [x] #5 README or docs note how to generate htpasswd credentials and configure the deployment
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Generate SSH deploy key and install public key on VPS
2. Create docker-compose.prod.yml with Traefik BasicAuth labels and data volume
3. Create .github/workflows/deploy.yml (build → ghcr.io → SSH deploy)
4. Document one-time VPS .env setup (domain + htpasswd credentials)
5. Verify ACs and finalize
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- docker-compose.prod.yml: pulls ghcr.io image, Traefik BasicAuth + HTTPS redirect middleware, SQLite data volume
- .github/workflows/deploy.yml: build → push to ghcr.io → scp compose file → SSH restart
- SSH deploy key generated (ed25519), public key installed on VPS authorized_keys
- Credentials (domain, htpasswd) live only in VPS .env — never in CI
- docs/deployment.md documents one-time VPS setup and htpasswd generation
<!-- SECTION:NOTES:END -->
