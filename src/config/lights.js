/**
 * lights.js
 * ---------------------------------------------------------
 * One lighting rig per scene. Each scene's <Lighting /> component
 * reads its entry here rather than declaring lights inline, so the
 * whole site's mood can be tuned from one file.
 *
 * fog uses R3F's exponential fog (fogExp2-style density) unless
 * `fogFar` is set, in which case treat it as linear fog.
 * ---------------------------------------------------------
 */

import palette, { scenePalettes } from './colors.js'

export const lightDefaults = {
  ambient: { color: palette.night, intensity: 0.25 },
  toneMappingExposure: 1.1,
}

export const lightingRigs = {
  intro: {
    ambient: { color: palette.void, intensity: 0.15 },
    directional: null, // no sun yet — the particles are the only light
    points: [], // populated procedurally by the Particles system itself
    fog: { color: scenePalettes.intro.fog, density: 0.04 },
  },

  childhood: {
    ambient: { color: palette.moss, intensity: 0.3 },
    directional: {
      color: '#CFE8C8',
      intensity: 0.8,
      position: [4, 8, 2],
      castShadow: false, // save the shadow-map budget for later, more important scenes
    },
    points: [], // fireflies added by <Fireflies /> component, not hardcoded here
    fog: { color: scenePalettes.childhood.fog, density: 0.05 },
  },

  strangerThings: {
    ambient: { color: palette.strangerBlue, intensity: 0.2 },
    directional: {
      color: palette.strangerBlue,
      intensity: 0.6,
      position: [-3, 4, -2],
      castShadow: false,
    },
    points: [
      { color: palette.crimson, intensity: 1.2, position: [2, 1, -3], distance: 6 },
    ],
    fog: { color: scenePalettes.strangerThings.fog, density: 0.06 },
  },

  storm: {
    ambient: { color: '#1A1E2B', intensity: 0.2 },
    directional: {
      color: '#8891A8',
      intensity: 0.4,
      position: [0, 10, -5],
      castShadow: false,
    },
    // lightning is handled as a timed intensity spike in the Storm scene
    // component itself, not a static config value — flagging here so
    // nobody goes looking for a "lightning" key in this file.
    points: [],
    fog: { color: scenePalettes.storm.fog, density: 0.08 },
  },

  flora: {
    ambient: { color: palette.blossom, intensity: 0.35 },
    directional: {
      color: '#FFE3C2',
      intensity: 1.1,
      position: [3, 6, 4],
      castShadow: true, // first scene where soft-edged shadows genuinely matter
    },
    points: [],
    fog: { color: scenePalettes.flora.fog, density: 0.03 },
  },

  romance: {
    ambient: { color: palette.lantern, intensity: 0.25 },
    directional: {
      color: '#B9A6FF',
      intensity: 0.35,
      position: [-2, 5, -3],
      castShadow: false,
    },
    points: [
      { color: palette.lantern, intensity: 0.9, position: [1.5, 1.2, 0.5], distance: 4 },
      { color: palette.lantern, intensity: 0.6, position: [-1.5, 1.6, -1], distance: 4 },
    ],
    fog: { color: scenePalettes.romance.fog, density: 0.045 },
  },

  volleyball: {
    ambient: { color: '#FFEAC2', intensity: 0.4 },
    directional: {
      color: palette.gold,
      intensity: 1.3,
      position: [5, 9, 3],
      castShadow: true,
    },
    points: [],
    fog: { color: scenePalettes.volleyball.fog, density: 0.025 },
  },

  family: {
    ambient: { color: palette.ember, intensity: 0.3 },
    directional: {
      color: '#FFB37A',
      intensity: 0.5,
      position: [0, 3, 5],
      castShadow: false,
    },
    points: [
      { color: palette.ember, intensity: 1.1, position: [0, 0.6, 2], distance: 5 }, // fireplace
    ],
    fog: { color: scenePalettes.family.fog, density: 0.04 },
  },

  friends: {
    ambient: { color: '#2A3550', intensity: 0.3 },
    directional: null,
    points: [
      { color: palette.lantern, intensity: 0.8, position: [-2, 3, 1], distance: 6 },
      { color: '#5B7FE8', intensity: 0.5, position: [2, 3, -2], distance: 6 }, // distant streetlight
    ],
    fog: { color: scenePalettes.friends.fog, density: 0.05 },
  },

  birthday: {
    ambient: { color: palette.gold, intensity: 0.3 },
    directional: {
      color: palette.gold,
      intensity: 0.7,
      position: [0, 10, 2],
      castShadow: false,
    },
    points: [], // fireworks add their own transient point lights at runtime
    fog: { color: scenePalettes.birthday.fog, density: 0.02 },
  },

  ending: {
    ambient: { color: palette.bone, intensity: 0.2 },
    directional: null,
    points: [],
    fog: { color: scenePalettes.ending.fog, density: 0.035 },
  },
}

export default lightingRigs
