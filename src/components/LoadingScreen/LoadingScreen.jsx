import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import gsap from 'gsap'

/**
 * LoadingScreen
 * ---------------------------------------------------------
 * The first thing anyone sees. Tracks three.js's real loading
 * manager via drei's useProgress — no fake/simulated progress bar.
 *
 * Real edge case this handles: useProgress reports
 * { progress: 0, active: false, total: 0 } both *before* anything
 * has started loading and *when there was never anything to load*
 * (true right now — no scene has real textures/models yet). Those
 * two states are indistinguishable from a single snapshot, so we
 * wait `graceMs` for `total` to become > 0; if it never does, we
 * treat loading as complete instead of hanging at 0% forever.
 *
 * Once real GLTF/texture assets exist in later scenes, this same
 * logic keeps working — `total` will simply become > 0 quickly,
 * well inside the grace window, and the real-progress branch
 * takes over.
 * ---------------------------------------------------------
 */
export default function LoadingScreen({ onFinish, minDurationMs = 1400, graceMs = 350 }) {
  const { progress, active, total } = useProgress()
  const [displayProgress, setDisplayProgress] = useState(0)
  const [fontsReady, setFontsReady] = useState(false)
  const [pastGrace, setPastGrace] = useState(false)

  const mountedAt = useRef(Date.now())
  const rootRef = useRef(null)
  const hasStartedExit = useRef(false)

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setFontsReady(true))
    } else {
      setFontsReady(true)
    }
    const graceTimer = setTimeout(() => setPastGrace(true), graceMs)
    return () => clearTimeout(graceTimer)
  }, [graceMs])

  // Smooth the raw progress value — drei reports in discrete per-asset
  // jumps, which looks jittery against an otherwise calm screen.
  useEffect(() => {
    const tween = gsap.to(
      { v: displayProgress },
      {
        v: progress,
        duration: 0.4,
        ease: 'power1.out',
        onUpdate: function onUpdate() {
          setDisplayProgress(this.targets()[0].v)
        },
      }
    )
    return () => tween.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  useEffect(() => {
    if (hasStartedExit.current) return

    const nothingToLoad = total === 0 && !active && pastGrace
    const realLoadComplete = progress >= 100 && !active
    if (!nothingToLoad && !realLoadComplete) return
    if (!fontsReady) return

    const elapsed = Date.now() - mountedAt.current
    const remaining = Math.max(minDurationMs - elapsed, 0)

    hasStartedExit.current = true
    const timer = setTimeout(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const tl = gsap.timeline({ onComplete: () => onFinish?.() })
      tl.set(rootRef.current, { pointerEvents: 'none' })
      tl.to(rootRef.current, {
        opacity: 0,
        duration: reduceMotion ? 0.01 : 0.9,
        ease: 'power2.inOut',
      })
    }, remaining)

    return () => clearTimeout(timer)
  }, [progress, active, total, pastGrace, fontsReady, minDurationMs, onFinish])

  const shown = Math.min(Math.round(displayProgress), 100)

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-void"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={shown}
      aria-label="Loading"
    >
      <p className="text-eyebrow">Still Here.</p>

      <div className="relative h-px w-48 overflow-hidden bg-white/10">
        <div
          className="absolute inset-y-0 left-0 origin-left bg-bone"
          style={{ width: '100%', transform: `scaleX(${shown / 100})` }}
        />
      </div>

      <p className="text-eyebrow tabular-nums">{shown}%</p>
    </div>
  )
}
