import http from '@/utils/http.js'
//获取全部个人信息
export const getUserInfoAPI = () => {
  return http({
    url: '/users/userinfo',
    method: 'GET',
  })
}
//上传头像
export const editAvatarAPI = avatar => {
  return http({
    url: '/users/upload-avatar',
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: {
      avatar,
    },
  })
}
