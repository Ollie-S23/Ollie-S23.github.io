<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IntroScreen from './components/IntroScreen.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import HeaderTools from './components/HeaderTools.vue'
import OrbitNav from './components/OrbitNav.vue'
import { design } from './composables/useDesign'
import { homeHeader } from './composables/useHomeHeader'

// Loaded separately, so Three.js does not hold up the page
const SpaceBackground = defineAsyncComponent(() => import('./components/SpaceBackground.vue'))

// Intro plays on the home page, the first time it is opened in a visit (browser tab session)
const STORAGE_KEY = 'intro-seen'
const route = useRoute()

// shown above the content in the text design, like the command that printed the page
const command = computed(() => `cat ${route.path.slice(1) || 'home'}.txt`)
// Home in the default design swaps the header for planets, unless the visitor wants the header
const orbitHome = computed(() => route.path === '/' && design.value === 'default' && !homeHeader.value)

const ready = ref(false)
useRouter().isReady().then(() => (ready.value = true))

const seen = ref(readSeen())
const showIntro = computed(() => !seen.value && route.path === '/')

function readSeen() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Skip link: move focus past the header to the page content
function skipToContent() {
  const main = document.getElementById('main-content')
  main?.setAttribute('tabindex', '-1')
  main?.focus({ preventScroll: true })
  window.scrollTo({ top: 0 })
}

function markSeen() {
  seen.value = true
  try {
    sessionStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // storage blocked: the intro is only skipped until the next reload
  }
}
</script>

<template>
  <template v-if="ready">
    <IntroScreen v-if="showIntro" @done="markSeen" />
    <template v-else>
      <SpaceBackground v-if="design === 'default'" />
      <a class="skip-link visually-hidden-focusable" href="#main-content" @click.prevent="skipToContent">
        Skip to content
      </a>
      <template v-if="orbitHome">
        <div class="home-tools">
          <HeaderTools />
        </div>
        <OrbitNav />
      </template>
      <AppHeader v-else />
      <p class="terminal-prompt" aria-hidden="true" translate="no">visitor@oliverscott:~$ {{ command }}</p>
      <RouterView />
      <AppFooter />
    </template>
  </template>
</template>
