/* =========================================================
   PHOTO GALLERY
   - Two layouts, switch via GALLERY_MODE: 'carousel' | 'polaroid'
   - Lightbox on tap with caption
   - Edit `photos` array to add/remove images. Drop files in
     assets/photos/ and reference them here.
   ========================================================= */
(function () {
  // ----- CONFIG -----------------------------------------------------------
  const GALLERY_MODE = 'carousel';  // 'carousel' | 'polaroid'

  // ----- PHOTOS -----
  // If js/photos-list.js has been generated, use its filenames automatically.
  // Otherwise fall back to a manual list below — replace with your own photos.
  // Regenerate the auto list any time after adding/removing photos:
  //   PowerShell:  powershell -File scripts\generate-photo-list.ps1
  //   Bash/macOS:  bash scripts/generate-photo-list.sh
  let photos;
  if (Array.isArray(window.PHOTO_LIST) && window.PHOTO_LIST.length > 0) {
    photos = window.PHOTO_LIST.map(src => ({ src, caption: '', date: '' }));
  } else {
    photos = [
      { src: 'assets/photos/photo-01.jpg', caption: 'A favourite moment ✨', date: '' },
      { src: 'assets/photos/photo-02.jpg', caption: 'You.',                 date: '' },
      { src: 'assets/photos/photo-03.jpg', caption: 'Our little adventure', date: '' },
    ];
  }
  // ------------------------------------------------------------------------

  const mount = document.getElementById('gallery-mount');
  const note  = document.getElementById('gallery-mode-note');
  if (!mount) return;

  // Friendly note + a tiny dev-only switcher (Alt+G to toggle layouts)
  note.textContent = '';

  if (GALLERY_MODE === 'carousel') buildCarousel();
  else buildPolaroid();

  // Lightbox handling — shared
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose   = document.getElementById('lb-close');

  function openLightbox(p) {
    lbImg.src = p.src;
    lbImg.alt = p.caption || 'photo';
    lbCaption.textContent = [p.caption, p.date].filter(Boolean).join(' · ');
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
  }
  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // Hidden hotkey to flip layouts during dev: Alt+G
  document.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'g' || e.key === 'G')) {
      mount.innerHTML = '';
      const next = mount.dataset.mode === 'polaroid' ? 'carousel' : 'polaroid';
      mount.dataset.mode = next;
      if (next === 'carousel') buildCarousel(); else buildPolaroid();
    }
  });

  // ===== CAROUSEL =========================================================
  function buildCarousel() {
    mount.dataset.mode = 'carousel';
    const wrap = document.createElement('div');
    wrap.className = 'carousel';

    photos.forEach((p, i) => {
      const item = document.createElement('button');
      item.className = 'carousel-item';
      item.type = 'button';
      item.innerHTML = `
        <img src="${p.src}" alt="${escapeHtml(p.caption || 'photo ' + (i+1))}" loading="lazy" />
        <div class="caption">
          ${p.caption ? escapeHtml(p.caption) : ''}
          ${p.date ? `<span class="date">${escapeHtml(p.date)}</span>` : ''}
        </div>
      `;
      item.addEventListener('click', () => openLightbox(p));
      wrap.appendChild(item);
    });

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    photos.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.type = 'button';
      d.setAttribute('aria-label', `Go to photo ${i + 1}`);
      d.addEventListener('click', () => {
        const items = wrap.children;
        items[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dots.appendChild(d);
    });

    wrap.addEventListener('scroll', () => {
      const w = wrap.clientWidth;
      const idx = Math.round(wrap.scrollLeft / (wrap.children[0]?.clientWidth || w));
      dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }, { passive: true });

    mount.appendChild(wrap);
    mount.appendChild(dots);
  }

  // ===== POLAROID GRID ====================================================
  function buildPolaroid() {
    mount.dataset.mode = 'polaroid';
    const grid = document.createElement('div');
    grid.className = 'polaroid-grid';

    photos.forEach((p, i) => {
      const card = document.createElement('button');
      card.className = 'polaroid';
      card.type = 'button';
      card.innerHTML = `
        <span class="washi" aria-hidden="true"></span>
        <img src="${p.src}" alt="${escapeHtml(p.caption || 'photo ' + (i+1))}" loading="lazy" />
        <div class="pl-caption">${p.caption ? escapeHtml(p.caption) : ''}</div>
      `;
      card.addEventListener('click', () => openLightbox(p));
      grid.appendChild(card);
    });

    mount.appendChild(grid);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }
})();
