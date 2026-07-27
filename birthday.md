# Still Here. — Build Tracker

Project: cinematic scrolling birthday tribute for Vedant
Deadline: **29 July** (his birthday)
Stack: Vite + React 19 + React Three Fiber + GSAP ScrollTrigger + Tailwind v4

Rule for this file: every time we finish a real chunk of work, update it here —
what got done, what was verified (not just written), and the exact next step.
No step gets marked done unless it actually built/ran, not just "looks right."

---

## Status at a glance

| # | Step | Status |
|---|------|--------|
| 1 | Project scaffold (Vite, deps, folders) | ✅ Done |
| 2 | `src/config/` (colors, settings, camera, lights) | ✅ Done |
| 3 | `src/styles/globals.css` (fonts, tokens, layout contract) | ✅ Done |
| 4 | `main.jsx` + `App.jsx` skeleton | ✅ Done |
| 5 | `LoadingScreen` | ✅ Done |
| 6 | `ScrollManager` (GSAP ScrollTrigger spine) | ✅ Done |
| 7 | Particle intro → "VEDANT" wow moment | ✅ Done |
| 8 | Individual scenes (Childhood → Ending, 10 scenes) | ⬜ Next up |
| 9 | Postprocessing (Bloom, GodRays, etc.) | ⬜ Not started |
| 10 | Cursor effects, Journey Map, audio, weather/time sync | ⬜ Not started |
| 11 | Performance pass + deploy | ⬜ Not started |

---

## Done so far (detail)

**1 — Scaffold**
`vedant/` Vite+React project. Real installed versions (not guessed):
React 19.2, R3F 9.6, drei 10.7, `@react-three/postprocessing` 3.0, `postprocessing` 6.39,
GSAP 3.15, Framer Motion 12.42, Tailwind 4.3, Vite 8.1. Zero peer-dep conflicts.
Path aliases (`@scenes`, `@components`, `@config`, etc.) set up in `vite.config.js`.

**2 — Config**
- `colors.js` — palette + per-scene `{bg, accent, text, fog}` mapping
- `settings.js` — feature flags, performance tiers, `BIRTHDAY`/`isBirthdayToday()`, scroll lengths
- `camera.js` — waypoints per scene + "emotional scroll speed" (`crawl`/`slow`/`normal`/`fast`)
- `lights.js` — lighting rig per scene, reads colors from `colors.js`

**3 — Styles**
Self-hosted fonts via `@fontsource`: Fraunces Variable (display), Instrument Sans (body),
Space Mono (utility/timecode). Tailwind v4 `@theme` block turns our palette into real
utility classes (`bg-void`, `text-bone`, etc.) — confirmed by actually rendering them and
inspecting build output, not assumed. Fixed-canvas + scrolling-overlay layout contract
(`.canvas-layer` / `.scroll-layer`) established — this is the pattern every scene builds on.

**4 — App skeleton**
R3F `<Canvas>` wired to config (fog/lights/camera per active scene). 11 scroll spacers from
`data/sections.js`. `ScenePlaceholder` (wireframe icosahedron, tinted per scene) proves
scene-switching works before any real 3D content exists.

**5 — LoadingScreen**
Real progress via drei's `useProgress` (not simulated). Caught and fixed a genuine edge case:
`useProgress`'s idle state (`{progress:0, active:false, total:0}`) is identical to "nothing
was ever queued" — without a fix this would hang at 0% forever right now, since no scene has
real assets yet. Handled with a 350ms grace window. Waits on `document.fonts.ready` too.
Respects `prefers-reduced-motion`. GSAP fade-out exit.

**6 — ScrollManager**
`useScroll.js` builds one GSAP ScrollTrigger per scene. Real technical catch: `scrub` only
smooths an attached *animation's* playhead, not a standalone trigger's raw `self.progress` —
confirmed against GSAP's actual behavior before relying on it. Fixed via the documented
proxy-tween pattern, so each scene's progress genuinely eases per its speed setting from
`camera.js` (Storm/Ending feel heavier, Volleyball tracks tighter). Exposed through React
Context (`ScrollManager` + `useScrollContext()`) so no prop drilling as scenes get built.
Also fixed a fast-refresh lint warning by splitting the context/hook into their own file.

**Verification standard used throughout:** every step above was checked with a real
`npm run build` + `npm run lint` (oxlint, 0 warnings/errors) before being marked done, not
just written and assumed correct. One honest gap: no headless browser in this environment,
so WebGL rendering hasn't been visually confirmed — worth an eyeball on first `npm run dev`.

**7 — Particle intro ("VEDANT")**
`components/Particles/` — pure position-generation (`particlePoints.js`, sanity-checked
directly in Node, not just assumed) plus GLSL shaders (`particleShaders.js`) and the R3F
component (`ParticleField.jsx`) that ties them together. Particles scatter in a volume,
then morph into a canvas-sampled silhouette of "VEDANT" as `progress` (the intro scene's
own eased scroll progress from ScrollManager) goes 0→1, with a small permanent drift so
the formed text never looks frozen. Deliberately used a plain fallback font for the
text-sampling canvas (not our brand Fraunces) to sidestep a real font-load race — the
Canvas mounts before `document.fonts.ready` resolves, so sampling with a
guaranteed-available font avoids getting the wrong glyph shapes on a slow load.
`scenes/Intro/IntroScene.jsx` wires it to the `intro` scene's accent color and particle
count (from `performanceTiers`). HTML overlay: the "29 July" tagline fades in past 75%
progress — deliberately not repeating "VEDANT" in HTML too, since the particles already
say it.

**Deployment**
Pushed to `imrozberg/imrozberg.github.io` on `main`. GitHub Actions workflow
(`.github/workflows/deploy.yml`) builds with `npm ci && npm run build` and deploys `dist/`
via `actions/deploy-pages` on every push to `main`.
⚠️ **Open item**: the repo's Pages source is still set to "Deploy from a branch" (legacy),
not "GitHub Actions" — switching that requires a permission my token doesn't have
(Pages/Administration), so it needs one manual toggle in Settings → Pages → Source →
"GitHub Actions". Until that's flipped, GitHub's own legacy auto-builder is *also* firing
on every push to `main` alongside our workflow, which is redundant and could race.

---

## Next up — Step 8: scenes, one at a time

Order matters less than getting Flora + the particle-reform Ending right, since those
are the emotional anchors per the original brief. Suggest: Storm → Flora → Ending first,
then backfill Childhood/StrangerThings/Romance/Volleyball/Family/Friends/Birthday as
atmosphere-level scenes if time is short.

---

## Open questions / risks
- No headless browser here → first real visual check has to happen on your machine (`npm run dev`)
- GitHub Pages source setting still needs the manual "GitHub Actions" toggle (see above)
- 3-day deadline — Step 8 (10 scenes) is the actual time sink, not the tech setup
- Bundle size already ~1.2MB gzipped before any real 3D assets — worth a code-splitting pass in Step 11, not urgent yet
