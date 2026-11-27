<script setup>
import SectionRail from '@/components/SectionRail.vue'
import TimelineNav from '@/components/TimelineNav.vue'
import { educationSections } from '@/data/educationSections'

</script>

<template>
  <div class="with-timeline">
    <main id="main-content">
      <h1 class="visually-hidden">Education</h1>
      <section id="swinburne">
        <h2 translate="no">Swinburne University of Technology</h2>
        <p class="text-body-secondary">VIC AUSTRALIA<br>2025 - CURRENT</p>
        <p>I am currently studying a Bachelor of Computer Science (Professional), majoring in Game Development and minoring in Web Development. I can work in both front-end and back-end development, where I love to design unique and interesting UI able to convey the page's meaning clearly while creating a distinct image for the page, as well as implementing simple and elegant designs when the project calls for it.</p>
        <p>I am currently delving into learning to create back-ends and link them through HTTP APIs using languages such as Python and Go (Golang). I have started to explore different modern challenges such as the creation of Artificial Intelligence systems, including both their inclusion in a full-stack web solution and machine learning pipelines, which I explored in both Introduction to Artificial Intelligence and Computing Technology Innovation Project.</p>
        <p>I have also started my game development journey within my Artificial Intelligence for Games unit, where I learnt about AI systems within games such as state machines and pathfinding algorithms, and Games Programming, where, within a group of 4 students, I worked with <span translate="no">Qualys</span>, our industry partner, which creates cybersecurity solutions, to create a 2D and 3D game across 8 weeks. I enjoy classes where I can create a final solution using skills and theory that we have looked through within that class. I cannot wait to see where this takes me.</p>
      </section>

      <section id="st-bedes">
        <h2 translate="no">St Bede's College</h2>
        <p class="text-body-secondary">VIC AUSTRALIA<br>2020-2024</p>
        <p>During my years at high school, my Computer Science and programming journey took off. During Years 9 and 10, I took Applied Computing, where we learnt basic computing skills such as HTML and programs such as Adobe's Dreamweaver. Although these classes were simple, they gave me a spark to explore the field.</p>
        <p>During these two years, my school encouraged us to explore our interests and what we might want to do after we graduate; as such, in Year 9 we took part in the Wednesday Program, where we developed real-life skills such as managing a cafe, barista training, serving city-goers, and job training, where we built our first resumes and took part in pseudo interviews. This is where I first thought that I could study Computer Science. In Years 9 and 10, I took part in work experience across two holidays, working at <span translate="no">St Joseph’s Primary School</span> and <span translate="no">Applied EV</span>, and this experience taught me how to work within a real-world team and the norms of a workplace.</p>
        <p>In Years 11 and 12, I pursued General Mathematics and Applied Computing (Programming), aiming to get into <span translate="no">Swinburne</span> after exploring the school in Year 10. In the end, I was able to achieve an ATAR of 79, allowing me to enrol in the professional course.</p>
      </section>

      <section id="nais">
        <h2 translate="no">Nord Anglia International School</h2>
        <p class="text-body-secondary">SH CHINA<br>2015-2020</p>
        <p>At <span translate="no">NAIS</span>, we were encouraged to build critical thinking and studying skills. I give this school credit for my drive for academic achievement and my can-do attitude that I have pushed to build upon across the better half of the last decade, across both my high school and university studies. We were given the opportunity to learn skills that could be taken across different fields, and it was there that I first heard the phrase 'Education is to teach how to think, not to teach facts to memorize and learn'.</p>
        <p>We got the opportunity to partake in cultural programs, where we explored different cultures, peoples, and perspectives. Each year, we took our Project Week trip, where we went to rural parts of China with the goal to better our own experience and help communities less fortunate than ourselves. We explored famous sights and hidden gems, and helped children in kindergartens and primary schools with their Maths and English classes.</p>
        <p>These experiences that I learnt during my primary and early high school days have stuck with me, and I try to continue to grow from them to this day; during my time at <span translate="no">St Bede's</span>, I took part in an Aboriginal exploration trip.</p>
      </section>

      <SectionRail :sections="educationSections" />
    </main>

    <TimelineNav :sections="educationSections" />
  </div>
</template>
