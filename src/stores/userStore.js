import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let isLogin = ref(false)
  const user = ref()
  // {
  //     name: '李华',
  //     identity: 'manager',
  //   }
  const setIsLogin = value => {
    isLogin.value = value
  }
  const getIsLogin = () => {
    if (isLogin.value === false) {
      isLogin.value = true
      return false
    } else {
      return true
    }
  }

  const setUserInfo = (username, identity, token, refreshToken) => {
    user.value = {
      name: username,
      identity,
      token,
      refreshToken,
    }
    if (user.value.identity == 'ADMIN') {
      user.value.identity = 'MANAGER'
    }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  //设置个人信息
  const setUserInfoPreference = U => {
    user.value = U
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const initialize = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
    return user.value
  }

  //修改偏好时间和课程
  const setPreference = (courses, times) => {
    user.value.preferredCourses = { ...courses }
    user.value.preferredTimeSlots = { ...times }
    localStorage.setItem('user', JSON.stringify(user.value))
  }
  //修改头像
  const setAvatar = avatar => {
    user.value.avatar = avatar
    localStorage.setItem('user', JSON.stringify(user.value))
  }
  //刷新token
  const setToken = (token, refreshToken) => {
    user.value.token = token
    user.value.refreshToken = refreshToken
    //顺便更新本地缓存
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  return {
    user,
    getIsLogin,
    initialize,
    setPreference,
    setUserInfo,
    setAvatar,
    setUserInfoPreference,
    setIsLogin,
    setToken,
  }
})
