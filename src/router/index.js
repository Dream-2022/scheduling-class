import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

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

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRouter, // 初始化时使用空的路由数组
})

const setRouter = async () => {
  return new Promise(resolve => {
    const userStore = useUserStore()
    let identity = userStore.user.identity
    console.log(identity)
    if (identity === 'student') {
      router.addRoute({
        path: '/',
        name: 'home',
        redirect: '/home/student',
        component: () => import('../views/index.vue'),
        children: [
          {
            path: 'student',
            name: 'student',
            component: () => import('../views/student/index.vue'),
          },
        ],
      })
    } else if (identity === 'teacher') {
      router.addRoute({
        path: '/',
        name: 'home',
        redirect: '/home/teacher',
        component: () => import('../views/index.vue'),
        children: [
          {
            path: 'teacher',
            name: 'teacher',
            component: () => import('../views/teacher/index.vue'),
          },
        ],
      })
    } else if (identity === 'manager') {
      router.addRoute({
        path: '/',
        name: 'home',
        redirect: '/manager/mainPage',
        component: () => import('../views/index.vue'),
        children: [
          {
            path: 'manager/mainPage',
            name: 'mainPage',
            component: () => import('../views/manager/mainPage/index.vue'),
          },
          {
            path: 'manager/functionPage',
            name: 'functionPage',
            redirect: '/functionPage/course',
            component: () => import('../views/manager/functionPage/index.vue'),
            children: [
              {
                path: 'course',
                component: () => import('../views/manager/functionPage/coursePage/index.vue'),
              },
              {
                path: 'exam',
                component: () => import('../views/manager/functionPage/examPage/index.vue'),
              },
              {
                path: 'information',
                component: () => import('../views/manager/functionPage/informationPage/index.vue'),
              },
              {
                path: 'analysis',
                component: () => import('../views/manager/functionPage/analysisPage/index.vue'),
              },
              {
                path: 'application',
                component: () => import('../views/manager/functionPage/applicationPage/index.vue'),
              },
              {
                path: 'manage',
                component: () => import('../views/manager/functionPage/managePage/index.vue'),
              },
            ],
          },
        ],
      })
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
  clearRouter()
  console.log('第二步', userStore.user)
  // 如果目标是登录页且用户已经登录，则跳转到首页或其他页面
  if (to.name === 'login') {
    if (userStore.user !== null) {
      next()
    }
    next() // 否则正常进入登录页
    return
  } else if (userStore.user === null) {
    console.log('未登录跳转到登录页')
    next({ name: 'login' })
    return
  } else {
    console.log(to, to.path)
    if (userStore.getIsLogin() === false) {
      console.log('登录状态', to.path)
      const res = await setRouter()
      if (res === true) {
        if (to.name === 'home') {
          next({ name: 'home' })
        } else {
          next({ path: to.path })
        }
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
  console.log('第一步')
  router.routes = basicRouter
}

export default router
