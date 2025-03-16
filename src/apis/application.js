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
//获取所有请假记录
export const getLeaveAllAPI = (teacherName, leaveType, title, status) => {
  return http({
    url: '/review/leave-all-list',
    method: 'GET',
    params: {
      teacherName,
      leaveType,
      title,
      status,
    },
  })
}
//审批请假申请
export const reviewLeaveAPI = (leaveId, status) => {
  return http({
    url: '/review/review-leave',
    method: 'PATCH',
    data: {
      leaveId,
      status,
    },
  })
}
//获取个人请假记录
export const getLeaveAPI = status => {
  return http({
    url: '/leave/leave-list',
    method: 'GET',
    data: {
      status,
    },
  })
}
export const getLeaveListAPI = () => {
  return http({
    url: '/leave/leave-list',
    method: 'GET',
  })
}
