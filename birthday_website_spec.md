# 💖 Romantic Birthday Website for Anisha — Build Spec for Claude Code

> **Project**: Surprise birthday website for my girlfriend, **Anisha Kathe**
> **Audience**: Just one person (her), opened from a link I send via WhatsApp/iMessage
> **Hosting plan**: **GitHub Pages** (I have a fresh GitHub account set up for this)
> **Primary device**: Mobile phone (she will most likely open it on her phone)
> **Secondary device**: Desktop (so I can preview both)

---

## 0. TL;DR for Claude Code

Build a **single-page static website** in **plain HTML + CSS + vanilla JavaScript** (no build step, no framework). It must be:

1. **Mobile-first responsive** — looks gorgeous on a phone, also works on desktop.
2. **Romantic & animated** — soft pastel/blush palette, floating hearts, subtle parallax, smooth fade-in transitions.
3. **Multi-section storytelling** — landing → countdown → photo gallery → timeline → love letter → quiz/interactive → final reveal.
4. **Includes a device-preview toggle at the very top** — a switch labelled `📱 Mobile` / `💻 Desktop` that wraps the entire page in a phone-frame iframe when "Mobile" is selected (so I can QA from my desktop).
5. **Zero backend, zero database, zero build tools.** Everything works by opening `index.html` in a browser.
6. Folder structure must be tidy so I can drop `assets/photos/` and `assets/audio/` in later.

---

## 1. Tech stack & constraints

### Use
- **HTML5**, **CSS3** (with custom properties / CSS variables for theming)
- **Vanilla JavaScript** (ES6+), no React / Vue / Svelte
- **GSAP** (loaded from CDN) for smooth scroll-triggered animations
- **tsParticles** (loaded from CDN) for the floating-hearts background
- **Google Fonts** — `Playfair Display` (serif headings) + `Inter` or `Quicksand` (body)
- **Lucide** or simple inline SVG for icons (no icon font bloat)

### Avoid
- No npm install required for the site itself
- No bundlers (Vite, Webpack, etc.)
- No backend / no API calls / no analytics
- No third-party tracking or external services that need an account

### Browser targets
- Latest Safari (iPhone) — **most important**
- Latest Chrome (Android + Desktop)
- Latest Firefox

---

## 2. Folder structure

```
birthday-site/
├── index.html
├── css/
│   ├── reset.css
│   ├── styles.css            # main styles, mobile-first
│   └── animations.css        # keyframes & transitions
├── js/
│   ├── main.js               # init + section logic
│   ├── particles-config.js   # tsParticles hearts config
│   ├── countdown.js          # birthday countdown
│   ├── gallery.js            # photo carousel + lightbox
│   ├── quiz.js               # "how well do you know us" quiz
│   ├── balloons.js           # tap-to-release + auto-load balloon burst
│   ├── audio-player.js       # song + voice note player (shared logic, only one plays at a time)
│   ├── easter-egg.js         # "I love you" hidden trigger
│   └── preview-toggle.js     # mobile/desktop preview switch
├── assets/
│   ├── photos/               # I will drop our photos here, named photo-01.jpg … photo-NN.jpg
│   ├── audio/
│   │   ├── song.mp3          # our song (I will provide)
│   │   └── voice-note.mp3    # personal voice message (I will record)
│   ├── fonts/                # if any are self-hosted
│   └── icons/
└── README.md                 # how to run + how to deploy
```

---

## 3. Design system

### Color palette — "Soft Romance"
Pick ONE of these and apply consistently via CSS variables:

**Option A — Blush & Cream (recommended, classic-romantic)**
```css
--bg-primary:     #FFF5F0;   /* warm cream */
--bg-secondary:   #FCE4EC;   /* blush pink */
--accent-rose:    #E91E63;   /* deep rose for accents */
--accent-soft:    #F8BBD0;   /* soft pink */
--text-primary:   #4A2C2A;   /* warm dark brown */
--text-secondary: #8B6F6B;   /* muted mauve */
--gold:           #D4AF37;   /* metallic gold for highlights */
```

**Option B — Twilight & Lavender (moodier, dreamy)**
```css
--bg-primary:     #1A1429;
--bg-secondary:   #2D1F47;
--accent-lilac:   #C8A2D9;
--accent-pink:    #FF6B9D;
--text-primary:   #F5E9F7;
--gold:           #FFD700;
```

> **Default to Option A.** Let me change one line in `:root` to switch.

### Typography
- **Headings**: `Playfair Display`, italic for hero title
- **Body**: `Quicksand`, weight 400/500
- **Accent script** (for love letter): `Dancing Script` or `Great Vibes`
- Base font size: `16px` mobile, `18px` desktop
- Line height: `1.6` for body, `1.2` for headings

