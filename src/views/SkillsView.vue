<script setup>
import SectionRail from '@/components/SectionRail.vue'
import TimelineNav from '@/components/TimelineNav.vue'
import { skillSections } from '@/data/skillSections'
</script>

<template>
  <div class="with-timeline">
    <main id="main-content">
      <h1 class="visually-hidden">Skills</h1>
      <section id="computer-science">
        <h2>Computer Science</h2>
        <ul>
          <li>Markup, Scripting, and Programming Languages: <span translate="no">C#, Python, JavaScript, HTML, CSS, SQL, PHP, Kotlin, XML, Bash shell script, Go, TypeScript.</span></li>
          <li>Frameworks and Tools: <span translate="no">Git, Github, Docker, VueJS, Jetpack Compose, React, Bootstrap, Vite, Vue Router, FastAPI, Room, pyglet, Jira, XAMPP, phpMyAdmin, PyInstaller.</span></li>
          <li>Databases: <span translate="no">MySQL, MariaDB, PostgreSQL</span>, database design (ERDs, normalisation).</li>
          <li>Other: Object-Oriented Programming, Front-end and Back-end development, Maya, Android Studio, Unity Game Engine, Artificial Intelligence, REST API design, PHP/MySQL web apps, machine learning pipelines, neural networks (LSTM, GRU), A* and other pathfinding, state machines, UML diagrams, game audio, in-game economy systems.</li>
        </ul>
      </section>

      <section id="general">
        <h2>General Key skills</h2>
        <ul>
          <li>Canva design, Windows 365/Office suite, Google Workspace, Adobe Creative Cloud.</li>
          <li>Operating Systems: <span translate="no">Windows, Linux.</span></li>
          <li>Time management, research skills using Google Scholar, problem-solving.</li>
          <li>Project management, teamwork and communication, technical writing, testing, mentoring and supervision.</li>
        </ul>
      </section>

      <SectionRail :sections="skillSections" />
    </main>

    <TimelineNav :sections="skillSections" />
  </div>
</template>
