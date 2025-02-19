import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let isLogin = ref(false)
  const user = ref()
  // {
  //     name: '李华',
  //     identity: 'manager',
  //   }
  const getIsLogin = () => {
    if (isLogin.value === false) {
      isLogin.value = true
      return false
    } else {
      return true
    }
  }

  const initialize = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    getIsLogin,
    initialize,
  }
})
