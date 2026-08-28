# Deploying via Cloudflare Tunnel

Four containers on one Docker network. **No ports are published.** `cloudflared`
dials out to Cloudflare, so the Pi has no inbound surface — the tunnel is the
only way in.

```
                          ┌──────────────────────────────────┐
      Cloudflare edge ────┤   cloudflared  (outbound only)   │
                          └───┬─────────────┬────────────┬───┘
  aspire-site.your-domain.dev ─┘             │            │
  aspire-admin.your-domain.dev ──────────────┘            │
  aspire-api.your-domain.dev ─────────────────────────────┘

                          ┌──────────────┐  ┌───────────────┐  ┌─────────┐
                          │ product-site │  │ admin-console │  │ backend │
                          │  Next :3000  │  │  nginx :80    │  │  :8000  │
                          └──────┬───────┘  └───────┬───────┘  └────▲────┘
                                 └──── /api ────────┴───────────────┘

              Postgres + Redis live off-box on 192.168.0.108 (k3s).
```

## Why the browser never makes a cross-origin request

Both frontends serve `/api` from their own origin:

- **product-site** — Next's `rewrites()` in `next.config.ts` proxy `/api/*` to
  the backend. These work in production (`next start`), not just dev — but the
  destination is resolved at **build time** and frozen into
  `.next/routes-manifest.json`. That is why `API_URL` is a build `arg` in
  docker-compose.yml, not only a runtime env var. Change the backend's service
  name and you must rebuild, not just restart.
- **admin-console** — a production Vite build is static files, and `server.proxy`
  is dev-only. So nginx in that container does the proxying instead, and also
  provides the SPA fallback React Router needs.

Because of that, `CORS_ORIGINS` can stay empty in production and Vite's
`allowedHosts` is irrelevant (it only guards the dev server).

`aspire-api.your-domain.dev` exists for curl and direct API access. No browser
code calls it, which is why `CORS_ORIGINS` stays localhost-only.

## One-time setup

This uses a **remotely-managed** tunnel: the connector authenticates with a
token, and ingress rules live in the Cloudflare dashboard rather than in a local
config file. There is deliberately no `cloudflared/config.yml` — for a
token-based tunnel it would be silently ignored.

1. Put the token from the dashboard (Networks -> Tunnels -> your tunnel ->
   *Install and run a connector*) into a git-ignored `.env` at the repo root:

   ```
   TUNNEL_TOKEN=eyJhIjoi...
   ```

   `.env.example` shows the shape. Never commit the real token; anyone holding
   it can run your tunnel.

2. In the dashboard, under your tunnel -> **Public Hostnames**, add three
   entries. The service address is the Docker *service name*, which resolves
   because cloudflared shares the compose network:

   | Public hostname               | Type | URL                 |
   |-------------------------------|------|---------------------|
   | `aspire-site.your-domain.dev`  | HTTP | `product-site:3000` |
   | `aspire-admin.your-domain.dev` | HTTP | `admin-console:80`  |
   | `aspire-api.your-domain.dev`   | HTTP | `backend:8000`      |

   Catch-all rule: `http_status:404`.

   Use `HTTP`, not `HTTPS` — TLS terminates at Cloudflare's edge, and the hop
   from cloudflared to each container is plain HTTP inside the bridge network.

   DNS records are created for you when you add a public hostname.

## Run

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f cloudflared   # look for "Registered tunnel connection"

Four registered connections is normal — cloudflared opens redundant links to two
Cloudflare edge locations.
```

## Staying up

- `restart: unless-stopped` on every service. Chosen over `always` because it
  respects a container you deliberately stopped when the daemon restarts.
- Docker is already `systemctl enable`d, so a reboot brings everything back.
  No extra systemd unit needed.
- The backend has a `/health` healthcheck; the two frontends wait on
  `service_healthy` before starting.
- Logs are capped at 10 MB × 3 per service. Without this the default json-file
  driver grows unbounded and eventually fills the SD card.
- `mem_limit` per service so one runaway container cannot OOM the whole Pi.

These run **production builds, not dev servers** — that is the main reason they
survive long uptimes. `nodemon`, `next dev`, and `vite dev` hold file watchers
and a resident TypeScript compiler, which is what tends to die overnight on a
7.7 GB Pi.

## Known production behaviour

Swagger UI at `/api-docs` and the on-disk regeneration of `swagger.json` are
gated on `NODE_ENV=development` in `expressConfig.ts`, so both are **off** in
these containers. `swagger.json` is still `require`d at startup and is copied
into the backend image. If you want Swagger served on `aspire-api.your-domain.dev`, that
gate needs changing — it is not a container issue.

## Rebuilding after a code change

```bash
docker compose up -d --build <service>
```

Building Next on aarch64 is the memory-hungry step. If it gets OOM-killed, build
one service at a time, or build on a bigger machine and push to the registry at
`192.168.0.108:5000`.

## Local dev is unchanged

`pnpm dev` in each project still works against `localhost:8000` — the Vite proxy
and Next rewrites both point there, and `CORS_ORIGINS` still lists the two
localhost origins.
