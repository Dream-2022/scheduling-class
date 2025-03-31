import http from '@/utils/http.js'

//获取教学计划
export const getTeachingPlanAPI = plan => {
  return http({
    url: '/engine/search-teaching-plan',
    method: 'GET',
    params: {
      courseId: plan.course,
      teacherId: plan.teacher,
      courseNature: plan.type,
      department: plan.department,
    },
  })
}
//ai生成教学计划
export const getAIGenerateAPI = () => {
  return http({
    url: '/admin/create-teaching-plan',
    method: 'POST',
  })
}
//获取总课时
export const getCourseHoursAPI = planId => {
  return http({
    url: '/engine/search-teaching-plan-hour',
    method: 'GET',
    params: {
      planId,
    },
  })
}
