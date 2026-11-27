<script setup>
import SectionRail from '@/components/SectionRail.vue'
import TimelineNav from '@/components/TimelineNav.vue'
import { workExperienceSections } from '@/data/workExperienceSections'
</script>

<template>
  <div class="with-timeline">
    <main id="main-content">
      <h1 class="visually-hidden">Work Experience</h1>
      <section id="applied-ev">
        <h2>Intern for <span translate="no">Applied EV</span></h2>
        <p class="text-body-secondary">Victoria<br>November 2022</p>
        <p>Worked along software and hardware developers to test autonomous vehicles in outdoor environments to see how it performed during different conditions and software iterations.</p>
        <p>Recorded test results performed on vehicle tests in a shared spreadsheet.</p>
        <p>Looked over CAD designs to ensure the accuracy of measurements during designing of vehicle hardware.</p>
        <p>General cleaning duties across a factory ensuring that the facility and machinery was clean.</p>
        <p>Communicated between teams to ensure that communication was clear when the teams were unable to communicate by themselves.</p>
      </section>

      <section id="st-josephs">
        <h2>Volunteering at <span translate="no">St Joseph’s Primary School</span></h2>
        <p class="text-body-secondary">Black Rock, Victoria<br>August 2021</p>
        <p>Worked alongside teaching staff as a teacher’s assistant to help manage and educate primary school students in classes such as numeracy and literacy</p>
        <p>Managed primary school students between class buildings and during lunchtime supervision</p>
      </section>

      <SectionRail :sections="workExperienceSections" />
    </main>

    <TimelineNav :sections="workExperienceSections" />
  </div>
</template>
