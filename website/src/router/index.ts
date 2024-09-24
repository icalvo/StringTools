import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'stringstops',
      component: () => import('@/StringStopsView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/AboutView.vue')
    }
  ]
})

export default router
