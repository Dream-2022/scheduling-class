import http from '@/utils/http.js'

//获取教室占用率
export const getRoomRateAPI = time => {
  return http({
    url: '/schedule/get-room-rate',
    method: 'GET',
    params: {
      time,
    },
  })
}
//获取当前反馈记录数
export const getFeedbackSizeAPI = time => {
  return http({
    url: '/admin-feedback/get-feedback-size',
    method: 'GET',
    params: {
      time,
    },
  })
}
