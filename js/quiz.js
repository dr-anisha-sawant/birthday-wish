/* =========================================================
   QUIZ
   - Edit `quiz` array. Each item: { q, options[], correct }
   - Right answer => confetti + green tick; wrong => shake
   - Final score with personalized message
   ========================================================= */
(function () {
  // ----- CONFIG -----------------------------------------------------------
  // TODO: replace with real questions
  const quiz = [
    { q: 'Where did we have our first date?',     options: ['The little café', 'The park', 'My place', 'A fancy restaurant'], correct: 0 },
    { q: 'What\'s my favourite thing about you?', options: ['Your laugh', 'Your eyes', 'Your hands', 'All of the above'],     correct: 3 },
    { q: 'Our song is…',                          options: ['Track A', 'Track B', 'Track C', 'Track D'],                       correct: 1 },
    { q: 'Where do we always end up walking?',    options: ['The river', 'The market', 'That one street', 'Wherever you point'], correct: 3 },
    { q: 'My favourite memory of us is…',         options: ['That trip', 'That dinner', 'A random Tuesday', 'Right now'],     correct: 2 },
  ];

  const messages = {
    perfect:  'You know us perfectly 💕',
    great:    "You've been paying attention 😘",
    okay:     "We've got more memories to make 😉",
    cute:     "Doesn't matter — I'd still pick you. 💖"
  };
  // ------------------------------------------------------------------------

  const card    = document.getElementById('quiz-card');
  const qEl     = document.getElementById('quiz-question');
  const optsEl  = document.getElementById('quiz-options');
  const progEl  = document.getElementById('quiz-progress');
  const finalEl = document.getElementById('quiz-final');
  const scoreEl = document.getElementById('quiz-score');
  const msgEl   = document.getElementById('quiz-msg');
  if (!card) return;

  let idx = 0;
  let score = 0;

  function render() {
    if (idx >= quiz.length) return showFinal();

    const item = quiz[idx];
    progEl.textContent = `Question ${idx + 1} of ${quiz.length}`;
    qEl.textContent = item.q;
    optsEl.innerHTML = '';

    item.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'quiz-option';
      b.type = 'button';
      b.textContent = opt;
      b.addEventListener('click', () => answer(b, i));
      optsEl.appendChild(b);
    });
  }

  function answer(btn, i) {
    const item = quiz[idx];
    const all = optsEl.querySelectorAll('.quiz-option');
    all.forEach(b => b.disabled = true);

    if (i === item.correct) {
      btn.classList.add('correct');
      score++;
      if (typeof confetti === 'function') {
        const r = btn.getBoundingClientRect();
        confetti({
          particleCount: 60,
          spread: 60,
          startVelocity: 30,
          origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
          colors: ['#E91E63', '#F8BBD0', '#D4AF37', '#FF6B9D']
        });
      }
    } else {
      btn.classList.add('wrong');
      // also reveal the correct one
      all[item.correct].classList.add('correct');
    }

    setTimeout(() => {
      idx++;
      render();
    }, 1100);
  }

  function showFinal() {
    qEl.style.display = 'none';
    optsEl.style.display = 'none';
    progEl.style.display = 'none';
    finalEl.classList.add('show');
    scoreEl.textContent = `${score} / ${quiz.length}`;

    let key = 'okay';
    const ratio = score / quiz.length;
    if (ratio === 1) key = 'perfect';
    else if (ratio >= 0.7) key = 'great';
    else if (ratio >= 0.4) key = 'okay';
    else key = 'cute';
    msgEl.textContent = messages[key];

    if (key === 'perfect' && typeof confetti === 'function') {
      // bigger celebration
      const dur = 2000, end = Date.now() + dur;
      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#E91E63','#F8BBD0','#D4AF37'] });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#E91E63','#F8BBD0','#D4AF37'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  }

  render();
})();
