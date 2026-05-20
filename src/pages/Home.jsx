import { Link } from 'react-router-dom'
import HeroCanvas from '../components/HeroCanvas.jsx'
import MinecraftSkin from '../components/MinecraftSkin.jsx'
import { useCurseForge, useTotalDownloads, fmt, extractPackVersion } from '../hooks/useCurseForge.js'
import { PROJECTS } from '../data/projects.js'
import { SKINS } from '../constants.js'

const PROJECT_COUNT = PROJECTS.filter((p) => p.cf).length

const FEATURED = [
  { slug: 'immersed-with-shaders', label: 'Immersed With Shaders' },
  { slug: 'over-stars', label: 'Over Stars' },
  { slug: 'simplistic-gui', label: 'Simplistic GUI' },
  { slug: 'iwn', label: 'Immersed With Nature' },
]

function FeaturedCell({ slug, label }) {
  const data = useCurseForge(slug)
  const dl = data?.downloads?.total
  return (
    <div className="fs-item">
      <span className="fs-label">{label}</span>
      <span className="fs-val">{dl ? fmt(dl) : '…'}</span>
      <span className="fs-label">downloads</span>
    </div>
  )
}

function PackArt({ slug, fallback }) {
  const data = useCurseForge(slug)
  const thumb = data?.thumbnail
  if (thumb) {
    return (
      <div
        className="pack-art cf-thumb cf-loaded"
        style={{ backgroundImage: `url("${thumb}")` }}
      />
    )
  }
  return fallback
}

function PackDownloads({ slug }) {
  const data = useCurseForge(slug)
  return <>{data?.downloads?.total ? fmt(data.downloads.total) : '…'}</>
}

function PackVersionTag({ slug, fallback, className = 'tag accent' }) {
  const data = useCurseForge(slug)
  const v = extractPackVersion(data?.download?.display)
  const label = v ? `LIVE · ${v}` : fallback
  return <div className={className}>{label}</div>
}

// EnVy's solo mod slugs, ordered by downloads at last sync.
const ENVY_TOP = [
  'emi-gamestages-integration',
  'create-dupe-patch',
  'integratedplaytime',
  'progressivestages',
]

function EnvyFeatured() {
  return (
    <section className="container" id="envy-work">
      <div className="section-label" style={{ color: '#e0533d' }}>◆ DEV WORK</div>
      <h2 style={{ marginBottom: 12 }}>ENVY'S TOP MODS</h2>
      <p style={{ marginBottom: 24, maxWidth: '62ch' }}>
        The standalone mods EnVy ships alongside Rice Labs packs. Integration helpers, server utilities,
        and gameplay tweaks — download counts pulled live from CurseForge.
      </p>
      <div className="envy-featured-grid">
        {ENVY_TOP.map((slug) => <EnvyFeaturedCard key={slug} slug={slug} />)}
      </div>
      <div className="row" style={{ marginTop: 20 }}>
        <Link className="btn" to="/envy">◆ MY PROFILE</Link>
        <Link className="btn btn-ghost" to="/downloads">ALL MY MODS →</Link>
      </div>
    </section>
  )
}

function EnvyFeaturedCard({ slug }) {
  const data = useCurseForge(slug)
  const project = PROJECTS.find((p) => p.slug === slug)
  const name = data?.title || project?.name || slug
  const dl = data?.downloads?.total
  const thumb = data?.thumbnail
  const url = data?.urls?.curseforge || (project?.cf ? `https://www.curseforge.com/${project.cf}` : '#')
  const forOS = project?.builtFor === 'over-stars'

  return (
    <a className="ef-card" href={url} target="_blank" rel="noopener noreferrer">
      <div
        className="ef-thumb"
        style={thumb ? { backgroundImage: `url("${thumb}")` } : undefined}
      >
        {!thumb && <span className="ef-thumb-fallback mono">MOD</span>}
      </div>
      <div className="ef-body">
        <div className="row" style={{ gap: 6, marginBottom: 10 }}>
          <span className="tag red">MOD · BY ENVY</span>
          {forOS && <span className="tag gold">FOR OVER STARS</span>}
        </div>
        <h3>{name}</h3>
        <div className="pack-meta">
          <span className="mono accent">{dl ? fmt(dl) : '…'}+ downloads</span>
          <span className="mono muted">CurseForge →</span>
        </div>
      </div>
    </a>
  )
}

