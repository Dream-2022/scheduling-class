import http from '@/utils/http.js'

//获取通知
export const getCodeAPI = id => {
  return http({
    url: '/admin/course-adjust',
    method: 'POST',
    params: {
      id,
    },
  })
}
