import http from '@/utils/http.js'
export const getFeedbackAllAPI = (leaveReason, status) => {
  return http({
    url: '/admin-feedback/all-list',
    method: 'GET',
    params: {
      leaveReason,
      status,
    },
  })
}
export const getFeedbackAPI = (title, status) => {
  return http({
    url: '/users-feedback/list',
    method: 'GET',
    data: {
      title,
      status,
    },
  })
}
//添加反馈
export const addFeedbackAPI = form => {
  return http({
    url: '/users-feedback/feedback',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      title: form.title,
      attachment: form.attachment,
      leaveReason: form.leaveReason,
    },
  })
}
