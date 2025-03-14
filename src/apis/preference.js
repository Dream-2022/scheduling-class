import http from '@/utils/http.js'

//获取验证码
export const setPreferredCoursesAPI = preferredCourses => {
  return http({
    url: '/users/update-preferred-courses',
    method: 'PATCH',
    params: {
      preferredCourses,
    },
  })
}
export const preferenceTimesAPI = preferredTimes => {
  return http({
    url: '/users/update-preferred-time',
    method: 'PATCH',
    params: {
      preferredTimes,
    },
  })
}
