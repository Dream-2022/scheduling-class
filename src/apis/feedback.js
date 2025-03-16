import http from '@/utils/http.js'
export const getFeedbackAllAPI = (key, status) => {
  return http({
    url: '/user-feedback/list',
    method: 'GET',
    params: {
      key,
      status,
    },
  })
}
export const getFeedbackAPI = (key, status) => {
  return http({
    url: '/admin-feedback/all-list',
    method: 'GET',
    params: {
      key,
      status,
    },
  })
}
