# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
# next.config's rewrites() is evaluated at build time and frozen into
# routes-manifest.json, so API_URL must be set here, not just at runtime.
ARG API_URL=http://backend:8000
ENV API_URL=$API_URL
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# next.config sets output:"standalone", so .next/standalone carries its own
# minimal node_modules and server.js.
FROM base AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
