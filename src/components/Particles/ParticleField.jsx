import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { generateTextPoints, generateScatterPoints, generateRandomSeeds } from './particlePoints.js'
import { vertexShader, fragmentShader } from './particleShaders.js'
import { performanceTiers, DEFAULT_TIER } from '../../config/settings.js'

/**
 * ParticleField
 * ---------------------------------------------------------
 * Renders `count` particles that morph between a scattered volume
 * and the silhouette of `text`, driven by `progress` (0–1, typically
 * a scene's scroll progress from ScrollManager).
 *
 * Uniforms are updated imperatively inside useFrame rather than via
 * React state/props on the material — this runs at 60fps and doesn't
 * need (or want) a React re-render on every tick.
 * ---------------------------------------------------------
 */
export default function ParticleField({
  text,
  count = performanceTiers[DEFAULT_TIER].particleCount,
  progress = 0,
  color = '#F5F5F0',
  size = 40,
  scatterRadius = 8,
}) {
  const progressRef = useRef(progress)
  progressRef.current = progress

  const { geometry, material } = useMemo(() => {
    const scatter = generateScatterPoints(count, scatterRadius)
    const target = generateTextPoints(text, { targetCount: count })
    const random = generateRandomSeeds(count)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(scatter, 3))
    geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3))
    geo.setAttribute('aRandom', new THREE.BufferAttribute(random, 1))

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: size },
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
    // Deliberately excluding `progress` — it's read every frame via
    // progressRef instead of retriggering point/material regeneration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, count, scatterRadius, color, size])

  useFrame((state) => {
    material.uniforms.uProgress.value = progressRef.current
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  // GPU resources aren't garbage-collected by React unmounting alone.
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return <points geometry={geometry} material={material} />
}
