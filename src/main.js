import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入echarts
import echarts from '@/utils/echarts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// echarts 使用
app.config.globalProperties.$echarts = echarts

app.mount('#app')
