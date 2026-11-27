<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="px-4">
    <p>Want to ask a question? <RouterLink to="/social">Get in contact</RouterLink></p>
    <p>Why is there no resumes? It includes personal info. You can request it by making contact</p>
    <p>Please be respectful. Any inappropriate behaviour this page will be taken down</p>
    <p>&copy; {{ currentYear }} <span translate="no">Oliver Scott</span>. All rights reserved.</p>
  </footer>
</template>
