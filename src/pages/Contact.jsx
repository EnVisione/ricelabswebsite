import { Link } from 'react-router-dom'
import { useState } from 'react'
import { DISCORD_INVITE, DISCORD_HANDLES, YOUTUBE_URL, CURSEFORGE_NITRO, CURSEFORGE_BANANE } from '../constants.js'
import DonateModal from '../components/DonateModal.jsx'

export default function Contact() {
  const [donateOpen, setDonateOpen] = useState(false)
  return (
    <>
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      <section className="container">
        <div className="section-label">◆ GET IN TOUCH</div>
        <h1 style={{ marginBottom: 16 }}>
          COME TO<br />
          <span className="grass-underline accent">THE SPAWN POINT.</span>
        </h1>
        <p style={{ fontSize: 16, maxWidth: '60ch' }}>
          Discord is home base. Join for sneak peeks, bug reports, feature ideas, server gossip, and dev diaries.
          All channels monitored by Nitro (<span className="accent">@{DISCORD_HANDLES.nitro}</span>),
          EnVy (<span className="red">@{DISCORD_HANDLES.envy}</span>) and
          Banane (<span className="gold">@{DISCORD_HANDLES.banane}</span>) personally.
        </p>
      </section>

      <section className="container">
        <div className="discord-hero card">
          <div className="disc-left">
            <div className="disc-icon">
              <div className="disc-block"></div>
            </div>
            <div>
              <div className="tag purple">◆ OFFICIAL SERVER</div>
              <h2 style={{ marginTop: 10, marginBottom: 12 }}>RICELABS ON DISCORD</h2>
              <p>Packs. Sneak peeks. Bug reports. Support. Community chat. One roof.</p>
              <div className="disc-stats">
                <div><strong className="pixel purple">2.3K+</strong><small>Members</small></div>
                <div><strong className="pixel accent">24/7</strong><small>Active</small></div>
                <div><strong className="pixel gold">8+</strong><small>Active Channels</small></div>
              </div>
            </div>
          </div>
          <div className="disc-right">
            <a
              className="btn btn-primary"
              style={{ fontSize: 14, padding: '16px 28px' }}
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
            >
              ◆ JOIN DISCORD
            </a>
            <p className="mono muted" style={{ fontSize: 11, marginTop: 12, textAlign: 'center' }}>discord.gg/FFRYhYXk8p</p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="donate-hero card">
          <div className="donate-left">
            <div className="donate-icon" aria-hidden="true">
              <span className="donate-cup">☕</span>
            </div>
            <div>
              <div className="tag gold">◆ OPTIONAL · COSMETIC PERKS ONLY</div>
              <h2 style={{ marginTop: 10, marginBottom: 12 }}>SUPPORT THE SERVER</h2>
              <p>
                Donations are <strong>totally optional and never required</strong>, but if you'd
                like to help with long-term server costs, it's hugely appreciated. Your support keeps
                the box upgraded and online for the future.
              </p>
              <p style={{ marginTop: 10 }}>
                EnVy runs the server because it's fun and he genuinely enjoys playing with this
                community. <span className="mono muted">All donation perks are purely cosmetic — nothing pay-to-win, ever.</span>
              </p>
            </div>
          </div>
          <div className="donate-right">
            <button
              type="button"
              className="btn btn-primary donate-btn"
              onClick={() => setDonateOpen(true)}
            >
              ☕ BUY ME A COFFEE
            </button>
            <p className="mono muted" style={{ fontSize: 11, marginTop: 12, textAlign: 'center' }}>
              buymeacoffee.com/enviouse
            </p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="section-label">◆ INSIDE THE SERVER</div>
        <h2 style={{ marginBottom: 24 }}>CHANNELS YOU'LL LIVE IN</h2>
        <div className="chan-grid">
          {[
            ['', '# 🌍┃roles', <>Grab the <strong className="gold">@Sneak Peaks</strong> role to unlock OS: Origins of Indestructium early access.</>],
            ['hot', '# 🔥┃sneak-peeks', 'Screenshots, concept art, and dev videos before anyone else sees them.'],
            ['', '# 📣┃announcements', 'Pack releases, updates, and major news. Subscribed channel — mirrors the news.'],
            ['', '# 🐛┃bug-reports', "Broken quest? Missing loot? File it here and we'll tag it for the next patch."],
            ['', '# 💬┃general', 'Builds, screenshots, memes, server talk. The town square.'],
            ['', '# 🎫┃support', 'Install help, launcher issues, performance problems. Nitro + EnVy respond.'],
          ].map(([cls, name, body], i) => (
            <div key={i} className={'chan ' + cls}>
              <div className="chan-name mono">{name}</div>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="direct-grid">
          <a className="direct-card" href={CURSEFORGE_NITRO} target="_blank" rel="noopener noreferrer">
            <div className="dc-icon" style={{ background: '#e0533d' }}>CF</div>
            <div><strong>CURSEFORGE</strong><p>Every pack, mod, and resource pack. Comments enabled on each.</p></div>
            <div className="dc-arrow">→</div>
          </a>
          <a className="direct-card" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
            <div className="dc-icon" style={{ background: '#e0533d' }}>▶</div>
            <div><strong>YOUTUBE</strong><p>@NitroRicedYT — tutorials, showcases, and dev videos.</p></div>
            <div className="dc-arrow">→</div>
          </a>
          <a className="direct-card" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
            <div className="dc-icon" style={{ background: 'var(--accent-3)' }}>DC</div>
            <div><strong>DISCORD DMs</strong><p>Ping <span className="accent">@{DISCORD_HANDLES.nitro}</span>, <span className="red">@{DISCORD_HANDLES.envy}</span> or <span className="gold">@{DISCORD_HANDLES.banane}</span> directly.</p></div>
            <div className="dc-arrow">→</div>
          </a>
          <a className="direct-card" href={CURSEFORGE_BANANE} target="_blank" rel="noopener noreferrer">
            <div className="dc-icon" style={{ background: 'var(--accent-2)' }}>B</div>
            <div><strong>BANANE · CURSEFORGE</strong><p>All in One modpacks + clean resource packs from <span className="gold">@{DISCORD_HANDLES.banane}</span>.</p></div>
            <div className="dc-arrow">→</div>
          </a>
          <Link className="direct-card" to="/envy">
            <div className="dc-icon" style={{ background: 'var(--accent-3)' }}>&lt;/&gt;</div>
            <div><strong>TECH / BUGS</strong><p>Ping <span className="red">EnVy</span> for anything technical — server, mods, infra.</p></div>
            <div className="dc-arrow">→</div>
          </Link>
        </div>
      </section>

      <section className="container">
        <div className="section-label">◆ COMMON QUESTIONS</div>
        <h2 style={{ marginBottom: 24 }}>BEFORE YOU ASK</h2>
        <div className="faq">
          {[
            ['How do I install a modpack?', <>Easiest: click <strong>Install via App</strong> on the CurseForge page. It'll handle Forge/NeoForge, mods, and memory.</>, true],
            ["I'm getting low FPS — help?", 'Disable shaders, lower render distance, and update your GPU drivers. Keep your Minecraft launcher updated. Give the pack time to launch even if it looks frozen.'],
            ['When does Over Stars: Origins of Indestructium release?', <>No date yet — it's in early development. Grab the <strong className="gold">@Sneak Peaks</strong> role on Discord to follow along as it's built.</>],
            ['Can I use RiceLabs content in my video?', <>Yes — credit <strong>NitroRiced</strong> and link back. Monetization is fine. Don't re-upload packs under a different name.</>],
            ['I found a bug / crash', <>File it in <span className="mono">#bug-reports</span> on Discord. Include your pack version, Minecraft version, and the crash log if you have one.</>],
            ['Can I join the team?', "We're small on purpose. If you're a modder or artist with work we love, DM Nitro on Discord — but don't expect a reply unless there's a fit."],
          ].map(([q, a, open], i) => (
            <details key={i} open={!!open}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
