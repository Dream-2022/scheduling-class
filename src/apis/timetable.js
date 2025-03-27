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

//获取日历上的课程数量
export const getEverydayCourseAPI = (
  week,
  days,
  yearOfEntry,
  majors,
  className,
  teacherId,
  year,
  month,
) => {
  return http({
    url: '/users/get-everyday-course-size',
    method: 'GET',
    params: {
      week,
      days,
      yearOfEntry,
      majors,
      className,
      teacherId,
      year,
      month,
    },
  })
}
