/* =========================================================
   EASTER EGG
   - Desktop: type "i love you" anywhere => screen-wide heart burst
   - Mobile:  triple-tap closing-section heart => same effect
   ========================================================= */
(function () {
  const TRIGGER = 'i love you';
  let buffer = '';

  function fire() {
    if (typeof confetti !== 'function') return;
    // Heart shape via canvas-confetti's "shapes" API
    const heartShape = confetti.shapeFromPath
      ? confetti.shapeFromPath({
          path: 'M16 28s-12-7.6-12-16.4C4 6 8 4 11 4c2.4 0 4.2 1.4 5 3 0.8-1.6 2.6-3 5-3 3 0 7 2 7 7.6C28 20.4 16 28 16 28z'
        })
      : 'circle';

    const colors = ['#E91E63', '#FF6B9D', '#F48FB1', '#D4AF37', '#F8BBD0'];
    const dur = 2500, end = Date.now() + dur;

    (function frame() {
      confetti({
        particleCount: 8,
        startVelocity: 30,
        spread: 360,
        ticks: 200,
        origin: { x: Math.random(), y: Math.random() * 0.6 },
        shapes: [heartShape],
        colors,
        scalar: 1.4
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  // Desktop: keystroke buffer (last 16 chars)
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length === 1) buffer += e.key.toLowerCase();
    else if (e.key === 'Backspace') buffer = buffer.slice(0, -1);
    if (buffer.length > 16) buffer = buffer.slice(-16);
    if (buffer.includes(TRIGGER)) {
      fire();
      buffer = '';
    }
  });

  // Mobile: triple-tap on the closing heart
  const heart = document.getElementById('closing-heart');
  if (heart) {
    let taps = 0;
    let timer;
    heart.addEventListener('click', () => {
      taps++;
      clearTimeout(timer);
      timer = setTimeout(() => { taps = 0; }, 700);
      if (taps >= 3) {
        fire();
        taps = 0;
      }
    });
    heart.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        heart.click();
      }
    });
  }
})();
