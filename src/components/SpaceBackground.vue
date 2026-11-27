<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as THREE from 'three'
import { scrollPosition } from '@/composables/useScrollSpy'
import { theme } from '@/composables/useTheme'
import { reduceMotion } from '@/composables/useMotion'
import { peek } from '@/composables/usePeek'
import { hasRing, pageLinks, PLANET_COLOURS, planetCount } from '@/data/pages'

// Planets along one flight path. Each page after Home visits the first planet of its group:
// changing page flies there, and moving through its sections orbits around it.
// Same order as the header links; the number is how many sections (and planets) the page has.
const PAGES = [['/', 1], ...pageLinks.map((page) => [page.path, planetCount(page)])]
const PLANETS = PAGES.reduce((total, [, count]) => total + count, 0)

const SPACING = 18 // distance between planets
const VIEW = 11 // distance from the camera to the first planet on Home
const ORBIT = 0.9 // radians the camera swings around a planet for each section

const route = useRoute()

// Which planet this page is about (null: the open view on Home), and how far round it we are
const view = computed(() => {
  let first = 0
  for (const [path, count] of PAGES) {
    if (path === route.path && path !== '/') {
      const progress = count > 1 ? Math.min(scrollPosition.value, count - 1) : 0
      return {
        planet: first,
        angle: (progress - (count - 1) / 2) * ORBIT,
      }
    }
    first += count
  }
  return {
    planet: null,
    angle: 0,
  }
})

const canvas = ref(null)
let cleanUp = () => {}

// Repeatable "random" numbers, so the sky looks the same on every visit
function seeded(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
}

function makeStars(count, random) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions.set([
      (random() - 0.5) * 120,
      (random() - 0.5) * 80,
      20 - random() * (PLANETS * SPACING + 80),
    ], i * 3)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  // square points suit the pixel theme
  return new THREE.Points(geometry, new THREE.PointsMaterial({
    color: 0xdfe8ff,
    size: 0.14,
    fog: false,
  }))
}

function makePlanet(index, random) {
  const colour = new THREE.Color(PLANET_COLOURS[index % PLANET_COLOURS.length])
  const radius = 1.5 + random() * 0.8

  // low-poly surface, each face a slightly different shade
  const geometry = new THREE.IcosahedronGeometry(radius, 3).toNonIndexed()
  const shades = []
  for (let face = 0; face < geometry.attributes.position.count / 3; face++) {
    const shade = colour.clone().multiplyScalar(0.35 + random() * 0.55)
    for (let corner = 0; corner < 3; corner++) shades.push(shade.r, shade.g, shade.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(shades, 3))

  const planet = new THREE.Group()
  const body = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
  }))
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.18, 32, 32),
    new THREE.MeshBasicMaterial({
      color: colour,
      transparent: true,
      opacity: 0.09,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  planet.add(body, glow)

  if (hasRing(index)) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(radius * 1.45, radius * 2.1, 64),
      new THREE.MeshBasicMaterial({
        color: colour,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      }),
    )
    ring.rotation.set(Math.PI / 2.4, 0.3, 0)
    planet.add(ring)
  }

  let moon
  if (index % 3 !== 1) {
    moon = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius * 0.22, 1),
      new THREE.MeshStandardMaterial({
        color: 0xb9c0cc,
        flatShading: true,
      }),
    )
    planet.add(moon)
  }

  return {
    planet,
    body,
    moon,
    radius,
    phase: random() * Math.PI * 2,
  }
}

