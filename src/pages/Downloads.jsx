import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS, OWNER_LABEL } from '../data/projects.js'
import { useAllProjects, fmt } from '../hooks/useCurseForge.js'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'nitro', label: 'Nitro' },
  { id: 'envy', label: 'EnVy' },
  { id: 'banane', label: 'Banane' },
  { id: 'both', label: 'Collabs' },
]

const SORTS = [
  { id: 'downloads', label: 'Downloads ↓' },
  { id: 'downloads-asc', label: 'Downloads ↑' },
  { id: 'name', label: 'Name A–Z' },
  { id: 'type', label: 'Type' },
]

const TYPE_FILTERS = [
  { id: 'all', label: 'All types' },
  { id: 'MODPACK', label: 'Modpacks' },
  { id: 'MOD', label: 'Mods' },
  { id: 'RESOURCE PACK', label: 'Resource packs' },
]

export default function Downloads() {
  const data = useAllProjects()
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sort, setSort] = useState('downloads')
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const enriched = PROJECTS.map((p) => {
      const d = p.cf ? data[p.slug] : null
      return {
        ...p,
        downloads: d?.downloads?.total ?? 0,
        thumbnail: d?.thumbnail || null,
        url: d?.urls?.curseforge || (p.cf ? `https://www.curseforge.com/${p.cf}` : null),
        mcVersion: d?.versions?.[0]?.[0] || d?.files?.[0]?.versions?.[0] || null,
        loaderText: d?.download?.version || null,
      }
    })
    const q = query.trim().toLowerCase()
    return enriched
      .filter((r) => filter === 'all' || r.owner === filter)
      .filter((r) => typeFilter === 'all' || r.type === typeFilter)
      .filter((r) => !q || r.name.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name)
        if (sort === 'type') return a.type.localeCompare(b.type) || b.downloads - a.downloads
        if (sort === 'downloads-asc') return a.downloads - b.downloads
        return b.downloads - a.downloads
      })
  }, [data, filter, typeFilter, sort, query])

  const totals = useMemo(() => {
    let count = rows.length
    let dl = 0
    let live = 0
    for (const r of rows) {
      dl += r.downloads
      if (r.thumbnail || r.downloads) live++
    }
    return { count, dl, live }
  }, [rows])

  const loading = Object.keys(data).length === 0

  return (
    <>
      <section className="container">
        <div className="section-label">◆ DOWNLOADS</div>
        <h1 style={{ marginBottom: 16 }}>EVERY<br /><span className="grass-underline accent">RICELABS DROP.</span></h1>
        <p style={{ fontSize: 16, maxWidth: '64ch' }}>
          Every modpack, mod, and resource pack we've shipped. Numbers pull live from CurseForge.
          Sort, filter, click through to grab any of them.
        </p>
        <div className="row" style={{ marginTop: 20 }}>
          <div className="tag accent">{totals.count} projects</div>
          <div className="tag gold">{fmt(totals.dl)} downloads shown</div>
          <div className="tag">{loading ? 'syncing…' : `${totals.live} live`}</div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 0 }}>
        <div className="dl-toolbar">
          <div className="dl-group">
            <span className="dl-label pixel">OWNER</span>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={'dl-chip ' + (filter === f.id ? 'on' : '')}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="dl-group">
            <span className="dl-label pixel">TYPE</span>
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                className={'dl-chip ' + (typeFilter === f.id ? 'on' : '')}
                onClick={() => setTypeFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="dl-group">
            <span className="dl-label pixel">SORT</span>
            <select className="dl-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="dl-group dl-group-search">
            <input
              className="dl-search"
              placeholder="Search projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="dl-list">
          <div className="dl-row dl-head">
            <div />
            <div>Project</div>
            <div>Type</div>
            <div>By</div>
            <div style={{ textAlign: 'right' }}>Downloads</div>
          </div>
          {rows.map((r, i) => <Row key={r.slug || r.name} row={r} rank={i + 1} />)}
          {rows.length === 0 && (
            <div className="dl-empty mono">No projects match that filter.</div>
          )}
        </div>
      </section>
    </>
  )
}

function Row({ row, rank }) {
  const inner = (
    <>
      <div className="dl-thumb-wrap">
        <div className="dl-rank mono">#{rank}</div>
        <div
          className={'dl-thumb' + (row.slug === 'over-stars-the-one-ring' ? ' dl-thumb-ooi' : '')}
          style={
            row.slug === 'over-stars-the-one-ring'
              ? { backgroundImage: 'url("/TheOneRing.gif")' }
              : row.thumbnail
              ? { backgroundImage: `url("${row.thumbnail}")` }
              : undefined
          }
        />
      </div>
      <div className="dl-meta">
        <strong>{row.name}</strong>
        <div className="dl-sub mono">
          {row.inDev && <span className="project-badge dev">IN DEV</span>}
          {!row.inDev && row.owner === 'both' && <span className="project-badge collab">COLLAB</span>}
          {row.url && <span className="muted">{stripHost(row.url)}</span>}
        </div>
      </div>
      <div className="dl-type mono">{row.type}</div>
      <div className={'dl-owner owner-' + row.owner}>{OWNER_LABEL[row.owner]}</div>
      <div className="dl-downloads">
        {row.downloads ? fmt(row.downloads) : row.inDev ? 'TBA' : '—'}
      </div>
    </>
  )

  const className = 'dl-row dl-body'
  if (row.internalLink) return <Link className={className} to={row.internalLink}>{inner}</Link>
  if (row.url) return <a className={className} href={row.url} target="_blank" rel="noopener noreferrer">{inner}</a>
  return <div className={className + ' dl-static'}>{inner}</div>
}

function stripHost(url) {
  try {
    const u = new URL(url)
    return u.pathname.replace(/^\//, '')
  } catch {
    return url
  }
}
