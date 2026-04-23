// Regenerates public/sitemap.xml with today's date as <lastmod> on every URL.
// Called automatically after fetch-projects and after vite build.

import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const { ROUTES, SITE_URL } = await import(
  'file:///' + resolve(ROOT, 'src/data/routeMeta.js').replace(/\\/g, '/')
)

const today = new Date().toISOString().slice(0, 10)

const body = ROUTES.map((r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`

// Write to public/ so it ships with the next build.
writeFileSync(resolve(ROOT, 'public/sitemap.xml'), xml, 'utf8')

// Also write directly into dist/ if it exists (so `npm run build`'s post-step
// ships a fresh sitemap without requiring a re-copy).
import { existsSync } from 'node:fs'
const distPath = resolve(ROOT, 'dist/sitemap.xml')
if (existsSync(resolve(ROOT, 'dist'))) writeFileSync(distPath, xml, 'utf8')

console.log(`✓ Wrote sitemap.xml with lastmod ${today} (${ROUTES.length} URLs)`)
