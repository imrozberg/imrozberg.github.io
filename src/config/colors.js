/**
 * colors.js
 * ---------------------------------------------------------
 * Single source of truth for every color in the experience.
 * Nothing should hardcode a hex value outside this file —
 * scenes, shaders (as uniforms), and CSS (via globals.css
 * custom properties) all read from here.
 * ---------------------------------------------------------
 */

// Raw palette — the physical paint set. Named by feeling, not by scene,
// so any color can be reused wherever it's emotionally true.
export const palette = {
  void: '#050505',       // the base. everything begins and ends here
  night: '#10131A',       // secondary dark surface, panel backgrounds
  strangerBlue: '#1F3B73', // cold artificial glow — Upside Down / TV static
  crimson: '#C1121F',     // pain, storm, danger, urgency
  ember: '#FF7A3D',       // warm memory — the color of being cared for
  gold: '#F4B942',        // celebration, fireworks, birthday warmth
  blossom: '#F3B6C4',     // Flora's color — soft, specific, never overused
  moss: '#2E4B3C',        // childhood forest, life returning
  lantern: '#E8A857',     // romance scene, warm floating light
  bone: '#F5F5F0',        // typography. intentionally not pure white
  mist: '#8A94A6',        // muted UI text, timestamps, captions
}

// Per-scene palettes. Each scene picks 3 roles from the raw palette:
// bg (fog/background), accent (the thing that glows), text (headline color).
// Keeping this explicit means no scene silently drifts off-brand.
export const scenePalettes = {
  intro: {
    bg: palette.void,
    accent: palette.bone,
    text: palette.bone,
    fog: palette.void,
  },
  childhood: {
    bg: '#0A120D',
    accent: palette.moss,
    text: palette.bone,
    fog: '#0A120D',
  },
  strangerThings: {
    bg: palette.night,
    accent: palette.strangerBlue,
    text: palette.bone,
    fog: '#0B0E16',
  },
  storm: {
    bg: '#08090C',
    accent: palette.crimson,
    text: palette.bone,
    fog: '#08090C',
  },
  flora: {
    bg: '#1A1410',
    accent: palette.blossom,
    text: palette.bone,
    fog: '#2B2018',
  },
  romance: {
    bg: '#0D0B1A',
    accent: palette.lantern,
    text: palette.bone,
    fog: '#0D0B1A',
  },
  volleyball: {
    bg: '#12100A',
    accent: palette.gold,
    text: palette.bone,
    fog: '#1A1710',
  },
  family: {
    bg: '#1A130A',
    accent: palette.ember,
    text: palette.bone,
    fog: '#1A130A',
  },
  friends: {
    bg: '#0A0E14',
    accent: palette.lantern,
    text: palette.bone,
    fog: '#0A0E14',
  },
  birthday: {
    bg: '#0B0A14',
    accent: palette.gold,
    text: palette.bone,
    fog: '#0B0A14',
  },
  ending: {
    bg: palette.void,
    accent: palette.bone,
    text: palette.bone,
    fog: palette.void,
  },
}

// Convenience: resolve a scene's palette safely, falling back to intro.
export function getScenePalette(sceneId) {
  return scenePalettes[sceneId] ?? scenePalettes.intro
}

export default palette
