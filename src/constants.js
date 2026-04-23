export const DISCORD_INVITE = 'https://discord.gg/FFRYhYXk8p'
export const YOUTUBE_URL = 'https://www.youtube.com/@NitroRicedYT'
export const CURSEFORGE_NITRO = 'https://www.curseforge.com/members/nitroriced/projects'
export const CURSEFORGE_ENVY = 'https://www.curseforge.com/members/envyonmymind/projects'

export const DISCORD_HANDLES = {
  envy: 'enviouse',
  nitro: 'nriced',
}

export const SKINS = {
  envy: 'EnVyOnMyMind',
  nitro: 'Nitroriced',
}

// Seed value for the persistent counter before cfwidget responds. Snapshot of
// the real total at the last `npm run fetch-projects` sync; refreshed from the
// live API every 12h and the counter auto-corrects.
export const FALLBACK_TOTAL = 35_245_906
