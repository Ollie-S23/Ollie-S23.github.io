import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import EducationView from '@/views/EducationView.vue'
import SocialView from '@/views/SocialView.vue'
import CertificatesView from '@/views/CertificatesView.vue'
import WorkExperienceView from '@/views/WorkExperienceView.vue'
import SkillsView from '@/views/SkillsView.vue'
import ProjectsView from '@/views/ProjectsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/education',
      name: 'education',
      component: EducationView,
      meta: { title: 'Education' },
    },
    {
      path: '/social',
      name: 'social',
      component: SocialView,
      meta: { title: 'Social & Contact' },
    },
    {
      path: '/certificates',
      name: 'certificates',
      component: CertificatesView,
      meta: { title: 'Qualifications' },
    },
    {
      path: '/work-experience',
      name: 'work-experience',
      component: WorkExperienceView,
      meta: { title: 'Work Experience' },
    },
    {
      path: '/skills',
      name: 'skills',
      component: SkillsView,
      meta: { title: 'Skills' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
      meta: { title: 'Projects' },
    },
  ],
  scrollBehavior(to) {
    // 73px is the height of the floating header
    return to.hash ? {
      el: to.hash,
      top: 73,
    } : { top: 0 }
  },
})

// each page has its own tab title
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Oliver Scott` : 'Oliver Scott'
})

export default router
