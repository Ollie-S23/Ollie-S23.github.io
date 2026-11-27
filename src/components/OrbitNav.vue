<script setup>
import { onBeforeUnmount } from 'vue'
import { hasRing, pageLinks, PLANET_COLOURS, planetCount } from '@/data/pages'
import { peek } from '@/composables/usePeek'

// each link takes the colour (and ring) of the planet its page flies to
let first = 1 // planet 0 belongs to Home
const planets = pageLinks.map((page) => {
  const index = first
  first += planetCount(page)
  return {
    path: page.path,
    title: page.title,
    colour: `#${PLANET_COLOURS[index % PLANET_COLOURS.length].toString(16).padStart(6, '0')}`,
    ringed: hasRing(index),
  }
})

// first half sits left of the panel, second half right
const half = Math.ceil(planets.length / 2)
const sides = [
  {
    name: 'left',
    x: -1,
    links: planets.slice(0, half),
  },
  {
    name: 'right',
    x: 1,
    links: planets.slice(half),
  },
]

const lookAt = (x, row) => (peek.value = {
  x,
  y: 1 - row,
})
const lookAway = () => (peek.value = null)
onBeforeUnmount(lookAway)
</script>

<template>
  <nav class="orbit-nav" aria-label="Pages">
    <ul v-for="side in sides" :key="side.name" :class="side.name">
      <li v-for="(planet, row) in side.links" :key="planet.path" :style="{ '--planet': planet.colour }">
        <RouterLink class="orb-link" :to="planet.path" @mouseenter="lookAt(side.x, row)" @focus="lookAt(side.x, row)"
                    @mouseleave="lookAway" @blur="lookAway">
          <span class="orb" :class="{ ringed: planet.ringed }" aria-hidden="true"></span>
          <span class="orb-label">{{ planet.title }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* small or short screens: a grid of planets above the content */
.orbit-nav {
  display: grid;
  grid-template-columns: 1fr;
  gap: .75rem;
  padding: 4.5rem .5rem .75rem; /* the top row is for the theme and accessibility buttons */
}

ul {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.orb-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .6rem;
  color: var(--bs-body-color);
  text-align: center;
  text-decoration: none;
}

.orb {
  position: relative;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, #fff 0 3%, var(--planet) 35%,
    color-mix(in srgb, var(--planet), #000 65%) 100%);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--planet) 16%, transparent),
    0 0 24px color-mix(in srgb, var(--planet) 45%, transparent);
  animation: bob 6s ease-in-out infinite;
  transition: scale .25s;
}

.orb.ringed::after {
  content: "";
  position: absolute;
  inset: 36% -30%;
  border: 3px solid color-mix(in srgb, var(--planet) 75%, transparent);
  border-radius: 50%;
  rotate: -18deg;
}

/* a moon that circles the planet being pointed at */
.orb::before {
  content: "";
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: radial-gradient(circle 4px at 50% 4px, #b9c0cc 95%, transparent);
  opacity: 0;
}

.orb-link:hover .orb,
.orb-link:focus-visible .orb { scale: 1.18; }

.orb-link:hover .orb::before,
.orb-link:focus-visible .orb::before {
  opacity: 1;
  animation: circle 2.4s linear infinite;
}

.orb-label {
  padding: .15rem .6rem;
  border-radius: .75rem;
  background: color-mix(in srgb, var(--bs-body-bg) 82%, transparent);
  font-size: .85rem;
}

li:nth-child(2) .orb { animation-delay: -2s; }
li:nth-child(3) .orb { animation-delay: -4s; }

@keyframes bob {
  50% { translate: 0 -6px; }
}

@keyframes circle {
  to { rotate: 1turn; }
}

/* large screens: planets in orbit either side of the 700px panel */
@media (min-width: 992px) and (min-height: 600px) {
  .orbit-nav {
    display: block;
    padding: 0;
  }

  /* the orbit line, passing behind the panel */
  .orbit-nav::before {
    content: "";
    position: fixed;
    z-index: -1;
    top: 15%;
    left: 50%;
    width: min(1150px, 94vw);
    height: 62%;
    translate: -50% 0;
    border: 1px dashed color-mix(in srgb, var(--bs-body-color) 28%, transparent);
    border-radius: 50%;
    pointer-events: none;
  }

  ul { display: block; }

  li {
    position: fixed;
    z-index: 2;
    width: 8rem;
    --bulge: 0rem;
    --edge: max(.25rem, calc(50% - 350px - 8.5rem - var(--bulge)));
  }

  .left li { left: var(--edge); }
  .right li { right: var(--edge); }
  li:nth-child(1) { top: 19%; }

  li:nth-child(2) {
    top: 40%;
    --bulge: 2.5rem; /* the middle one sits further out, following the orbit */
  }

  li:nth-child(3) { top: 59%; }

  .orb {
    width: 4.25rem;
    height: 4.25rem;
  }
}
</style>

<style>
/* theme and accessibility stay in the top corner while the header is away */
.home-tools {
  position: fixed;
  z-index: 1030;
  top: .75rem;
  right: .75rem;
  padding: .25rem .5rem;
  border: 1px solid var(--glass-edge);
  border-radius: 999px;
  background: color-mix(in srgb, var(--bs-body-bg) 85%, transparent);
  box-shadow: var(--glass-shadow);
}

.home-tools .theme-toggle,
.home-tools .accessibility-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

#app:has(> .orbit-nav) > main.home { margin-top: auto; }
</style>
