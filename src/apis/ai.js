import http from '@/utils/http.js'
//调用ai接口
export const getAIAPI = message => {
  return http({
    url: '/ai/chatStream',
    method: 'GET',
    params: {
      message,
    },
  })
}
