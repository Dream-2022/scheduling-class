import http from '@/utils/http.js'
export const addApplicationAPI = form => {
  return http({
    url: '/leave/leave-request',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: {
      leaveStart: form.leaveStartTime,
      leaveEnd: form.leaveEndTime,
      leaveReason: form.leaveReason,
      attachment: form.imgs,
      title: form.title,
      leaveType: form.leaveType,
      signature: form.signature,
    },
  })
}
