import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MinecraftSkin from '../components/MinecraftSkin.jsx'
import { useCurseForge, useAllProjects, fmt, extractPackVersion } from '../hooks/useCurseForge.js'
import { PROJECTS } from '../data/projects.js'
import {
  DISCORD_INVITE,
  DISCORD_HANDLES,
  SKINS,
  YOUTUBE_URL,
  CURSEFORGE_NITRO,
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
      <h3 style={{ fontSize: 10, color: 'var(--accent)', marginBottom: 8 }}>{title}</h3>
      {projects.map((p) => {
        const live = cfData[p.slug]
        const dl = live?.downloads?.total
        return (
          <div className="cat-row" key={p.name}>
            <strong>
              {p.name}
              {p.inDev && <span className="project-badge dev">IN DEV</span>}
              {!p.inDev && p.owner === 'both' && <span className="project-badge collab">+ ENVY</span>}
            </strong>
            <span className="mono">
              {p.inDev ? 'in dev' : dl ? fmt(dl) : '…'}
            </span>
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
  return <>{v}</>
}

export default function Nitro() {
  useEffect(() => {
    document.body.classList.add('nitro-theme')
    return () => document.body.classList.remove('nitro-theme')
  }, [])

  const cfData = useAllProjects()
  // Nitro's catalog = everything he owns or co-owns.
  const nitroProjects = PROJECTS.filter((p) => p.owner === 'nitro' || p.owner === 'both')
  const modpacks = nitroProjects.filter((p) => p.type === 'MODPACK')
  const mods = nitroProjects.filter((p) => p.type === 'MOD')
  const resources = nitroProjects.filter((p) => p.type === 'RESOURCE PACK')

  return (
    <>
      <section className="container profile-hero">
        <div className="ph-skin ph-skin-nitro">
          <MinecraftSkin username={SKINS.nitro} variant="body" size={170} className="mc-skin-img" />
          <div className="ph-nameplate">
            <div className="ph-rank pixel accent">[CEO]</div>
            <div className="ph-level pixel accent">LVL 99</div>
          </div>
        </div>
        <div className="ph-body">
          <div className="section-label nitro-label">◆ DEV PROFILE</div>
          <h1 style={{ fontSize: 48, marginBottom: 12 }}>NitroRiced</h1>
          <div className="mono muted" style={{ fontSize: 13, marginBottom: 20 }}>
            CEO · Creator · Designer · YouTube · Rice Labs founder
          </div>
          <p style={{ fontSize: 16, maxWidth: '58ch' }}>
            CEO and creative force behind every pack we ship. Builds the worlds,
            writes the lore, designs the quests, and takes it all to YouTube. 35.1M+ downloads later,
            still just makin' cool Minecraft stuff.
          </p>
          <div className="row" style={{ marginTop: 24, gap: 10 }}>
            <div className="tag accent">CEO</div>
            <div className="tag">DEV</div>
            <div className="tag accent">YOUTUBE</div>
            <div className="tag purple">305 FOLLOWERS</div>
          </div>
          <div className="link-row">
            <a className="link-chip discord" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              ◆ discord · @{DISCORD_HANDLES.nitro}
            </a>
            <a className="link-chip" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              ▶ youtube · @NitroRicedYT
            </a>
            <a className="link-chip" href={CURSEFORGE_NITRO} target="_blank" rel="noopener noreferrer">
              ◆ curseforge · nitroriced
            </a>
          </div>
          <div className="row" style={{ marginTop: 20 }}>
            <a className="btn btn-primary" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">▶ YOUTUBE</a>
            <a className="btn" href={CURSEFORGE_NITRO} target="_blank" rel="noopener noreferrer">◆ CURSEFORGE</a>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="yt-strip">
          {(() => {
            let total = 0
            for (const p of nitroProjects) {
              const d = cfData[p.slug]?.downloads?.total
              if (d) total += d
            }
            const cfCount = nitroProjects.filter((p) => p.cf).length
            const stats = [
              [total ? fmt(total) : '35.1M', 'Total downloads'],
              [String(cfCount), 'CurseForge projects'],
              ['305', 'CF followers'],
              ['5 years', 'Creating'],
            ]
            return stats.map(([v, l]) => (
              <div className="yt-item" key={l}><span className="pixel accent">{v}</span><small>{l}</small></div>
            ))
          })()}
        </div>
      </section>

      <section className="container">
        <div className="section-label nitro-label">◆ SIGNATURE WORKS</div>
        <h2 style={{ marginBottom: 24 }}>THE HITS</h2>
        <div className="sig-grid">
          <a className="sig-card sig-os" href="https://www.curseforge.com/minecraft/modpacks/over-stars" target="_blank" rel="noopener noreferrer">
            <SigArt
              slug="over-stars"
              fallback={
                <div className="sig-art sig-art-os">
                  <div className="stars"></div>
                </div>
              }
            />
            <div className="sig-body">
              <div className="tag accent">MODPACK · <PackVersionLine slug="over-stars" /></div>
              <strong>OVER STARS</strong>
              <p>Tech-RPG campaign. 1000+ hand-written quests. 5 planets. 80+ biomes. His magnum opus.</p>
              <div className="mono accent"><Downloads slug="over-stars" /> downloads</div>
            </div>
          </a>

          <a className="sig-card sig-iws" href="https://www.curseforge.com/minecraft/modpacks/immersed-with-shaders" target="_blank" rel="noopener noreferrer">
            <SigArt
              slug="immersed-with-shaders"
              fallback={
                <div className="sig-art sig-art-iws">
                  <div className="hills"></div>
                </div>
              }
            />
            <div className="sig-body">
              <div className="tag accent">MODPACK · <PackVersionLine slug="immersed-with-shaders" /></div>
              <strong>IMMERSED WITH SHADERS</strong>
              <p>The pack that started it all. Client-side shaders, FPS, sound — vanilla server compatible.</p>
              <div className="mono accent"><Downloads slug="immersed-with-shaders" /> downloads</div>
            </div>
          </a>

          <a className="sig-card" href="https://www.curseforge.com/minecraft/texture-packs/simplistic-gui" target="_blank" rel="noopener noreferrer">
            <SigArt
              slug="simplistic-gui"
              fallback={
                <div className="sig-art sig-art-simplistic">
                  <div className="simplistic-shape"></div>
                </div>
              }
            />
            <div className="sig-body">
              <div className="tag accent">RESOURCE PACK</div>
              <strong>SIMPLISTIC GUI</strong>
              <p>Clean, minimalist UI overhaul. A staple of the "less noise, more focus" vanilla aesthetic.</p>
              <div className="mono accent"><Downloads slug="simplistic-gui" /> downloads</div>
            </div>
          </a>

          <a className="sig-card sig-iwn" href="https://www.curseforge.com/minecraft/modpacks/iwn" target="_blank" rel="noopener noreferrer">
            <SigArt
              slug="iwn"
              fallback={
                <div className="sig-art sig-art-iwn-nitro">
                  <div className="forest"></div>
                  <div className="mist"></div>
                </div>
              }
            />
            <div className="sig-body">
              <div className="tag accent">MODPACK · <PackVersionLine slug="iwn" /></div>
              <strong>IMMERSED WITH NATURE</strong>
              <p>One-click immersion upgrade. Shaders, FPS, weather, soundscape & worldgen on top of vanilla.</p>
              <div className="mono accent"><Downloads slug="iwn" /> downloads</div>
            </div>
          </a>
        </div>
      </section>

      <section className="container">
        <div className="yt-card card">
          <div className="yt-meta">
            <div className="section-label" style={{ color: '#e0533d' }}>◆ ON YOUTUBE</div>
            <h2 style={{ marginBottom: 12 }}>@NitroRicedYT</h2>
            <p>
              Tutorials, showcases, and dev diaries covering the RiceLabs pack library. If you're trying to figure out how Over Stars works, start here.
            </p>
            <div className="row" style={{ marginTop: 16 }}>
              <a className="btn btn-primary" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">▶ SUBSCRIBE</a>
              <a className="btn btn-ghost" href={YOUTUBE_URL + '/videos'} target="_blank" rel="noopener noreferrer">ALL VIDEOS</a>
            </div>
          </div>
          <div className="yt-preview">
            {[
              ['', 'Latest upload', 'watch now', YOUTUBE_URL + '/videos'],
              ['yt-thumb-2', 'Over Stars tutorial', 'full series', YOUTUBE_URL + '/search?query=over+stars'],
              ['yt-thumb-3', 'IWS showcase', 'channel', YOUTUBE_URL],
            ].map(([cls, name, dur, href], i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={'yt-thumb ' + cls}
              >
                <div className="yt-play">▶</div>
                <div className="yt-thumb-label mono">{name}</div>
                <div className="yt-duration mono">{dur}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-label nitro-label">◆ CREATIVE CREDO</div>
        <h2 style={{ marginBottom: 24 }}>HOW NITRO BUILDS</h2>
        <div className="credo-grid credo-grid-nitro">
          {[
            ['01', 'LORE FIRST', 'A pack without story is a pile of mods. Over Stars has a four-chapter campaign because it had a story before it had a mod list.'],
            ['02', 'POLISH OVER SCOPE', 'Fewer quests, but each one hand-tuned. Fewer mods, but each one serving the pack. Pick an identity and ship it.'],
            ['03', 'SHOW YOUR WORK', 'YouTube, Discord, sneak peeks. The community gets to watch the forge, not just the finished blade.'],
            ['04', 'ITERATE FOREVER', "A RiceLabs pack is never done — it's just in production. Always a next version queued up."],
          ].map(([n, title, body]) => (
            <div className="credo" key={n}>
              <div className="credo-num pixel accent">{n}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-label nitro-label">◆ THE FULL CATALOG</div>
        <h2 style={{ marginBottom: 24 }}>EVERYTHING SHIPPED</h2>
        <div className="catalog">
          <CatalogCol title="MODPACKS" projects={modpacks} cfData={cfData} />
          <CatalogCol title="MODS" projects={mods} cfData={cfData} />
          <CatalogCol title="RESOURCE PACKS" projects={resources} cfData={cfData} />
        </div>
        <p className="mono muted" style={{ marginTop: 16, fontSize: 11 }}>
          Counts pull live from CurseForge. See <Link to="/downloads" className="accent">/downloads</Link> for the sortable view.
        </p>
      </section>

      <section className="container">
        <div
          className="contact-card card"
          style={{ background: 'linear-gradient(90deg, rgba(124,194,66,0.08), var(--panel))', borderColor: 'rgba(124,194,66,0.3)' }}
        >
          <div>
            <div className="section-label nitro-label">◆ FOLLOW</div>
            <h2>Catch the next drop</h2>
            <p style={{ marginTop: 12 }}>
              Subscribe on YouTube for dev diaries, hop in Discord (<span className="accent">@{DISCORD_HANDLES.nitro}</span>) for sneak peeks, follow on CurseForge for release pings.
            </p>
          </div>
          <div className="row">
            <a className="btn btn-primary" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">▶ YOUTUBE</a>
            <a className="btn" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">DISCORD</a>
            <Link className="btn btn-ghost" to="/team">BACK TO TEAM</Link>
          </div>
        </div>
      </section>
    </>
  )
}