export default function Home() {
  const total = useTotalDownloads()

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-inner">
          <div className="tag accent">◆ RICE / LABS</div>
          <h1 className="hero-title">
            Modpacks<br />
            crafted<br />
            <span className="grass-underline accent">block by block.</span>
          </h1>
          <p className="hero-sub">
            A three-person studio building deeply immersive, hand-polished Minecraft modpacks &amp; mods. Over{' '}
            <strong className="accent">{total ? total.toLocaleString('en-US') : 'loading…'}</strong> downloads and counting.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            <a className="btn btn-primary" href="#packs">▶ EXPLORE PACKS</a>
            <Link className="btn btn-ghost btn-ooi" to="/ool">◆ OVER STARS: ORIGINS OF INDESTRUCTIUM</Link>
          </div>
          <div className="hero-stats">
            <div><span className="pixel accent">{total ? fmt(total) : '…'}</span><small>Total downloads</small></div>
            <div><span className="pixel gold">{PROJECT_COUNT}</span><small>Projects shipped</small></div>
            <div><span className="pixel purple">3</span><small>Devs</small></div>
            <div><span className="pixel" style={{ color: '#e0533d' }}>4yrs</span><small>Building</small></div>
          </div>
        </div>
        <div className="hero-fade"></div>
      </section>

      {/* FEATURED STRIP */}
      <section className="container" style={{ paddingTop: 24, paddingBottom: 16 }}>
        <div className="featured-strip">
          {FEATURED.map((d) => <FeaturedCell key={d.slug} {...d} />)}
        </div>
      </section>

      {/* MODPACKS SHOWCASE */}
      <section className="container" id="packs">
        <div className="section-label">◆ FEATURED WORK</div>
        <h2 style={{ marginBottom: 28 }}>OUR MODPACKS</h2>
        <div className="packs-grid">
          {/* One Ring pack — internal link */}
          <Link className="pack-card pack-os" to="/ool">
            <div className="pack-art pack-art-or">
              <div className="art-bg-or"></div>
              <img src="/TheOneRing.gif" alt="The One Ring" className="or-pack-gif" />
              <div className="art-badge">SNEAK PEEK</div>
            </div>
            <div className="pack-body">
              <div className="tag purple">IN DEVELOPMENT · 2026</div>
              <h3 className="ooi-title"><span className="ooi-cyan">OVER STARS:</span><br /><span className="ooi-magenta">ORIGINS OF INDESTRUCTIUM</span></h3>
              <p>LOTR-inspired progressive campaign, set 300 years before Over Stars. An ancient ring of unknown alloy, forbidden powers, and a vanished journeyman's footsteps to follow.</p>
              <div className="pack-meta">
                <span className="mono muted">→ dedicated sneak-peek page</span>
              </div>
            </div>
          </Link>

          {/* Over Stars — no planet */}
          <a className="pack-card" href="https://www.curseforge.com/minecraft/modpacks/over-stars" target="_blank" rel="noopener noreferrer">
            <PackArt
              slug="over-stars"
              fallback={
                <div className="pack-art art-overstars">
                  <div className="stars"></div>
                </div>
              }
            />
            <div className="pack-body">
              <PackVersionTag slug="over-stars" fallback="LIVE" className="tag accent" />
              <h3>OVER STARS</h3>
              <p>Challenging Tech-RPG progression with a custom 4-chapter questline, 5-stage tech tree, 5 new planets, 80+ biomes, villager contracts and ferocious bosses.</p>
              <div className="pack-meta">
                <span className="mono accent"><PackDownloads slug="over-stars" />+ downloads</span>
                <span className="mono muted">1.20.1 Forge</span>
              </div>
            </div>
          </a>

          {/* IWS — no sun */}
          <a className="pack-card" href="https://www.curseforge.com/minecraft/modpacks/immersed-with-shaders" target="_blank" rel="noopener noreferrer">
            <PackArt
              slug="immersed-with-shaders"
              fallback={
                <div className="pack-art art-iws">
                  <div className="trees-iws"></div>
                </div>
              }
            />
            <div className="pack-body">
              <PackVersionTag slug="immersed-with-shaders" fallback="LIVE" className="tag gold" />
              <h3>IMMERSED<br />WITH SHADERS</h3>
              <p>Client-side visual enhancement pack. Spectacular shaders, boosted FPS, immersive soundscape, QoL mods — and still works on vanilla servers.</p>
              <div className="pack-meta">
                <span className="mono accent"><PackDownloads slug="immersed-with-shaders" />+ downloads</span>
                <span className="mono muted">NeoForge / Fabric</span>
              </div>
            </div>
          </a>

          <a className="pack-card" href="https://www.curseforge.com/minecraft/modpacks/iwn" target="_blank" rel="noopener noreferrer">
            <PackArt
              slug="iwn"
              fallback={
                <div className="pack-art art-iwn">
                  <div className="forest"></div>
                  <div className="mist"></div>
                </div>
              }
            />
            <div className="pack-body">
              <PackVersionTag slug="iwn" fallback="LIVE" className="tag accent" />
              <h3>IMMERSED<br />WITH NATURE</h3>
              <p>Upgrade vanilla immersion. Shaders, FPS, textures, weather, soundscapes, worldgen &amp; QoL — a single-click enhancement of the base game.</p>
              <div className="pack-meta">
                <span className="mono accent"><PackDownloads slug="iwn" />+ downloads</span>
                <span className="mono muted">Forge</span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ENVY TOP 3 */}
      <EnvyFeatured />

      {/* ONE RING PROGRESS */}
      <section className="container">
        <div className="one-ring-progress card">
          <div className="orp-left">
            <div className="section-label" style={{ color: 'var(--accent-3)' }}>◆ IN THE FORGE</div>
            <h2 className="ooi-title"><span className="ooi-cyan">Over Stars:</span> <span className="ooi-magenta">Origins of Indestructium</span></h2>
            <p className="mono" style={{ color: 'var(--ink-dim)', marginTop: 12 }}>
              Development started Januray 2026 · planned release TBA · follow @Sneak Peaks in Discord
            </p>
            <div className="progress-group" style={{ marginTop: 24 }}>
              {[
                ['LORE & WORLDBUILDING', 62],
                ['QUEST CAMPAIGN', 28],
                ['CUSTOM CONTENT', 41],
                ['WORLD GEN & STRUCTURES', 18],
                ['CUSTOM SOUNDTRACK & AUDIO', 9],
              ].map(([label, pct]) => (
                <div key={label}>
                  <div className="prg-row">
                    <span className="pixel" style={{ fontSize: 9 }}>{label}</span>
                    <span className="mono ooi-cyan">{pct}%</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div>
                </div>
              ))}
            </div>
            <div className="row" style={{ marginTop: 24 }}>
              <Link className="btn btn-ooi" to="/ool">◆ READ THE TEASER</Link>
              <Link className="btn btn-ghost" to="/contact">GET THE ROLE</Link>
            </div>
          </div>
          <div className="orp-right">
            <div className="ring-anim">
              <img src="/TheOneRing.gif" alt="The One Ring" className="ring-gif" />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container">
        <div className="about-grid">
          <div>
            <div className="section-label">◆ WHO WE ARE</div>
            <h2>Three devs, one forge.</h2>
            <p style={{ marginTop: 16 }}>
              Rice Labs is <strong className="accent">NitroRiced</strong> (CEO — Founder, Creative Direction, Modpack Development, YouTube),{' '}
              <strong className="accent">EnVy</strong> (CTO — Development, Server Operations, Mod Work, Expert Coder), and{' '}
              <strong className="accent">Banane</strong> (Co-Dev — Modpack Development, Resource Packs, 3.1M+ downloads of his own). Small on purpose — every quest is hand-written, every balance pass is personal.
            </p>
            <div className="row" style={{ marginTop: 20 }}>
              <Link className="btn" to="/team">◆ MEET THE TEAM</Link>
              <Link className="btn btn-ghost" to="/contact">JOIN DISCORD</Link>
            </div>
          </div>
          <div className="stack">
            <Link to="/nitro" className="about-card about-card-nitro">
              <MinecraftSkin username={SKINS.nitro} variant="avatar" size={64} className="about-skin" />
              <div>
                <h3 style={{ fontSize: 12 }}>NITRORICED</h3>
                <div className="mono muted" style={{ fontSize: 11 }}>CEO · Creative · YouTube</div>
                <p style={{ fontSize: 13, marginTop: 8 }}>Runs the show. Series creator, designer-in-chief, content machine.</p>
                <div className="about-cta">VIEW PROFILE →</div>
              </div>
            </Link>
            <Link to="/envy" className="about-card about-card-envy">
              <MinecraftSkin username={SKINS.envy} variant="avatar" size={64} className="about-skin" />
              <div>
                <h3 style={{ fontSize: 12 }}>ENVY</h3>
                <div className="mono muted" style={{ fontSize: 11 }}>CTO · Developer · Server Ops</div>
                <p style={{ fontSize: 13, marginTop: 8 }}>Builds the tech. Ships mods, runs the official Over Stars server, handles improvements.</p>
                <div className="about-cta" style={{ color: '#e0533d' }}>VIEW PROFILE →</div>
              </div>
            </Link>
            <Link to="/banane" className="about-card about-card-banane">
              <MinecraftSkin username={SKINS.banane} variant="avatar" size={64} className="about-skin" />
              <div>
                <h3 style={{ fontSize: 12 }}>BANANE</h3>
                <div className="mono muted" style={{ fontSize: 11 }}>Co-Dev · Modpacks · Resource Packs</div>
                <p style={{ fontSize: 13, marginTop: 8 }}>Modpack builder behind the All in One series + a stable of clean resource packs. 3.1M+ downloads.</p>
                <div className="about-cta gold">VIEW PROFILE →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
