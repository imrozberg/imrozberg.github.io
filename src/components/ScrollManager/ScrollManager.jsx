import { useScrollProgress } from '../../hooks/useScroll.js'
import { ScrollContext } from './ScrollContext.js'

/**
 * ScrollManager
 * ---------------------------------------------------------
 * Wrap the app in this once, near the root. Everything downstream —
 * the camera rig, individual scenes, the Journey Map sidebar, audio
 * crossfade — reads scroll state via useScrollContext() instead of
 * receiving it as props. This is what lets scenes "talk to each
 * other" (e.g. Storm's exit and Flora's entrance both reacting to
 * the same source of truth) without wiring every intermediate
 * component to pass it through.
 * ---------------------------------------------------------
 */
export function ScrollManager({ children }) {
  const scrollState = useScrollProgress()
  return <ScrollContext.Provider value={scrollState}>{children}</ScrollContext.Provider>
}

export default ScrollManager
