import http from '@/utils/http.js'

//获取课表详细
export const setPreferredCoursesAPI = week => {
  return http({
    url: '/timetable/get-student-timetable',
    method: 'GET',
    params: {
      week,
    },
  })
}
