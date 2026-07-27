/**
 * particleShaders.js
 * ---------------------------------------------------------
 * Note on three.js's ShaderMaterial: it auto-injects `position`
 * (from the geometry's position attribute), plus the standard
 * matrices/uniforms — those are NOT redeclared below. Only the
 * custom attributes (aTarget, aRandom) and uniforms we actually
 * add are declared here.
 * ---------------------------------------------------------
 */

export const vertexShader = /* glsl */ `
  uniform float uProgress; // 0 = scattered in darkness, 1 = formed into text
  uniform float uTime;
  uniform float uSize;

  attribute vec3 aTarget;
  attribute float aRandom;

  varying float vRandom;

  // Cheap layered-sine drift, not real Perlin/simplex noise — keyed by a
  // per-particle seed so each particle wanders on its own phase instead
  // of moving in lockstep. Good enough for ambient motion, much cheaper
  // than a real noise function.
  vec3 drift(float seed, float t) {
    float x = sin(t * 0.6 + seed * 62.0) * cos(t * 0.23 + seed * 11.0);
    float y = cos(t * 0.5 + seed * 40.0) * sin(t * 0.31 + seed * 7.0);
    float z = sin(t * 0.4 + seed * 17.0);
    return vec3(x, y, z);
  }

  void main() {
    vRandom = aRandom;

    float eased = uProgress * uProgress * (3.0 - 2.0 * uProgress); // smoothstep

    // Wide, slow drift while scattered; a small "still alive" jitter
    // once formed, so the assembled text never looks frozen.
    vec3 scattered = position + drift(aRandom, uTime) * mix(0.9, 0.08, eased);
    vec3 formed = aTarget + drift(aRandom, uTime * 0.5) * 0.05;

    vec3 finalPosition = mix(scattered, formed, eased);

    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;

  varying float vRandom;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, dist);
    float twinkle = 0.7 + 0.3 * sin(vRandom * 100.0 + uTime * 1.5);
    gl_FragColor = vec4(uColor, alpha * twinkle);
  }
`
