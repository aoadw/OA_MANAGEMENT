import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import login from '@/views/login/login.vue'
import frame from '@/views/main/frame.vue'
import my from '@/views/absent/my.vue'
import sub from "@/views/absent/sub.vue"
import publish from '@/views/inform/publish.vue'
import list from '@/views/inform/list.vue'
import detail from '@/views/inform/detail.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'frame',
      component: frame,
      children: [{
        path: 'absent/my',
        name: 'myabsent',
        component: my
      },
      {
        path: 'absent/sub',
        name: 'subabsent',
        component: sub
      },
      {
        path: 'inform/list',
        name: 'inform_list',
        component: list
      },
      {
        path: 'inform/publish',
        name: 'inform_publish',
        component: publish
      },
      {
        path: 'inform/detail',
        name: 'inform_detail',
        component: detail
      },

      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
router.beforeEach((to, from) => {
  // 判断用户是否登录，如果没有登录
  // 并且访问的页面不是登录页面，那么就要跳转到登录页面
  const useStore = useAuthStore()
  if (!useStore.is_login && to.name != 'login') {
    return { name: 'login' }
  }
})

export default router
