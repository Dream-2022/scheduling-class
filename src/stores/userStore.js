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

  const initialize = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
    return user.value
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
    setUserInfo,
    setIsLogin,
    setToken,
  }
})
