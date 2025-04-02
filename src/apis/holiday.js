import http from '@/utils/http.js'
export const getHolidaysAPI = () => {
  return http({
    url: '/engine/get-holidays',
    method: 'GET',
  })
}
