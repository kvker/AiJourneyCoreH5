import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const routes = [
  {
    path: '/',
    component: HomeView,
    children: [
      {
        path: '', // 默认子路由，重定向到total
        name: 'Home',
        component: () => import('@/components/Home.vue')
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/components/Chat.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
