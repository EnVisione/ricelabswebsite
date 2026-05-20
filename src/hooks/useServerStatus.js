import { useEffect, useState } from 'react'

// Polls the Cloudflare Worker relay at /api/server-status for live Over Stars
// server metrics (TPS, player count, uptime, MOTD).
//
// Shape returned by the Worker when the server is live:
//   {
//     online: true, timestamp, uptimeMs, tps, mspt,
//     players: { online, max, names: string[] },
//     motd: "…",
//     version: { minecraft, loader },
//     ageMs
//   }
//
// When the Worker hasn't received a push in > 5 min it returns:
//   { online: false, stale: true, lastKnown: <last payload or null>, ageMs? }
//
// Until the Minecraft mod is deployed, the relay will return either 404 or the
// "stale" shape; this hook handles both cleanly and returns null.

const ENDPOINT = '/api/server-status'
const POLL_INTERVAL_MS = 60_000          // 1 minute — UI refreshes quickly even though data only changes every 5 min
const LIVE_THRESHOLD_MS = 10 * 60_000    // 10 min = 2× mod's 5-min push cadence. OFFLINE beyond this.
const LS_KEY = 'ricelabs:server-status:v1'
const LS_TTL_MS = 5 * 60_000             // serve from cache if < 5 min old

function lsGet() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.at !== 'number') return null
    if (Date.now() - parsed.at > LS_TTL_MS) return null
    return parsed.data
  } catch {
    return null
  }
}
function lsSet(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ at: Date.now(), data })) } catch { /* quota — skip */ }
}

async function fetchStatus() {
  try {
    const r = await fetch(ENDPOINT, { credentials: 'omit' })
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

export function useServerStatus() {
  const [raw, setRaw] = useState(() => lsGet())

  useEffect(() => {
    let live = true
    const load = async () => {
      const data = await fetchStatus()
      if (!live || !data) return
      lsSet(data)
      setRaw(data)
    }
    load()
    const id = setInterval(load, POLL_INTERVAL_MS)
    return () => { live = false; clearInterval(id) }
  }, [])

  return normalize(raw)
}

// Flattens the live / stale shapes into one predictable object the UI can read.
function normalize(raw) {
  if (!raw) {
    return { loaded: false, online: false, data: null, ageMs: null }
  }
  // Stale response — use lastKnown if relay provided it.
  if (raw.online === false) {
    return {
      loaded: true,
      online: false,
      data: raw.lastKnown || null,
      ageMs: raw.ageMs ?? null,
    }
  }
  // Treat anything older than the live threshold as offline even if relay marked it live.
  const tooOld = raw.ageMs != null && raw.ageMs > LIVE_THRESHOLD_MS
  return {
    loaded: true,
    online: !tooOld,
    data: raw,
    ageMs: raw.ageMs ?? null,
  }
}

// Helpers consumed by the host card.
export function formatRelativeAgo(ms) {
  if (ms == null) return '—'
  const sec = Math.floor(ms / 1000)
  if (sec < 60) return sec + 's ago'
  const min = Math.floor(sec / 60)
  if (min < 60) return min + 'm ago'
  const hr = Math.floor(min / 60)
  if (hr < 48) return hr + 'h ' + (min % 60) + 'm ago'
  const day = Math.floor(hr / 24)
  return day + 'd ' + (hr % 24) + 'h ago'
}

// Pulls a version-looking substring ("v5.8", "1.20.1", "v2.4.0a") from the
// server MOTD. Returns the raw match with a leading "v" normalised in.
export function extractPackVersion(motd) {
  if (!motd || typeof motd !== 'string') return null
  const m = motd.match(/v?(\d+(?:\.\d+)+[a-z]?)/i)
  if (!m) return null
  return m[0].toLowerCase().startsWith('v') ? m[0] : 'v' + m[1]
}

// ───────────────────────────────────────────────────────────────────────────
// Scheduled-restart countdown
//
// The Over Stars server reboots 4× daily in America/Chicago local time:
//   1:09 AM · 7:09 AM · 1:09 PM · 7:09 PM   (every 6 hours)
//
// This mirrors `kubejs/server_scripts/restart_command.js` on the server —
// keep the two in sync. Minutes-since-midnight chosen because the original
// KubeJS script uses the same encoding, so the numbers are copy-paste.
// ───────────────────────────────────────────────────────────────────────────

const RESTART_SCHEDULE_CHICAGO_MIN = [69, 429, 789, 1149]
const RESTART_TZ = 'America/Chicago'

function getChicagoNowSeconds() {
  // Uses Intl so DST is handled correctly — Chicago switches between
  // CST (UTC-6) and CDT (UTC-5) twice a year, and the restart schedule is
  // defined in LOCAL wall-clock time, not UTC.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: RESTART_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const h = parseInt(parts.find((p) => p.type === 'hour').value, 10) || 0
  const m = parseInt(parts.find((p) => p.type === 'minute').value, 10) || 0
  const s = parseInt(parts.find((p) => p.type === 'second').value, 10) || 0
  return h * 3600 + m * 60 + s
}

function formatChicagoTime(secOfDay) {
  const h = Math.floor(secOfDay / 3600)
  const m = Math.floor((secOfDay % 3600) / 60)
  const displayH = h % 12 === 0 ? 12 : h % 12
  const ampm = h >= 12 ? 'PM' : 'AM'
  const mm = m < 10 ? '0' + m : '' + m
  return displayH + ':' + mm + ' ' + ampm + ' CT'
}

export function computeNextRestart() {
  const nowSec = getChicagoNowSeconds()
  const scheduleSec = RESTART_SCHEDULE_CHICAGO_MIN.map((m) => m * 60)
  let nextSec = null
  for (const s of scheduleSec) {
    if (s > nowSec) { nextSec = s; break }
  }
  const secondsUntil =
    nextSec == null
      ? 86400 - nowSec + scheduleSec[0]   // roll past midnight → tomorrow's 1:09 AM
      : nextSec - nowSec
  return {
    secondsUntil,
    nextTimeLabel: formatChicagoTime(nextSec ?? scheduleSec[0]),
  }
}

export function formatCountdown(secondsUntil) {
  if (secondsUntil == null || secondsUntil < 0) return '—'
  if (secondsUntil < 60) return '<1m'
  const totalMin = Math.floor(secondsUntil / 60)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h === 0) return m + 'm'
  if (m === 0) return h + 'h'
  return h + 'h ' + m + 'm'
}

// Ticks every 30s so the countdown visibly drifts down between page visits.
// State is pure — no network traffic.
export function useNextRestart() {
  const [next, setNext] = useState(() => computeNextRestart())
  useEffect(() => {
    const id = setInterval(() => setNext(computeNextRestart()), 30_000)
    return () => clearInterval(id)
  }, [])
  return next
}
