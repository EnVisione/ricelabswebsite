# Cloudflare Worker Setup — RiceLabs Server Status Relay

One-time setup guide for the `ricelabs-status-relay` Cloudflare Worker that
receives live stats from the Over Stars Minecraft server mod and serves them
to the website at `https://rice-labs.enviouse.com/envy`.

Runs on the Cloudflare edge, isolated from your Nginx origin — no changes to
the origin server or DNS structure required beyond confirming the proxy is on.

---

## Prerequisites

- Node.js 18+ (you already have it — Vite runs on it).
- A terminal in a **new empty folder**, NOT inside the website repo.

## Step 1 — Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

Opens a browser, pick your Cloudflare account, done.

## Step 2 — Scaffold the Worker project

```bash
mkdir ricelabs-status-relay
cd ricelabs-status-relay
npm init -y
npm install -D wrangler @cloudflare/workers-types typescript
mkdir src
```

## Step 3 — Create the KV namespace

```bash
wrangler kv namespace create STATUS_KV
```

Copy the `id` from the output — you paste it into `wrangler.toml` next.

## Step 4 — Create `wrangler.toml`

```toml
name = "ricelabs-status-relay"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[[kv_namespaces]]
binding = "STATUS_KV"
id = "PASTE_THE_ID_FROM_STEP_3_HERE"

[[routes]]
pattern = "rice-labs.enviouse.com/api/server-status*"
zone_name = "enviouse.com"
```

## Step 5 — Generate + store the shared secret

```bash
openssl rand -hex 32                      # copy the output somewhere safe
wrangler secret put RICELABS_STATUS_TOKEN # paste it when prompted
```

Keep that hex string — you also need it in the Minecraft mod's config.

## Step 6 — Paste the Worker source

`src/index.ts`:

```ts
export interface Env {
  STATUS_KV: KVNamespace
  RICELABS_STATUS_TOKEN: string
}

const KEY = 'server:overstars:latest'
const CORS_ORIGIN = 'https://rice-labs.enviouse.com'

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    if (!url.pathname.startsWith('/api/server-status')) {
      return new Response('not found', { status: 404 })
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': CORS_ORIGIN,
          'access-control-allow-methods': 'GET, POST, OPTIONS',
          'access-control-allow-headers': 'content-type, x-ricelabs-token',
          'access-control-max-age': '86400',
        },
      })
    }

    if (req.method === 'POST') {
      if (req.headers.get('x-ricelabs-token') !== env.RICELABS_STATUS_TOKEN) {
        return new Response('unauthorized', { status: 401 })
      }
      let body: any
      try { body = await req.json() } catch { return new Response('bad json', { status: 400 }) }
      if (!body || typeof body.timestamp !== 'number' || !body.players) {
        return new Response('bad payload', { status: 400 })
      }
      await env.STATUS_KV.put(KEY, JSON.stringify(body), { expirationTtl: 1800 })
      return new Response(null, {
        status: 204,
        headers: { 'access-control-allow-origin': CORS_ORIGIN },
      })
    }

    if (req.method === 'GET') {
      const raw = await env.STATUS_KV.get(KEY, 'json') as any
      const headers = {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=30, s-maxage=30',
        'access-control-allow-origin': CORS_ORIGIN,
      }
      if (!raw) return new Response(JSON.stringify({ online: false, stale: true, lastKnown: null }), { headers })
      const ageMs = Date.now() - raw.timestamp
      // 15 min = 3× the mod's 5-min push cadence; one missed push doesn't flip us OFFLINE
      if (ageMs > 15 * 60_000) {
        return new Response(JSON.stringify({ online: false, stale: true, lastKnown: raw, ageMs }), { headers })
      }
      return new Response(JSON.stringify({ ...raw, ageMs }), { headers })
    }

    return new Response('method not allowed', { status: 405 })
  },
}
```

`tsconfig.json` (next to `package.json`):

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

## Step 7 — Confirm DNS proxy is ON

Cloudflare Dashboard → `enviouse.com` → DNS → Records → the row for `rice-labs`
must show **orange cloud / Proxied**, not gray / DNS only. Worker routes don't
fire unless the record is proxied.

## Step 8 — Deploy

```bash
wrangler deploy
```

The output lists your route — `rice-labs.enviouse.com/api/server-status*`.

## Step 9 — Smoke test

```bash
# Empty response while the mod isn't running
curl https://rice-labs.enviouse.com/api/server-status
# → {"online":false,"stale":true,"lastKnown":null}

# Bad token
curl -X POST https://rice-labs.enviouse.com/api/server-status \
  -H "X-RiceLabs-Token: WRONG" \
  -H "Content-Type: application/json" \
  -d '{"timestamp":1,"players":{"online":0,"max":0}}'
# → 401

# Good token
curl -X POST https://rice-labs.enviouse.com/api/server-status \
  -H "X-RiceLabs-Token: YOUR_HEX_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"timestamp":'$(date +%s%3N)',"uptimeMs":60000,"tps":20,"players":{"online":1,"max":100,"names":["test"]},"motd":"Over Stars · Official · v5.8"}'
# → 204

# Read it back
curl https://rice-labs.enviouse.com/api/server-status
# → {"timestamp":…,"uptimeMs":…,"tps":…,"players":{…},"motd":"…","ageMs":…}
```

## Step 10 — Give the token to the mod developer

Paste the hex string from Step 5 into the mod's `config/ricelabs_status.toml`
under `authToken`.

---

## Common gotchas

- **`curl` returns Nginx's 404 page** → DNS record is DNS-only, or the route
  pattern doesn't match. Flip to Proxied and verify the pattern string.
- **`wrangler deploy` says "no zone found"** → `zone_name` in `wrangler.toml`
  must be the root zone (`enviouse.com`), not the subdomain.
- **401 with correct token** → check for trailing whitespace when you pasted
  the secret. Rerun `wrangler secret put` if unsure.
- **Old data served after a mod push** → edge caches GET responses 30 s.
  Bust it with `?t=<timestamp>` or wait 30 s.
- **Rotate the secret later** → `wrangler secret put RICELABS_STATUS_TOKEN` with
  the new value, then update the mod's config on the Minecraft server. The old
  token stops working instantly when you re-run the command.

---

## Maintenance

- **Free-tier headroom**: mod pushes ~288 times/day at the default 300s (5 min)
  cadence (the shipped mod default). Workers free tier allows 100K requests/day.
  KV free tier allows 1K writes/day — we use ~29% of the write quota,
  leaving ~700 writes/day of headroom for immediate join/leave/start/stop pushes
  and any burst activity.
  Do not lower `pushIntervalSeconds` below 300 unless you've upgraded the KV
  paid plan ($5/month).
- **Adding a second server later** (e.g., IWS server): change `KEY` from
  `server:overstars:latest` to `server:${serverId}:latest`, expect `serverId`
  in the POST body, and add new stat cards to the site.
- **Log viewing** in real time: `wrangler tail` from inside the project folder.
