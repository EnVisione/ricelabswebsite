// Per-route SEO metadata. Consumed both by the client (via useDocumentMeta)
// and by scripts/prerender.mjs at build time — so pasting any subroute URL in
// Discord / Twitter / a Google result shows its own title + description.

const BASE = 'https://rice-labs.enviouse.com'
const OG = `${BASE}/og-image.jpg`

export const SITE_URL = BASE
export const SITE_OG_IMAGE = OG

export const ROUTE_META = {
  '/': {
    title: 'RiceLabs — Minecraft Modpacks & Mods by NitroRiced, EnVy & Banane',
    description: 'Three-person studio by NitroRiced, EnVy & Banane building deeply immersive, hand-polished Minecraft modpacks. 39M+ downloads. Home of Over Stars, Immersed With Shaders, the All in One series, and Over Stars: Origins of Indestructium.',
    image: OG,
  },
  '/team': {
    title: 'The Team — RiceLabs',
    description: 'Meet NitroRiced, EnVy and Banane: the three-person studio behind RiceLabs. 39M+ downloads across 50 projects since 2022 — every quest hand-written, every balance pass personal.',
    image: OG,
  },
  '/ool': {
    title: 'Over Stars: Origins of Indestructium — RiceLabs',
    description: 'A Lord of the Rings–inspired Minecraft modpack in early development, set 300 years before Over Stars. A folkloric prequel with an eldritch cursed ring. Follow development on Discord.',
    image: OG,
  },
  '/envy': {
    title: 'EnVy — CTO at RiceLabs',
    description: 'EnVy: CTO and lead mod developer at RiceLabs. Hosts the official Over Stars Minecraft server. Creator of Create Dupe Patch, EMI Gamestages Integration, IntegratedPlaytime, ProgressiveStages, Server Essentials Forge, and OpacFixes.',
    image: OG,
  },
  '/nitro': {
    title: 'NitroRiced — CEO at RiceLabs',
    description: 'NitroRiced: CEO, creative director, and YouTuber at RiceLabs. Creator of Over Stars, Immersed With Shaders, and 27 other Minecraft projects totalling 35M+ downloads.',
    image: OG,
  },
  '/banane': {
    title: 'Banane — Co-Dev at RiceLabs',
    description: 'Banane (bananegod): Co-Dev at RiceLabs and creator of the All in One modpack series. Builds themed Minecraft modpacks and clean focused resource packs — 3.1M+ downloads across 14 CurseForge projects.',
    image: OG,
  },
  '/downloads': {
    title: 'Downloads — Every RiceLabs Modpack & Mod',
    description: 'Every RiceLabs modpack, mod, and resource pack in one sortable list. Live CurseForge download counts, filter by owner, search, and jump straight to any project.',
    image: OG,
  },
  '/contact': {
    title: 'Contact — RiceLabs Discord, CurseForge & YouTube',
    description: 'Join the RiceLabs Discord, find us on CurseForge, subscribe on YouTube, and reach Nitro, EnVy or Banane directly for support, bug reports, and collabs.',
    image: OG,
  },
}

// Routes for sitemap generation + prerender. Keep in sync with ROUTE_META keys.
export const ROUTES = [
  { path: '/',           priority: 1.0, changefreq: 'weekly'  },
  { path: '/team',       priority: 0.8, changefreq: 'monthly' },
  { path: '/ool',        priority: 0.9, changefreq: 'weekly'  },
  { path: '/envy',       priority: 0.7, changefreq: 'monthly' },
  { path: '/nitro',      priority: 0.7, changefreq: 'monthly' },
  { path: '/banane',     priority: 0.7, changefreq: 'monthly' },
  { path: '/downloads',  priority: 0.9, changefreq: 'daily'   },
  { path: '/contact',    priority: 0.6, changefreq: 'monthly' },
]
