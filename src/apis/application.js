import http from '@/utils/http.js'
export const addApplicationAPI = form => {
  return http({
    url: '/leave/leave-request',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      leaveStart: form.leaveStartTime,
      leaveEnd: form.leaveEndTime,
      leaveReason: form.leaveReason,
      attachment: form.attachment,
      title: form.title,
      leaveType: form.leaveType,
      signature: form.blob,
    },
  })
}
export const getLeaveListAPI = () => {
  return http({
    url: '/leave/leave-list',
    method: 'GET',
  })
}
