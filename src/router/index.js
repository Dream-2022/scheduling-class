import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/index.vue'),
      children: {},
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

const basicRouter = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/basic/login/index.vue'),
  },
  {
    path: '/404',
    name: 'NoPage404',
    component: () => import('../views/basic/noPage/index.vue'),
    hidden: true,
  },
]

const setRouter = async () => {
  return new Promise(resolve => {
    const userStore = useUserStore()
    clearRouter()
    let identity = userStore.user.identity
    console.log(identity)
    if (identity === 'student') {
      router.addRoute({
        path: '/',
        name: 'page',
        redirect: '/page/student',
        component: () => import('../views/index.vue'),
        children: [
          {
            path: 'mainPage',
            name: 'mainPage',
            component: () => import('../views/student/mainPage/index.vue'),
          },
        ],
      })
    } else if (identity === 'teacher') {
      console.log('teacher')
    } else if (identity === 'manager') {
      console.log('manager')
    }
    router.addRoute({
      path: '/:pathMatch(.*)',
      redirect: '/404',
      hidden: true,
    })
    userStore.changeIsLogin(true)
    resolve(true)
  })
}

router.beforeEach(async (to, next) => {
  // 判断有没有登录
  const userStore = useUserStore()
  if (to.name == 'login') {
    next()
    return
  }
  if (userStore.user === null) {
    if (to.name == 'login') {
      next()
    } else {
      router.push('login')
    }
  } else {
    const res = await setRouter()
    if (res === true) {
      next({ ...to, replace: true })
    } else next(false)
    return
  }
})

export const clearRouter = () => {
  router.routes = basicRouter
}

export default router
