import http from '@/utils/http.js'
//通知连接
export const connectAPI = () => {
  return http({
    url: '/inform/connect',
    method: 'GET',
  })
}
