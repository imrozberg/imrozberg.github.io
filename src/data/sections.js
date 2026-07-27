/**
 * sections.js
 * ---------------------------------------------------------
 * The canonical, ordered list of scenes. Nothing else should
 * hardcode scene order or labels — ScrollManager builds its
 * ScrollTriggers from this, the Journey Map sidebar renders
 * its dots from this, and App.jsx's scroll-layer spacers come
 * from this.
 * ---------------------------------------------------------
 */

import settings from '../config/settings.js'
import { scenePalettes } from '../config/colors.js'

const ids = [
  'intro',
  'childhood',
  'strangerThings',
  'storm',
  'flora',
  'romance',
  'volleyball',
  'family',
  'friends',
  'birthday',
  'ending',
]

// Journey Map labels — short, matches the sidebar spec from the design doc.
const labels = {
  intro: 'Beginning',
  childhood: 'Childhood',
  strangerThings: 'Stranger Things',
  storm: 'Storm',
  flora: 'Flora',
  romance: 'Romance',
  volleyball: 'Volleyball',
  family: 'Family',
  friends: 'Friends',
  birthday: '29 July',
  ending: 'Still Here',
}

export const sections = ids.map((id, index) => ({
  id,
  index,
  label: labels[id],
  lengthVh: settings.scroll.sceneLengthVh[id],
  palette: scenePalettes[id],
}))

export function getSection(id) {
  return sections.find((s) => s.id === id)
}

export function getSectionByIndex(index) {
  return sections[index]
}

export default sections
