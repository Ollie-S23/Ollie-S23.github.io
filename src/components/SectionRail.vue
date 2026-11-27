<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { currentSection, scrollPosition, selectSection } from '@/composables/useScrollSpy'
import { playClick } from '@/composables/useClickSound'

const props = defineProps({
  sections: {
    type: Array,
    required: true,
  },
})

// Inline copy of the side nav, with a circle beside each section heading
const rail = ref(null)
const centres = ref([])
let observer

function measure() {
  centres.value = props.sections.map(({ id }) => {
    const heading = document.getElementById(id)?.querySelector('h2')
    return heading ? heading.offsetTop + heading.offsetHeight / 2 : 0
  })
}

onMounted(() => {
  // re-measure when text reflows (resize, fonts loading)
  observer = new ResizeObserver(measure)
  observer.observe(rail.value.parentElement)
})
onBeforeUnmount(() => observer?.disconnect())

const travellerTop = computed(() => {
  const i = Math.floor(scrollPosition.value)
  const from = centres.value[i] ?? 0
  const to = centres.value[i + 1] ?? from
  return from + (to - from) * (scrollPosition.value - i)
})

const lineStyle = computed(() => ({
  top: `${centres.value[0] ?? 0}px`,
  height: `${(centres.value.at(-1) ?? 0) - (centres.value[0] ?? 0)}px`,
}))
</script>

<template>
  <div ref="rail" class="section-rail">
    <span class="line" :style="lineStyle"></span>
    <a v-for="(section, index) in sections" :key="section.id" class="circle"
       :class="{ active: currentSection === section.id }" :href="`#${section.id}`"
       :style="{ top: `${centres[index] ?? 0}px` }" :aria-label="section.title" :translate="section.keepName ? 'no' : undefined"
       @click="selectSection(section.id); playClick(880)"></a>
    <span class="dot" :style="{ top: `${travellerTop}px` }" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
/* only shown on large screens */
.section-rail { display: none; }

@media (min-width: 1200px) {
  .section-rail { display: block; }
}

.line, .circle, .dot {
  position: absolute;
  left: 2.25rem;
  transform: translateX(-50%);
}

.line {
  width: 2px;
  background: rgba(255, 255, 255, .3);
  box-shadow: 0 0 0 4px rgba(94, 230, 168, .1);
}

.circle, .dot {
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.circle {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, .13);
  background: radial-gradient(circle at 32% 28%, #8d949f 0 10%, #4a4f58 45%, #2c3036 100%);
  box-shadow: 0 0 0 5px rgba(94, 230, 168, .1), inset 0 2px 4px rgba(255, 255, 255, .2);
  transition: box-shadow .3s;
}

.circle.active {
  background: radial-gradient(circle at 32% 28%, #d9ffee 0 10%, #5ee6a8 45%, #1f9c68 100%);
  box-shadow: 0 0 0 7px rgba(94, 230, 168, .22), 0 0 18px rgba(94, 230, 168, .5);
}

.dot {
  width: 10px;
  height: 10px;
  background: #fff;
  border: 2px solid #5ee6a8;
  box-shadow: 0 0 10px 3px rgba(94, 230, 168, .7);
  pointer-events: none;
  transition: top .15s linear;
}
</style>
