import { useEffect, useRef, useState } from 'react'

const PROMPT_HOST = 'envy@ricelabs'

const BOOT = [
  { t: 'out-green', v: 'RiceLabs Shell v3.1.7 (envy-kernel · arch x86_64)', d: 120 },
  { t: 'out', v: 'Copyright © 2022-2026 RiceLabs. All rights reserved.', d: 80 },
  { t: 'out', v: '', d: 180 },
  { t: 'out', v: 'Starting program...', d: 260 },
  { t: 'ok', v: '[  OK  ] Loading user modules                          ... done', d: 280 },
  { t: 'ok', v: '[  OK  ] Initializing server core                      ... done', d: 240 },
  { t: 'ok', v: '[  OK  ] Mounting /dev/creativity                      ... done', d: 180 },
  { t: 'ok', v: '[  OK  ] Spawning 12 background daemons                ... done', d: 220 },
  { t: 'ok', v: '[  OK  ] Compiling quest-token-api v2.4.0              ... done', d: 240 },
  { t: 'ok', v: '[  OK  ] Reticulating splines                          ... done', d: 180 },
  { t: 'ok', v: '[  OK  ] Priming villager contract hooks               ... done', d: 200 },
  { t: 'ok', v: '[  OK  ] Establishing uplink to CurseForge... 18ms     ... done', d: 240 },
  { t: 'ok', v: '[  OK  ] Authenticating envy@ricelabs (TOTP ✓)         ... done', d: 260 },
  { t: 'out-green', v: '', d: 100 },
  { t: 'out-green', v: 'Welcome, envy. 6 mods online · 103K combined downloads.', d: 80 },
  { t: 'out', v: "Type 'help' for commands — or try: ls, neofetch, cd create-dupe-patch", d: 120 },
  { t: 'out', v: '', d: 60 },
]

const PROJECTS = {
  'create-dupe-patch': {
    dl: '29.4K',
    desc: 'Forge mod that prevents the most common duplication exploits in Create-based modpacks. Ship-safe on production servers.',
    tags: ['forge', 'anti-cheat', 'create'],
  },
  'emi-gamestages-integration': {
    dl: '54.1K',
    desc: 'Bridges the EMI item-browser with the GameStages API — items only show up in the recipe book when their stage is unlocked.',
    tags: ['forge', 'emi', 'gamestages'],
  },
  'integratedplaytime': {
    dl: '17.5K',
    desc: 'Tracks per-player session + lifetime playtime and exposes it to gamestages, commands and scoreboards. Pack-author friendly.',
    tags: ['forge', 'server', 'gamestages'],
  },
  'progressivestages': {
    dl: '1.8K',
    desc: 'Stage-gated progression system. Ties unlocks to quest completion, playtime, or custom triggers. Backbone of Over Stars contract work.',
    tags: ['forge', 'quests', 'gamestages'],
  },
  'server-essentials-forge': {
    dl: '196',
    desc: 'Bundles the essentials every modpack server forgets: homes, warps, TPA, basic perms via LuckPerms, motd hook.',
    tags: ['forge', 'server', 'luckperms'],
  },
  opacfixes: {
    dl: '91',
    desc: 'Tiny patch mod for OPAC (Open Parties and Claims) edge cases I hit while running the Over Stars server.',
    tags: ['forge', 'server'],
  },
}

const HELP_LINES = [
  '  help              → show this list',
  '  whoami            → who is at the keyboard',
  '  ls                → list my shipped projects',
  '  cd <project>      → open a project (try: cd create-dupe-patch)',
  '  cat <project>     → same as cd — shows description',
  '  tree              → show project tree with downloads',
  '  info              → full profile summary',
  '  uptime            → overstars server status',
  '  date              → current time',
  '  neofetch          → system info',
  '  ping <target>     → ping someone (nitro, discord, curseforge…)',
  '  top               → running processes',
  '  fortune           → random minecraft proverb',
  '  echo <msg>        → print <msg>',
  '  sudo coffee       → essential',
  '  origins           → ???',
  '  secret            → ??????????',
  '  gandalf           → ?????????????',
  '  mordor            → ??????????????',
  '  clear             → wipe the screen',
]

