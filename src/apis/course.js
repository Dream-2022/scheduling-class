import http from '@/utils/http.js'
export const getCourseAllAPI = () => {
  return http({
    url: '/users/get-taught-courses',
    method: 'GET',
  })
}
