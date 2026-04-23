import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MinecraftSkin from '../components/MinecraftSkin.jsx'
import Terminal from '../components/Terminal.jsx'
import { useCurseForge, fmt } from '../hooks/useCurseForge.js'
import { DISCORD_INVITE, DISCORD_HANDLES, SKINS, CURSEFORGE_ENVY } from '../constants.js'

// Everything EnVy has shipped on CurseForge, plus the One Ring collab.
const PROJECTS = [
  {
    slug: 'emi-gamestages-integration',
    name: 'EMI Gamestages Integration',
    type: 'MOD · BUILT FOR OVER STARS',
    downloads: 54_124,
    url: 'https://www.curseforge.com/minecraft/mc-mods/emi-gamestages-integration',
    tag: 'solo',
    builtFor: 'over-stars',
  },
  {
    slug: 'create-dupe-patch',
    name: 'Create Dupe Patch',
    type: 'MOD',
    downloads: 29_408,
    url: 'https://www.curseforge.com/minecraft/mc-mods/create-dupe-patch',
    tag: 'solo',
  },
  {
    slug: 'integratedplaytime',
    name: 'IntegratedPlaytime',
    type: 'MOD · BUILT FOR OVER STARS',
    downloads: 17_467,
    url: 'https://www.curseforge.com/minecraft/mc-mods/integratedplaytime',
    tag: 'solo',
    builtFor: 'over-stars',
  },
  {
    slug: 'progressivestages',
    name: 'ProgressiveStages',
    type: 'MOD',
    downloads: 1_780,
    url: 'https://www.curseforge.com/minecraft/mc-mods/progressivestages',
    tag: 'solo',
  },
  {
    slug: 'server-essentials-forge',
    name: 'Server Essentials Forge',
    type: 'MOD',
    downloads: 196,
    url: 'https://www.curseforge.com/minecraft/mc-mods/server-essentials-forge',
    tag: 'solo',
  },
  {
    slug: 'opacfixes',
    name: 'OpacFixes',
    type: 'MOD',
    downloads: 91,
    url: 'https://www.curseforge.com/minecraft/mc-mods/opacfixes',
    tag: 'solo',
  },
  // One Ring is the only collab EnVy claims credit on.
  {
    slug: null,
    name: 'Over Stars: The One Ring',
    type: 'MODPACK · WITH NITRO · IN DEV',
    downloads: null,
    url: null,
    internal: '/one-ring',
    tag: 'dev',
  },
]

const TOOLKIT = [
  ['diamond', 'Java'], ['diamond', 'Forge'], ['', 'NeoForge'],
  ['gold', 'FTB Quests'], ['', 'KubeJS'], ['', 'Gradle'],
  ['diamond', 'Linux'], ['gold', 'Docker'], ['', 'Bash'],
  ['gold', 'Git'], ['', 'React'], ['', 'JS/TS'],
  ['purple', 'Python'], ['purple', 'Rust'], ['gold', 'MC Modding'],
]

function ProjectCard({ project }) {
  const live = useCurseForge(project.slug)
  const thumb = live?.thumbnail
  const liveDownloads = live?.downloads?.total
  const dl = liveDownloads ?? project.downloads
  const badgeLabel =
    project.tag === 'collab' ? '+ NITRO' :
    project.tag === 'dev'    ? 'IN DEV'  :
                               'SOLO'

  const inner = (
    <>
      <div
        className="project-thumb"
        style={thumb ? { backgroundImage: `url("${thumb}")` } : undefined}
      />
      <div className="project-meta">
        <strong>
          {project.name}
          <span className={'project-badge ' + project.tag}>{badgeLabel}</span>
          {project.builtFor === 'over-stars' && (
            <span className="project-badge for-os">FOR OVER STARS</span>
          )}
        </strong>
        <small>{project.type}</small>
      </div>
      <div className="project-dl">
        {dl ? fmt(dl) : '—'}
        <small>{dl ? 'downloads' : 'coming soon'}</small>
      </div>
    </>
  )

  if (project.internal) {
    return <Link className="project-card" to={project.internal}>{inner}</Link>
  }
  return (
    <a className="project-card" href={project.url} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  )
}

