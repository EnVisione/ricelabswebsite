// Animated Minecraft-style hero canvas
// Three variants: day-night, floating blocks, terrain parallax
(function(){
  function rand(a,b){ return a + Math.random()*(b-a); }
  function mixColor(a,b,t){
    const pa = a.match(/\w\w/g).map(h=>parseInt(h,16));
    const pb = b.match(/\w\w/g).map(h=>parseInt(h,16));
    return '#' + pa.map((v,i)=> Math.round(v + (pb[i]-v)*t).toString(16).padStart(2,'0')).join('');
  }

  function initHero(container){
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1;
    function resize(){
      dpr = Math.min(window.devicePixelRatio||1, 2);
      const r = container.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w*dpr; canvas.height = h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.imageSmoothingEnabled = false;
    }
    const ro = new ResizeObserver(resize); ro.observe(container);
    resize();

    let t0 = performance.now();
    const variant = 'day-night';
    const intensity = 0.7;

    // Pre-generated landscape profile
    const profile = [];
    for (let i=0;i<400;i++){
      profile.push(12 + Math.round(Math.sin(i*0.08)*3 + Math.sin(i*0.23)*2 + Math.random()*2));
    }

    // Floating blocks
    const blocks = [];
    for (let i=0;i<24;i++){
      blocks.push({
        x: rand(0,1), y: rand(0,1), size: rand(24,56),
        vx: rand(-0.00005,0.00005), vy: rand(-0.00008,0.00008),
        rot: rand(-0.15,0.15),
        type: ['grass','dirt','stone','diamond','gold','wood'][Math.floor(Math.random()*6)]
      });
    }

    const BLOCK = {
      grass: {top:'#7CC242', side:'#8b5a3c', sideTop:'#5a9a2d'},
      dirt: {top:'#8b5a3c', side:'#7a4f34', sideTop:'#6d4730'},
      stone: {top:'#7a7f85', side:'#5c6167', sideTop:'#6a7076'},
      diamond:{top:'#4fd6e2', side:'#2fa3af', sideTop:'#3fbac7'},
      gold: {top:'#C9A227', side:'#8a6f1b', sideTop:'#a88820'},
      wood: {top:'#b27b3d', side:'#6d4a22', sideTop:'#8a6030'},
      leaves:{top:'#4a8a2c', side:'#365f1f', sideTop:'#3e7527'},
      ore:  {top:'#6b5d7a', side:'#3e364a', sideTop:'#534669'}
    };

    function drawIsoBlock(cx, cy, s, type){
      const b = BLOCK[type] || BLOCK.stone;
      // top diamond
      ctx.fillStyle = b.top;
      ctx.beginPath();
      ctx.moveTo(cx, cy - s*0.5);
      ctx.lineTo(cx + s*0.9, cy);
      ctx.lineTo(cx, cy + s*0.5);
      ctx.lineTo(cx - s*0.9, cy);
      ctx.closePath(); ctx.fill();
      // right face
      ctx.fillStyle = b.side;
      ctx.beginPath();
      ctx.moveTo(cx, cy + s*0.5);
      ctx.lineTo(cx + s*0.9, cy);
      ctx.lineTo(cx + s*0.9, cy + s);
      ctx.lineTo(cx, cy + s*1.5);
      ctx.closePath(); ctx.fill();
      // left face
      ctx.fillStyle = b.sideTop;
      ctx.beginPath();
      ctx.moveTo(cx, cy + s*0.5);
      ctx.lineTo(cx - s*0.9, cy);
      ctx.lineTo(cx - s*0.9, cy + s);
      ctx.lineTo(cx, cy + s*1.5);
      ctx.closePath(); ctx.fill();
      // pixel noise
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      for (let i=0;i<4;i++){
        const px = cx + rand(-s*0.6, s*0.6), py = cy + rand(-s*0.3, s*0.4);
        ctx.fillRect(Math.round(px), Math.round(py), 2, 2);
      }
    }

    function drawDayNight(time){
      // cycle in seconds
      const cycle = 20;
      const day = (Math.sin(time/cycle*Math.PI*2) + 1)/2; // 0 night, 1 day
      // sky gradient
      const topCol = mixColor('0a0e1e','62a7e0', day);
      const botCol = mixColor('1a2a4a','c9e3ff', day);
      const g = ctx.createLinearGradient(0,0,0,h);
      g.addColorStop(0, topCol); g.addColorStop(1, botCol);
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

      // stars (night)
      if (day < 0.5){
        const a = (0.5 - day) * 2;
        ctx.fillStyle = `rgba(255,255,255,${a*0.8*intensity})`;
        for (let i=0;i<60;i++){
          const x = (i*47 % w);
          const y = ((i*23) % (h*0.6));
          ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
        }
      }
      // sun/moon
      const sunX = w*0.15 + (time*w*0.6/cycle) % (w*1.2) - w*0.1;
      const sunY = h*0.65 - Math.sin(time/cycle*Math.PI*2)*h*0.5;
      ctx.fillStyle = day>0.5 ? '#ffe58a' : '#e6e8ee';
      // pixel circle
      for (let dx=-3; dx<=3; dx++) for (let dy=-3; dy<=3; dy++){
        if (dx*dx + dy*dy <= 9) ctx.fillRect(Math.round(sunX + dx*6), Math.round(sunY + dy*6), 6, 6);
      }

      // distant mountains
      ctx.fillStyle = mixColor('0a1420','556a85', day*0.6);
      const mh = h*0.55;
      for (let x=0; x<w; x+=6){
        const y = mh + Math.sin(x*0.01 + time*0.05)*20 + Math.sin(x*0.03)*12;
        ctx.fillRect(x, y, 6, h-y);
      }
      // closer hills
      ctx.fillStyle = mixColor('0a1810','3a5a28', day*0.7);
      const hh = h*0.7;
      for (let x=0; x<w; x+=6){
        const y = hh + Math.sin(x*0.02 + time*0.08)*14 + Math.cos(x*0.04)*8;
        ctx.fillRect(x, y, 6, h-y);
      }
      // ground line of iso blocks (grass row)
      const rowY = h - 60;
      const step = 40;
      for (let x=-step; x<w+step; x+=step*0.9){
        drawIsoBlock(x + (time*10)%step, rowY, 28, 'grass');
      }
      // ambient overlay
      ctx.fillStyle = `rgba(10,20,40,${(1-day)*0.4*intensity})`;
      ctx.fillRect(0,0,w,h);
    }

    function drawFloating(time){
      // gradient bg
      const g = ctx.createLinearGradient(0,0,0,h);
      g.addColorStop(0,'#0a0d12'); g.addColorStop(1,'#161d28');
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
      // grid pattern
      ctx.strokeStyle = `rgba(124,194,66,${0.08*intensity})`;
      ctx.lineWidth = 1;
      for (let x=0; x<w; x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for (let y=0; y<h; y+=40){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

      blocks.forEach(b => {
        const x = ((b.x + b.vx*time*1000) % 1 + 1) % 1;
        const y = ((b.y + b.vy*time*1000 + Math.sin(time*0.5 + b.rot*10)*0.02) % 1 + 1) % 1;
        drawIsoBlock(x*w, y*h, b.size*intensity, b.type);
      });
    }

    function drawTerrain(time){
      const g = ctx.createLinearGradient(0,0,0,h);
      g.addColorStop(0,'#1a2433'); g.addColorStop(1,'#0b0f16');
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

      // three layers of terrain
      const layers = [
        {scale:0.5, yOff: h*0.7, col:'#2a3a4a', speed:5},
        {scale:0.7, yOff: h*0.78, col:'#1e2d3e', speed:10},
        {scale:1, yOff: h*0.86, col:'#0e1a26', speed:20}
      ];
      layers.forEach(L => {
        ctx.fillStyle = L.col;
        const off = (time*L.speed) % 400;
        for (let x=0; x<w; x+=8){
          const pi = Math.floor(((x+off)/8)) % profile.length;
          const yy = L.yOff - profile[(pi+400)%profile.length]*L.scale*3;
          ctx.fillRect(x, yy, 8, h-yy);
        }
      });
      // grass top on front layer
      ctx.fillStyle = `rgba(124,194,66,${0.7*intensity})`;
      const off = (time*20) % 400;
      for (let x=0; x<w; x+=8){
        const pi = Math.floor(((x+off)/8)) % profile.length;
        const yy = h*0.86 - profile[(pi+400)%profile.length]*3;
        ctx.fillRect(x, yy, 8, 4);
      }
    }

    function loop(){
      const t = (performance.now() - t0)/1000;
      ctx.clearRect(0,0,w,h);
      if (variant === 'floating') drawFloating(t);
      else if (variant === 'terrain') drawTerrain(t);
      else drawDayNight(t);
      requestAnimationFrame(loop);
    }
    loop();
  }

  window.RiceHero = { initHero };
})();
