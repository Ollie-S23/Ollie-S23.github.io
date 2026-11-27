import { ref } from 'vue'

// Mutes every sound the site makes: click sounds and read aloud
const STORAGE_KEY = 'muted'

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export const muted = ref(readMuted())

export function setMuted(on) {
  muted.value = on
  try {
    localStorage.setItem(STORAGE_KEY, String(on))
  } catch {
    // storage blocked: the choice just lasts until the next reload
  }
}
