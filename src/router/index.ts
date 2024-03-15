import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
          component: () => import('@/components/Chat.vue')
        },
      ]
    },
  ]
})

export default router
