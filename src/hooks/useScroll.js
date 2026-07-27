import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import sections from '../data/sections.js'
import { cameraPaths, speedMultiplier } from '../config/camera.js'
import settings from '../config/settings.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollProgress
 * ---------------------------------------------------------
 * The spine of the scroll experience. Builds one GSAP ScrollTrigger
 * per scene (from data/sections.js) against real DOM elements the
 * caller registers, and exposes:
 *
 *  - registerSection(id) → ref callback to attach to that scene's spacer
 *  - activeId            → whichever scene is currently in view
 *  - sceneProgress[id]   → 0–1 progress *within* that scene, eased/lagged
 *                          per its "emotional scroll speed" from camera.js
 *  - globalProgress      → 0–1 progress across the entire document
 *  - refresh()           → recompute trigger measurements (call after
 *                          layout-affecting things settle, e.g. fonts load)
 *
 * On scrub, and why sceneProgress isn't just self.progress:
 * GSAP's `scrub` option only smooths the playhead of an *animation*
 * attached to a ScrollTrigger — it does nothing to a standalone
 * trigger's raw self.progress. To get real eased/lagged progress per
 * the speedMultiplier map (crawl scenes should feel heavier, fast
 * scenes should track tighter), each scene drives a tiny proxy-object
 * tween (`gsap.to({ value: 0 }, { value: 1, scrollTrigger: {...} })`)
 * and we read the tween's eased value — the documented pattern for
 * scrubbing a value that isn't a DOM style.
 * ---------------------------------------------------------
 */
export function useScrollProgress() {
  const elementsRef = useRef({})
  const refCallbacksRef = useRef({})
  const tweensRef = useRef([])

  const [activeId, setActiveId] = useState(sections[0].id)
  const [sceneProgress, setSceneProgress] = useState(() =>
    Object.fromEntries(sections.map((s) => [s.id, 0]))
  )
  const [globalProgress, setGlobalProgress] = useState(0)

  const registerSection = useCallback((id) => {
    if (!refCallbacksRef.current[id]) {
      refCallbacksRef.current[id] = (el) => {
        if (el) elementsRef.current[id] = el
      }
    }
    return refCallbacksRef.current[id]
  }, [])

  useEffect(() => {
    const tweens = sections
      .map((section) => {
        const el = elementsRef.current[section.id]
        if (!el) return null

        const speedKey = cameraPaths[section.id]?.speed ?? 'normal'
        const mult = speedMultiplier[speedKey] ?? 1
        const scrub = settings.scroll.scrub / mult

        const proxy = { value: 0 }
        return gsap.to(proxy, {
          value: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub,
            anticipatePin: settings.scroll.anticipatePin,
            onToggle: (self) => {
              if (self.isActive) setActiveId(section.id)
            },
          },
          onUpdate: () => {
            setSceneProgress((prev) =>
              prev[section.id] === proxy.value ? prev : { ...prev, [section.id]: proxy.value }
            )
          },
        })
      })
      .filter(Boolean)

    tweensRef.current = tweens

    // Separate, unscrubbed trigger for whole-document progress — the
    // Journey Map and audio crossfade want an exact position, not a
    // lagged one.
    const globalTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setGlobalProgress(self.progress),
    })

    ScrollTrigger.refresh()

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
      globalTrigger.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refresh = useCallback(() => ScrollTrigger.refresh(), [])

  return { registerSection, activeId, sceneProgress, globalProgress, refresh }
}

export default useScrollProgress
