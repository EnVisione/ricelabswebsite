import { useEffect } from 'react'

function setAttr(selector, attr, value) {
  const el = document.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Updates the document <title>, description, Open Graph, Twitter Card,
 * itemprop, and canonical URL on the fly when the client navigates between
 * routes. Combined with scripts/prerender.mjs this gives us per-route SEO
 * that works whether the crawler executes JS or not.
 */
export function useDocumentMeta({ title, description, image, url }) {
  useEffect(() => {
    if (title) {
      document.title = title
      setAttr('meta[itemprop="name"]', 'content', title)
      setAttr('meta[property="og:title"]', 'content', title)
      setAttr('meta[name="twitter:title"]', 'content', title)
    }
    if (description) {
      setAttr('meta[name="description"]', 'content', description)
      setAttr('meta[itemprop="description"]', 'content', description)
      setAttr('meta[property="og:description"]', 'content', description)
      setAttr('meta[name="twitter:description"]', 'content', description)
    }
    if (image) {
      setAttr('meta[itemprop="image"]', 'content', image)
      setAttr('meta[property="og:image"]', 'content', image)
      setAttr('meta[property="og:image:secure_url"]', 'content', image)
      setAttr('meta[name="twitter:image"]', 'content', image)
      setAttr('meta[name="image"]', 'content', image)
    }
    if (url) {
      setAttr('link[rel="canonical"]', 'href', url)
      setAttr('meta[property="og:url"]', 'content', url)
    }
  }, [title, description, image, url])
}
