import http from '@/utils/http.js'
//层次查询
export const getsearchAPI = (departmentsName, majorsName, classesName) => {
  return http({
    url: '/engine/search-department-majors-class',
    method: 'GET',
    params: {
      departmentsName,
      majorsName,
      classesName,
    },
  })
}
//获取学院
export const getDepartmentsAPI = departmentsName => {
  return http({
    url: '/engine/search-departments',
    method: 'GET',
    params: {
      departmentsName,
    },
  })
}
//获取专业
export const getMajorsAPI = departmentsName => {
  return http({
    url: '/engine/search-majors',
    method: 'GET',
    params: {
      departmentsName,
    },
  })
}
//获取年级
export const getGradesAPI = majorsName => {
  return http({
    url: '/engine/search-grade',
    method: 'GET',
    params: {
      majorsName,
    },
  })
}

//获取班级
export const getClassesAPI = (departmentsName, majorsName) => {
  return http({
    url: '/engine/search-classes',
    method: 'GET',
    params: {
      departmentsName,
      majorsName,
    },
  })
}
//导入专业数据
export const importMajorsAPI = majorsData => {
  return http({
    url: '/admin/import-majors-data',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      majorsData,
    },
  })
}
//导入班级数据
export const importClassesAPI = classesData => {
  return http({
    url: '/admin/import-classes-data',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      classesData,
    },
  })
}
//导入教师数据
export const importTeachersAPI = usersData => {
  return http({
    url: '/admin/import-users-data',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      usersData,
    },
  })
}
//导入课程数据(没写好)
export const importCoursesAPI = usersData => {
  return http({
    url: '/admin/import-users-data',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      usersData,
    },
  })
}
//获取教室信息
export const getClassroomAPI = (type, department, campus, pageNum, pageSize) => {
  return http({
    url: '/engine/search-room',
    method: 'GET',
    params: {
      type,
      department,
      campus,
      pageNum,
      pageSize,
    },
  })
}
