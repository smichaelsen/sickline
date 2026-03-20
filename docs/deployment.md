# Deployment

The app deploys automatically to the VPS via GitHub Actions on every push to `master`.

## How it works

1. GitHub Actions builds a Docker image and pushes it to `ghcr.io/smichaelsen/sickline:latest`
2. It SSHs to the VPS, copies `docker-compose.prod.yml`, and runs `docker compose up -d`
3. Traefik handles TLS (via Let's Encrypt DNS challenge) and BasicAuth — no auth in the app itself

## Required GitHub Secrets

| Secret | Description |
|---|---|
| `SSH_PRIVATE_KEY` | Private key of the deploy SSH key pair |
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USER` | SSH user (e.g. `root`) |
| `DEPLOY_PATH` | Absolute path on VPS (e.g. `/root/apps/sickline`) |

## One-time VPS setup

Create `$DEPLOY_PATH/.env` on the VPS:

```
SICKLINE_HOST=your-domain.example.com
BASIC_AUTH_USERS=username:$$2y$$...hashed-password...
```

### Generating the htpasswd value

```bash
htpasswd -nB username
```

Copy the output and **double every `$`** (required by docker-compose variable interpolation).

Example: `user:$2y$05$abc...` → `user:$$2y$$05$$abc...`

## Local development

Run without Docker and without any authentication:

```bash
npm run dev
```

The SQLite database is stored at `data/sickline.sqlite` (auto-created on first run).
