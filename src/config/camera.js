/**
 * camera.js
 * ---------------------------------------------------------
 * Every scene defines a camera path as a list of waypoints.
 * `scroll` is a 0–1 progress value *within that scene* (not
 * global page scroll) — ScrollManager hands each scene its
 * own local progress, and the camera component lerps/catmull-
 * rom's between whatever waypoints straddle that progress.
 *
 * `speed` maps to a scrub multiplier applied on top of the
 * global scroll.scrub value in settings.js — this is what
 * gives the "Emotional Scroll Speed" effect from the design
 * doc (Storm feels heavy, Volleyball feels fast, Ending is
 * unhurried).
 * ---------------------------------------------------------
 */

export const cameraDefaults = {
  fov: 50,
  near: 0.1,
  far: 200,
  // Real cameras never hold perfectly still. These are subtle —
  // tune amplitude down further if it reads as "shaky" instead of "alive".
  imperfections: {
    breathing: { amplitude: 0.02, speed: 0.4 },
    sway: { amplitude: 0.015, speed: 0.15 },
  },
}

// speed multiplier: 1 = baseline. <1 = slower/heavier. >1 = faster/urgent.
export const speedMultiplier = {
  crawl: 0.5,   // Storm, Ending — grief and farewell shouldn't be rushed
  slow: 0.75,   // Childhood, Flora's bloom
  normal: 1,
  fast: 1.4,    // Volleyball — kinetic, alive
}

export const cameraPaths = {
  intro: {
    fov: 40,
    speed: 'slow',
    waypoints: [
      { scroll: 0, position: [0, 0, 12], lookAt: [0, 0, 0] },
      { scroll: 0.6, position: [0, 0.4, 6], lookAt: [0, 0, 0] },
      { scroll: 1, position: [0, 0.2, 3.2], lookAt: [0, 0, 0] },
    ],
  },

  childhood: {
    fov: 55,
    speed: 'slow',
    waypoints: [
      { scroll: 0, position: [-4, 1.6, 8], lookAt: [0, 1.2, 0] },
      { scroll: 0.5, position: [0, 1.8, 4], lookAt: [0.5, 1.4, -2] },
      { scroll: 1, position: [3, 2, 0], lookAt: [1, 1.4, -4] },
    ],
  },

  strangerThings: {
    fov: 48,
    speed: 'normal',
    waypoints: [
      { scroll: 0, position: [0, 1.5, 6], lookAt: [0, 1, -2] },
      { scroll: 0.5, position: [-2, 1.2, 2], lookAt: [1, 1, -4] },
      { scroll: 1, position: [1, 0.8, -1], lookAt: [0, 1, -6] },
    ],
  },

  storm: {
    fov: 52,
    speed: 'crawl',
    waypoints: [
      { scroll: 0, position: [0, 3, 10], lookAt: [0, 0, 0] },
      { scroll: 0.5, position: [0, 1, 5], lookAt: [0, -0.5, 0] },
      { scroll: 1, position: [0, 4, 2], lookAt: [0, 2, -4] }, // camera begins rising
    ],
  },

  flora: {
    fov: 45,
    speed: 'slow',
    waypoints: [
      { scroll: 0, position: [-3, 1, 6], lookAt: [-1, 0.8, 0] },
      { scroll: 0.4, position: [0, 1.2, 3], lookAt: [0, 1, 0] }, // the one flower
      { scroll: 1, position: [2, 1.6, -1], lookAt: [1, 1.2, -3] }, // the field
    ],
  },

  romance: {
    fov: 42,
    speed: 'normal',
    waypoints: [
      { scroll: 0, position: [0, 1.4, 7], lookAt: [0, 1.2, 0] },
      { scroll: 1, position: [1.5, 1.8, 1], lookAt: [0, 1.4, -3] },
    ],
  },

  volleyball: {
    fov: 58,
    speed: 'fast',
    waypoints: [
      { scroll: 0, position: [-6, 2, 6], lookAt: [0, 1.5, 0] },
      { scroll: 0.5, position: [0, 3.5, 0.5], lookAt: [0, 2, 0] }, // slow-mo spike apex
      { scroll: 1, position: [5, 1.8, -4], lookAt: [0, 1.5, 0] },
    ],
  },

  family: {
    fov: 46,
    speed: 'slow',
    waypoints: [
      { scroll: 0, position: [0, 1.4, 8], lookAt: [0, 1.2, 0] },
      { scroll: 1, position: [0, 1.6, 3], lookAt: [0, 1.3, -1] }, // pushing toward the window glow
    ],
  },

  friends: {
    fov: 50,
    speed: 'normal',
    waypoints: [
      { scroll: 0, position: [-3, 1.6, 6], lookAt: [0, 1.3, 0] },
      { scroll: 1, position: [2, 1.4, 1], lookAt: [0, 1.3, -3] },
    ],
  },

  birthday: {
    fov: 44,
    speed: 'normal',
    waypoints: [
      { scroll: 0, position: [0, 1, 8], lookAt: [0, 1, 0] },
      { scroll: 0.6, position: [0, 3, 4], lookAt: [0, 2, 0] },
      { scroll: 1, position: [0, 6, 0.5], lookAt: [0, 4, 0] }, // flying up into the constellation
    ],
  },

  ending: {
    fov: 40,
    speed: 'crawl',
    waypoints: [
      { scroll: 0, position: [0, 0.5, 4], lookAt: [0, 0, 0] },
      { scroll: 1, position: [0, 0, 1.5], lookAt: [0, 0, 0] }, // final held close
    ],
  },
}

export default cameraPaths
