/* =========================================================
   tsParticles — floating hearts background for hero
   - Low density, drifts upward, varied size & opacity
   - Reduces particle count on mobile
   ========================================================= */
(function () {
  if (typeof tsParticles === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // skip entirely

  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const count = isMobile ? 14 : 28;

  // SVG heart as a custom shape (path-based "character" image)
  const HEART_SVG =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M16 28s-12-7.6-12-16.4C4 6 8 4 11 4c2.4 0 4.2 1.4 5 3 0.8-1.6 2.6-3 5-3 3 0 7 2 7 7.6C28 20.4 16 28 16 28z"
              fill="#E91E63" opacity="0.85"/>
      </svg>
    `);

  tsParticles.load('particles', {
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    fpsLimit: 60,
    particles: {
      number: { value: count, density: { enable: true, area: 800 } },
      shape: {
        type: 'image',
        image: { src: HEART_SVG, width: 32, height: 32 }
      },
      size: { value: { min: 8, max: 20 } },
      opacity: { value: { min: 0.3, max: 0.7 } },
      move: {
        enable: true,
        direction: 'top',
        speed: { min: 0.4, max: 1.4 },
        straight: false,
        outModes: { default: 'out' }
      }
    },
    detectRetina: true
  }).catch(() => {});
})();
