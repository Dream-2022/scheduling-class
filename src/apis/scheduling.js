import http from '@/utils/http.js'

//下载教学计划
export const downloadAPI = () => {
  return http({
    url: '/admin/get-template',
    method: 'GET',
    params: {
      templateName: 'scheduling-template-key',
    },
  })
}
