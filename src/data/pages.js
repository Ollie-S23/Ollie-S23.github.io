import { educationSections } from './educationSections'
import { projectSections } from './projectSections'
import { skillSections } from './skillSections'
import { workExperienceSections } from './workExperienceSections'

// Header links after Home; pages with sections get a sub-menu on small screens
export const pageLinks = [
  {
    path: '/education',
    title: 'Education',
    sections: educationSections,
  },
  {
    path: '/social',
    title: 'Social & Contact',
  },
  {
    path: '/certificates',
    title: 'Qualifications',
  },
  {
    path: '/work-experience',
    title: 'Work Experience',
    sections: workExperienceSections,
  },
  {
    path: '/projects',
    title: 'Projects',
    sections: projectSections,
  },
  {
    path: '/skills',
    title: 'Skills',
    sections: skillSections,
  },
]

export const PLANET_COLOURS = [0x5ee6a8, 0x8278ff, 0x3caadc, 0x29bbbc, 0xb48cff] // the site's accents

// Home has one planet, then each page has one per section
export const planetCount = (page) => page.sections?.length ?? 1

// every third planet has a ring
export const hasRing = (index) => index % 3 === 1
