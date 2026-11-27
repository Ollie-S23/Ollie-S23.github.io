<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderTools from '@/components/HeaderTools.vue'
import { currentSection, selectSection } from '@/composables/useScrollSpy'
import { pageLinks } from '@/data/pages'


const route = useRoute()
const router = useRouter()
const open = ref(false)

// Bootstrap's lg breakpoint, where the links sit in one row
const large = window.matchMedia('(min-width: 992px)')
const wide = ref(large.matches)
const onWidthChange = (event) => (wide.value = event.matches)
large.addEventListener('change', onWidthChange)
onBeforeUnmount(() => large.removeEventListener('change', onWidthChange))

// Close the collapsed menu after navigating
watch(() => route.fullPath, () => (open.value = false))

const sectionLink = (path, id) => ({
  path,
  hash: `#${id}`,
})

// The router ignores a link to the current address, so scroll there ourselves
function goToSection(path, id) {
  open.value = false
  selectSection(id)
  if (route.fullPath === router.resolve(sectionLink(path, id)).fullPath) {
    document.getElementById(id)?.scrollIntoView()
  }
}
</script>

<template>
  <header class="sticky-top">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/" translate="no">Oliver Scott</RouterLink>
        <!-- placed here or after the links, so keyboard order matches what is on screen -->
        <HeaderTools v-if="!wide" class="ms-auto me-2" />
        <button class="navbar-toggler" type="button" aria-label="Toggle navigation"
                :aria-expanded="open" @click="open = !open">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" :class="{ show: open }">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" exact-active-class="active" to="/">Home</RouterLink>
            </li>
            <li v-for="page in pageLinks" :key="page.path" class="nav-item">
              <RouterLink class="nav-link" exact-active-class="active" :to="page.path">
                {{ page.title }}
              </RouterLink>

              <!-- Replaces the side nav below the lg breakpoint -->
              <ul v-if="page.sections" class="list-unstyled border-start ms-2 mb-2 d-lg-none">
                <li v-for="section in page.sections" :key="section.id">
                  <RouterLink class="nav-link ps-3" :to="sectionLink(page.path, section.id)"
                              :translate="section.keepName ? 'no' : undefined"
                              :class="{ 'active fw-bold': currentSection === section.id }"
                              active-class="" exact-active-class=""
                              @click="goToSection(page.path, section.id)">
                    {{ section.title }}
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <HeaderTools v-if="wide" />
      </div>
    </nav>
  </header>
</template>
