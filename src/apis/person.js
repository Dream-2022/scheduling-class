import http from '@/utils/http.js'

//获取教师和学生
export const getTeacherAndStudentAPI = (teacherId, teacherName, department, title, current) => {
  return http({
    url: '/engine/search-teacher',
    method: 'GET',
    params: {
      teacherId,
      teacherName,
      title,
      department,
      current,
      pageSize: 12,
    },
  })
}
