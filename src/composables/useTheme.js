import { ref } from 'vue'

const STORAGE_KEY = 'theme'

function readTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export const theme = ref(readTheme())

function apply() {
  document.documentElement.dataset.bsTheme = theme.value
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme.value)
}

export function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  apply()
  try {
    localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {
    // storage blocked: the choice just lasts until the next reload
  }
}

apply()
