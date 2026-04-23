import { Link } from 'react-router-dom'
import HeroCanvas from '../components/HeroCanvas.jsx'
import MinecraftSkin from '../components/MinecraftSkin.jsx'
import { useCurseForge, useTotalDownloads, fmt } from '../hooks/useCurseForge.js'
import { PROJECTS } from '../data/projects.js'

const PROJECT_COUNT = PROJECTS.filter((p) => p.cf).length

const FEATURED = [
  { slug: 'immersed-with-shaders', label: 'Immersed With Shaders' },
  { slug: 'over-stars', label: 'Over Stars' },
  { slug: 'diamond-crosshair', label: 'Diamond Crosshair' },
  { slug: 'clean-swords', label: 'Clean Swords' },
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
        The standalone mods EnVy ships alongside RiceLabs packs. Integration helpers, server utilities,
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
            A two-person studio building deeply immersive, hand-polished Minecraft modpacks &amp; mods. Over{' '}
            <strong className="accent">{total ? total.toLocaleString('en-US') : 'loading…'}</strong> downloads and counting.
          </p>
          <div className="row" style={{ marginTop: 24 }}>
            <a className="btn btn-primary" href="#packs">▶ EXPLORE PACKS</a>
            <Link className="btn btn-ghost" to="/one-ring">◆ OS: ONE RING</Link>
          </div>
          <div className="hero-stats">
            <div><span className="pixel accent">{total ? fmt(total) : '…'}</span><small>Total downloads</small></div>
            <div><span className="pixel gold">{PROJECT_COUNT}</span><small>Projects shipped</small></div>
            <div><span className="pixel purple">2</span><small>Devs</small></div>
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
          <Link className="pack-card pack-os" to="/one-ring">
            <div className="pack-art">
              <div className="art-layer art-bg-os"></div>
              <div className="art-ring"></div>
              <div className="art-badge">SNEAK PEEK</div>
            </div>
            <div className="pack-body">
              <div className="tag purple">IN DEVELOPMENT · 2026</div>
              <h3>OVER STARS:<br />THE ONE RING</h3>
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
              <div className="tag accent">LIVE · v5.8</div>
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
              <div className="tag gold">LIVE · 26.x</div>
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
              <div className="tag accent">LIVE</div>
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
            <h2>Over Stars: The One Ring</h2>
            <p className="mono" style={{ color: 'var(--ink-dim)', marginTop: 12 }}>
              Development started 2026 · planned release TBA · follow @Sneak Peaks in Discord
            </p>
            <div className="progress-group" style={{ marginTop: 24 }}>
              {[
                ['LORE & WORLDBUILDING', 62],
                ['QUEST CAMPAIGN', 28],
                ['CUSTOM MODS / RING MECHANICS', 41],
                ['WORLD GEN & STRUCTURES', 18],
                ['SOUNDTRACK & AUDIO', 9],
              ].map(([label, pct]) => (
                <div key={label}>
                  <div className="prg-row">
                    <span className="pixel" style={{ fontSize: 9 }}>{label}</span>
                    <span className="mono accent">{pct}%</span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div>
                </div>
              ))}
            </div>
            <div className="row" style={{ marginTop: 24 }}>
              <Link className="btn btn-gold" to="/one-ring">◆ READ THE TEASER</Link>
              <Link className="btn btn-ghost" to="/contact">GET THE ROLE</Link>
            </div>
          </div>
          <div className="orp-right">
            <div className="ring-anim">
              <div className="ring-glow"></div>
              <div className="ring-band">
                <div className="runes pixel">ᛟ · ᚱ · ᛁ · ᚲ · ᛖ · ᛚ · ᚨ · ᛒ · ᛋ</div>
              </div>
              <div className="ring-band ring-band-2">
                <div className="runes pixel">300 YRS · UNKNOWN ALLOYS · FORBIDDEN</div>
              </div>
              <div className="ring-pedestal"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container">
        <div className="about-grid">
          <div>
            <div className="section-label">◆ WHO WE ARE</div>
            <h2>Two devs, one forge.</h2>
            <p style={{ marginTop: 16 }}>
              RiceLabs is <strong className="accent">NitroRiced</strong> (CEO — creative direction, YouTube) and{' '}
              <strong className="accent">EnVy</strong> (CTO — development, server ops, mod work). Small on purpose — every quest is hand-written, every balance pass is personal.
            </p>
            <div className="row" style={{ marginTop: 20 }}>
              <Link className="btn" to="/team">◆ MEET THE TEAM</Link>
              <Link className="btn btn-ghost" to="/contact">JOIN DISCORD</Link>
            </div>
          </div>
          <div className="stack">
            <Link to="/nitro" className="about-card about-card-nitro">
              <MinecraftSkin username="Nitroriced" variant="avatar" size={64} className="about-skin" />
              <div>
                <h3 style={{ fontSize: 12 }}>NITRORICED</h3>
                <div className="mono muted" style={{ fontSize: 11 }}>CEO · Creative · YouTube</div>
                <p style={{ fontSize: 13, marginTop: 8 }}>Runs the show. Series creator, designer-in-chief, content machine.</p>
                <div className="about-cta gold">VIEW PROFILE →</div>
              </div>
            </Link>
            <Link to="/envy" className="about-card about-card-envy">
              <MinecraftSkin username="EnVyOnMyMind" variant="avatar" size={64} className="about-skin" />
              <div>
                <h3 style={{ fontSize: 12 }}>ENVY</h3>
                <div className="mono muted" style={{ fontSize: 11 }}>CTO · Developer · Server Ops</div>
                <p style={{ fontSize: 13, marginTop: 8 }}>Builds the tech. Ships mods, runs the official Over Stars server, handles improvements.</p>
                <div className="about-cta" style={{ color: '#e0533d' }}>VIEW PROFILE →</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
