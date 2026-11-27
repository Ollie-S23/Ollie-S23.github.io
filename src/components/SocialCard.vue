<script setup>
import githubIcon from '@/assets/github.png'
import linkedinIcon from '@/assets/linkedin.png'
import outlookIcon from '@/assets/outlook.png'

const email = 'oliverscott.business@gmail.com'

const platforms = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/oliverscottmelbourne',
    icon: linkedinIcon,
    detail: 'www.linkedin.com/in/oliverscottmelbourne',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Ollie-S23',
    icon: githubIcon,
    detail: 'github.com/Ollie-S23',
  },
]
</script>

<template>
  <div class="social-banner">
    <h2>Reach Out Across My Platforms</h2>
    <ul class="list-unstyled mb-0">
      <li>
        <div>
          <a class="social-link" :href="`mailto:${email}`">Email</a>
          <div class="social-detail" translate="no">{{ email }}</div>
        </div>
        <img class="social-icon" :src="outlookIcon" alt="" loading="lazy">
      </li>
      <li v-for="platform in platforms" :key="platform.name">
        <div>
          <a class="social-link" :href="platform.url" target="_blank" rel="noopener noreferrer" translate="no">
            {{ platform.name }}
          </a>
          <div v-if="platform.detail" class="social-detail" translate="no">{{ platform.detail }}</div>
        </div>
        <img class="social-icon" :src="platform.icon" alt="" loading="lazy">
      </li>
    </ul>
  </div>
</template>

<style scoped>
.social-banner {
  width: 420px; /* sets how wide the page panel is */
  max-width: 100%;
  margin: 0 auto;
  padding: var(--space);
  border-radius: 10px;
  background: #29bbbc;
  color: #111528;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-size: 1.25rem;
}

h2 {
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
}

li > :first-child { min-width: 0; }

.social-link {
  color: inherit;
  text-decoration: none;
}

.social-link:hover {
  color: #0071ff;
  text-decoration: underline;
}

.social-detail {
  font-size: 0.85rem;
  overflow-wrap: anywhere;
}

.social-icon {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  object-fit: contain;
}
</style>
