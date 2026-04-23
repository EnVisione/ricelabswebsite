// Post-build SSG: clones dist/index.html for every route with route-specific
// meta baked in (title, description, og:*, twitter:*, canonical). Crawlers
// like Discord, Twitter, Facebook, and Google indexers that don't execute
// JavaScript see the right metadata for every URL.
//
// Works with any static host that prefers /foo/index.html over /index.html
// when /foo is requested (Vercel, Netlify, Cloudflare Pages, GitHub Pages,
// Nginx `try_files $uri $uri/index.html`).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const { ROUTE_META, SITE_URL } = await import(
  'file:///' + resolve(ROOT, 'src/data/routeMeta.js').replace(/\\/g, '/')
)

const distIndex = readFileSync(resolve(ROOT, 'dist/index.html'), 'utf8')

const escHtml = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function replaceMeta(html, attrMatch, content) {
  const re = new RegExp(
    `(<meta [^>]*${attrMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*content=")[^"]*(")`,
    'gi'
  )
  return html.replace(re, `$1${escHtml(content)}$2`)
}
function replaceLink(html, attrMatch, href) {
  const re = new RegExp(
    `(<link [^>]*${attrMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*href=")[^"]*(")`,
    'gi'
  )
  return html.replace(re, `$1${escHtml(href)}$2`)
}

function writeForRoute(path, meta) {
  const canonical = SITE_URL + path
  let html = distIndex
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escHtml(meta.title)}</title>`)
  html = replaceMeta(html, 'name="description"', meta.description)
  html = replaceMeta(html, 'itemprop="description"', meta.description)
  html = replaceMeta(html, 'property="og:title"', meta.title)
  html = replaceMeta(html, 'property="og:description"', meta.description)
  html = replaceMeta(html, 'property="og:url"', canonical)
  html = replaceMeta(html, 'property="og:image"', meta.image)
  html = replaceMeta(html, 'property="og:image:secure_url"', meta.image)
  html = replaceMeta(html, 'name="twitter:title"', meta.title)
  html = replaceMeta(html, 'name="twitter:description"', meta.description)
  html = replaceMeta(html, 'name="twitter:image"', meta.image)
  html = replaceMeta(html, 'itemprop="name"', meta.title)
  html = replaceMeta(html, 'itemprop="image"', meta.image)
  html = replaceMeta(html, 'name="image"', meta.image)
  html = replaceLink(html, 'rel="canonical"', canonical)

  if (path === '/') {
    writeFileSync(resolve(ROOT, 'dist/index.html'), html, 'utf8')
    console.log(`  wrote dist/index.html`)
    return
  }
  const dir = resolve(ROOT, 'dist' + path)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), html, 'utf8')
  console.log(`  wrote dist${path}/index.html`)
}

let count = 0
for (const [path, meta] of Object.entries(ROUTE_META)) {
  writeForRoute(path, meta)
  count++
}
console.log(`✓ Prerendered ${count} routes with per-page SEO metadata`)
