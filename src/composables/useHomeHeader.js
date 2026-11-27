import { ref } from 'vue'

// Whether Home keeps the normal header instead of the orbit menu
const STORAGE_KEY = 'home-header'

function readHomeHeader() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export const homeHeader = ref(readHomeHeader())

export function setHomeHeader(on) {
  homeHeader.value = on
  try {
    localStorage.setItem(STORAGE_KEY, String(on))
  } catch {
    // storage blocked: the choice just lasts until the next reload
  }
}
