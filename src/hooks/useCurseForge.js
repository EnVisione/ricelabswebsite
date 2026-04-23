import { useEffect, useState } from 'react'
import { FALLBACK_TOTAL } from '../constants.js'
import { PROJECTS } from '../data/projects.js'

// Transport note: api.curseforge.com blocks browser origins (CORS) and any
// bundled key would be public, so runtime fetches go through api.cfwidget.com
// which proxies the same CurseForge data with no key. The Core API key in
// .env is used server-side by scripts/fetch-projects.mjs to regenerate the
// registry.
//
// To stay well under cfwidget's rate limits and avoid getting disabled, every
// response is cached in localStorage for 12h. Page reloads inside that window
// serve from cache and make ZERO network requests.

const SLUGS = Object.fromEntries(
  PROJECTS.filter((p) => p.cf).map((p) => [p.slug, p.cf])
)

const LS_PREFIX = 'ricelabs:cf:v2:'
const CACHE_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

// Only the fields the UI uses — keeps localStorage payload tiny.
function slim(raw) {
  if (!raw) return null
  return {
    title: raw.title,
    thumbnail: raw.thumbnail,
    downloads: { total: raw.downloads?.total || 0 },
    urls: { curseforge: raw.urls?.curseforge || '' },
    categories: raw.categories?.slice(0, 2) || [],
  }
}

function lsGet(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.at !== 'number') return null
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null
    return parsed.data
  } catch {
    return null
  }
}
function lsSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), data })) } catch { /* quota full — silently skip */ }
}

const memCache = {}
const inflight = {}

function cfFetch(path, cacheKey) {
  const key = cacheKey || path
  if (memCache[key]) return Promise.resolve(memCache[key])

  // Try localStorage first — no network on warm reload.
  const stored = lsGet(LS_PREFIX + key)
  if (stored) {
    memCache[key] = stored
    return Promise.resolve(stored)
  }

  if (inflight[key]) return inflight[key]
  inflight[key] = fetch(`https://api.cfwidget.com/${path}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('cf ' + r.status))))
    .then((raw) => {
      const data = slim(raw)
      memCache[key] = data
      lsSet(LS_PREFIX + key, data)
      return data
    })
    .catch(() => null)
    .finally(() => { delete inflight[key] })
  return inflight[key]
}

export function fetchProject(slug) {
  const path = SLUGS[slug] || slug
  if (!path) return Promise.resolve(null)
  return cfFetch(path, slug)
}

export function fmt(n) {
  if (n == null) return '—'
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

export function useCurseForge(slug) {
  const [data, setData] = useState(memCache[slug] || null)
  useEffect(() => {
    if (!slug) return
    let live = true
    fetchProject(slug).then((d) => { if (live) setData(d) })
    return () => { live = false }
  }, [slug])
  return data
}

// Bulk loader for the Downloads page — returns a map {slug: data}.
export function useAllProjects() {
  const [map, setMap] = useState({})
  useEffect(() => {
    let live = true
    const slugs = PROJECTS.filter((p) => p.cf).map((p) => p.slug)
    Promise.all(slugs.map((s) => fetchProject(s).then((d) => [s, d])))
      .then((pairs) => {
        if (!live) return
        const next = {}
        for (const [s, d] of pairs) if (d) next[s] = d
        setMap(next)
      })
    return () => { live = false }
  }, [])
  return map
}

// ───────────────────────────────────────────────────────────────────────────
// Persistent live download counter.
//
// Rules (explicit to avoid drift vs. reality):
//   • Seeds from the last real CurseForge total (anchor).
//   • Ticks up at ~1 download/second (86,400/day).
//   • HARD CAP: never more than +100K above the last real anchor. Once the
//     counter hits anchor+100K it just sits there until the next refresh.
//   • Every 12h we re-fetch the real total and re-anchor. If real > displayed
//     we snap up; if real < displayed we snap down. Self-correcting.
//   • Persists in localStorage so refreshes don't reset the number.
// ───────────────────────────────────────────────────────────────────────────

const TICKER_KEY = 'ricelabs:total-ticker'
const TICKER_REFRESH_MS = 12 * 60 * 60 * 1000
const TICKER_RATE_PER_SEC = 1 // downloads/sec
const TICKER_MAX_OVERFLOW = 100_000 // hard cap above anchor

function loadTickerState() {
  try {
    const raw = localStorage.getItem(TICKER_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
function saveTickerState(s) {
  try { localStorage.setItem(TICKER_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

async function fetchLiveTotal() {
  const slugs = PROJECTS.filter((p) => p.cf).map((p) => p.slug)
  const results = await Promise.all(slugs.map(fetchProject))
  let t = 0
  for (const d of results) if (d?.downloads?.total) t += d.downloads.total
  return t
}

function projectedValue(state) {
  if (!state?.anchorValue) return FALLBACK_TOTAL
  const elapsedSec = Math.max(0, (Date.now() - state.anchorTime) / 1000)
  const growth = Math.min(elapsedSec * TICKER_RATE_PER_SEC, TICKER_MAX_OVERFLOW)
  return Math.floor(state.anchorValue + growth)
}

export function useTotalDownloads() {
  const [displayed, setDisplayed] = useState(() => {
    const s = loadTickerState()
    return s ? projectedValue(s) : FALLBACK_TOTAL
  })

  // Tick every second; cap enforced inside projectedValue.
  useEffect(() => {
    const id = setInterval(() => {
      const s = loadTickerState()
      if (!s || !s.anchorValue) return
      setDisplayed(projectedValue(s))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // On mount: refresh real total if we've never fetched or it's been > 12h.
  useEffect(() => {
    let live = true
    const s = loadTickerState() || {}
    const needsRefresh = !s.realFetchedAt || Date.now() - s.realFetchedAt > TICKER_REFRESH_MS
    if (!needsRefresh) {
      if (!s.anchorValue) {
        const seed = { anchorValue: FALLBACK_TOTAL, anchorTime: Date.now(), realTotal: FALLBACK_TOTAL, realFetchedAt: 0 }
        saveTickerState(seed)
        setDisplayed(FALLBACK_TOTAL)
      }
      return
    }
    fetchLiveTotal().then((real) => {
      if (!live || !real) return
      // Snap to real — counter can't drift past anchor+100K before the next
      // sync anyway, so this also corrects any over/under-count.
      const next = {
        anchorValue: real,
        anchorTime: Date.now(),
        realTotal: real,
        realFetchedAt: Date.now(),
      }
      saveTickerState(next)
      setDisplayed(real)
    })
    return () => { live = false }
  }, [])

  return displayed
}

export const CF_SLUGS = SLUGS
