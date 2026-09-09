FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY . .

RUN pnpm run check
RUN pnpm run test:prebuild
RUN pnpm run build

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1111

WORKDIR /app

RUN corepack enable

COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 1111

CMD ["pnpm", "exec", "astro", "preview", "--host", "0.0.0.0", "--port", "1111"]
