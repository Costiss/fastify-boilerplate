FROM oven/bun:1.1.27-alpine


WORKDIR /app

COPY . .

RUN apk update && \
    apk add --no-cache build-base python3

ENV NODE_ENV=production

RUN bun install

RUN bun run build

ENV PORT=8080
EXPOSE 8080

CMD ["bun", "run", "--smol", "--preload", "./dist/telemetry.mjs",  "./dist/index.mjs"]

