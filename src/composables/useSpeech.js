import { ref } from 'vue'
import { muted } from './useMute'

// Read the page aloud with the browser's built-in speech (Web Speech API)
export const speechSupported = 'speechSynthesis' in window
export const speaking = ref(false)

const BLOCKS = 'h1, h2, h3, p, li'
let session = 0 // ignores events from a reading that has since been stopped

// The page's text in reading order, one sentence at a time
function pageSentences() {
  return [...document.querySelectorAll('#app main :is(h1, h2, h3, p, li)')]
    .filter((element) => !element.querySelector(BLOCKS)) // its children are read instead
    .flatMap((element) => element.innerText.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/))
    .flatMap((sentence) => sentence.match(/\S.{0,179}(?=\s|$)/g) ?? []) // break up very long ones
}

export function stopReading() {
  if (!speechSupported) return
  session += 1
  speaking.value = false
  window.speechSynthesis.cancel()
}

export function readPage() {
  if (!speechSupported || muted.value) return
  stopReading()
  const sentences = pageSentences()
  if (!sentences.length) return

  const current = session
  const finish = () => {
    if (current === session) speaking.value = false
  }
  speaking.value = true
  // browser translators change <html lang>; the site's own English is read in an Australian voice
  const pageLang = document.documentElement.lang
  const lang = pageLang && !pageLang.startsWith('en') ? pageLang : 'en-AU'
  // short pieces, because some browsers cut off long ones part way through
  sentences.forEach((sentence, index) => {
    const utterance = new SpeechSynthesisUtterance(sentence)
    utterance.lang = lang
    utterance.onerror = finish
    if (index === sentences.length - 1) utterance.onend = finish
    window.speechSynthesis.speak(utterance)
  })
}

// speech would otherwise carry on after leaving or reloading the page
window.addEventListener('pagehide', stopReading)
