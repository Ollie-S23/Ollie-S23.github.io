import { ref } from 'vue'

export const DESIGNS = [
  {
    id: 'default',
    title: 'Default',
    detail: 'Space and planets',
  },
  {
    id: 'natural',
    title: 'Natural',
    detail: 'Glass, no 3D scene',
  },
  {
    id: 'text',
    title: 'Text',
    detail: 'Plain terminal view',
  },
]

const STORAGE_KEY = 'design'

function readDesign() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return DESIGNS.some(({ id }) => id === saved) ? saved : 'default'
  } catch {
    return 'default'
  }
}

export const design = ref(readDesign())

// Simple text swaps the pixel and code fonts for a clear one, in any design
const SIMPLE_TEXT_KEY = 'simple-text'

function readSimpleText() {
  try {
    return localStorage.getItem(SIMPLE_TEXT_KEY) === 'true'
  } catch {
    return false
  }
}

export const simpleText = ref(readSimpleText())

// the stylesheets switch on <html data-design="..." data-simple-text="...">
function apply() {
  document.documentElement.dataset.design = design.value
  document.documentElement.dataset.simpleText = simpleText.value
}

export function setSimpleText(on) {
  simpleText.value = on
  apply()
  try {
    localStorage.setItem(SIMPLE_TEXT_KEY, String(on))
  } catch {
    // storage blocked: the choice just lasts until the next reload
  }
}

export function setDesign(id) {
  design.value = id
  apply()
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // storage blocked: the choice just lasts until the next reload
  }
}

apply()
