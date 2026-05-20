import { DISCORD_INVITE, YOUTUBE_URL, CURSEFORGE_NITRO, CURSEFORGE_BANANE } from '../constants.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="stack" style={{ gap: 4 }}>
          <div>RICE / LABS · © 2026 · not affiliated with Mojang or Microsoft</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
            Website designed &amp; built by{' '}
            <strong style={{ color: '#e0533d' }}>EnVy</strong>
            {' · '}
            <a
              href="mailto:contact.enviouse@gmail.com"
              style={{ color: '#e0533d', textDecoration: 'underline', textDecorationColor: 'rgba(224,83,61,0.4)' }}
            >
              contact.enviouse@gmail.com
            </a>
            {' · '}
            for future website work or client builds
          </div>
        </div>
        <div className="row" style={{ gap: 18 }}>
          <a href={CURSEFORGE_NITRO} target="_blank" rel="me noopener noreferrer">CurseForge · Nitro</a>
          <a href="https://www.curseforge.com/members/envyonmymind" target="_blank" rel="me noopener noreferrer">CurseForge · EnVy</a>
          <a href={CURSEFORGE_BANANE} target="_blank" rel="me noopener noreferrer">CurseForge · Banane</a>
          <a href={YOUTUBE_URL} target="_blank" rel="me noopener noreferrer">YouTube</a>
          <a href={DISCORD_INVITE} target="_blank" rel="me noopener noreferrer">Discord</a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-donate'))}
            style={{
              background: 'none', border: 0, padding: 0, cursor: 'pointer',
              font: 'inherit', color: 'var(--accent-2)',
            }}
          >
            ☕ Donate
          </button>
        </div>
      </div>
    </footer>
  )
}
