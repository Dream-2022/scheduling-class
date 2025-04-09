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

//分页查询课程
export const getCoursePageSizeAPI = (
  courseId,
  name,
  type,
  departmentName,
  isActive,
  current,
  pageSize,
) => {
  return http({
    url: '/engine/search-course',
    method: 'GET',
    params: {
      courseId,
      name,
      type,
      departmentName,
      isActive,
      current,
      pageSize,
    },
  })
}

//获取课程性质
export const getCourseTypeAPI = () => {
  return http({
    url: '/engine/search-course-nature',
    method: 'GET',
  })
}
//获取课程类别
export const getCourseCategoryAPI = () => {
  return http({
    url: '/engine/search-course-category',
    method: 'GET',
  })
}
//获取课表未排原因
export const getTimetableHelpAPI = scheduleTaskId => {
  return http({
    url: '/schedule/get-schedule-error',
    method: 'GET',
    params: {
      scheduleTaskId,
    },
  })
}
//获取课表排课进度
export const getTimetableProgressAPI = () => {
  return http({
    url: '/admin/create-scheduling-task',
    method: 'POST',
  })
}
