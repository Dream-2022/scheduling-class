import http from '@/utils/http.js'
export const getDepartmentsAPI = departmentsName => {
  return http({
    url: '/engine/search-departments',
    method: 'GET',
    params: {
      departmentsName,
    },
  })
}
export const getMajorsAPI = departmentsName => {
  return http({
    url: '/engine/search-majors',
    method: 'GET',
    params: {
      departmentsName,
    },
  })
}
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
