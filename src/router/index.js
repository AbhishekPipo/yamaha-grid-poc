import { createRouter, createWebHistory } from 'vue-router'
import DashboardGrid from '@/components/DashboardGrid.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardGrid,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
