import http from '@/utils/http.js'

//获取课表详细
export const setTimetableAPI = (week, days, yearOfEntry, majors, className, teacherId) => {
  return http({
    url: '/users/get-timetable',
    method: 'GET',
    params: {
      week,
      days,
      yearOfEntry,
      majors,
      className,
      teacherId,
    },
  })
}
