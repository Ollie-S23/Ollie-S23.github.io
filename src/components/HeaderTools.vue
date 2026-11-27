<script setup>
import sunIcon from '@/assets/sun.svg'
import moonIcon from '@/assets/moon.svg'
import { theme, toggleTheme } from '@/composables/useTheme'
import AccessibilityMenu from '@/components/AccessibilityMenu.vue'
</script>

<template>
  <div class="d-flex align-items-center gap-1">
    <button type="button" class="btn theme-toggle p-1"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            :title="theme === 'dark' ? 'Light mode' : 'Dark mode'" @click="toggleTheme">
      <img :src="theme === 'dark' ? sunIcon : moonIcon" alt="" width="24" height="24" class="d-block">
    </button>
    <AccessibilityMenu />
  </div>
</template>
