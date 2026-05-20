import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MinecraftSkin from '../components/MinecraftSkin.jsx'
import { useCurseForge, useAllProjects, fmt, extractPackVersion } from '../hooks/useCurseForge.js'
import { PROJECTS } from '../data/projects.js'
import {
  DISCORD_INVITE,
  DISCORD_HANDLES,
  SKINS,
  CURSEFORGE_BANANE,
} from '../constants.js'

function Downloads({ slug }) {
  const data = useCurseForge(slug)
  return <>{data?.downloads?.total ? fmt(data.downloads.total) + '+' : '…'}</>
}

function SigArt({ slug, fallback }) {
  const data = useCurseForge(slug)
  const thumb = data?.thumbnail
  if (thumb) {
    return (
      <div
        className="sig-art"
        style={{
          backgroundImage: `url("${thumb}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    )
  }
  return fallback
}

function CatalogCol({ title, projects, cfData }) {
  return (
    <div className="cat-col">
      <h3 style={{ fontSize: 10, color: 'var(--accent-2)', marginBottom: 8 }}>{title}</h3>
      {projects.map((p) => {
        const live = cfData[p.slug]
        const dl = live?.downloads?.total
        return (
          <div className="cat-row" key={p.name}>
            <strong>{p.name}</strong>
            <span className="mono">{dl ? fmt(dl) : '…'}</span>
          </div>
        )
      })}
    </div>
  )
}

function PackVersionLine({ slug }) {
  const data = useCurseForge(slug)
  const v = extractPackVersion(data?.download?.display)
  if (!v) return null
  return <span className="mono muted" style={{ marginLeft: 8, fontSize: 10 }}>· {v}</span>
}

export default function Banane() {
  useEffect(() => {
    document.body.classList.add('banane-theme')
    return () => document.body.classList.remove('banane-theme')
  }, [])

  const cfData = useAllProjects()
  const bananeProjects = PROJECTS.filter((p) => p.owner === 'banane')
  const modpacks = bananeProjects.filter((p) => p.type === 'MODPACK')
  const resources = bananeProjects.filter((p) => p.type === 'RESOURCE PACK')

  let totalDl = 0
  for (const p of bananeProjects) {
    const d = cfData[p.slug]?.downloads?.total
    if (d) totalDl += d
  }

  return (
    <>
      <section className="container profile-hero">
        <div className="ph-skin ph-skin-banane">
          <MinecraftSkin username={SKINS.banane} variant="body" size={170} className="mc-skin-img" />
          <div className="ph-nameplate">
            <div className="ph-rank pixel gold">[CO-DEV]</div>
            <div className="ph-level pixel gold">LVL 99</div>
          </div>
        </div>
        <div className="ph-body">
          <div className="section-label banane-label">◆ DEV PROFILE</div>
          <h1 style={{ fontSize: 48, marginBottom: 12 }}>Banane</h1>
          <div className="mono muted" style={{ fontSize: 13, marginBottom: 20 }}>
            aka bananegod · Co-Dev · Modpacks & Resource Packs
          </div>
          <p style={{ fontSize: 16, maxWidth: '58ch' }}>
            The mind behind the <strong>All in One</strong> series and a stable of
            clean, focused resource packs. A Rice Labs founder since day one — builds themed modpacks fast,
            ships polished textures, and carries 3.1M+ downloads of his own work.
            If a pack has a theme and runs smooth, there's a good chance Banane wrote the mod list.
          </p>
          <div className="row" style={{ marginTop: 24, gap: 10 }}>
            <div className="tag gold">CO-DEV</div>
            <div className="tag gold">MODPACKS</div>
            <div className="tag gold">RESOURCE PACKS</div>
            <div className="tag">13 FOLLOWERS</div>
          </div>
          <div className="link-row">
            <a className="link-chip discord" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              ◆ discord · @{DISCORD_HANDLES.banane}
            </a>
            <a className="link-chip" href={CURSEFORGE_BANANE} target="_blank" rel="noopener noreferrer">
              ◆ curseforge · bananegod
            </a>
          </div>
          <div className="row" style={{ marginTop: 20 }}>
            <a className="btn btn-gold" href={CURSEFORGE_BANANE} target="_blank" rel="noopener noreferrer">◆ CURSEFORGE</a>
            <a className="btn" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">JOIN DISCORD</a>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="yt-strip">
          {(() => {
            const cfCount = bananeProjects.filter((p) => p.cf).length
            const stats = [
              [totalDl ? fmt(totalDl) : '3.1M', 'Total downloads'],
              [String(cfCount), 'CurseForge projects'],
              ['13', 'CF followers'],
              ['3 years', 'On CurseForge'],
            ]
            return stats.map(([v, l]) => (
              <div className="yt-item" key={l}><span className="pixel gold">{v}</span><small>{l}</small></div>
            ))
          })()}
        </div>
      </section>

      <section className="container">
        <div className="section-label banane-label">◆ SIGNATURE WORKS</div>
        <h2 style={{ marginBottom: 24 }}>THE HITS</h2>
        <div className="sig-grid">
          <a className="sig-card" href="https://www.curseforge.com/minecraft/modpacks/all-in-one-create" target="_blank" rel="noopener noreferrer">
            <SigArt
              slug="all-in-one-create"
              fallback={<div className="sig-art sig-art-banane-create"><div className="banane-gear" /></div>}
            />
            <div className="sig-body">
              <div className="tag gold">MODPACK<PackVersionLine slug="all-in-one-create" /></div>
              <strong>ALL IN ONE: CREATE</strong>
              <p>The flagship. Create mod plus its addons, QOL, and curated extras — a Create experience that doesn't sprawl.</p>
              <div className="mono gold"><Downloads slug="all-in-one-create" /> downloads</div>
            </div>
          </a>

          <a className="sig-card" href="https://www.curseforge.com/minecraft/texture-packs/simple-crosshair" target="_blank" rel="noopener noreferrer">
            <SigArt
              slug="simple-crosshair"
              fallback={<div className="sig-art sig-art-banane-rp"><div className="banane-plus" /></div>}
            />
            <div className="sig-body">
              <div className="tag gold">RESOURCE PACK</div>
              <strong>SIMPLE CROSSHAIR</strong>
              <p>Clean, minimal crosshair. Easier aiming, no clutter. 463K downloads of stripped-back precision.</p>
              <div className="mono gold"><Downloads slug="simple-crosshair" /> downloads</div>
            </div>
          </a>

          <a className="sig-card" href="https://www.curseforge.com/minecraft/texture-packs/smooth-swords" target="_blank" rel="noopener noreferrer">
            <SigArt
              slug="smooth-swords"
              fallback={<div className="sig-art sig-art-banane-rp"><div className="banane-plus" /></div>}
            />
            <div className="sig-body">
              <div className="tag gold">RESOURCE PACK</div>
              <strong>SMOOTH SWORDS</strong>
              <p>Replaces the default sword textures with a clean, aesthetic re-cut. Pure visual upgrade — no gameplay change.</p>
              <div className="mono gold"><Downloads slug="smooth-swords" /> downloads</div>
            </div>
          </a>

          <a className="sig-card" href="https://www.curseforge.com/minecraft/modpacks/all-in-one-fantasy" target="_blank" rel="noopener noreferrer">
            <SigArt
              slug="all-in-one-fantasy"
              fallback={<div className="sig-art sig-art-banane-fantasy"><div className="banane-spark" /></div>}
            />
            <div className="sig-body">
              <div className="tag gold">MODPACK<PackVersionLine slug="all-in-one-fantasy" /></div>
              <strong>ALL IN ONE: FANTASY</strong>
              <p>Magic, mythical creatures, spells, structures, biomes — a curated fantasy modpack you can pick up and play.</p>
              <div className="mono gold"><Downloads slug="all-in-one-fantasy" /> downloads</div>
            </div>
          </a>
        </div>
      </section>

      <section className="container">
        <div className="section-label banane-label">◆ CREATIVE CREDO</div>
        <h2 style={{ marginBottom: 24 }}>HOW BANANE BUILDS</h2>
        <div className="credo-grid credo-grid-banane">
          {[
            ['01', 'A THEME, NOT A KITCHEN SINK', 'Every "All in One" pack picks a lane. Create. Fantasy. Steampunk. The mod list serves that one idea — nothing else gets in.'],
            ['02', 'PICK YOUR DIFFICULTY', 'Some packs are friendly (All in One: Create). Some will eat you alive (Quest of Survival). The audience knows what they\'re signing up for.'],
            ['03', 'TEXTURES THAT WHISPER', "Resource packs that change one thing and do it well. Crosshairs. Swords. Ingots. Totems. No fonts, no UI overhauls — just clean replacements."],
            ['04', 'SHIP, ITERATE, REPEAT', '14 projects since 2022. Some are massive, some are tiny — but they all shipped. Done beats perfect.'],
          ].map(([n, title, body]) => (
            <div className="credo" key={n}>
              <div className="credo-num pixel gold">{n}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-label banane-label">◆ THE FULL CATALOG</div>
        <h2 style={{ marginBottom: 24 }}>EVERYTHING SHIPPED</h2>
        <div className="catalog catalog-banane">
          <CatalogCol title="MODPACKS" projects={modpacks} cfData={cfData} />
          <CatalogCol title="RESOURCE PACKS" projects={resources} cfData={cfData} />
        </div>
        <p className="mono muted" style={{ marginTop: 16, fontSize: 11 }}>
          Counts pull live from CurseForge. See <Link to="/downloads" className="gold">/downloads</Link> for the sortable view.
        </p>
      </section>

      <section className="container">
        <div
          className="contact-card card"
          style={{ background: 'linear-gradient(90deg, rgba(201,162,39,0.08), var(--panel))', borderColor: 'rgba(201,162,39,0.3)' }}
        >
          <div>
            <div className="section-label banane-label">◆ FOLLOW</div>
            <h2>Catch the next drop</h2>
            <p style={{ marginTop: 12 }}>
              Follow on CurseForge for release pings, hop in Discord (<span className="gold">@{DISCORD_HANDLES.banane}</span>) for sneak peeks and pack discussion.
            </p>
          </div>
          <div className="row">
            <a className="btn btn-gold" href={CURSEFORGE_BANANE} target="_blank" rel="noopener noreferrer">◆ CURSEFORGE</a>
            <a className="btn" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">DISCORD</a>
            <Link className="btn btn-ghost" to="/team">BACK TO TEAM</Link>
          </div>
        </div>
      </section>
    </>
  )
}
