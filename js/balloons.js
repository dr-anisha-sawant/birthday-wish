/* =========================================================
   BALLOONS
   - Tap anywhere => one balloon spawns from tap point
   - On load => 8–12 balloon staggered burst from bottom
   - Cap: 30 simultaneous; respects prefers-reduced-motion
   ========================================================= */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const layer = document.getElementById('balloon-layer');
  if (!layer) return;

  const COLORS = ['#F8BBD0', '#F48FB1', '#FFC1CC', '#D4AF37', '#C8A2D9', '#FFE4E1', '#FFB7C5'];
  const MAX = 30;
  let count = 0;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function balloonSVG(color, size) {
    const sw = size;
    const sh = size * 1.5;
    return `
      <svg width="${sw}" height="${sh}" viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.7)"/>
            <stop offset="60%" stop-color="${color}"/>
            <stop offset="100%" stop-color="${color}"/>
          </radialGradient>
        </defs>
        <ellipse cx="30" cy="30" rx="22" ry="28" fill="url(#g)"/>
        <polygon points="27,57 33,57 30,62" fill="${color}"/>
        <path d="M30 62 Q34 70 28 78 Q24 84 30 90" stroke="${color}" stroke-width="1.2" fill="none" opacity="0.6"/>
      </svg>
    `;
  }

  function spawn(x, y) {
    if (count >= MAX) return;
    count++;

    const size = rand(40, 80);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const drift = rand(-80, 80);
    const rot = rand(-20, 20);
    const dur = rand(3, 6);

    const el = document.createElement('div');
    el.className = 'balloon';
    el.style.left = (x - size / 2) + 'px';
    el.style.top  = (y - (size * 1.5) / 2) + 'px';
    el.style.width = size + 'px';
    el.style.height = (size * 1.5) + 'px';
    el.style.setProperty('--drift', drift + 'px');
    el.style.setProperty('--rot', rot + 'deg');
    el.style.animation = `balloonFloat ${dur}s ease-out forwards`;
    el.innerHTML = balloonSVG(color, size);

    layer.appendChild(el);

    setTimeout(() => {
      el.remove();
      count--;
    }, dur * 1000 + 100);
  }

  // Tap-to-release (page-wide listener)
  function onTap(e) {
    // Don't spawn from preview-bar buttons or interactive elements that might break
    const t = e.target;
    if (t && t.closest && t.closest('#preview-bar')) return;
    const point = (e.touches && e.touches[0]) || e;
    spawn(point.clientX, point.clientY);
  }

  // Use 'click' so we don't double-fire on touch+click; touchstart for snappier mobile feel
  let lastTouch = 0;
  document.addEventListener('touchstart', (e) => {
    lastTouch = Date.now();
    onTap(e);
  }, { passive: true });
  document.addEventListener('click', (e) => {
    if (Date.now() - lastTouch < 500) return; // dedupe with touchstart
    onTap(e);
  });

  // Auto-burst on load — wait for hero text to appear (~1.5s)
  function autoBurst() {
    const n = Math.floor(rand(8, 13));
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        spawn(rand(w * 0.1, w * 0.9), h - rand(10, 60));
      }, i * 180);
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(autoBurst, 1500);
  } else {
    window.addEventListener('load', () => setTimeout(autoBurst, 1500));
  }

  // Re-burst after the envelope overlay is dismissed
  document.addEventListener('envelope:opened', () => {
    setTimeout(autoBurst, 400);
  });
})();
