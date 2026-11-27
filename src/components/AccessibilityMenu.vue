<script setup>
import { nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { readPage, speaking, speechSupported, stopReading } from '@/composables/useSpeech'
import { DESIGNS, design, setDesign, setSimpleText, simpleText } from '@/composables/useDesign'
import { setShortcuts, shortcutsOn } from '@/composables/useShortcuts'
import { reduceMotion, setReduceMotion } from '@/composables/useMotion'
import { muted, setMuted } from '@/composables/useMute'
import { homeHeader, setHomeHeader } from '@/composables/useHomeHeader'

// a new page means the old page's reading should end
const route = useRoute()
watch(() => route.path, stopReading)

function toggleMute(on) {
  setMuted(on)
  if (on) stopReading()
}

// on Home this swaps which copy of the menu is shown, so move focus to the new one
async function toggleHomeHeader(on) {
  setHomeHeader(on)
  if (route.path !== '/') return
  await nextTick()
  document.querySelector('.accessibility-toggle')?.focus()
}
</script>

<template>
  <div class="dropdown">
    <button type="button" class="btn accessibility-toggle p-1" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false"
            aria-label="Accessibility: choose a design" title="Accessibility">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="7" r="1" fill="currentColor" />
        <path d="M7 10l5 1 5-1M12 11v3l-2.5 4M12 14l2.5 4" />
      </svg>
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li><h6 class="dropdown-header">Accessibility</h6></li>
      <li v-for="option in DESIGNS" :key="option.id">
        <button type="button" class="dropdown-item" :class="{ active: design === option.id }"
                :aria-pressed="design === option.id" @click="setDesign(option.id)">
          {{ option.title }}
          <small class="d-block opacity-75">{{ option.detail }}</small>
        </button>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li v-if="design === 'default'" class="px-3 py-1" @click.stop>
        <div class="form-check form-switch mb-0">
          <input id="home-header" class="form-check-input" type="checkbox" role="switch"
                 :checked="homeHeader" @change="toggleHomeHeader($event.target.checked)">
          <label class="form-check-label" for="home-header">
            Header on Home
            <small class="d-block opacity-75">Instead of the planets</small>
          </label>
        </div>
      </li>
      <!-- .stop keeps the menu open while the switch is used -->
      <li class="px-3 py-1" @click.stop>
        <div class="form-check form-switch mb-0">
          <input id="simple-text" class="form-check-input" type="checkbox" role="switch"
                 :checked="simpleText" @change="setSimpleText($event.target.checked)">
          <label class="form-check-label" for="simple-text">
            Simple text
            <small class="d-block opacity-75">Clear, plain font</small>
          </label>
        </div>
      </li>
      <li class="px-3 py-1" @click.stop>
        <div class="form-check form-switch mb-0">
          <input id="reduce-motion" class="form-check-input" type="checkbox" role="switch"
                 :checked="reduceMotion" @change="setReduceMotion($event.target.checked)">
          <label class="form-check-label" for="reduce-motion">
            Reduce motion
            <small class="d-block opacity-75">Stops animations</small>
          </label>
        </div>
      </li>
      <li class="px-3 py-1" @click.stop>
        <div class="form-check form-switch mb-0">
          <input id="shortcuts" class="form-check-input" type="checkbox" role="switch"
                 :checked="shortcutsOn" @change="setShortcuts($event.target.checked)">
          <label class="form-check-label" for="shortcuts">
            [ key shortcut
            <small class="d-block opacity-75">Shows or hides side nav</small>
          </label>
        </div>
      </li>
      <li class="px-3 py-1" @click.stop>
        <div class="form-check form-switch mb-0">
          <input id="mute" class="form-check-input" type="checkbox" role="switch"
                 :checked="muted" @change="toggleMute($event.target.checked)">
          <label class="form-check-label" for="mute">
            Mute sound
            <small class="d-block opacity-75">Clicks and read aloud</small>
          </label>
        </div>
      </li>
      <li v-if="speechSupported" @click.stop>
        <button type="button" class="dropdown-item" :disabled="muted" @click="speaking ? stopReading() : readPage()">
          {{ speaking ? '■ Stop reading' : '▶ Read page aloud' }}
          <small class="d-block opacity-75">{{ muted ? 'Sound is muted' : 'Text to speech' }}</small>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.accessibility-toggle {
  color: var(--accent);
  border: 0;
}

.dropdown-menu {
  --bs-dropdown-link-active-bg: var(--accent);
  --bs-dropdown-link-active-color: var(--bs-body-bg);
}

/* Bootstrap's popper is not used inside a navbar, so line the menu up with the button's right edge */
.dropdown-menu {
  right: 0;
  left: auto;
  min-width: 13.5rem;
}

/* the header is sticky, so on short screens the menu has to scroll by itself */
.dropdown-menu {
  max-height: calc(100vh - 5rem);
  max-height: calc(100dvh - 5rem);
  overflow-y: auto;
}

.dropdown-header { color: var(--bs-secondary-color); }
.dropdown-item.active small { opacity: 1 !important; }

.form-check-input:checked {
  background-color: var(--accent);
  border-color: var(--accent);
}
</style>
