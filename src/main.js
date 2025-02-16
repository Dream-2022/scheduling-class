import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入echarts
import echarts from '@/utils/echarts.js'
// 引入element-plus
import installElementPlus from '@/utils/elementplus.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// echarts 使用
app.config.globalProperties.$echarts = echarts
// element-plus 使用
installElementPlus(app)
app.mount('#app')
