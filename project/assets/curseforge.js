// CurseForge data loader via cfwidget (public JSON proxy for CurseForge, no key needed)
// Populates any element with data-cf-pack="<slug>" using data-cf-field="thumbnail|downloads|title|summary"
(function(){
  const SLUGS = {
    'immersed-with-shaders': 'minecraft/modpacks/immersed-with-shaders',
    'over-stars': 'minecraft/modpacks/over-stars',
    'immersed-with-nature': 'minecraft/modpacks/immersed-within-nature',
    'quest-token-api': 'minecraft/mc-mods/quest-token-api',
    'over-stars-content': 'minecraft/mc-mods/over-stars-content',
    'over-stars-contracts': 'minecraft/mc-mods/over-stars-contracts',
    'diamond-crosshair': 'minecraft/texture-packs/diamond-crosshair',
    'clean-swords': 'minecraft/texture-packs/clean-swords',
    'simplistic-menu': 'minecraft/texture-packs/simplistic-menu',
    'simplistic-gui': 'minecraft/texture-packs/simplistic-gui',
    'x-crosshair-shape': 'minecraft/texture-packs/x-crosshair-shape',
    'modern-armour-bar': 'minecraft/texture-packs/modern-armour-bar',
    'improved-crosshair': 'minecraft/texture-packs/improved-crosshair',
    'central-crosshair': 'minecraft/texture-packs/central-crosshair',
    'better-bubbles': 'minecraft/texture-packs/better-bubbles',
    'fresh-x-faithless': 'minecraft/texture-packs/fresh-x-faithless',
    'over-stars-quest-theme': 'minecraft/texture-packs/over-stars-quest-theme'
  };

  const cache = {};
  async function fetchPack(slug){
    if (cache[slug]) return cache[slug];
    const path = SLUGS[slug] || slug;
    const url = `https://api.cfwidget.com/${path}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('cf ' + resp.status);
    cache[slug] = await resp.json();
    return cache[slug];
  }

  function fmt(n){
    if (!n && n !== 0) return '—';
    if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'') + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/,'') + 'K';
    return String(n);
  }

  async function totalDownloads(){
    const slugs = Object.keys(SLUGS);
    const results = await Promise.allSettled(slugs.map(s => fetchPack(s)));
    let total = 0;
    results.forEach(r => { if (r.status === 'fulfilled' && r.value && r.value.downloads) total += r.value.downloads.total || 0; });
    return total;
  }

  async function populate(){
    const els = document.querySelectorAll('[data-cf-pack]');
    const slugSet = new Set();
    els.forEach(el => slugSet.add(el.getAttribute('data-cf-pack')));
    await Promise.allSettled([...slugSet].map(s => fetchPack(s)));
    els.forEach(el => {
      const slug = el.getAttribute('data-cf-pack');
      const field = el.getAttribute('data-cf-field') || 'thumbnail';
      const data = cache[slug];
      if (!data) return;
      if (field === 'thumbnail'){
        const url = data.thumbnail;
        if (url) {
          // treat like bg image or img
          if (el.tagName === 'IMG') el.src = url;
          else {
            el.style.backgroundImage = `url("${url}")`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.classList.add('cf-loaded');
          }
        }
      } else if (field === 'downloads'){
        el.textContent = fmt(data.downloads && data.downloads.total);
      } else if (field === 'downloads_raw'){
        el.textContent = (data.downloads && data.downloads.total || 0).toLocaleString('en-US');
      } else if (field === 'title'){
        el.textContent = data.title || '';
      } else if (field === 'summary'){
        el.textContent = data.summary || '';
      } else if (field === 'url'){
        if (el.tagName === 'A') el.href = data.urls && data.urls.curseforge;
      }
    });

    // Total downloads element
    const totalEl = document.querySelector('[data-cf-total]');
    if (totalEl){
      const t = await totalDownloads();
      if (t > 0){
        const mode = totalEl.getAttribute('data-cf-total');
        totalEl.textContent = mode === 'short' ? fmt(t) : t.toLocaleString('en-US');
        totalEl.dataset.cfValue = t;
        // live ticker if requested
        if (totalEl.hasAttribute('data-cf-ticker')){
          let n = t;
          setInterval(()=>{
            n += Math.floor(Math.random()*3) + 1;
            totalEl.textContent = mode === 'short' ? fmt(n) : n.toLocaleString('en-US');
          }, 1500);
        }
      }
    }
  }

  window.RiceCF = { fetchPack, fmt, totalDownloads, populate };
  document.addEventListener('DOMContentLoaded', populate);
})();
