import { ref, onUnmounted } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore'
export const useSseStore = defineStore('sse', () => {
  const eventSource = ref()
  const setEventSource = () => {
    const userStore = useUserStore()
    const userId = userStore.user.userId
    eventSource.value = new EventSource(
      `http://192.168.83.243:8085/inform/connect?userId=${userId}`,
    )
    eventSource.value.onopen = function () {
      console.log('连接建立')
    }
    eventSource.value.onerror = error => {
      console.error('SSE连接错误:', error)
    }

    // 组件卸载时关闭连接
    onUnmounted(() => {
      if (eventSource.value) {
        eventSource.value.close()
      }
    })
    return eventSource.value
  }
  const getEventSource = () => {
    return eventSource.value
  }

  return {
    eventSource,
    setEventSource,
    getEventSource,
  }
})
