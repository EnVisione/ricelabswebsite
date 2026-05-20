import { Link } from 'react-router-dom'
import MinecraftSkin from '../components/MinecraftSkin.jsx'
import { useTotalDownloads, useAllProjects, fmt } from '../hooks/useCurseForge.js'
import { PROJECTS } from '../data/projects.js'
import { SKINS } from '../constants.js'

function sumDownloads(list, cf) {
  let t = 0
  for (const p of list) {
    const d = cf[p.slug]?.downloads?.total
    if (d) t += d
  }
  return t
}

export default function Team() {
  const total = useTotalDownloads()
  const cf = useAllProjects()
  const projectCount = PROJECTS.filter((p) => p.cf).length
  const totalLabel = fmt(total) + '+'

  const envyProjects = PROJECTS.filter((p) => (p.owner === 'envy' || p.owner === 'both') && p.cf)
  const nitroProjects = PROJECTS.filter((p) => (p.owner === 'nitro' || p.owner === 'both') && p.cf)
  const bananeProjects = PROJECTS.filter((p) => p.owner === 'banane' && p.cf)

  const envyDownloads = sumDownloads(envyProjects, cf)
  const nitroDownloads = sumDownloads(nitroProjects, cf)
  const bananeDownloads = sumDownloads(bananeProjects, cf)

  return (
    <>
      <section className="container">
        <div className="section-label">◆ ABOUT US</div>
        <h1 style={{ marginBottom: 16 }}>RICE / LABS</h1>
        <p style={{ fontSize: 16, maxWidth: '72ch' }}>
          Three devs. One forge. Rice Labs is a small, hand-crafted Minecraft modpack studio.
          We don't ship kitchen-sink packs — every quest is written, every balance pass personal,
          every release tested on the same servers our community plays on. Since 2022.
        </p>
        <div className="row" style={{ marginTop: 20 }}>
          <div className="tag accent">EST. NOV 2022</div>
          <div className="tag">{totalLabel} DOWNLOADS</div>
          <div className="tag">{projectCount} PROJECTS</div>
          <div className="tag gold">3 DEVS</div>
        </div>
      </section>

      <section className="container">
        <div className="section-label">◆ THE ROSTER</div>
        <h2 style={{ marginBottom: 28 }}>WHO'S IN THE LAB</h2>
        <div className="team-grid">
          <Link className="team-card team-card-nitro" to="/nitro">
            <div className="team-skin">
              <MinecraftSkin username={SKINS.nitro} variant="body" size={170} className="mc-skin-img" />
              <div className="team-level">LVL 99</div>
            </div>
            <div className="team-body">
              <div className="tag accent">CEO</div>
              <h3>NITRORICED</h3>
              <div className="mono muted" style={{ fontSize: 11, marginTop: 4 }}>Creative · Content · Direction</div>
              <p>The mind behind the modpacks, Immersed With Shaders, Over Stars, you name it. YouTube creator, lore architect, community shepherd. If you've played a Rice Labs pack, you've seen his world.</p>
              <div className="team-stats">
                <div><span className="pixel accent">{nitroDownloads ? fmt(nitroDownloads) : '…'}</span><small>Downloads</small></div>
                <div><span className="pixel accent">{nitroProjects.length}</span><small>Projects</small></div>
                <div><span className="pixel accent">305</span><small>Followers</small></div>
              </div>
              <div className="team-cta">VIEW PROFILE →</div>
            </div>
          </Link>

          <Link className="team-card team-card-envy" to="/envy">
            <div className="team-skin">
              <MinecraftSkin username={SKINS.envy} variant="body" size={170} className="mc-skin-img" />
              <div className="team-level">LVL 99</div>
            </div>
            <div className="team-body">
              <div className="tag red">CTO</div>
              <h3>ENVY</h3>
              <div className="mono muted" style={{ fontSize: 11, marginTop: 4 }}>Development · Server Ops · Tech</div>
              <p>The brains of the operation. Ships custom mods, runs the official Over Stars server, owns the technical roadmap and the tools that keep everything humming.</p>
              <div className="team-stats">
                <div><span className="pixel red">{envyDownloads ? fmt(envyDownloads) : '…'}</span><small>Downloads</small></div>
                <div><span className="pixel red">{envyProjects.length}</span><small>Projects</small></div>
                <div><span className="pixel red">MODS</span><small>Developer</small></div>
              </div>
              <div className="team-cta red">VIEW PROFILE →</div>
            </div>
          </Link>

          <Link className="team-card team-card-banane" to="/banane">
            <div className="team-skin">
              <MinecraftSkin username={SKINS.banane} variant="body" size={170} className="mc-skin-img" />
              <div className="team-level">LVL 99</div>
            </div>
            <div className="team-body">
              <div className="tag gold">CO-DEV</div>
              <h3>BANANE</h3>
              <div className="mono muted" style={{ fontSize: 11, marginTop: 4 }}>Modpacks · Resource Packs · Co-Dev</div>
              <p>The "All in one" creator. Builds themed modpacks and a stable of clean, focused resource packs. 3.1M+ downloads of his own work, and a Rice Labs founder since day one.</p>
              <div className="team-stats">
                <div><span className="pixel gold">{bananeDownloads ? fmt(bananeDownloads) : '…'}</span><small>Downloads</small></div>
                <div><span className="pixel gold">{bananeProjects.length}</span><small>Projects</small></div>
                <div><span className="pixel gold">13</span><small>Followers</small></div>
              </div>
              <div className="team-cta gold">VIEW PROFILE →</div>
            </div>
          </Link>
        </div>
      </section>

      <section className="container">
        <div className="section-label">◆ HOW WE BUILD</div>
        <h2 style={{ marginBottom: 28 }}>PRINCIPLES</h2>
        <div className="principles-grid">
          {[
            ['◆', 'NO KITCHEN SINK', "We pick every mod with intent. If it doesn't serve the storyline or the balance, it doesn't ship. Quality over mod-count."],
            ['⚒', 'HAND-WRITTEN QUESTS', '1000+ custom quests in Over Stars. Every line, every reward, every chapter tuned by hand — not generated.'],
            ['▲', 'PLAY WITH US', "We run the official servers. We're in Discord. Feedback shapes the next patch — the loop is real and tight."],
            ['◈', 'OWN THE STACK', "When existing mods don't fit, we write our own. Quest Token API, Over Stars Content, Contracts — all in-house."],
          ].map(([icon, title, body]) => (
            <div className="principle" key={title}>
              <div className="p-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="stats-card card">
          <div className="section-label">◆ BY THE NUMBERS</div>
          <h2 style={{ marginBottom: 24 }}>THE LAB, MEASURED</h2>
          <div className="stats-grid">
            {[
              ['accent', fmt(total), 'Downloads'],
              ['gold', String(projectCount), 'Projects'],
              ['purple', '1000+', 'Custom quests'],
              ['danger', '80+', 'New biomes (OS)'],
              ['accent', '5', 'Planets (OS)'],
              ['gold', '305', 'Followers'],
              ['purple', '4', 'Years shipping'],
              ['danger', '3', 'Humans'],
            ].map(([c, v, l], i) => (
              <div key={i} className="stat-box">
                <div className={'pixel stat-v ' + (c === 'danger' ? '' : c)} style={c === 'danger' ? { color: '#e0533d' } : undefined}>{v}</div>
                <div className="stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-label">◆ HISTORY</div>
        <h2 style={{ marginBottom: 32 }}>THE PATH SO FAR</h2>
        <div className="era-grid">
          {[
            ['2022', 'Chapter I · The First Blocks', 'Immersed With Shaders launches. A client-side visual pack with shaders, FPS and sound. Grows fast — the modpack that started it all.'],
            ['2023', 'Chapter II · The Labs Expands', "Immersed With Nature, Clean Swords, Simplistic GUI — the studio's catalog grows. Resource packs, UI polish, a voice forming. The official Rice Labs discord establishses. Over Stars begins development."],
            ['2024', 'Chapter III · Sharpening Tools', 'Crosshairs, armour bar, bubbles — a suite of minimal HUD packs. Downloads cross 10M combined. Groundwork being laid. Over Stars development in full-swing.'],
            ['2025', 'Chapter IV · Over Stars', 'Over Stars released in April, the first full Rice Labs modpack with a story. Tech-RPG progression, villager contracts, custom RPG questing system, and a hand-written campaign. 320K+ downloads. The infamous EnVy joins the Labs.'],
            ['2026', 'Chapter V · Origins of Indestructium', 'The Over Stars universe deepens. A 300-year prequel. Ancient alloys. Forbidden ring. Lore-driven campaign and storyline. Development begins.', true],
          ].map(([year, title, body, accent]) => (
            <div key={year} className={'era ' + (accent ? 'accent-era' : '')}>
              <div className="era-year pixel">{year}</div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
