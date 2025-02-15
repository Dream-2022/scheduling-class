import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [], // 初始化时使用空的路由数组
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
        // redirect: '/page/student',
        component: () => import('../views/index.vue'),
        // children: [
        //   {
        //     path: 'mainPage',
        //     name: 'mainPage',
        //     component: () => import('../views/student/mainPage/index.vue'),
        //   },
        // ],
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
    resolve(true)
  })
}

// 配置路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 如果目标是登录页且用户已经登录，则跳转到首页或其他页面
  if (to.name === 'login') {
    if (userStore.user !== null) {
      next({ name: 'home' }) // 假设你有一个首页（home）路由
      return
    }
    next() // 否则正常进入登录页
    return
  } else if (userStore.user === null) {
    next({ name: 'login' })
    return
  } else {
    if (userStore.getIsLogin() === false) {
      const res = await setRouter()
      if (res === true) {
        next({ ...to, replace: true }) // 跳转并替换历史记录
      } else {
        next(false) // 终止导航
      }
    } else {
      next()
    }
  }
})

// 初始化基本路由
export const clearRouter = () => {
  router.routes = basicRouter
}

export default router
