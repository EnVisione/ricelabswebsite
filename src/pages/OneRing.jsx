import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function OneRing() {
  useEffect(() => {
    document.body.classList.add('one-ring-body')
    return () => document.body.classList.remove('one-ring-body')
  }, [])

  return (
    <>
      <section className="or-hero">
        <div className="or-hero-bg"></div>
        <div className="or-mist"></div>
        <div className="or-hero-inner">
          <div className="tag purple">◆ EARLY DEV · SNEAK PEEK</div>
          <h1 className="or-title">
            <span className="cinzel">Over Stars</span>
            <br />
            <span className="gold">: The One Ring</span>
          </h1>
          <p className="or-lede">
            A Lord of the Rings–inspired journey, set <strong className="gold">300 years before</strong> the events of the original Over Stars modpack and the discovery of the Orb of Existence.
          </p>
          <div className="or-ring-wrap">
            <div className="or-ring">
              <div className="or-ring-glow"></div>
              <div className="or-ring-band"></div>
              <div className="or-ring-inner"></div>
              <div className="or-ring-runes pixel">ᛟ · ᚱ · ᛁ · ᚲ · ᛖ · ᛚ · ᚨ · ᛒ · ᛋ · ᛟ · ᚱ · ᛁ · ᚲ · ᛖ</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container or-container">
        <div className="or-quote">
          <div className="quote-mark cinzel">&ldquo;</div>
          <p className="cinzel or-quote-text">
            A fantastical, mythological world. An ancient, eldritch ring forged by unknown alloys and creators.
            A folkloric curse bound within its otherworldly forgery.
            Forbidden abilities &mdash; at the cost of evil side effects.
          </p>
          <div className="quote-attr mono">&mdash; Announcement · RiceLabs, 2026</div>
        </div>
      </section>

      <section className="container or-container">
        <div className="or-cols">
          <div>
            <div className="section-label" style={{ color: 'var(--accent-2)' }}>◆ THE PREMISE</div>
            <h2 style={{ marginBottom: 16 }}>A JOURNEY, UNFINISHED</h2>
            <p>
              You embark on an exhilarating, momentous journey to uncover the ring's myth-enveloped lore and origins &mdash;
              following the footsteps of a previous journeyman who took on the task, and could not achieve what he set out to do,
              due to his <strong className="gold">mysterious disappearance</strong>&hellip;
            </p>
            <p style={{ marginTop: 14 }}>
              This is not <em>Over Stars 2</em>. This is the lore beneath the lore &mdash; the era the Orb of Existence has never told you about.
              A prequel carved from the rich potential of the original world, told as a lore-heavy progressive campaign.
            </p>
          </div>
          <div className="or-premise-card">
            {[
              ['SETTING', 'Fantasy / mythological prequel'],
              ['ERA', <span className="gold" key="era">300 years before Over Stars</span>],
              ['TONE', 'Folkloric · eldritch · Tolkien-inspired'],
              ['CAMPAIGN', 'Lore-rich · progressive · story-first'],
              ['THE RING', <span className="accent" key="ring">Ancient · forbidden · cursed</span>],
              ['STATUS', <span style={{ color: '#e0533d' }} key="status">Early development</span>],
            ].map(([label, val], i) => (
              <div key={i} className="or-pc-row">
                <span className="mono muted">{label}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container or-container">
        <div className="section-label" style={{ color: 'var(--accent-2)' }}>◆ PILLARS</div>
        <h2 style={{ marginBottom: 28 }}>WHAT MAKES IT DIFFERENT</h2>
        <div className="pillars-grid">
          {[
            ['I', 'AN ELDRITCH RING', 'Forged by unknown alloys, by unknown creators. Grants forbidden abilities — at the cost of evil side effects bound within its otherworldly forgery.'],
            ['II', 'A FOLKLORIC WORLD', 'A fantastical, mythological realm unlike the tech-leaning Over Stars original. Ancient sites, old magic, older secrets.'],
            ['III', 'LORE-DRIVEN CAMPAIGN', "Progressive, hand-written questline. Follow a lost journeyman's footsteps and complete what he could not."],
            ['IV', 'A SEQUEL, UNLIKE ANY', 'Not Over Stars 2. A sibling pack set three centuries earlier, with its own identity, its own heroes, its own myths.'],
          ].map(([num, title, body]) => (
            <div className="pillar" key={num}>
              <div className="pillar-num pixel">{num}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container or-container">
        <div className="card or-progress-card">
          <div className="section-label" style={{ color: 'var(--accent-2)' }}>◆ PROGRESS</div>
          <h2 style={{ marginBottom: 24 }}>FROM THE FORGE</h2>
          <div className="or-prog-grid">
            {[
              ['WORLDBUILDING & LORE', 62],
              ['RING MECHANICS & CUSTOM MODS', 41],
              ['QUEST CAMPAIGN', 28],
              ['WORLD GEN & STRUCTURES', 18],
              ['SOUNDTRACK & AMBIENT', 9],
              ['PLAYTESTING', 0],
            ].map(([label, pct]) => (
              <div className="or-prog" key={label}>
                <div className="or-prog-head">
                  <span className="pixel" style={{ fontSize: 9 }}>{label}</span>
                  <span className={pct ? 'mono gold' : 'mono muted'}>{pct ? pct + '%' : '—'}</span>
                </div>
                <div className="or-prog-bar"><div style={{ width: pct + '%' }}></div></div>
              </div>
            ))}
          </div>
          <p className="mono muted" style={{ marginTop: 20, fontSize: 11 }}>
            Figures are aspirational — development is iterative. No release date committed yet.
          </p>
        </div>
      </section>

      <section className="container or-container">
        <div className="section-label" style={{ color: 'var(--accent-2)' }}>◆ SNEAK PEEKS</div>
        <h2 style={{ marginBottom: 16 }}>A FIRST LOOK</h2>
        <p style={{ marginBottom: 24 }}>Early, in-engine captures. Expect everything to change — including these.</p>
        <div className="peeks-grid">
          {[
            ['peek-1', 'EARLY_FORGE_01.png', 'Ring forge — ambient reference'],
            ['peek-2', 'GLOAMING_HILL_02.png', 'Overworld biome exploration'],
            ['peek-3', 'JOURNEYMAN_CAMP_03.png', "Lost journeyman's abandoned camp"],
            ['peek-4', 'ANCIENT_RUIN_04.png', 'Pre-Over Stars era ruin'],
          ].map(([cls, label, note]) => (
            <div key={cls} className={'peek ' + cls}>
              <div className="peek-label mono">{label}</div>
              <div className="peek-note">{note}</div>
            </div>
          ))}
        </div>
        <p className="mono muted" style={{ marginTop: 16, fontSize: 11 }}>
          Placeholders — EnVy can drop real captures here when ready.
        </p>
      </section>

      <section className="container or-container">
        <div className="section-label" style={{ color: 'var(--accent-2)' }}>◆ ROADMAP</div>
        <h2 style={{ marginBottom: 28 }}>THE PATH AHEAD</h2>
        <div className="rm-grid">
          {[
            ['done', '✓', 'PLANNING', 'Pitch locked in. Core pillars agreed. Early 2026.'],
            ['active', '◆', 'EARLY DEVELOPMENT', 'Worldbuilding, ring mechanics, custom mods. You are here.'],
            ['', '◇', 'ALPHA (@Sneak Peaks)', 'Closed alpha for Discord supporters. Feedback loop opens.'],
            ['', '◇', 'BETA', 'Wider playtest. Quest polish, balance, bug hunt.'],
            ['', '◇', 'LAUNCH', 'Public release on CurseForge. Date TBA.'],
          ].map(([state, mark, title, body]) => (
            <div key={title} className={'rm-stage ' + state}>
              <div className="rm-mark">{mark}</div>
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container or-container">
        <div className="or-cta card">
          <div>
            <div className="section-label" style={{ color: 'var(--accent-2)' }}>◆ FOLLOW THE FORGE</div>
            <h2>Get the @Sneak Peaks role</h2>
            <p style={{ marginTop: 12 }}>
              Want exclusive early peeks, dev snapshots and behind-the-scenes from the campaign? Pick up the{' '}
              <strong className="gold">@Sneak Peaks</strong> role in our Discord's roles channel.
            </p>
          </div>
          <div className="row">
            <Link className="btn btn-gold" to="/contact">◆ JOIN DISCORD</Link>
            <a className="btn btn-ghost" href="https://www.youtube.com/@NitroRicedYT" target="_blank" rel="noopener noreferrer">WATCH YOUTUBE</a>
          </div>
        </div>
      </section>
    </>
  )
}
