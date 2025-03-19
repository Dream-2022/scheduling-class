import http from '@/utils/http.js'

//获取教师和学生
export const getTeacherAndStudentAPI = (teacherId, teacherName, title, department, Integer) => {
  return http({
    url: '/engine/search-teacher',
    method: 'GET',
    params: {
      teacherId,
      teacherName,
      title,
      department,
      Integer: Integer == null ? 1 : Integer,
      pageSize: 12,
    },
  })
}
