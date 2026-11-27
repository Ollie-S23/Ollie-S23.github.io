<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { isShort, scrollPosition, selectSection, useScrollSpy } from '@/composables/useScrollSpy'
import { playClick } from '@/composables/useClickSound'
import { shortcutsOn } from '@/composables/useShortcuts'

const props = defineProps({
  sections: {
    type: Array,
    required: true,
  },
  // Set to false to turn the travelling dot off for a page
  traveller: {
    type: Boolean,
    default: true,
  },
})

const activeId = useScrollSpy(props.sections.map((section) => section.id))

// Collapsed hides the nav, leaving the open button; the choice is remembered in this browser
const STORAGE_KEY = 'timeline-collapsed'
const collapsed = ref(readCollapsed())

function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function toggle() {
  collapsed.value = !collapsed.value
  playClick(collapsed.value ? 440 : 660)
  try {
    localStorage.setItem(STORAGE_KEY, String(collapsed.value))
  } catch {
    // storage blocked: the choice just lasts for this page
  }
}

function goTo(id) {
  selectSection(id)
  playClick(880)
}

// Move one section up (-1) or down (+1)
function step(direction) {
  const index = props.sections.findIndex((section) => section.id === activeId.value)
  const next = props.sections[index + direction]
  if (!next) return // already at the first or last section
  goTo(next.id)
  history.replaceState(history.state, '', `#${next.id}`)
  document.getElementById(next.id)?.scrollIntoView()
}

// Keys: [ collapses or reopens the side nav, Alt + Up/Down changes section
function onKey(event) {
  if (event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable]')) return
  if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault()
    step(event.key === 'ArrowUp' ? -1 : 1)
  } else if (!event.altKey && !event.repeat && !isShort.value && shortcutsOn.value && event.key === '[') {
    toggle()
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const list = ref(null)
const centres = ref([])

// Vertical centre of each circle, measured from the top of the list
// measured again whenever the list is shown or resized (it has no size while collapsed)
let observer
onMounted(() => {
  observer = new ResizeObserver(() => {
    centres.value = [...list.value.querySelectorAll('li:not(.traveller)')].map((li) => li.offsetTop + li.offsetHeight / 2)
  })
  observer.observe(list.value)
})
onBeforeUnmount(() => observer?.disconnect())

const travellerTop = computed(() => {
  const i = Math.floor(scrollPosition.value)
  const from = centres.value[i] ?? 0
  const to = centres.value[i + 1] ?? from
  return `${from + (to - from) * (scrollPosition.value - i)}px`
})
</script>

<template>
  <nav class="timeline" :class="{ collapsed, 'not-needed': isShort }" aria-label="Page sections">
    <button type="button" class="btn btn-sm btn-outline-secondary timeline-toggle"
            :aria-expanded="!collapsed" :aria-label="collapsed ? 'Expand side nav' : 'Collapse side nav'"
            :title="`${collapsed ? 'Expand' : 'Collapse'} side nav ( [ )`" @click="toggle">
      {{ collapsed ? '«' : '»' }}
    </button>
    <ul ref="list">
      <li v-for="section in sections" :key="section.id">
        <a :href="`#${section.id}`" :class="{ active: activeId === section.id }" :title="section.title"
           :translate="section.keepName ? 'no' : undefined" @click="goTo(section.id)">
          {{ section.title }}
        </a>
      </li>
      <li v-if="traveller" class="traveller" :style="{ top: travellerTop }"
          aria-hidden="true"></li>
    </ul>
  </nav>
</template>
