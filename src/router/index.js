import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

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
    let identity = userStore.initialize().identity
    console.log(identity)
    console.log(identity === 'STUDENT')
    console.log(identity === 'TEACHER')
    console.log(identity === 'MANAGER')
    if (identity === 'STUDENT') {
      router.addRoute({
        path: '/',
        name: 'home',
        redirect: '/student/mainPage',
        component: () => import('../views/index.vue'),
        children: [
          {
            path: 'student/mainPage',
            name: 'mainPage',
            component: () => import('../views/student/mainPage/index.vue'),
          },
        ],
      })
    } else if (identity === 'TEACHER') {
      console.log('add', 'teacher')
      router.addRoute({
        path: '/',
        name: 'home',
        redirect: '/teacher/mainPage',
        component: () => import('../views/index.vue'),
        children: [
          {
            path: 'teacher/mainPage',
            name: 'mainPage',
            component: () => import('../views/teacher/mainPage/index.vue'),
          },
          {
            path: 'teacher/functionPage',
            name: 'functionPage',
            component: () => import('../views/teacher/functionPage/index.vue'),
            children: [
              {
                path: 'course',
                component: () => import('../views/teacher/functionPage/coursePage/index.vue'),
              },
              {
                path: 'exam',
                component: () => import('../views/teacher/functionPage/examPage/index.vue'),
              },
              {
                path: 'application',
                component: () => import('../views/teacher/functionPage/applicationPage/index.vue'),
              },
              {
                path: 'feedback',
                component: () => import('../views/teacher/functionPage/feedbackPage/index.vue'),
              },
              {
                path: 'class',
                component: () => import('../views/teacher/functionPage/classPage/index.vue'),
              },
              {
                path: 'arrange',
                component: () => import('../views/teacher/functionPage/arrangePage/index.vue'),
              },
              {
                path: 'classroom',
                component: () => import('../views/teacher/functionPage/classroomPage/index.vue'),
              },
            ],
          },
        ],
      })
    } else if (identity === 'MANAGER') {
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
            component: () => import('../views/manager/functionPage/index.vue'),
            children: [
              {
                path: 'course',
                component: () => import('../views/manager/functionPage/coursePage/index.vue'),
                redirect: '/main',
                props: true,
                children: [
                  {
                    path: 'main',
                    component: () =>
                      import('../views/manager/functionPage/coursePage/components/main.vue'),
                  },
                  {
                    path: ':id/class',
                    component: () =>
                      import('../views/manager/functionPage/coursePage/components/class.vue'),
                  },
                  {
                    path: ':id/exam',
                    component: () =>
                      import('../views/manager/functionPage/coursePage/components/exam.vue'),
                  },
                ],
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
              {
                path: 'workload',
                component: () => import('../views/manager/functionPage/workloadPage/index.vue'),
              },
              {
                path: 'scheduling',
                component: () => import('../views/manager/functionPage/schedulingPage/index.vue'),
              },
              {
                path: 'schedule',
                component: () => import('../views/manager/functionPage/schedulePage/index.vue'),
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
  const user = userStore.initialize()
  // 如果目标是登录页且用户已经登录，则跳转到首页或其他页面
  if (to.name === 'login') {
    if (user != null) {
      next()
    }
    next() // 否则正常进入登录页
    return
  } else if (user == null) {
    console.log('未登录跳转到登录页')
    ElMessage.warning('请先登录, 已为您跳转到登录页')
    next({ name: 'login' })
    return
  } else {
    if (userStore.getIsLogin() == false) {
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
  router.routes = basicRouter
}

export default router
