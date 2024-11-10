import { createRouter, createWebHistory } from 'vue-router'
import DashboardGrid from '@/components/DashboardGrid.vue'
import AddWidget from '@/views/AddWidget.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardGrid,
  },
  {
    path: '/add-widget',
    name: 'AddWidget',
    component: AddWidget, // Add the AddWidget route here
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