const FORTUNES = [
  '"The best modpack is the one you finish." — Nitro, probably',
  '"If it compiles, ship it. If it crashes, patch it Tuesday."',
  '"Forge taketh, NeoForge giveth."',
  '"Do not taunt the Ender Dragon." — ancient proverb',
  '"A bug in prod is worth two in staging."',
  '"All modpacks eventually become Over Stars." — corollary of Greenspun\'s tenth rule',
]

function nowString() {
  return new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function Terminal() {
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [hIdx, setHIdx] = useState(-1)
  const [booting, setBooting] = useState(true)
  const inputRef = useRef(null)
  const bodyRef = useRef(null)

  const push = (newLines) =>
    setLines((prev) => [...prev, ...(Array.isArray(newLines) ? newLines : [newLines])])

  // Boot sequence — types BOOT lines with realistic staggered delays, then unlocks input.
  useEffect(() => {
    let cancel = false
    let t = 0
    for (const ln of BOOT) {
      t += ln.d
      setTimeout(() => { if (!cancel) setLines((p) => [...p, { t: ln.t, v: ln.v }]) }, t)
    }
    setTimeout(() => { if (!cancel) { setBooting(false); inputRef.current?.focus() } }, t + 200)
    return () => { cancel = true }
  }, [])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  function run(raw) {
    const cmd = raw.trim()
    push([{ t: 'prompt', v: `${PROMPT_HOST} ~ $ ${raw}` }])
    if (!cmd) return
    setHistory((h) => [...h, cmd])
    setHIdx(-1)

    const [head, ...rest] = cmd.toLowerCase().split(/\s+/)
    const arg = rest.join(' ')

    switch (head) {
      case 'help':
        push(HELP_LINES.map((v) => ({ t: 'out', v })))
        return

      case 'whoami':
        push([{ t: 'out-green', v: 'envy · CTO @ ricelabs · LVL 99' }])
        return

      case 'info':
        push([
          { t: 'out-green', v: '╭─ envy ─ dev @ RiceLabs ──────────────────────────╮' },
          { t: 'out', v: ' role      CTO + lead mod dev + server ops          ' },
          { t: 'out', v: ' shipped   6 solo mods · 103K combined downloads    ' },
          { t: 'out', v: ' stack     Java · Forge · NeoForge · React · Linux  ' },
          { t: 'out', v: ' status    caffeinated                              ' },
          { t: 'out-green', v: '╰──────────────────────────────────────────────────╯' },
        ])
        return

      case 'ls':
        push([
          { t: 'out-green', v: 'projects/' },
          ...Object.entries(PROJECTS).map(([slug, p]) => ({
            t: 'out',
            v: `  ${slug.padEnd(34)} ${p.dl.padStart(6)} downloads`,
          })),
          { t: 'out-gold', v: '  over-stars-origins-of-indestructium/ (in development)' },
        ])
        return

      case 'tree':
        push([
          { t: 'out-green', v: 'envy/' },
          { t: 'out', v: '├── solo-mods/' },
          ...Object.keys(PROJECTS).map((s, i, arr) => ({
            t: 'out', v: (i === arr.length - 1 ? '│   └── ' : '│   ├── ') + s,
          })),
          { t: 'out', v: '├── collabs/' },
          { t: 'out', v: '│   ├── over-stars         (with nitro)' },
          { t: 'out', v: '│   └── origins-of-indestructium (with nitro · in dev)' },
          { t: 'out', v: '└── infra/' },
          { t: 'out', v: '    ├── over-stars-server  (uptime 42d)' },
          { t: 'out', v: '    └── ricelabs-site      (you are here)' },
        ])
        return

      case 'cd':
      case 'cat': {
        if (!arg) {
          push([{ t: 'out', v: `usage: ${head} <project>  —  try 'ls' to see slugs` }])
          return
        }
        const key = arg.replace(/\/$/, '')
        const p = PROJECTS[key]
        if (p) {
          push([
            { t: 'out-green', v: `${head === 'cd' ? 'entering' : 'cat'} ${key}/` },
            { t: 'out', v: p.desc },
            { t: 'mono', v: `tags:      ${p.tags.join(' · ')}` },
            { t: 'mono', v: `downloads: ${p.dl}` },
            { t: 'mono', v: `url:       https://www.curseforge.com/minecraft/mc-mods/${key}` },
          ])
        } else if (['.', '..', '~', '/'].includes(key)) {
          push([{ t: 'out', v: '~' }])
        } else {
          push([{ t: 'err', v: `${head}: no such project: ${key}` }])
        }
        return
      }

      case 'pwd':
        push([{ t: 'out', v: '/home/envy/ricelabs' }])
        return

      case 'echo':
        push([{ t: 'out', v: rest.join(' ') || '' }])
        return

      case 'uptime':
        push([
          { t: 'out-gold', v: 'overstars.service — active (running)' },
          { t: 'out-gold', v: 'uptime 42d 03h 18m · TPS 19.97 · players 47 online' },
          { t: 'out', v: `load average: 0.32, 0.41, 0.38` },
        ])
        return

      case 'date':
        push([{ t: 'out', v: nowString() }])
        return

      case 'neofetch':
        push([
          { t: 'out-green', v: '        envy@ricelabs' },
          { t: 'out-green', v: '        --------------' },
          { t: 'out', v: '  OS:       Arch Linux (btw)' },
          { t: 'out', v: '  Shell:    zsh 5.9' },
          { t: 'out', v: '  Kernel:   envy-kernel 3.1.7' },
          { t: 'out', v: '  Uptime:   way too long today' },
          { t: 'out', v: '  Stack:    Java · Forge · NeoForge · React' },
          { t: 'out', v: '  Editor:   IntelliJ IDEA + VSCode' },
          { t: 'out', v: '  Coffee:   ∞' },
        ])
        return

      case 'ping': {
        const target = arg || 'localhost'
        const known = {
          nitro: ['discord.com/users/nriced', 19, 21, 18, 22],
          discord: ['discord.gg/FFRYhYXk8p', 34, 41, 38, 39],
          curseforge: ['api.curseforge.com', 112, 108, 115, 110],
          mojang: ['mojang.com', 73, 71, 76, 74],
          localhost: ['127.0.0.1', 0, 1, 0, 1],
        }
        const hit = known[target]
        if (hit) {
          const [host, ...pings] = hit
          push([
            { t: 'out', v: `PING ${target} (${host}): 56 data bytes` },
            ...pings.map((ms, i) => ({ t: 'out', v: `64 bytes from ${host}: icmp_seq=${i} time=${ms} ms` })),
            { t: 'out-green', v: `--- ${target} ping statistics ---` },
            { t: 'out', v: `4 packets transmitted, 4 received, 0% loss` },
          ])
        } else {
          push([{ t: 'err', v: `ping: cannot resolve ${target}: Unknown host` }])
        }
        return
      }

      case 'top':
        push([
          { t: 'mono', v: 'PID   USER   %CPU  %MEM  COMMAND' },
          { t: 'mono', v: ' 142  envy   93.1  42.0  java (over-stars-server)' },
          { t: 'mono', v: ' 287  envy   21.4  12.8  node vite (ricelabs-site)' },
          { t: 'mono', v: ' 913  envy    8.7   3.2  ssh overstars-prod' },
          { t: 'mono', v: '1042  envy    4.1   1.6  lofi-radio --infinite' },
          { t: 'mono', v: '   1  root    0.1   0.4  systemd' },
        ])
        return

      case 'fortune':
        push([{ t: 'out-gold', v: FORTUNES[Math.floor(Math.random() * FORTUNES.length)] }])
        return

      case 'sudo':
        if (arg === 'coffee' || arg === 'make coffee' || arg === 'brew') {
          push([
            { t: 'out', v: '[sudo] password for envy: ********' },
            { t: 'out-gold', v: '☕ brewing… done.' },
            { t: 'out-green', v: 'Caffeine level: 100%' },
          ])
        } else if (arg === 'secret' || arg === 'secret mode') {
          runSecret()
        } else if (arg.startsWith('rm')) {
          push([{ t: 'err', v: 'sudo: nice try. rm blocked by envy-kernel.' }])
        } else {
          push([{ t: 'err', v: `sudo: ${arg || '(none)'}: command not found` }])
        }
        return

      case 'origins':
      case 'indestructium':
        push([
          { t: 'out-gold', v: '"…and in the darkness bind them."' },
          { t: 'out', v: "Try 'secret'." },
        ])
        return

      case 'secret':
      case 'secret-mode':
        runSecret()
        return

      case 'gandalf':
      case 'wizard':
      case 'youshallnotpass':
      case 'you-shall-not-pass':
        window.dispatchEvent(new Event('ricelabs:gandalf'))
        push([
          { t: 'out-gold', v: '"A wizard is never late, Frodo Baggins."' },
          { t: 'gold-glow', v: 'YOU. SHALL. NOT. PASS!' },
          { t: 'err', v: '*** the Balrog of Moria has been bonked. ***' },
          { t: 'out', v: 'Fly, you fools.' },
        ])
        return

      case 'mordor':
      case 'eye':
      case 'sauron':
        window.dispatchEvent(new Event('ricelabs:mordor'))
        push([
          { t: 'err', v: '"One does not simply walk into Mordor."' },
          { t: 'rainbow', v: 'A great Eye, lidless, wreathed in flame.' },
          { t: 'out', v: '(toggle: run again to look away.)' },
        ])
        return

      case 'clear':
      case 'cls':
        setLines([])
        return

      case 'exit':
        push([{ t: 'out', v: "Session terminated. (but you can keep typing — it's fine)" }])
        return

      case 'hack':
        push([
          { t: 'err', v: 'INITIATING HACK SEQUENCE…' },
          { t: 'out-gold', v: '[████████████████░░] bypassing firewall' },
          { t: 'out-green', v: 'access granted to: /dev/null' },
          { t: 'out', v: '…you hacked nothing. congrats.' },
        ])
        return

      default:
        push([{ t: 'err', v: `zsh: command not found: ${cmd}` }])
    }
  }

  function runSecret() {
    // Dispatch the global takeover event — <SecretMode /> listens and renders
    // the ring overlay + applies body.secret-mode for page-wide effects.
    window.dispatchEvent(new Event('ricelabs:secret'))
    push([
      { t: 'out-green', v: '' },
      { t: 'out-green', v: '🔓 SECRET MODE UNLOCKED' },
      { t: 'rainbow', v: 'Three Rings for the Elven-kings under the sky,' },
      { t: 'rainbow', v: 'Seven for the Dwarf-lords in their halls of stone,' },
      { t: 'rainbow', v: 'Nine for Mortal Men doomed to die,' },
      { t: 'rainbow', v: 'One for the Dark Lord on his dark throne.' },
      { t: 'gold-glow', v: 'One Ring to rule them all, One Ring to find them,' },
      { t: 'gold-glow', v: 'One Ring to bring them all, and in the darkness bind them.' },
      { t: 'out', v: '' },
      { t: 'out', v: '— in the lands of Mordor where the Shadows lie.' },
      { t: 'out', v: '' },
      { t: 'out-green', v: '→ three hundred years before the Stars were Over,' },
      { t: 'out-green', v: '  a journeyman walked the path alone, and never came back.' },
      { t: 'out-green', v: '→ follow the forge: /ool' },
    ])
  }

  function onKeyDown(e) {
    if (booting) return
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1)
      setHIdx(next); setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hIdx === -1) return
      const next = hIdx + 1
      if (next >= history.length) { setHIdx(-1); setInput('') }
      else { setHIdx(next); setInput(history[next]) }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); setLines([])
    }
  }

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term-bar">
        <span className="term-dot" style={{ background: '#ff5f57' }}></span>
        <span className="term-dot" style={{ background: '#ffbd2e' }}></span>
        <span className="term-dot" style={{ background: '#28c840' }}></span>
        <span className="term-title mono">envy@ricelabs ~ zsh</span>
      </div>
      <div className="term-body" ref={bodyRef}>
        {lines.map((ln, i) => (
          <div key={i} className={'term-line ' + ln.t}>{ln.v || ' '}</div>
        ))}
        {!booting && (
          <div className="term-input-line">
            <span className="prompt">{PROMPT_HOST} ~ $</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="terminal input"
            />
          </div>
        )}
        {booting && (
          <div className="term-line prompt"><span className="term-caret" /></div>
        )}
      </div>
      <div className="term-hint mono">
        tip: try <span className="accent">help</span> · arrows for history · ctrl+l to clear
      </div>
    </div>
  )
}
