import { ref } from 'vue'

// Reduced motion: follows the device setting until the visitor uses the switch
const STORAGE_KEY = 'reduce-motion'
const system = window.matchMedia('(prefers-reduced-motion: reduce)')

function readChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

let choice = readChoice()
export const reduceMotion = ref(choice === null ? system.matches : choice === 'true')

// style.css switches transitions and smooth scrolling off from this attribute
function apply(on) {
  reduceMotion.value = on
  document.documentElement.dataset.reduceMotion = String(on)
}

export function setReduceMotion(on) {
  choice = String(on)
  apply(on)
  try {
    localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // storage blocked: the choice just lasts until the next reload
  }
}

system.addEventListener('change', () => {
  if (choice === null) apply(system.matches)
})
apply(reduceMotion.value)
