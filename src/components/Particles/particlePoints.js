/**
 * particlePoints.js
 * ---------------------------------------------------------
 * Pure position-generation for the particle system. No React,
 * no three.js — just Float32Arrays, so these are independently
 * testable.
 * ---------------------------------------------------------
 */

/**
 * Samples a canvas-rendered string into a flat array of 3D points,
 * one per particle, drawn from wherever the rendered glyph is "lit"
 * (alpha above threshold).
 *
 * Font choice is deliberately a plain heavy sans fallback, not our
 * brand Fraunces — this only needs to produce a legible silhouette
 * of particles, and a guaranteed-available font avoids a race with
 * document.fonts.ready (this can run before custom fonts finish
 * loading, since the Canvas mounts immediately, before LoadingScreen
 * resolves).
 */
export function generateTextPoints(
  text,
  {
    targetCount = 3000,
    canvasWidth = 1024,
    canvasHeight = 256,
    fontSize = 200,
    sampleStep = 3,
    depth = 0.6,
    scale = 0.014,
  } = {}
) {
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2)

  const { data } = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  const candidates = []
  for (let y = 0; y < canvasHeight; y += sampleStep) {
    for (let x = 0; x < canvasWidth; x += sampleStep) {
      const alpha = data[(y * canvasWidth + x) * 4 + 3]
      if (alpha > 128) candidates.push(x, y)
    }
  }

  const points = new Float32Array(targetCount * 3)
  const candidateCount = candidates.length / 2

  // Should never happen with real text, but never hand back garbage.
  if (candidateCount === 0) return points

  for (let i = 0; i < targetCount; i++) {
    // Sampling with replacement is fine — this needs a visual
    // silhouette, not a unique pixel-to-particle mapping.
    const idx = Math.floor(Math.random() * candidateCount)
    const px = candidates[idx * 2]
    const py = candidates[idx * 2 + 1]

    points[i * 3 + 0] = (px - canvasWidth / 2) * scale
    points[i * 3 + 1] = -(py - canvasHeight / 2) * scale // canvas y-down -> world y-up
    points[i * 3 + 2] = (Math.random() - 0.5) * depth
  }

  return points
}

/** Points roughly uniformly distributed in a sphere, flattened toward the camera plane. */
export function generateScatterPoints(count, radius = 8) {
  const points = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    points[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
    points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    points[i * 3 + 2] = r * Math.cos(phi) * 0.4
  }
  return points
}

/** One random seed per particle — drives per-particle drift phase and twinkle in the shader. */
export function generateRandomSeeds(count) {
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) seeds[i] = Math.random()
  return seeds
}
