import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let isLogin = ref(false)
  const user = ref({
    name: '李华',
    identity: 'student',
  })

  const getIsLogin = () => {
    if (isLogin.value === false) {
      isLogin.value = true
      return false
    } else {
      return true
    }
  }

  return {
    user,
    getIsLogin,
  }
})
