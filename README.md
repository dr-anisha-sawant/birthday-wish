# Personal Page

A small static personal page. Plain HTML, CSS, and vanilla JavaScript — no build tools.

## Run locally

From the project folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use any other static file server (e.g. `npx serve`).

## Folder layout

```
.
├── index.html
├── css/
│   ├── reset.css
│   ├── styles.css
│   └── animations.css
├── js/
│   ├── main.js              # init, fade-up observer, timeline, envelope, gift, theme
│   ├── preview-toggle.js    # mobile/desktop QA bar
│   ├── particles-config.js  # tsParticles hearts
│   ├── balloons.js          # tap-to-release balloons + auto-burst
│   ├── countdown.js
│   ├── gallery.js           # carousel + polaroid + lightbox
│   ├── audio-player.js      # song + voice note (only one plays at a time)
│   ├── quiz.js
│   └── easter-egg.js
└── assets/
    ├── photos/      # photo-01.jpg, photo-02.jpg, …
    ├── audio/       # song.mp3, voice-note.mp3
    ├── fonts/
    └── icons/
```

## Editing content

All editable bits are at the top of their respective JS files in a clearly marked `CONFIG` block.

- **Photos** — drop any `.jpg` / `.jpeg` / `.png` / `.webp` files into `assets/photos/`, then regenerate the photo list:

  ```powershell
  # Windows / PowerShell
  powershell -File scripts\generate-photo-list.ps1
  ```

  ```bash
  # macOS / Linux / Git Bash
  bash scripts/generate-photo-list.sh
  ```

  This rewrites `js/photos-list.js`, which the gallery reads on load. Layout switches between carousel and polaroid via `GALLERY_MODE` at the top of [`js/gallery.js`](js/gallery.js). To add captions/dates per photo, edit the `photos` array in `gallery.js` directly instead of using the auto-list.
- **Voice note** — drop `voice-note.mp3` in `assets/audio/`. No code changes needed.
- **Song** — drop `song.mp3` in `assets/audio/`. Update title/artist text in [`index.html`](index.html) under the `#song` section.
- **Love letter** — edit the text inside `<article class="letter-paper">` in [`index.html`](index.html).
- **Quiz** — edit the `quiz` array in [`js/quiz.js`](js/quiz.js).
- **Countdown** — set `MODE` (`'before'` or `'together'`), `BIRTHDAY`, and `TOGETHER_SINCE` at the top of [`js/countdown.js`](js/countdown.js).
- **Gift reveal text** — edit the `<div id="gift-message">` inside [`index.html`](index.html).
- **Closing signature** — edit the closing `<p class="closing-line">` text in [`index.html`](index.html).

## Color palette

Two palettes are wired up via CSS variables in [`css/styles.css`](css/styles.css):

- `data-theme="blush"` — Blush & Cream (default)
- `data-theme="twilight"` — Twilight & Lavender

Switch by changing the attribute on `<html data-theme="...">` in `index.html`.

## Preview toggle bar

A small bar at the top lets you preview the page inside an iPhone-sized iframe to QA mobile from a desktop. Before sharing the link with anyone:

- Append `?preview=off` to the URL — the bar will be hidden.
- Or click **Hide** in the bar (state is local to that browser only).
- Or remove the `<div id="preview-bar">` block entirely from `index.html` for a clean shareable page.

## Deploy to GitHub Pages

1. Initialize and push to a new GitHub repo:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. On github.com → your repo → **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `main`, folder: `/ (root)` → **Save**.
5. Wait ~1 minute, then refresh — your live URL will be `https://<your-username>.github.io/<repo-name>/`.

> Free GitHub accounts require **public repos** for Pages. Use generic naming, generic commit messages, and a vague README (this one is intentionally minimal). The chance of someone randomly finding the URL is essentially zero, but assume the source is publicly readable. If you want a private repo, GitHub Pro is ~$4/month.

## Update workflow

```bash
git add .
git commit -m "update content"
git push
# wait ~30s and refresh the live URL
```

## Custom domain (optional)

1. Buy a domain (Namecheap, Porkbun, etc.).
2. Repo → Settings → Pages → **Custom domain** → enter your domain.
3. At your DNS provider, add a `CNAME` record pointing to `<your-username>.github.io`.
4. GitHub auto-provisions HTTPS within a few minutes.

## Notes

- Page is mobile-first. The narrow desktop max-width is intentional — it should feel like a letter, not a website.
- Audio never autoplays; modern browsers block it. The user must tap play.
- Animations respect `prefers-reduced-motion`.
- Compress photos before adding them — keep total page weight under ~2 MB.
