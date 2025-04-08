import http from '@/utils/http.js'
//获取排考试表
export const getExamTableAllAPI = () => {
  return http({
    url: '/engine/search-exam-record',
    method: 'GET',
  })
}
//获取考试表详情
export const getExamTableDetailAPI = examId => {
  return http({
    url: '/engine/search-exam-arrangement',
    method: 'GET',
    params: {
      examId,
    },
  })
}