export default function Envy() {
  useEffect(() => {
    document.body.classList.add('envy-theme')
    return () => document.body.classList.remove('envy-theme')
  }, [])
  return (
    <>
      <section className="container profile-hero">
        <div className="ph-skin ph-skin-envy">
          <MinecraftSkin username={SKINS.envy} variant="body" size={170} className="mc-skin-img" />
          <div className="ph-nameplate">
            <div className="ph-rank pixel">[CTO]</div>
            <div className="ph-level pixel">LVL 99</div>
          </div>
        </div>
        <div className="ph-body">
          <div className="section-label" style={{ color: '#e0533d' }}>◆ DEVELOPER PROFILE</div>
          <h1 style={{ fontSize: 48, marginBottom: 12 }}>EnVy</h1>
          <div className="mono muted" style={{ fontSize: 13, marginBottom: 20 }}>aka the brains · aka the tech dept.</div>
          <p style={{ fontSize: 16, maxWidth: '58ch' }}>
            CTO at RiceLabs. I build the mods, I run the official Over Stars
            Minecraft server, and I own every technological improvement that keeps
            the studio shipping. If it compiles, runs, or gets deployed &mdash; it probably went through me.
          </p>
          <div className="row" style={{ marginTop: 24, gap: 10 }}>
            <div className="tag red">CTO</div>
            <div className="tag">DEV</div>
            <div className="tag gold">SERVER OPS</div>
            <div className="tag purple">TECH</div>
          </div>
          <div className="link-row">
            <a className="link-chip discord" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              ◆ discord · @{DISCORD_HANDLES.envy}
            </a>
            <a className="link-chip" href={CURSEFORGE_ENVY} target="_blank" rel="noopener noreferrer">
              ◆ curseforge · envyonmymind
            </a>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="hud-bar">
          {[
            ['hi-heart', 92, '#e0533d', 'Energy'],
            ['hi-food', 78, '#C9A227', 'Focus'],
            ['hi-xp', 64, '#7CC242', 'XP → MAX'],
            ['hi-armor', 100, '#9aa3ad', 'Caffeine'],
          ].map(([icon, pct, col, lbl]) => (
            <div className="hud-item" key={lbl}>
              <div className={'hud-icon ' + icon}></div>
              <div className="hud-meter"><div className="hud-fill" style={{ width: pct + '%', background: col }}></div></div>
              <span className="hud-lbl">{lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── OFFICIAL SERVER HOSTING ─────────────────────────────────── */}
      <section className="container">
        <div className="section-label envy-label">◆ OFFICIAL SERVER HOSTING</div>
        <h2 style={{ marginBottom: 18 }}>I HOST THE OVER STARS SERVER</h2>
        <div className="host-card card">
          <div className="host-left">
            <div className="host-status">
              <span className="host-dot" aria-hidden="true" />
              <span className="mono">LIVE · ACCEPTING CONNECTIONS</span>
            </div>
            <h3 style={{ marginTop: 10, fontSize: 14 }}>OVER STARS · OFFICIAL SERVER</h3>
            <p style={{ fontSize: 13, marginTop: 10 }}>
              The official RiceLabs-run Over Stars Minecraft server — hosted, patched,
              backed up, and kept at 20 TPS by me. If you're joining the community campaign,
              you're landing on my hardware.
            </p>
            <div className="row" style={{ marginTop: 16 }}>
              <a className="btn btn-primary" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">◆ JOIN IN DISCORD</a>
              <a className="btn btn-ghost" href="https://www.curseforge.com/minecraft/modpacks/over-stars" target="_blank" rel="noopener noreferrer">PACK ON CURSEFORGE</a>
            </div>
          </div>
          <div className="host-right">
            <div className="host-stat"><span className="pixel">42d</span><small>Uptime</small></div>
            <div className="host-stat"><span className="pixel">19.97</span><small>TPS</small></div>
            <div className="host-stat"><span className="pixel">47</span><small>Players</small></div>
            <div className="host-stat"><span className="pixel">v5.8</span><small>Pack</small></div>
          </div>
        </div>
        <p className="mono muted" style={{ marginTop: 14, fontSize: 11 }}>
          Deployments, player support, backups, exploit patches — all handled by me personally.
        </p>
      </section>

      {/* Roles + terminal */}
      <section className="container">
        <div className="cmd-grid">
          <div>
            <div className="section-label envy-label">◆ MY ROLES</div>
            <h2 style={{ marginBottom: 20 }}>WHAT I DO AT RICELABS</h2>
            <div className="role-grid">
              {[
                ['⚒', 'MOD DEVELOPMENT', 'Write the custom mods that power our packs. Ring mechanics, quest integrations, dupe patches, playtime tracking — the stuff that makes RiceLabs packs actually unique.', '→ Java · Forge · NeoForge'],
                ['⛵', 'OFFICIAL SERVER OPS', 'Run the official Over Stars Minecraft server. Uptime, mod deployments, player support, backups, exploit patches — the whole kit.', '→ Forge server · Linux · ops'],
                ['◆', 'TECH IMPROVEMENTS', "Owner of the studio's technical roadmap. If there's a workflow, a tool, or a pipeline that could be better — that's where I spend my time.", '→ DX · infra · tooling'],
                ['▲', 'WEB & BRAND', 'Building the RiceLabs website — this one — and helping Nitro with anything technical that lives outside the game client.', '→ React · HTML · CSS · JS'],
              ].map(([icon, title, body, meta]) => (
                <div className="role" key={title}>
                  <div className="role-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <div className="mono muted" style={{ fontSize: 11, marginTop: 10 }}>{meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label envy-label">◆ LIVE FROM MY TERMINAL</div>
            <h2 style={{ marginBottom: 20 }}>ON MY SCREEN</h2>
            <Terminal />
            <div className="toolkit">
              {TOOLKIT.map(([tier, name]) => (
                <span key={name} className={'tk-chip ' + tier}><i></i>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MY PROJECTS */}
      <section className="container">
        <div className="section-label envy-label">◆ MY PROJECTS</div>
        <h2 style={{ marginBottom: 10 }}>EVERYTHING I'VE SHIPPED</h2>
        <p style={{ marginBottom: 20 }}>
          My solo mods plus the two modpacks I build with Nitro. Thumbnails pull live from CurseForge.
        </p>
        <div className="projects-list">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
        <p className="mono muted" style={{ marginTop: 16, fontSize: 11 }}>
          <span className="project-badge solo">SOLO</span> = shipped by me ·{' '}
          <span className="project-badge collab">+ NITRO</span> = co-built ·{' '}
          <span className="project-badge dev">IN DEV</span> = not released yet
        </p>
      </section>

      <section className="container">
        <div className="section-label envy-label">◆ ACHIEVEMENTS</div>
        <h2 style={{ marginBottom: 24 }}>UNLOCKED</h2>
        <div className="ach-grid">
          {[
            ['⛏', 'Taking Inventory', 'Shipped my first mod for a RiceLabs pack.'],
            ['⚒', 'Acquire Hardware', 'Stood up the Over Stars official server and kept it alive through launch.'],
            ['◆', 'Diamonds!', 'Promoted to CTO — officially running the tech at RiceLabs.'],
            ['✦', 'The End?', 'Helped design the mod architecture for Over Stars: The One Ring.', 'ach-rare'],
            ['▲', 'Getting an Upgrade', "Built the RiceLabs website from scratch. You're looking at it."],
            ['?', '???', 'Locked until OS: The One Ring ships.', '', true],
          ].map(([icon, title, body, iconClass, locked]) => (
            <div key={title} className={'ach ' + (locked ? 'locked' : '')}>
              <div className={'ach-icon ' + (iconClass || '')}>{icon}</div>
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="section-label envy-label">◆ CURRENTLY QUESTING</div>
        <h2 style={{ marginBottom: 24 }}>ACTIVE FRONTS</h2>
        <div className="quest-list">
          {[
            ['accent', 'ACTIVE', 'OS: The One Ring — mod systems', 'Designing and prototyping the custom ring mechanics, curse-system hooks, and supporting content mods.', '◆ Co-dev'],
            ['accent', 'ACTIVE', 'Over Stars official server', 'Keeping the live server healthy through the v5.x release cadence. Mod pushes, player reports, incident response.', '⚒ Ops'],
            ['gold', 'IN PROGRESS', 'ricelabs.dev — studio site', 'This website. Hub for packs, team, dev updates, and the One Ring sneak peek.', '▲ Web'],
            ['purple', 'PLANNED', 'ProgressiveStages · next', 'Iterating on stage-gated progression for the next-gen RiceLabs pack.', '◆ Mod'],
          ].map(([color, state, title, body, reward], i) => (
            <div className="quest" key={i}>
              <div className={'quest-state pixel ' + color}>{state}</div>
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
              <div className="quest-reward mono">{reward}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="contact-card card">
          <div>
            <div className="section-label envy-label">◆ PING ME</div>
            <h2>Need something technical?</h2>
            <p style={{ marginTop: 12 }}>
              Best caught in the RiceLabs Discord — ping <span className="accent">@{DISCORD_HANDLES.envy}</span> for bugs, server issues, mod questions, or just to say hi.
            </p>
          </div>
          <div className="row">
            <a className="btn btn-primary" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">◆ DISCORD</a>
            <Link className="btn btn-ghost" to="/team">BACK TO TEAM</Link>
          </div>
        </div>
      </section>
    </>
  )
}