function startScene() {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    alpha: true,
    antialias: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x1b1d21, VIEW + 6, VIEW + SPACING * 3) // far planets fade into the charcoal
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400)
  const sun = new THREE.DirectionalLight(0xffffff, 2.2)
  sun.position.set(-4, 5, 6)
  const sky = new THREE.HemisphereLight(0xbfd8ff, 0x101216, 0.9)
  scene.add(sky, sun)

  const random = seeded(2026)
  const stars = makeStars(window.innerWidth < 576 ? 900 : 2200, random)
  scene.add(stars)
  const planets = Array.from({ length: PLANETS }, (_, i) => makePlanet(i, random))
  planets.forEach(({ planet }) => scene.add(planet))

  const mouse = {
    x: 0,
    y: 0,
  }
  const size = {
    width: 1,
    height: 1,
  }
  let current // where the camera is now
  let frame

  // Light mode is lit by the bright star (top right), so the planets and sky brighten
  function applyTheme() {
    const light = theme.value === 'light'
    scene.fog.color.set(light ? 0xe2e6f2 : 0x1b1d21)
    stars.material.color.set(light ? 0x3a435d : 0xdfe8ff)
    sky.color.set(light ? 0xffffff : 0xbfd8ff)
    sky.groundColor.set(light ? 0x8a90b0 : 0x101216)
    sky.intensity = light ? 2 : 0.9
    sun.position.set(light ? 5 : -4, 5, 6)
    sun.color.set(light ? 0xfff1d0 : 0xffffff)
  }

  function layout() {
    const { clientWidth: width, clientHeight: height } = canvas.value
    Object.assign(size, {
      width,
      height,
    })
    renderer.setSize(width, height, false)
    camera.aspect = width / height

    // planets sit towards the screen edges, alternating sides
    const halfWidth = Math.tan(THREE.MathUtils.degToRad(25)) * VIEW * camera.aspect
    const scale = THREE.MathUtils.clamp(camera.aspect, 0.55, 1)
    planets.forEach(({ planet }, i) => {
      const side = i % 2 ? 1 : -1
      planet.position.set(side * halfWidth * 0.82, side * -1.6, -i * SPACING)
      planet.scale.setScalar(scale)
    })
  }

  // Where the camera wants to be. screenX/Y: where on screen the point it looks at appears
  function destination() {
    const { planet: index, angle } = view.value
    if (index === null) {
      // lean towards the orbit-menu planet being pointed at
      const lean = reduceMotion.value ? null : peek.value
      return {
        focus: lean ? new THREE.Vector3(lean.x * 2.5, lean.y * 1.5, 0) : new THREE.Vector3(),
        angle: 0,
        distance: lean ? VIEW - 3 : VIEW,
        rise: 0,
        screenX: 0.5,
        screenY: 0.5,
      }
    }
    const { planet, radius } = planets[index]
    const { width, height } = size
    const wide = width >= 992
    // large screens: planet in the space left of the text; smaller: above it
    const diameter = wide ? Math.min(width * 0.22, height * 0.55) : Math.min(width * 0.5, height * 0.2)
    const distance = (radius * planet.scale.x * height) / (diameter * Math.tan(THREE.MathUtils.degToRad(25)))
    return {
      focus: planet.position.clone(),
      angle,
      distance: Math.min(distance, 14),
      rise: 0.12,
      screenX: wide ? 0.15 : 0.5,
      screenY: wide ? 0.52 : 0.22,
    }
  }

  function draw(time = 0) {
    const seconds = reduceMotion.value ? 0 : time / 1000
    const goal = destination()

    // glide towards the destination
    let travel = 0
    if (!current || reduceMotion.value) {
      current = goal
    } else {
      current.focus.lerp(goal.focus, 0.045)
      for (const key of ['angle', 'distance', 'rise', 'screenX', 'screenY']) {
        current[key] += (goal[key] - current[key]) * 0.05
      }
      travel = current.focus.distanceTo(goal.focus)
    }

    const { focus, angle, distance, rise, screenX, screenY } = current
    camera.position.set(
      focus.x + Math.sin(angle) * distance + (reduceMotion.value ? 0 : mouse.x * 0.6),
      // climb during long flights, to pass over the planets in between
      focus.y + rise * distance + Math.min(travel * 0.12, 5) - (reduceMotion.value ? 0 : mouse.y * 0.4),
      focus.z + Math.cos(angle) * distance,
    )
    camera.rotation.set(0, angle, 0)
    camera.rotateX(-Math.atan(rise))
    const { width, height } = size
    camera.setViewOffset(width, height, width * (0.5 - screenX), height * (0.5 - screenY), width, height)

    planets.forEach(({ body, moon, radius, phase }) => {
      body.rotation.y = phase + seconds * 0.15
      moon?.position.set(
        Math.cos(phase + seconds * 0.5) * radius * 1.8,
        Math.sin(phase + seconds * 0.5) * radius * 0.5,
        Math.sin(phase + seconds * 0.5) * radius * 1.8,
      )
    })
    renderer.render(scene, camera)
  }

  function loop(time) {
    draw(time)
    frame = requestAnimationFrame(loop)
  }

  // animate, or draw a single still picture when reduced motion is on
  function run() {
    cancelAnimationFrame(frame)
    if (reduceMotion.value) draw()
    else frame = requestAnimationFrame(loop)
  }

  const onResize = () => { layout(); run() }
  const onMouseMove = (event) => {
    mouse.x = event.clientX / window.innerWidth - 0.5
    mouse.y = event.clientY / window.innerHeight - 0.5
  }
  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  const stopMotion = watch(reduceMotion, run)
  const stopWatching = watch(view, () => reduceMotion.value && draw(), { flush: 'post' })

  const stopTheme = watch(theme, () => { applyTheme(); run() })

  applyTheme()
  layout()
  run()

  return () => {
    cancelAnimationFrame(frame)
    stopWatching()
    stopTheme()
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', onMouseMove)
    stopMotion()
    scene.traverse((object) => {
      object.geometry?.dispose()
      object.material?.dispose()
    })
    renderer.dispose()
  }
}

onMounted(() => {
  try {
    cleanUp = startScene()
  } catch {
    // no WebGL: the plain gradient background is still there
  }
})
onBeforeUnmount(() => cleanUp())
</script>

<template>
  <div v-if="theme === 'light'" class="bright-star" aria-hidden="true"></div>
  <canvas ref="canvas" class="space-background" aria-hidden="true"></canvas>
</template>

<style scoped>
.space-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* light mode only: a bright star behind everything, drawn before the canvas so planets pass in front */
.bright-star {
  position: fixed;
  z-index: -1;
  top: 20vh;
  right: 12vw;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, #fff 0 45%, #fff3c4 70%, #ffd978 100%);
  box-shadow: 0 0 3rem 1.5rem #fff6d2,
    0 0 9rem 5rem rgba(255, 214, 120, .65),
    0 0 22rem 12rem rgba(255, 230, 170, .5);
}
</style>
