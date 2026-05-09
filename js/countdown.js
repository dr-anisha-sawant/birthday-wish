/* =========================================================
   COUNTDOWN
   Two modes — flip MODE between 'before' and 'together'.
   Default: 'together' (days since you started dating)
   ========================================================= */
(function () {
  // ----- CONFIG -----------------------------------------------------------
  const MODE = 'together';            // 'before' | 'together'
  const BIRTHDAY    = '2026-12-25T00:00:00';   // her birthday (used in 'before' mode)
  const TOGETHER_SINCE = '2017-07-22T00:00:00'; // date you started dating ('together' mode)
  // ------------------------------------------------------------------------

  const tagline = document.getElementById('countdown-tagline');
  const tiles   = document.querySelectorAll('#countdown-tiles .tile-num');
  if (!tagline || tiles.length === 0) return;

  const targetDate = new Date(MODE === 'before' ? BIRTHDAY : TOGETHER_SINCE);

  if (MODE === 'before') {
    tagline.textContent = 'Until your special day…';
  } else {
    tagline.textContent = "We've been together…";
  }

  function getParts() {
    const now = new Date();
    let diff;
    if (MODE === 'before') {
      diff = targetDate - now;
      if (diff < 0) diff = 0;
    } else {
      diff = now - targetDate;
      if (diff < 0) diff = 0;
    }

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours   = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
  }

  function update() {
    const parts = getParts();
    tiles.forEach(el => {
      const unit = el.dataset.unit;
      const val = parts[unit];
      if (val == null) return;
      const newVal = String(val).padStart(unit === 'days' ? 1 : 2, '0');
      if (el.textContent !== newVal) {
        const tile = el.closest('.tile');
        tile.classList.remove('flip');
        // re-trigger animation
        void tile.offsetWidth;
        tile.classList.add('flip');
        el.textContent = newVal;
      }
    });
  }

  update();
  setInterval(update, 1000);
})();
