/* =========================================================
   PREVIEW TOGGLE BAR
   - Lets me QA mobile view from desktop via an iframe phone shell
   - ?embed=1 inside the iframe hides the bar (avoid recursion)
   - ?preview=off on the shareable link hides the bar entirely
   ========================================================= */
(function () {
  const params = new URLSearchParams(location.search);
  const isEmbed   = params.get('embed') === '1';
  const previewOff = params.get('preview') === 'off';

  const bar       = document.getElementById('preview-bar');
  const phoneFrame = document.getElementById('phone-frame');
  const phoneIframe = document.getElementById('phone-iframe');
  const hideBtn   = document.getElementById('preview-hide-btn');
  const pills     = document.querySelectorAll('#preview-bar .preview-pill');

  // Hide bar inside iframe or on shareable URL
  if (isEmbed || previewOff) {
    if (bar) bar.classList.add('hidden');
    return;
  }

  if (!bar) return;

  const STORAGE_KEY = 'previewMode';
  const saved = localStorage.getItem(STORAGE_KEY) || 'desktop';

  function applyMode(mode) {
    pills.forEach(p => {
      const active = p.dataset.mode === mode;
      p.classList.toggle('active', active);
      p.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (mode === 'mobile') {
      // Load iframe (only set src on activation to avoid double load)
      if (phoneIframe.src === 'about:blank' || !phoneIframe.src.includes('embed=1')) {
        phoneIframe.src = location.pathname + '?embed=1';
      }
      phoneFrame.classList.add('active');
      document.body.classList.add('preview-active');
    } else {
      phoneFrame.classList.remove('active');
      document.body.classList.remove('preview-active');
    }

    localStorage.setItem(STORAGE_KEY, mode);
  }

  pills.forEach(p => {
    p.addEventListener('click', () => applyMode(p.dataset.mode));
  });

  hideBtn?.addEventListener('click', () => {
    bar.classList.add('hidden');
    phoneFrame.classList.remove('active');
    document.body.classList.remove('preview-active');
  });

  // initial
  applyMode(saved);

  // Push body padding so content isn't hidden under the bar
  document.body.style.paddingTop = bar.offsetHeight + 'px';
})();
