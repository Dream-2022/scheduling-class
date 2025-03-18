import http from '@/utils/http.js'
export const getDepartmentsAPI = departmentsName => {
  return http({
    url: '/engine/search-departments',
    method: 'GET',
    data: {
      departmentsName,
    },
  })
}
export const getMajorsAPI = (departmentsName, majorsName) => {
  return http({
    url: '/engine/search-majors',
    method: 'GET',
    data: {
      departmentsName,
      majorsName,
    },
  })
}
export const getClassesAPI = (departmentsName, majorsName, classesName) => {
  return http({
    url: '/engine/search-majors',
    method: 'GET',
    data: {
      departmentsName,
      majorsName,
      classesName,
    },
  })
}
