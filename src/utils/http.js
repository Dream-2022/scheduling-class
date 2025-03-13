// axios基础的封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
// import router from '@/router/index.js'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

import { tokenAPI } from '@/apis/login'
import { showLoading, hideLoading } from '@/utils/loading.js'

const http = axios.create({
  baseURL: 'http://192.168.50.8:80',
  // headers: {
  //   Origin: 'http://192.168.50.32:10010', // 设置允许的源
  // },
  // timeout: 5000
})
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = true

// axios请求拦截器
http.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    const user = userStore.user
    if (user != null) {
      console.log(user)
      console.log(user.token)
      config.headers.set('Authorization', 'Bearer ' + user.token)
    }
    if (config.url === '/goodan-homepage/ai' || config.url === '/apk-info/checkFile') {
      // 如果是登录接口，不显示 loading 效果
      return config
    }
    showLoading()
    return config
  },
  e => Promise.reject(e),
)

// axios响应式拦截器
http.interceptors.response.use(
  response => {
    // 响应拦截进来隐藏loading效果，此处采用延时处理是合并loading请求效果，避免多次请求loading关闭又开启
    setTimeout(() => {
      hideLoading()
    }, 200)

    const userStore = useUserStore()
    const router = useRouter()

    const status = response.status
    switch (status) {
      case 400:
        ElMessage({ type: 'warning', message: response.data.message })
        break
      case 401:
        refreshToken()
        return resend(response.config)
      case 402:
        userStore.clearInfoAndToken()
        router.push('/login')
        break
    }
    const code = response.code
    switch (code) {
      case 'A001400':
        refreshToken()
        break
    }
    return response
  },
  e => {
    setTimeout(() => {
      hideLoading()
    }, 200)
    return Promise.reject(e)
  },
)

const resend = req => {
  let originalRequest = req
  return http({
    method: originalRequest.method,
    url: originalRequest.url,
    data: originalRequest.data,
  })
}
const refreshToken = async () => {
  const userStore = useUserStore()
  const res = await tokenAPI()
  userStore.setToken(res.data.token)
}
export default http
