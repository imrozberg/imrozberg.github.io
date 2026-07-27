import ParticleField from '../../components/Particles/ParticleField.jsx'
import { performanceTiers, DEFAULT_TIER } from '../../config/settings.js'
import { scenePalettes } from '../../config/colors.js'

/**
 * IntroScene
 * ---------------------------------------------------------
 * `progress` is the intro scene's own 0–1 scroll progress from
 * ScrollManager (already eased per camera.js's "slow" speed setting
 * for this scene). At 0, particles drift in darkness. By 1, they've
 * assembled into VEDANT and settled into a small living jitter.
 * ---------------------------------------------------------
 */
export default function IntroScene({ progress = 0 }) {
  const tier = performanceTiers[DEFAULT_TIER]

  return (
    <ParticleField
      text="VEDANT"
      count={tier.particleCount}
      progress={progress}
      color={scenePalettes.intro.accent}
    />
  )
}
