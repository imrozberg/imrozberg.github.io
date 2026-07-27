import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import sections from './data/sections.js'
import lightingRigs from './config/lights.js'
import { performanceTiers, DEFAULT_TIER } from './config/settings.js'
import { cameraDefaults, cameraPaths } from './config/camera.js'
import LoadingScreen from './components/LoadingScreen'
import { ScrollManager, useScrollContext } from './components/ScrollManager'

/**
 * Stand-in 3D content. Each real scene (Storm, Flora, Volleyball...)
 * replaces this with its own component in src/scenes/<Name>/. This
 * exists purely to prove the canvas re-renders when the active
 * scene changes — colored by that scene's own accent from colors.js,
 * and now also driven by that scene's own scroll progress.
 */
function ScenePlaceholder({ palette, progress }) {
  return (
    <mesh rotation={[0.4, 0.4 + progress * Math.PI, 0]}>
      <icosahedronGeometry args={[1.2, 0]} />
      <meshStandardMaterial color={palette.accent} wireframe />
    </mesh>
  )
}

/**
 * Everything that needs scroll state lives inside <ScrollManager>, since
 * useScrollContext() can only be called by a descendant of the provider —
 * not by the component that renders the provider itself.
 */
function Experience() {
  const { registerSection, activeId, sceneProgress, refresh } = useScrollContext()
  const activeSection = sections.find((s) => s.id === activeId)
  const activeRig = lightingRigs[activeId]
  const tier = performanceTiers[DEFAULT_TIER]
  const initialPosition = cameraPaths[activeId]?.waypoints[0]?.position ?? [0, 0, 10]

  const [isLoading, setIsLoading] = useState(true)

  // Lock scroll while the loading screen is up — nothing to scroll
  // through yet anyway, and it keeps the entrance feeling deliberate.
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isLoading])

  return (
    <>
      {isLoading && (
        <LoadingScreen
          onFinish={() => {
            setIsLoading(false)
            // Section heights can shift a hair once real fonts/layout
            // settle behind the loading screen — resync ScrollTrigger's
            // measurements right as the page becomes scrollable.
            refresh()
          }}
        />
      )}

      {/* Fixed R3F canvas — see .canvas-layer in globals.css for the
          layering contract this depends on. */}
      <div className="canvas-layer">
        <Canvas
          dpr={tier.dpr}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          shadows={tier.shadows}
          camera={{
            fov: cameraPaths[activeId]?.fov ?? cameraDefaults.fov,
            near: cameraDefaults.near,
            far: cameraDefaults.far,
            position: initialPosition,
          }}
        >
          <color attach="background" args={[activeSection.palette.bg]} />
          <fogExp2
            attach="fog"
            args={[activeRig?.fog.color ?? activeSection.palette.fog, activeRig?.fog.density ?? 0.04]}
          />
          <ambientLight color={activeRig?.ambient.color} intensity={activeRig?.ambient.intensity ?? 0.3} />
          {activeRig?.directional && (
            <directionalLight
              color={activeRig.directional.color}
              intensity={activeRig.directional.intensity}
              position={activeRig.directional.position}
              castShadow={activeRig.directional.castShadow}
            />
          )}

          <Suspense fallback={null}>
            <ScenePlaceholder palette={activeSection.palette} progress={sceneProgress[activeId] ?? 0} />
          </Suspense>
        </Canvas>
      </div>

      {/* Normal-flow scroll spacers — one per scene, height driven by
          settings.scroll.sceneLengthVh via data/sections.js. Real scene
          text/UI overlays will render inside each of these later. */}
      <div className="scroll-layer">
        {sections.map((section) => (
          <section
            key={section.id}
            ref={registerSection(section.id)}
            data-scene={section.id}
            style={{ minHeight: `${section.lengthVh}vh` }}
            className="flex items-center justify-center"
          >
            <p className="text-eyebrow">
              {section.label} — {Math.round((sceneProgress[section.id] ?? 0) * 100)}%
            </p>
          </section>
        ))}
      </div>
    </>
  )
}

export default function App() {
  return (
    <ScrollManager>
      <Experience />
    </ScrollManager>
  )
}
