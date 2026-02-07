# Farcaster Contest Host (MVP)

Create a contest, ask people to reply to your cast, and show a leaderboard ranked by **likes + 2×recasts**.

## Env vars (Vercel)

Required:
- `NEYNAR_API_KEY`
- `NEXT_PUBLIC_APP_URL` (e.g. `https://farcaster-contest-host.vercel.app`)

Persistence (Redis):
- Preferred: set these manually (copy from your Upstash integration):
  - `REDIS_REST_URL`
  - `REDIS_REST_TOKEN`

Alternatives supported:
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
- `KV_REST_API_URL` + `KV_REST_API_TOKEN`

## Usage

1) Open `/create` and create a contest.
2) Post the generated cast text from your Farcaster account.
3) Paste the cast hash at `/c/<id>/set-hash`.
4) Share `/c/<id>` as the leaderboard.