### Spacing & layout
- Mobile-first breakpoints: `480px`, `768px`, `1024px`
- Container max-width on desktop: `720px` (intentionally narrow — feels intimate)
- Section padding: `4rem 1.5rem` mobile, `6rem 2rem` desktop
- Soft shadows everywhere — `0 8px 32px rgba(233, 30, 99, 0.12)`
- Generous border-radius — `16px` for cards, `999px` for buttons

---

## 4. Page sections (in order)

### 🔝 Section 0 — Preview Toggle Bar (NEW — only for me, hide later)
Fixed bar at the very top of the page:
- Two pill buttons: `📱 Mobile View` | `💻 Desktop View`
- Default: Desktop View (no frame)
- When Mobile View is clicked: wrap the rest of the page in an iframe sized like an iPhone 14 (`390px × 844px`), centered on screen, with a subtle phone-bezel SVG around it
- A small note: `"Preview mode — remove before sharing"`
- Toggle state persisted in `localStorage` so it survives reloads
- The bar should have a hide/show button so when she eventually sees the link, I can disable it via a URL flag like `?preview=off`

### 🌸 Section 1 — Hero / Landing
- Full-viewport height
- Background: animated gradient (soft pink → cream) + floating hearts (tsParticles)
- Center: **"Anisha"** in large `Playfair Display` italic, fades in with a slight scale-up
- Subtitle: `"Happy Birthday, Anisha 💕"` typed out with a typewriter effect
- A glowing "Open your gift 🎁" button that gently pulses, scrolls to the next section on click
- On first load, optional: a small "envelope" overlay that the user taps to "open" the site — adds drama

### ⏳ Section 2 — Countdown / Counter
Two modes (you decide before her birthday — easy CSS class swap):
- **Before the day**: "X days, X hours, X minutes until your special day"
- **On/after the day**: "We've been together X days, X hours, X minutes — and counting" (use the date you started dating)

Style: large numerical tiles with flip-card animation when digits change.

### 📸 Section 3 — Photo Gallery
- Auto-detect photos from `assets/photos/` named `photo-01.jpg`, `photo-02.jpg`, etc. (have a JS array I can edit; do NOT require directory listing).
- Two layout options I want included, switchable via a simple variable:
  1. **Polaroid stack** — photos look like polaroids, lightly tilted, on a string of "fairy lights"
  2. **Swipeable carousel** — full-width on mobile, horizontal scroll-snap, with dot indicators
- Each photo opens in a **lightbox** on tap, with optional caption text I can fill in via a JS object:
  ```js
  const photos = [
    { src: 'photo-01.jpg', caption: 'Our first trip together ✈️', date: 'June 2024' },
    ...
  ];
  ```
- Use lazy loading (`loading="lazy"`) and `<picture>` for responsive images.

### 🗓️ Section 4 — Our Timeline
A vertical scroll-triggered timeline of milestones (the day we met, first date, first trip, etc.). Each entry:
- Date on one side
- Short text + tiny photo or icon on the other
- Animates into view as you scroll (use GSAP ScrollTrigger or IntersectionObserver)

Provide a JS data array I can edit:
```js
const milestones = [
  { date: 'YYYY-MM-DD', title: 'The day we met', text: '...', icon: '💫' },
  ...
];
```

### 💌 Section 5 — Love Letter
- A "letter envelope" that the user taps
- Envelope flips open with a paper-unfolding animation (CSS 3D transform)
- Reveals a heartfelt message in `Dancing Script` font on a parchment-style background
- Placeholder text I will replace — leave a clear `<!-- LETTER TEXT GOES HERE -->` marker

