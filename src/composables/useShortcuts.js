import { ref } from 'vue'

// Single-key shortcuts must be able to be switched off (WCAG 2.1.4)
const STORAGE_KEY = 'shortcuts'

function readShortcuts() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

export const shortcutsOn = ref(readShortcuts())

export function setShortcuts(on) {
  shortcutsOn.value = on
  try {
    localStorage.setItem(STORAGE_KEY, String(on))
  } catch {
    // storage blocked: the choice just lasts until the next reload
  }
}
