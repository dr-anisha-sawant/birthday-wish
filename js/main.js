/* =========================================================
   MAIN
   - Hero typewriter subtitle
   - Fade-up IntersectionObserver
   - Timeline data + reveal
   - Envelope flip + reveal letter
   - Gift box reveal + confetti
   - Hero CTA scroll
   - Envelope opening overlay
   - Theme palette switcher (dev)
   ========================================================= */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----- HERO PHOTO STRIP --------------------------------------------------
  // Slow horizontal montage behind the hero. Uses photos from window.PHOTO_LIST.
  (function buildHeroStrip() {
    const track = document.getElementById('hero-strip-track');
    if (!track) return;
    const list = Array.isArray(window.PHOTO_LIST) ? window.PHOTO_LIST.slice() : [];
    if (!list.length) {
      const strip = document.getElementById('hero-strip');
      if (strip) strip.style.display = 'none';
      return;
    }
    // Shuffle for variety
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    // Mobile: fewer photos so first paint is fast and Safari doesn't drop frames
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const capped = list.slice(0, isMobile ? 10 : 20);
    const seq = capped.concat(capped); // duplicate for seamless loop
    seq.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'eager';
      img.decoding = 'async';
      track.appendChild(img);
    });
    // Force the animation inline so nothing in the cascade can override it
    track.style.animation = 'stripScroll 90s linear infinite';
  })();

  // ----- ENVELOPE OPENING OVERLAY -------------------------------------------
  const envOverlay = document.getElementById('envelope-overlay');
  if (envOverlay) {
    const dismiss = () => {
      envOverlay.classList.add('hidden');
      document.dispatchEvent(new CustomEvent('envelope:opened'));
      setTimeout(() => envOverlay.remove(), 700);
    };
    envOverlay.addEventListener('click', dismiss);
    envOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dismiss(); }
    });
  }

  // ----- HERO TYPEWRITER ----------------------------------------------------
  const sub = document.getElementById('hero-subtitle');
  if (sub) {
    const text = 'Happy birthday, my love 💕';
    if (reduced) {
      sub.textContent = text;
    } else {
      let i = 0;
      sub.textContent = '';
      const start = () => {
        const tick = () => {
          sub.textContent = text.slice(0, i++);
          if (i <= text.length) setTimeout(tick, 70);
        };
        setTimeout(tick, 1500); // after name fades in
      };
      start();
    }
  }

  // ----- HERO CTA SCROLL ----------------------------------------------------
  const cta = document.getElementById('hero-cta');
  cta?.addEventListener('click', () => {
    document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ----- FADE-UP OBSERVER ---------------------------------------------------
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ----- GALLERY PHOTO STRIP (decorative, slow scroll) ---------------------
  (function buildGalleryStrip() {
    const track = document.getElementById('gallery-strip-track');
    if (!track) return;
    const list = Array.isArray(window.PHOTO_LIST) ? window.PHOTO_LIST.slice() : [];
    if (!list.length) {
      const strip = track.parentElement;
      if (strip) strip.style.display = 'none';
      return;
    }
    // Different shuffle than hero so the two strips look distinct
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    const isMobile2 = window.matchMedia('(max-width: 600px)').matches;
    const capped = list.slice(0, isMobile2 ? 10 : 20);
    const seq = capped.concat(capped);
    seq.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'eager';
      img.decoding = 'async';
      track.appendChild(img);
    });
    track.style.animation = 'stripScrollSlow 80s linear infinite';
  })();

  // ----- LETTER ENVELOPE ----------------------------------------------------
  const env = document.getElementById('letter-envelope');
  const paper = document.getElementById('letter-paper');
  if (env && paper) {
    const open = () => {
      if (env.classList.contains('open')) return;
      env.classList.add('open');
      paper.setAttribute('aria-hidden', 'false');
      // Reveal the real letter after the flap + slide
      setTimeout(() => paper.classList.add('revealed'), 700);
      // Then collapse the envelope so it doesn't sit on top of the letter
      setTimeout(() => env.classList.add('dismissed'), 1400);
    };
    env.addEventListener('click', open);
    env.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }

  // ----- HELPERS ------------------------------------------------------------
  // (no helpers in use right now)
})();
