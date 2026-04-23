// Shared top nav
(function(){
  function makeNav(activePath){
    const links = [
      { href: 'index.html', label: 'HOME' },
      { href: 'team.html', label: 'TEAM' },
      { href: 'one-ring.html', label: 'ONE RING' },
      { href: 'envy.html', label: 'ENVY' },
      { href: 'nitro.html', label: 'NITRO' },
      { href: 'contact.html', label: 'CONTACT' }
    ];
    const nav = document.createElement('nav');
    nav.className = 'nav';
    nav.innerHTML = `
      <div class="nav-inner">
        <a href="index.html" class="brand">
          <div class="brand-logo" aria-hidden="true"></div>
          <div class="brand-name">RICE<em>/</em>LABS</div>
        </a>
        <div class="nav-links">
          ${links.map(l => `<a class="nav-link ${activePath===l.href?'active':''}" href="${l.href}">${l.label}</a>`).join('')}
        </div>
        <a class="nav-cta" href="https://www.curseforge.com/members/nitroriced/projects" target="_blank" rel="noopener">↓ DOWNLOADS</a>
      </div>
    `;
    return nav;
  }
  function makeFooter(){
    const f = document.createElement('footer');
    f.className = 'footer';
    f.innerHTML = `
      <div class="footer-inner">
        <div>RICE / LABS · crafted by EnVy &amp; NitroRiced · © 2026</div>
        <div class="row" style="gap:18px">
          <a href="https://www.curseforge.com/members/nitroriced/projects" target="_blank">CurseForge</a>
          <a href="https://www.youtube.com/@NitroRicedYT" target="_blank">YouTube</a>
          <a href="contact.html">Discord</a>
        </div>
        <div class="muted">Not affiliated with Mojang or Microsoft.</div>
      </div>`;
    return f;
  }
  window.RiceLabs = { makeNav, makeFooter };
  document.addEventListener('DOMContentLoaded', () => {
    const mount = document.getElementById('nav-mount');
    if (mount){
      const active = mount.getAttribute('data-active') || 'index.html';
      mount.appendChild(makeNav(active));
    }
    const fmount = document.getElementById('footer-mount');
    if (fmount) fmount.appendChild(makeFooter());
  });
})();
