<script setup>
import { ref, watch } from 'vue'
import { reduceMotion } from '@/composables/useMotion'
import animation from '@/assets/under-construction.gif'

// A GIF cannot be paused, so pausing swaps in a still copy of it.
// Follows the reduce motion setting; the button can still override it.
const paused = ref(reduceMotion.value)
const image = ref(null)
const still = ref(null)

function copyFrame() {
  still.value.width = image.value.naturalWidth
  still.value.height = image.value.naturalHeight
  still.value.getContext('2d').drawImage(image.value, 0, 0)
}

function setPaused(on) {
  // freeze on the frame showing now, once the GIF has loaded
  if (on && !paused.value && image.value.complete) copyFrame()
  paused.value = on
}

watch(reduceMotion, setPaused)
</script>

<template>
  <div class="text-center">
    <h2 class="construction-warning">SITE IS UNDER CONSTRUCTION</h2>
    <img v-show="!paused" ref="image" class="underconstruction-animation" :src="animation"
         alt="Under construction animation" @load="copyFrame">
    <canvas v-show="paused" ref="still" class="underconstruction-animation" role="img"
            aria-label="Under construction picture"></canvas>
    <div>
      <button type="button" class="btn btn-sm btn-outline-secondary animation-toggle" @click="setPaused(!paused)">
        {{ paused ? 'Play animation' : 'Pause animation' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.construction-warning {
  font-weight: bold;
  color: #ff3131;
}

/* Bootstrap's grey outline button is too faint here */
.animation-toggle {
  --bs-btn-color: var(--bs-body-color);
  --bs-btn-border-color: var(--bs-body-color);
  --bs-btn-hover-color: var(--bs-body-bg);
  --bs-btn-hover-bg: var(--bs-body-color);
  --bs-btn-active-color: var(--bs-body-bg);
  --bs-btn-active-bg: var(--bs-body-color);
}

.underconstruction-animation {
  height: 50vh;
  max-width: 100%;
  object-fit: contain;
}
</style>
