/* =========================================================
   AUDIO PLAYERS — song + voice note share one lock
   - Custom UI: play/pause, progress, time
   - Only one player at a time (pauses the other on play)
   - Waveform CSS animation toggles via .playing class
   ========================================================= */
(function () {
  const cards = document.querySelectorAll('.player-card');
  if (!cards.length) return;

  const audios = []; // { audio, card, btn, fill, current, total, progress }

  cards.forEach(card => {
    const audio = card.querySelector('audio');
    const btn   = card.querySelector('.play-btn');
    const fill  = card.querySelector('.progress-fill');
    const cur   = card.querySelector('.time-current');
    const tot   = card.querySelector('.time-total');
    const prog  = card.querySelector('.progress');
    if (!audio || !btn) return;

    audios.push({ audio, card, btn });

    function setPlayingUI(playing) {
      card.classList.toggle('playing', playing);
      btn.classList.toggle('playing', playing);
      btn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      btn.innerHTML = playing
        ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    }

    function fmt(s) {
      if (!isFinite(s)) return '0:00';
      const m = Math.floor(s / 60);
      const ss = Math.floor(s % 60).toString().padStart(2, '0');
      return `${m}:${ss}`;
    }

    btn.addEventListener('click', () => {
      if (audio.paused) {
        // pause everyone else
        audios.forEach(p => { if (p.audio !== audio) p.audio.pause(); });
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play',   () => setPlayingUI(true));
    audio.addEventListener('pause',  () => setPlayingUI(false));
    audio.addEventListener('ended',  () => { setPlayingUI(false); fill.style.width = '0%'; cur.textContent = '0:00'; });

    audio.addEventListener('loadedmetadata', () => {
      tot.textContent = fmt(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
      const pct = (audio.currentTime / (audio.duration || 1)) * 100;
      fill.style.width = pct + '%';
      cur.textContent = fmt(audio.currentTime);
    });

    // Click/drag on progress bar to seek
    function seekFromEvent(e) {
      const rect = prog.getBoundingClientRect();
      const x = ((e.touches && e.touches[0]) || e).clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      if (isFinite(audio.duration)) audio.currentTime = pct * audio.duration;
    }
    prog.addEventListener('click', seekFromEvent);
    prog.addEventListener('keydown', (e) => {
      if (!isFinite(audio.duration)) return;
      if (e.key === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - 5);
      if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    });
  });

  // Pause everything on page hide (e.g. switching tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audios.forEach(p => p.audio.pause());
  });
})();