### 🎵 Section 6 — Our Song
- A custom music player (no default `<audio>` controls — build a styled one)
- Big circular play/pause button, song title, artist
- A waveform-style visualizer is a nice touch (use Web Audio API if simple, otherwise skip)
- Option to autoplay on first user interaction (NOT on page load — modern browsers block it)
- Audio file: `assets/audio/song.mp3` (I'll provide)

### 🧠 Section 7 — Interactive Quiz: "How well do we know each other?"
A short 5–7 question quiz with multiple choice. Each question:
- One question, 3–4 options as cards
- Tap the right answer → confetti burst + green tick
- Tap wrong → gentle shake + correct answer revealed
- Final score screen with a personalized message ("You know us perfectly 💕" / "We've got more memories to make 😉")

Provide questions in a JS array I can edit:
```js
const quiz = [
  { q: 'Where did we have our first date?', options: ['...','...','...'], correct: 0 },
  ...
];
```

### 🎈 Section 8 — Tap to Release a Balloon (page-wide layer)
This is a **page-wide overlay**, not a single section. It's a fixed-position layer that captures clicks across the whole site:
- Every tap/click anywhere on the screen sends a colored balloon (pastel pinks, blush, gold, lilac) floating upward from the tap point
- Balloons drift up with slight horizontal sway, fade out near the top, with a tiny string trailing behind
- Each balloon has gentle physics — random size (40–80px), random rise speed (3–6s), slight rotation
- **AUTO-TRIGGER on page load**: as soon as the site first opens, automatically release **8–12 balloons** in a staggered burst from the bottom of the screen over ~2 seconds. This gives an instant "celebration!" feel before she does anything. Trigger AFTER the hero text fades in so it doesn't compete for attention.
- Use SVG balloons (not emoji) for crisp rendering — simple ellipse + string path, fillable with palette colors
- Cap simultaneous balloons at 30 to keep it performant on mobile
- Implementation note: the overlay must use `pointer-events: none` on the layer itself so it doesn't block buttons underneath, but each balloon can still spawn from any click — listen on `document` with a global event listener
- Respect `prefers-reduced-motion` — disable entirely if set

### 🎤 Section 9 — Voice Note from Me
A dedicated section for a personal audio message I will record:
- Audio file: `assets/audio/voice-note.mp3` (I'll record and add it)
- Visual: a soft, warm card styled like a vintage tape recorder OR a modern voicemail card with a waveform display
- Big circular play/pause button with subtle pulse animation when idle
- When playing: animated waveform bars react to playback (can be a faked CSS animation if Web Audio API is overkill — visual delight matters more than real audio analysis)
- Small label above the player: `"A little something I wanted to say out loud 🎙️"`
- Show duration (mm:ss) and a draggable progress bar
- **Important**: pauses any other playing audio (like the song in Section 6) when this is started, and vice versa — never have two audio sources playing at once

### 🎁 Section 10 — Virtual Gift Reveal
- A wrapped present that shakes gently
- On tap → unwrap animation (lid flies off, confetti explodes)
- Reveals a final personal message OR a hint about a real gift waiting for her, e.g.:
  - "Check under your pillow tonight 🛌"
  - "Your real gift arrives on [date]"
  - A coupon-style card: "Good for one weekend trip of your choice 💞"

### 🌌 Section 11 — Closing / Signature
- Soft fade to a dark romantic gradient
- Final line: `"Forever yours, [Your Name]"` in script font
- Subtle credits + a tiny heart that pulses

---

## 5. Animations — spec

Implement these (all should be smooth, never janky):

| Section | Animation |
|---|---|
| Background (entire page) | Floating hearts (tsParticles), low density (~30 hearts), drifting upward, varying sizes & opacity |
| Hero | Name fades in + scales (0.8 → 1) over 1.2s; typewriter subtitle |
| Page load | Auto-release of 8–12 balloons from bottom in staggered burst (after hero fades in) |
| Tap anywhere | Single balloon spawns from tap point and floats up |
| Section transitions | Soft fade-in + 20px upward slide on scroll (IntersectionObserver) |
| Buttons | Gentle pulse on idle, scale-up on hover, ripple on tap |
| Polaroids | Slight rotation on hover, lift shadow |
| Carousel | Smooth scroll-snap, no jitter |
| Timeline | Each entry slides in from alternating sides |
| Envelope (love letter) | 3D flip + paper unfold (CSS transforms + perspective) |
| Voice note player | Animated waveform bars when playing, idle pulse on play button |
| Quiz | Confetti burst on correct answer (use canvas-confetti CDN) |
| Gift box | Idle wiggle, then explode on tap with confetti |
| Page-wide | Cursor on desktop leaves a small heart trail (optional, off on mobile for perf) |

**Performance rules:**
- Disable the heart cursor trail on touch devices
- Reduce particle count on mobile (≤ 15)
- Respect `prefers-reduced-motion: reduce` — turn off all non-essential animation
- Lazy-load all images

---

## 6. Mobile / Desktop preview toggle — exact spec

This is for **me** to QA from my laptop before sending the link.

```
┌─────────────────────────────────────────────────────┐
│  📱 Mobile  |  💻 Desktop      [Hide preview bar]   │
└─────────────────────────────────────────────────────┘
```

Behavior:
- Desktop View (default): page renders normally, fluid responsive
- Mobile View: the entire page (below the toggle bar) loads inside an `<iframe src="index.html?embed=1">` sized to `390 × 844px`, centered on a dark backdrop, with rounded corners and a subtle iPhone-style notch at the top
- The `?embed=1` URL param tells the page to hide the toggle bar inside the iframe (avoid recursion)
- A `?preview=off` URL param (or removing the toggle bar div) gives a clean shareable link
- State stored in `localStorage` key `previewMode`

---

## 7. Content placeholders to fill in

Make these obvious in the code with `// TODO:` comments or `<!-- FILL IN -->` markers so I can `Cmd+F` and replace:

- [x] Her name: **Anisha** (use "Anisha" in hero, countdown headline; "Anisha Kathe" only in HTML `<title>` and meta tags)
- [ ] Her birthday date (for countdown)
- [ ] Date we started dating (for "days together" mode)
- [ ] Photo files in `assets/photos/` + caption + date metadata
- [ ] Timeline milestone array (5–10 entries)
- [ ] Love letter text
- [ ] Song file + title + artist
- [ ] **Voice note** file (`assets/audio/voice-note.mp3`) — I'll record this myself
- [ ] Quiz questions + correct answers
- [ ] Final gift reveal message
- [ ] My name in the closing signature

> **Note on her name in the page**: use just "Anisha" everywhere it appears visually — feels more intimate. Save "Anisha Kathe" for the page `<title>` so the browser tab reads `"Happy Birthday, Anisha 💕"` and meta tags only.

---

## 8. Hosting & deployment — GitHub Pages

> **Decision made**: hosting on **GitHub Pages** using a fresh GitHub account I just created.

### Why GitHub Pages works well here
- Completely free, no credit card, no expiring trial
- HTTPS included automatically, perfect for sharing a link via WhatsApp without the "not secure" warning
- Permanent URL (won't change like a tunnel would)
- I can edit a file, `git push`, and the site updates in ~30 seconds
- No build step needed — it serves my HTML/CSS/JS directly
- Reliable enough that I don't have to worry about my laptop being on

### Repo setup

I'll set up the repo this way (Claude Code: please bake these instructions into the README):

```bash
# inside the project folder
git init
git add .
git commit -m "Initial commit — birthday site for Anisha 🌸"
git branch -M main

# create a NEW repo on github.com first (named e.g. "for-anisha" or "birthday-site")
# then connect:
git remote add origin https://github.com/<my-username>/<repo-name>.git
git push -u origin main
```

### Privacy decision — important
GitHub Pages on a **free account requires a public repo**. This means:
- ✅ The website itself is fine to be public (no one will find a random URL)
- ⚠️ But ALL the code, photos, and the love letter text are publicly viewable on github.com to anyone who visits the repo

**Two ways to handle this:**

**Option A (recommended) — Keep the repo public, but obscure the contents:**
- Don't put her full name in commit messages or the repo description
- Name the repo something neutral like `personal-page` or `my-static-site`
- Commit photos with generic filenames (`photo-01.jpg` not `anisha-paris-2024.jpg`)
- Add a basic `README.md` that doesn't mention her or what the site is for
- The chance of someone randomly finding it and caring is essentially zero

**Option B — Pay for GitHub Pro (~$4/month) for one month, use a private repo:**
- GitHub Pages works on private repos only with paid plans
- One month is enough to cover the surprise; cancel after
- If the photos/letter are sensitive enough that you want zero risk, this is worth it

> **My pick if I'm honest**: Option A is fine for 99% of people. Don't overthink it.

### Enable GitHub Pages

1. Go to your repo on github.com
2. Settings → Pages (left sidebar)
3. Source: **Deploy from a branch**
4. Branch: **main** / folder: **/ (root)**
5. Click Save
6. Wait ~1 minute, refresh — you'll see your live URL: `https://<username>.github.io/<repo-name>/`

### Custom domain (optional, fancy touch)
If you want a romantic URL like `happybirthdayanisha.com` or `for-anisha.love`:
- Buy from Namecheap or Porkbun (~€10/year, `.love` is around €30)
- In repo Settings → Pages → Custom domain → enter the domain
- Add a CNAME record at your DNS provider pointing to `<username>.github.io`
- GitHub auto-provisions an SSL cert

This is genuinely a nice touch and only takes 10 minutes if you're up for it.

### Update workflow
Once it's live, every time you change something:
```bash
git add .
git commit -m "update photos"
git push
# wait ~30s, refresh the live URL — done
```

### Local testing before pushing
```bash
# from the project folder
python3 -m http.server 8000
# open http://localhost:8000 in your browser
```
This is how you'll preview every change locally before pushing to GitHub.

### .gitignore
Claude Code: include a `.gitignore` with:
```
.DS_Store
.vscode/
.idea/
*.log
node_modules/
# uncomment if you want to keep raw/original photos out of the repo
# assets/photos/originals/
```

---

## 9. Bonus interactive features — confirmed picks

Based on what I've decided, here are the **confirmed extras** (already integrated into the section list above) and the ones to **skip**:

### ✅ Include
- **Tap-to-release balloons** + auto-trigger on page load (specced in Section 8 above)
- **Voice note from me** (specced in Section 9 above)
- **Hidden Easter egg** — typing "I love you" anywhere on the page triggers a screen-wide heart explosion. Implementation: keystroke buffer that checks the last 10 keys typed; on match, fire a full-screen burst of heart particles using canvas-confetti with custom heart shapes. Works on desktop only (no keyboard on mobile) — as a mobile equivalent, secretly enable a triple-tap on the closing-section heart icon to fire the same effect.

### ❌ Skip (per my decision)
- ~~Reaction buttons~~ (no)
- ~~Photo guessing game~~ (no)
- ~~"Letter to future us" section~~ (no)

### Pinterest-inspired aesthetic moves (still encouraged)
- Polaroid-style photos pinned with washi tape SVGs
- Handwritten-looking annotations layered over photos
- Pressed-flower illustrations as section dividers
- A film-strip style horizontal photo gallery
- Subtle paper-texture background overlay (`.png` at 5% opacity)
- Vintage postcard frames around special photos

---

## 10. Accessibility & polish checklist

- [ ] All images have `alt` text (descriptive, not just "photo")
- [ ] Color contrast meets WCAG AA on all text
- [ ] All interactive elements have visible focus states
- [ ] Keyboard navigable (tab through quiz, buttons, etc.)
- [ ] `prefers-reduced-motion` respected
- [ ] No autoplaying audio — always require a tap
- [ ] Works offline once loaded (consider adding a tiny service worker — bonus)
- [ ] Page weight under 2 MB total (compress photos before adding)
- [ ] Lighthouse mobile performance score ≥ 90

---

## 11. Build order suggestion for Claude Code

To keep momentum and avoid getting stuck on details, build in this order:

1. Folder skeleton + `index.html` boilerplate + CSS reset + design tokens in `:root`
2. `.gitignore` + initial git setup ready for GitHub Pages
3. Preview toggle bar (so I can test mobile view from minute 1)
4. Hero section + tsParticles hearts background
5. **Balloon overlay layer** (tap-to-release + auto-burst on load) — gets it working early so you see it everywhere
6. Countdown section
7. Photo gallery (carousel version first, polaroid as enhancement)
8. Timeline
9. Love letter envelope
10. Music player (Section 6 — song)
11. **Voice note player** (Section 9 — shares audio-control logic with music player so only one plays at a time)
12. Quiz
13. Gift reveal
14. **Easter egg** — "I love you" keystroke listener + triple-tap mobile fallback
15. Closing
16. Polish pass — animations, perf, accessibility, README with GitHub Pages deploy steps

Each section should be independently togglable via a comment block in `index.html` so I can disable any I don't want.

---

## 12. README.md content (Claude Code: please generate this too)

Create a `README.md` covering:
- How to run locally (`python3 -m http.server 8000`)
- Where to drop photos and how to update the photo array
- Where to drop the voice note (`assets/audio/voice-note.mp3`)
- How to update the love letter, quiz, timeline data
- How to switch color palette
- **Full GitHub Pages deploy workflow** (the `git init` → push → enable Pages → live URL flow from Section 8)
- Update workflow (`git add . && git commit && git push` and the ~30s delay)
- How to remove the preview toggle bar before sharing the final link
- Custom domain setup (optional, brief)

Keep the README intentionally vague about *what* the project is — since the repo will be public, don't spell out "this is a birthday website for Anisha". Something like "A small static personal page" is enough.

---

## 13. What NOT to do

- ❌ Don't use any tracking, analytics, or third-party fonts loaded inline
- ❌ Don't use icon fonts (Font Awesome etc.) — use inline SVG
- ❌ Don't use `<marquee>`, autoplay video, or anything cringe-y
- ❌ Don't make her tap through more than 2 things to get to the photos — they're the main gift
- ❌ Don't use generic stock-photo couples or AI-generated art anywhere
- ❌ Don't add a chatbot, popup, or anything that asks for her email/info

---

## 💖 Final note for Claude Code

This is a personal gift for Anisha, so prioritize **emotional impact over feature count**. A simple page with one stunning photo gallery and a heartfelt letter beats a feature-stuffed page that loads slowly. When in doubt: fewer sections, more heart, more polish.

Make it feel like **a love letter, not a landing page.**

---

*Build with care. Anisha deserves it. 🌸*
