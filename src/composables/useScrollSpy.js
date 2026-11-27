import { onMounted, onBeforeUnmount, ref } from 'vue'

// Shared so the header menu can highlight the same section as the side nav
export const currentSection = ref('')

// A clicked section stays highlighted until the visitor scrolls by hand,
// because short sections near the end cannot always reach the top of the screen
let pinned = false
let pageIds = []

// Where the travelling dot sits, in dot units: 1.5 is halfway from dot 1 to dot 2
export const scrollPosition = ref(0)
const MIN_SCROLL = 200

// True when the page is too short to need the side nav
export const isShort = ref(false)

export function selectSection(id) {
  currentSection.value = id
  pinned = true
  const index = pageIds.indexOf(id)
  if (index >= 0) scrollPosition.value = index
}

const HEADER = 77
const USER_INPUT = ['wheel', 'touchstart', 'pointerdown', 'keydown']

/**
 * Highlight the section being read. The reading line moves from the top of the
 * screen to the bottom as the page scrolls, so every section gets a turn.
 *
 * @param {string[]} ids Element ids of the sections, in page order.
 * @returns {import('vue').Ref<string>} Id of the active section.
 */
export function useScrollSpy(ids) {
  const unpin = () => (pinned = false)
  let observer

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight
    isShort.value = max < MIN_SCROLL
    if (pinned) return

    // Too little to scroll: rest the dot on the section from the URL, or the first
    if (isShort.value) {
      const fromUrl = window.location.hash.slice(1)
      const index = Math.max(ids.indexOf(fromUrl), 0)
      currentSection.value = ids[index] ?? ''
      scrollPosition.value = index
      return
    }
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0
    const line = HEADER + progress * (window.innerHeight - HEADER)
    const passed = ids.filter((id) => document.getElementById(id)?.getBoundingClientRect().top <= line)
    currentSection.value = passed.at(-1) ?? ids[0] ?? ''

    const tops = ids.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? 0)
    const i = Math.max(ids.indexOf(currentSection.value), 0)
    const gap = tops[i + 1] - tops[i]
    scrollPosition.value = gap > 0 ? i + Math.min(Math.max((line - tops[i]) / gap, 0), 1) : i
  }

  onMounted(() => {
    pageIds = ids
    scrollPosition.value = 0
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('hashchange', update)
    USER_INPUT.forEach((type) => window.addEventListener(type, unpin, { passive: true }))

    const fromUrl = window.location.hash.slice(1)
    if (ids.includes(fromUrl)) selectSection(fromUrl)
    else {
      unpin()
    }
    update()
    // content can change height without a window resize (fonts, images, layout)
    observer = new ResizeObserver(update)
    observer.observe(document.body)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    isShort.value = false
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    window.removeEventListener('hashchange', update)
    USER_INPUT.forEach((type) => window.removeEventListener(type, unpin))
    currentSection.value = ''
    unpin()
  })

  return currentSection
}
