/**
 * settings.js
 * ---------------------------------------------------------
 * Global knobs for the whole experience. If a value affects
 * more than one file, it belongs here — not hardcoded inline.
 * ---------------------------------------------------------
 */

// The one date this entire site revolves around.
// Month is 0-indexed (JS Date convention) — 6 = July.
export const BIRTHDAY = {
  month: 6,
  day: 29,
  label: '29 July',
}

/** Returns true if "now" (in the visitor's local time) is Vedant's birthday. */
export function isBirthdayToday(date = new Date()) {
  return date.getMonth() === BIRTHDAY.month && date.getDate() === BIRTHDAY.day
}

// Feature flags — lets us ship a scene in "atmosphere only" mode
// without ripping it out of the scroll sequence, and lets us kill
// expensive features fast if perf becomes a problem close to launch.
export const features = {
  dynamicTimeOfDay: true,   // scene lighting reacts to visitor's local clock
  weatherSync: true,        // rain scene checks visitor's real weather
  audio: true,               // background score + ambient sound layer
  cursorEffects: true,       // custom cursor per scene
  journeyMap: true,          // vertical scroll timeline (see Scene 9 spec)
  secretEnding: true,        // hidden alternate ending trigger
  birthdayMode: true,        // full takeover visuals on July 29
  godRays: true,             // disable first if FPS drops — most expensive effect
}

// Performance tiers. `usePerformance` hook measures a quick frame-time
// sample on load and assigns one of these; every particle/instance count
// in the scenes should read from the active tier rather than a fixed number.
export const performanceTiers = {
  low: {
    particleCount: 800,
    shadows: false,
    postprocessing: false,
    dpr: [1, 1],
  },
  mid: {
    particleCount: 2500,
    shadows: true,
    postprocessing: true,
    dpr: [1, 1.5],
  },
  high: {
    particleCount: 6000,
    shadows: true,
    postprocessing: true,
    dpr: [1, 2],
  },
}

export const DEFAULT_TIER = 'mid'

// Scroll behavior shared by ScrollManager + every scene's GSAP ScrollTrigger.
export const scroll = {
  // total scrollable height per scene, in viewport-heights (vh units).
  // Longer scenes = more room for the camera to move slowly.
  sceneLengthVh: {
    intro: 150,
    childhood: 120,
    strangerThings: 130,
    storm: 140,
    flora: 150,
    romance: 110,
    volleyball: 90,
    family: 100,
    friends: 100,
    birthday: 130,
    ending: 160,
  },
  scrub: 0.6, // GSAP ScrollTrigger scrub smoothing — higher = laggier/dreamier
  anticipatePin: 1,
}

// Audio crossfade timing between scene scores, in seconds.
export const audio = {
  crossfadeDuration: 2.2,
  masterVolumeDefault: 0.6,
  duckDuringNarration: 0.25,
}

export default {
  BIRTHDAY,
  isBirthdayToday,
  features,
  performanceTiers,
  DEFAULT_TIER,
  scroll,
  audio,
}
