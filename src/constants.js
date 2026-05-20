export const DISCORD_INVITE = 'https://discord.gg/FFRYhYXk8p'
export const YOUTUBE_URL = 'https://www.youtube.com/@NitroRicedYT'
export const CURSEFORGE_NITRO = 'https://www.curseforge.com/members/nitroriced/projects'
export const CURSEFORGE_ENVY = 'https://www.curseforge.com/members/envyonmymind/projects'
export const CURSEFORGE_BANANE = 'https://www.curseforge.com/members/bananegod/projects'
export const BUYMEACOFFEE_URL = 'https://buymeacoffee.com/enviouse'

export const DISCORD_HANDLES = {
  envy: 'enviouse',
  nitro: 'nriced',
  banane: 'bananegod',
}

// Minecraft usernames (canonical Mojang casing). NMSR resolves these via
// Mojang to fetch each player's live skin.
export const SKINS = {
  envy: 'EnVyOnMyMind',
  nitro: 'NitroRiced',
  banane: 'BananeBread',
}

// Seed value for the persistent counter before cfwidget responds. Snapshot of
// the real total at the last `npm run fetch-projects` sync; refreshed from the
// live API every 12h and the counter auto-corrects.
export const FALLBACK_TOTAL = 39_487_738
