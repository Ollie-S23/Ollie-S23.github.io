<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { reduceMotion } from '@/composables/useMotion'

const emit = defineEmits(['done'])

const TEXT = 'WELCOME'
const TYPE_DELAY = 120 // ms per letter
const HOLD = 1000 // ms the finished word stays on screen

const typed = ref('')
let timer

function typeNext() {
  if (typed.value.length < TEXT.length) {
    typed.value = TEXT.slice(0, typed.value.length + 1)
    timer = setTimeout(typeNext, TYPE_DELAY)
  } else {
    timer = setTimeout(() => emit('done'), HOLD)
  }
}

onMounted(() => {
  // reduced motion: show the whole word at once, without typing it
  if (reduceMotion.value) typed.value = TEXT
  typeNext()
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="intro-screen" role="main">
    <h1 aria-label="Welcome">{{ typed }}</h1>
  </div>
</template>

<style scoped>
.intro-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  height: 100dvh;
  background: #000;
  color: #fff;
}

h1 { font-size: clamp(2.5rem, 10vw, 5rem); }
</style>
