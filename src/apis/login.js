import http from '@/utils/http.js'

//获取验证码
export const getCodeAPI = email => {
  return http({
    url: '/user-info/sendCode',
    method: 'GET',
    params: {
      email,
    },
  })
}
//登录
export const loginAPI = (username, password, grant_type) => {
  return http({
    url: '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      username,
      password,
      grant_type,
      client_id: 'scheduling',
      client_secret: 'scheduling-secret',
    },
  })
}
//登录
export const login2API = (email, password, k) => {
  return http({
    url: '/user-info/login',
    method: 'POST',
    params: {
      k,
    },
    data: {
      email,
      password,
    },
  })
}
export const modifyAPI = (email, code, password, k) => {
  return http({
    url: '/user-info/modifyAPI',
    method: 'POST',
    params: {
      email,
      code,
      password,
      k,
    },
  })
}
export const registerAPI = (email, code, password, invitationCode, k) => {
  return http({
    url: '/user-info/register',
    method: 'POST',
    data: {
      email,
      code,
      password,
      invitationCode,
    },
    params: {
      k,
    },
  })
}
export const refreshTokenAPI = (token, k) => {
  console.log(token)
  return http({
    url: '/user-info/refreshToken',
    method: 'GET',
    params: {
      k,
      token,
    },
  })
}
