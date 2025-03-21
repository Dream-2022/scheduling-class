import http from '@/utils/http.js'
export const getCourseAllAPI = () => {
  return http({
    url: '/users/get-taught-courses',
    method: 'GET',
  })
}

//获取排课表
export const getCourseSchedulingAPI = (taskName, academicTerm, taskStatus, createdByName) => {
  return http({
    url: '/schedule/get-task-list',
    method: 'GET',
    params: {
      taskName,
      academicTerm,
      taskStatus,
      createdByName,
    },
  })
}
