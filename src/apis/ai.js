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
//ai总结标题
export const getTitleAPI = message => {
  return http({
    url: '/ai/sum-up',
    method: 'GET',
    params: {
      message,
    },
  })
}
//ai获取建议
export const getSuggestionAPI = () => {
  return http({
    url: '/ai/suggestion',
    method: 'GET',
  })
}
