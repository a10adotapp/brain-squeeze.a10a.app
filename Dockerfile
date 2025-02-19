FROM node:22-bookworm AS base

#
# builder
#
FROM base AS builder

WORKDIR /app

COPY . .

RUN npm ci
RUN npx prisma generate --generator client
RUN npm run build

#
# runner
#
FROM gcr.io/distroless/nodejs22-debian12 AS runner

WORKDIR /app

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder --chown=nonroot:nonroot /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nonroot:nonroot /app/apps/web/public ./apps/web/public

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["apps/web/server.js"]
