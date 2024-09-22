import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/stringstops',
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
