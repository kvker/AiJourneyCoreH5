import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { auth, db } from '@/services/cloud'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        try {
          const { message, data } = await db.collection('Role').where({
            userIds: auth.currentUser?.uid,
          })
            .field({
              name: true,
            })
            .get()
          if (message) {
            throw new Error(message)
          }
          console.log('当前用户角色： ' + (data[0]?.name || '无角色'))
          const passed = data[0]?.name === 'superAdmin'
          if (passed) {
            next()
          } else {
            alert('抱歉，您没有权限进入管理系统')
            await auth.signOut()
            next('/')
          }
        } catch (error) {
          alert(error)
          await auth.signOut()
          next('/')
        }
      },
      children: [
        {
          path: 'chat',
          component: () => import('@/components/Chat.vue')
        },
        {
          path: 'mine',
          component: () => import('@/components/Mine.vue')
        },
      ]
    },
  ]
})

export default router
