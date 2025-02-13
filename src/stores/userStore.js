import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    name: '李华',
    identity: 'student',
  })

  return {
    user,
  }
})
