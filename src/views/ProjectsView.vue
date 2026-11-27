<script setup>
import SectionRail from '@/components/SectionRail.vue'
import TimelineNav from '@/components/TimelineNav.vue'
import { projectGroups } from '@/data/projects'
import { projectSections } from '@/data/projectSections'
</script>

<template>
  <div class="with-timeline">
    <main id="main-content">
      <h1 class="visually-hidden">Projects</h1>
      <section v-for="group in projectGroups" :id="group.id" :key="group.id">
        <h2 class="mb-4">{{ group.heading }}</h2>

        <article v-for="project in group.projects" :key="project.name" class="card mb-3">
          <div class="card-body">
            <h3 class="card-title h5">{{ project.name }}</h3>
            <p class="card-subtitle text-body-secondary mb-2">{{ project.tech }}</p>
            <p class="card-text">{{ project.text }}</p>
            <a v-if="project.link" :href="project.link" class="card-link" target="_blank"
               rel="noopener noreferrer">View on GitHub</a>
          </div>
        </article>
      </section>

      <SectionRail :sections="projectSections" />
    </main>

    <TimelineNav :sections="projectSections" />
  </div>
</template>
