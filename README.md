# Yeabsera's Golden 25 Celebration

An interactive, cinematic 3D birthday experience built with React, TypeScript, Three.js (React Three Fiber), Framer Motion, GSAP and Vite.

The journey runs through ten scenes: welcome, 3D balloons, the cake and candles, cutting the cake, a memory gallery, a birthday letter, a gift table, and a full-screen golden finale with fireworks, balloons, confetti and glowing particles.

---

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL (defaults to `http://127.0.0.1:5173`).

> The optional microphone "blow out the candles" feature requires a secure context. It works on `localhost` and on HTTPS sites, and falls back gracefully to the "Blow them out" button when a mic is unavailable or permission is declined.

## Build

```bash
npm run build      # type-check-free production build via Vite
npm run preview    # serve the built site locally
npx tsc --noEmit   # standalone TypeScript check
```

The production output is written to `dist/`. The build uses relative asset paths (`base: './'`), so `dist/` can be hosted at a domain root or in a subfolder.

---

## Customize everything in one file

All personal content lives in **[`src/config.ts`](src/config.ts)**.

| Field | What it controls |
| --- | --- |
| `name` | The birthday girl's name, used across the welcome, cake, letter and finale. |
| `age` | The golden number on the cake and in the finale. |
| `tagline`, `welcomeMessage` | Welcome screen copy. |
| `finale.subtitle` | The line under "HAPPY 25TH BIRTHDAY". |
| `balloonMessages` | Hidden notes revealed when balloons pop. Add or remove freely. |
| `letter` | The full letter: greeting, paragraphs, closing and signature. |
| `photos` | Gallery entries: `src`, `caption`, `date`, optional `motif` (sample artwork style). |
| `music` | Optional music file path and starting volume. |
| `theme` | Gold, blush, cream, ink and background colours (applied as CSS variables). |

### Photographs

1. Put image files in `public/photos/` (for example `public/photos/yeabsera-01.jpg`).
2. Set `src: 'photos/yeabsera-01.jpg'` on that entry in `config.ts`.
3. Entries with an empty `src` show an original illustrated placeholder instead, so the gallery always looks complete.

Recommended: portrait or square images, at least 800 px on the short edge, JPG/WebP.

### Music

1. Put an audio file in `public/music/` (for example `public/music/song.mp3`).
2. Set `music.src: 'music/song.mp3'` in `config.ts`.

Out of the box the player synthesizes a soft public-domain "Happy Birthday" music-box melody with the Web Audio API, so the site has music with **no audio file and no autoplay**. Visitors start it with the music button. They can also upload their own track from the player, change volume, or mute. Playback continues across scene changes.

---

## Interactions

- **Balloons** — drag to look around; click/tap a balloon to pop it and read its hidden note.
- **Cake** — click each candle to light it, use the mic to blow them out (or the manual button), then cut the cake.
- **Memories** — click a polaroid to open the viewer; use the arrow buttons or keyboard arrows, `Esc` to close.
- **Letter** — break the wax seal, watch the typewriter, replay it, or skip to read the whole letter.
- **Gifts** — click a gift to open the lid and reveal what is inside.
- **Finale** — "Relive the Celebration" returns to the welcome screen; "View Our Memories" returns to the gallery.

## Performance & accessibility

- A single persistent WebGL canvas and camera rig are reused across scenes; scene-specific 3D objects unmount and dispose their geometries/materials.
- Fireworks render as one pooled `Points` draw call; finale balloons use one `InstancedMesh`.
- The render loop is demand-aware per scene and pauses work when the tab is hidden.
- `prefers-reduced-motion` reduces camera drift, particle counts and decorative animation.
- If WebGL is unavailable, the site detects it up front and shows a styled static fallback with all UI still usable.
- Microphone tracks and the Web Audio context are stopped/closed when no longer needed.

## Browser support

Current Chrome, Edge, Firefox and Safari (desktop and mobile). WebGL2 is preferred, WebGL1 is supported.

---

## Deploying

The site is a static build — no server or database required.

### Netlify

1. Push the project to GitHub.
2. In Netlify choose **Add new site → Import an existing project**, select the repository.
3. Build command: `npm run build` · Publish directory: `dist`.
4. Deploy.

### Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Vite** · Build command: `npm run build` · Output directory: `dist`.
3. Deploy.

### GitHub Pages

1. Create a repository and push the project.
2. Install the helper: `npm install --save-dev gh-pages`.
3. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
4. Run `npm run deploy`, then set **Settings → Pages → Branch: `gh-pages`**.
5. Because assets use relative paths, the site works at `https://<user>.github.io/<repo>/` without changing `base`.

### Any static host

Upload the contents of `dist/` to your host (Cloudflare Pages, S3, Firebase Hosting, etc.). Serve `index.html` for unknown routes.

After deploying, open the live URL on a phone as well: check that the music button starts playback after a tap, the mic prompt appears over HTTPS, and the finale runs smoothly.
